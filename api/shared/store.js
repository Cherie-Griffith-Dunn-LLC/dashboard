'use strict';

/**
 * Pluggable state store for the connector services.
 *
 * The shipped adapter is an in-memory store (a warm Functions host keeps it
 * alive between invocations, which is enough for the MVP and for tests). The
 * interface is intentionally async so a durable backend — Azure Table Storage,
 * Cosmos DB, or the authoritative PSA itself — can be dropped in without
 * touching callers. See `createTableStore` note at the bottom for the
 * production path.
 *
 * Responsibilities:
 *   - tickets:      the local shadow record of each ticket (PSA is authoritative)
 *   - mappings:     Amazon `ContactId` <-> PSA `TicketId` (the core of the
 *                   contact-to-ticket mapping requirement)
 *   - activities:   append-only ticket activity / audit trail
 *   - idempotency:  webhook + event de-duplication keys
 */

class MemoryStore {
  constructor() {
    this.tickets = new Map(); // ticketId -> ticket
    this.contactToTicket = new Map(); // contactId -> ticketId
    this.ticketToContacts = new Map(); // ticketId -> Set<contactId>
    this.activities = new Map(); // ticketId -> [activity]
    this.idempotencyKeys = new Map(); // key -> { ticketId, at }
    this.snapshots = new Map(); // `${tenantId}:${connector}` -> snapshot
    this.auditLog = []; // in-memory audit retention (DEV/TEST sink)
  }

  async saveTicket(ticket) {
    this.tickets.set(ticket.ticketId, ticket);
    return ticket;
  }

  async getTicket(ticketId) {
    return this.tickets.get(ticketId) || null;
  }

  async listTickets(filter = {}) {
    let items = Array.from(this.tickets.values());
    if (filter.status) items = items.filter((t) => t.status === filter.status);
    if (filter.customerId) items = items.filter((t) => t.customerId === filter.customerId);
    if (filter.channel) items = items.filter((t) => t.channel === filter.channel);
    if (filter.openOnly) items = items.filter((t) => !isClosedStatus(t.status));
    items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    if (filter.limit) items = items.slice(0, filter.limit);
    return items;
  }

  async linkContact(contactId, ticketId) {
    if (!contactId) return;
    this.contactToTicket.set(contactId, ticketId);
    if (!this.ticketToContacts.has(ticketId)) this.ticketToContacts.set(ticketId, new Set());
    this.ticketToContacts.get(ticketId).add(contactId);
  }

  async getTicketIdForContact(contactId) {
    return this.contactToTicket.get(contactId) || null;
  }

  async getContactsForTicket(ticketId) {
    const set = this.ticketToContacts.get(ticketId);
    return set ? Array.from(set) : [];
  }

  async addActivity(ticketId, activity) {
    if (!this.activities.has(ticketId)) this.activities.set(ticketId, []);
    this.activities.get(ticketId).push(activity);
    return activity;
  }

  async getActivities(ticketId) {
    return (this.activities.get(ticketId) || []).slice();
  }

  /**
   * Reserve an idempotency key. Returns the previously stored value when the
   * key was already seen (so callers can short-circuit duplicate events), or
   * null when this is the first time and the key is now reserved.
   */
  async checkAndSetIdempotency(key, value) {
    if (!key) return null;
    if (this.idempotencyKeys.has(key)) return this.idempotencyKeys.get(key);
    this.idempotencyKeys.set(key, value);
    return null;
  }

  /** Release a previously reserved idempotency key (e.g. after a failed create). */
  async releaseIdempotency(key) {
    if (key) this.idempotencyKeys.delete(key);
  }

  // --- connector snapshots (per tenant) -----------------------------------

  async saveConnectorSnapshot(tenantId, connector, snapshot) {
    this.snapshots.set(`${tenantId}:${connector}`, snapshot);
    return snapshot;
  }

  async getConnectorSnapshot(tenantId, connector) {
    return this.snapshots.get(`${tenantId}:${connector}`) || null;
  }

  async getTenantSnapshots(tenantId) {
    const out = [];
    const prefix = `${tenantId}:`;
    for (const [key, snap] of this.snapshots.entries()) {
      if (key.startsWith(prefix)) out.push(snap);
    }
    return out;
  }

  // --- audit retention (in-memory sink) -----------------------------------

  async appendAudit(record) {
    this.auditLog.push(record);
    // Bound memory in long-lived hosts.
    if (this.auditLog.length > 5000) this.auditLog.splice(0, this.auditLog.length - 5000);
    return record;
  }

  async queryAudit(tenantId, filter = {}) {
    let items = this.auditLog.filter((r) => !tenantId || r.tenantId === tenantId);
    if (filter.action) items = items.filter((r) => r.action === filter.action);
    if (filter.actor) items = items.filter((r) => r.actor === filter.actor);
    items.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    if (filter.limit) items = items.slice(0, filter.limit);
    return items;
  }

  async reset() {
    this.tickets.clear();
    this.contactToTicket.clear();
    this.ticketToContacts.clear();
    this.activities.clear();
    this.idempotencyKeys.clear();
    this.snapshots.clear();
    this.auditLog = [];
  }
}

function isClosedStatus(status) {
  return ['closed', 'resolved', 'cancelled'].includes(String(status || '').toLowerCase());
}

// Singleton so warm invocations and every shared module see the same state.
let instance = null;

function getStore() {
  if (!instance) instance = new MemoryStore();
  return instance;
}

// For tests: swap in a fresh store.
function _setStoreForTest(store) {
  instance = store;
}

module.exports = {
  MemoryStore,
  getStore,
  isClosedStatus,
  _setStoreForTest,
};

/*
 * Production path (Azure Table Storage), sketch:
 *
 *   const { TableClient } = require('@azure/data-tables');
 *   class TableStore { ... same async interface, PartitionKey = customerId ... }
 *
 * Swap `getStore()` to return a TableStore when
 * process.env.CONNECTOR_TABLE_CONNECTION is set. The rest of the codebase is
 * unchanged because every caller already awaits this interface.
 */
