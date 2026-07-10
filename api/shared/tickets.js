'use strict';

/**
 * Ticket orchestration service.
 *
 * This is the heart of the connector: it maps Amazon Connect intake (and
 * portal/API intake) onto the authoritative PSA ticket record while enforcing
 * the cross-cutting requirements:
 *
 *   - Contact-to-ticket mapping   (every ContactId -> one TicketId)
 *   - Duplicate-ticket prevention (exact contact match + fuzzy match)
 *   - SLA + activity records
 *   - Copilot enrichment          (priority, categorization, transcript summary)
 *
 * The PSA connector is authoritative for the ticket; the local store keeps a
 * shadow record (for mapping, SLA, activity, and Security 360 read models).
 */

const { getStore } = require('./store');
const { getActiveConnector } = require('./psa');
const { initSla, evaluateSla, activityRecord } = require('./sla');
const dedupe = require('./dedupe');
const copilot = require('./copilot');
const { shortId, nowIso } = require('./ids');

const OPEN_STATUS = 'new';
const VALID_STATUSES = ['new', 'in_progress', 'pending', 'resolved', 'closed', 'cancelled'];

/**
 * Create a ticket from a normalized intake object.
 *
 * @param {object} intake   normalized fields (see amazonConnect.normalizeEvent or a portal payload)
 * @param {object} options  { source, actor, enrich=true, connector }
 * @returns {object} { ticket, deduplicated, reason?, activities }
 */
async function createTicket(intake, options = {}) {
  const store = getStore();
  const connector = getActiveConnector();
  const source = options.source || intake.source || 'api';
  const actor = options.actor || source;
  const enrich = options.enrich !== false;

  // 1. Exact contact match — never open a second ticket for the same contact.
  if (intake.contactId) {
    const existingId = await store.getTicketIdForContact(intake.contactId);
    if (existingId) {
      const existing = await store.getTicket(existingId);
      if (existing) {
        await store.addActivity(
          existing.ticketId,
          activityRecord('contact.reattached', `Contact ${intake.contactId} already linked`, actor)
        );
        return { ticket: existing, deduplicated: true, reason: 'contact-mapping' };
      }
    }
  }

  // 2. Copilot enrichment: priority + categorization (best effort).
  let priority = normalizePriority(intake.priorityHint);
  let category = null;
  let tags = intake.tags || [];
  if (enrich) {
    if (!priority) {
      const rec = await copilot.recommendPriority(intake);
      priority = normalizePriority(rec.priority) || 'medium';
      intake._priorityRationale = rec.rationale;
    }
    const cat = await copilot.categorize(intake);
    category = cat.category;
    tags = Array.from(new Set([].concat(tags, cat.tags || [])));
    intake._subcategory = cat.subcategory;
  }
  priority = priority || 'medium';

  // 3. Fuzzy duplicate detection against recent open tickets for the customer.
  const openCandidates = await gatherOpenCandidates(store, connector, intake.customerId);
  const match = dedupe.findDuplicate(
    { subject: intake.subject, description: intake.description, customerId: intake.customerId, occurredAt: intake.occurredAt },
    openCandidates
  );
  if (match) {
    const dup = await store.getTicket(match.ticket.ticketId) || match.ticket;
    if (intake.contactId) await store.linkContact(intake.contactId, dup.ticketId);
    await store.addActivity(
      dup.ticketId,
      activityRecord('duplicate.suppressed', `Suppressed duplicate from ${source} (score ${match.score})`, actor)
    );
    return { ticket: dup, deduplicated: true, reason: 'fuzzy-match', score: match.score };
  }

  // 4. Create in the authoritative PSA.
  const createdAt = intake.occurredAt || nowIso();
  const payload = {
    subject: intake.subject,
    description: buildDescription(intake),
    priority,
    status: OPEN_STATUS,
    customerId: intake.customerId,
    customerName: intake.customerName,
    contactName: intake.contactName,
    contactEmail: intake.contactEmail,
    channel: intake.channel,
    source,
    category,
    tags,
  };
  const psaResult = await connector.createTicket(payload);

  // 5. Build the local shadow record + SLA.
  const ticket = {
    ticketId: shortId('TKT'),
    externalId: psaResult.externalId,
    externalUrl: psaResult.url || null,
    connector: connector.name,
    simulated: Boolean(psaResult.simulated),
    source,
    channel: intake.channel || null,
    status: OPEN_STATUS,
    priority,
    category,
    subcategory: intake._subcategory || null,
    tags,
    subject: intake.subject,
    description: intake.description || '',
    customerId: intake.customerId || null,
    customerName: intake.customerName || null,
    contactName: intake.contactName || null,
    contactEmail: intake.contactEmail || null,
    contactNumber: intake.contactNumber || null,
    primaryContactId: intake.contactId || null,
    agent: intake.agent || null,
    queue: intake.queue || null,
    sla: initSla(priority, createdAt),
    summary: null,
    createdAt,
    updatedAt: createdAt,
    createdBy: actor,
  };

  await store.saveTicket(ticket);
  if (intake.contactId) await store.linkContact(intake.contactId, ticket.ticketId);
  await store.addActivity(ticket.ticketId, activityRecord('created', `Opened via ${source} (${intake.channel || 'n/a'})`, actor, createdAt));
  if (intake._priorityRationale) {
    await store.addActivity(ticket.ticketId, activityRecord('priority.recommended', intake._priorityRationale, 'copilot'));
  }

  // 6. Transcript summarization (call/chat), best effort.
  if (enrich && intake.transcript) {
    try {
      const summary = await copilot.summarizeTranscript({ transcript: intake.transcript, subject: intake.subject, description: intake.description });
      ticket.summary = summary;
      await store.saveTicket(ticket);
      await store.addActivity(ticket.ticketId, activityRecord('summary.generated', summary.summary, `copilot:${summary.generatedBy}`));
    } catch (err) {
      // Never fail ticket creation on a summarization error.
    }
  }

  return { ticket, deduplicated: false };
}

/**
 * Update an existing ticket. Recomputes SLA milestones from status transitions
 * and pushes the change to the authoritative PSA.
 *
 * @param {string} ticketId
 * @param {object} patch    { status, priority, assignee, note, firstResponse, resolve }
 * @param {object} options  { actor }
 */
async function updateTicket(ticketId, patch = {}, options = {}) {
  const store = getStore();
  const connector = getActiveConnector();
  const actor = options.actor || 'agent';
  const ticket = await store.getTicket(ticketId);
  if (!ticket) return null;

  const now = nowIso();
  const psaPatch = {};

  if (patch.priority) {
    const p = normalizePriority(patch.priority);
    if (!p) throw badInput(`Invalid priority: ${patch.priority}`);
    if (p !== ticket.priority) {
      ticket.sla = evaluateSla(ticket.sla, { priority: p, createdAt: ticket.createdAt, now });
      ticket.priority = p;
      psaPatch.priority = p;
      await store.addActivity(ticketId, activityRecord('priority.changed', `-> ${p}`, actor, now));
    }
  }

  if (patch.status) {
    const s = String(patch.status).toLowerCase();
    if (!VALID_STATUSES.includes(s)) throw badInput(`Invalid status: ${patch.status}`);
    if (s !== ticket.status) {
      ticket.status = s;
      psaPatch.status = s;
      await store.addActivity(ticketId, activityRecord('status.changed', `-> ${s}`, actor, now));
      const slaOpts = { now };
      if (s === 'in_progress' && !ticket.sla.firstResponseAt) slaOpts.firstResponseAt = now;
      if (s === 'resolved' || s === 'closed') slaOpts.resolvedAt = now;
      ticket.sla = evaluateSla(ticket.sla, slaOpts);
    }
  }

  if (patch.firstResponse && !ticket.sla.firstResponseAt) {
    ticket.sla = evaluateSla(ticket.sla, { firstResponseAt: now, now });
    await store.addActivity(ticketId, activityRecord('response.first', 'First response recorded', actor, now));
  }

  if (patch.assignee) {
    ticket.assignee = patch.assignee;
    await store.addActivity(ticketId, activityRecord('assigned', patch.assignee, actor, now));
  }

  if (patch.note) {
    await store.addActivity(ticketId, activityRecord('note', String(patch.note), actor, now));
    if (!ticket.sla.firstResponseAt && actor !== 'system') {
      ticket.sla = evaluateSla(ticket.sla, { firstResponseAt: now, now });
    }
  }

  // Push to authoritative PSA when there is something it cares about.
  if (Object.keys(psaPatch).length && ticket.externalId) {
    try {
      await connector.updateTicket(ticket.externalId, psaPatch);
    } catch (err) {
      await store.addActivity(ticketId, activityRecord('psa.sync_failed', String(err.message), 'system', now));
    }
  }

  // Refresh SLA breach flags against the wall clock.
  ticket.sla = evaluateSla(ticket.sla, { now });
  ticket.updatedAt = now;
  await store.saveTicket(ticket);
  return ticket;
}

/** Fetch a ticket with its activity trail, linked contacts, and live SLA state. */
async function getTicket(ticketId) {
  const store = getStore();
  const ticket = await store.getTicket(ticketId);
  if (!ticket) return null;
  const activities = await store.getActivities(ticketId);
  const contacts = await store.getContactsForTicket(ticketId);
  const sla = evaluateSla(ticket.sla, {});
  return Object.assign({}, ticket, { sla, activities, linkedContacts: contacts });
}

async function listTickets(filter = {}) {
  const store = getStore();
  const tickets = await store.listTickets(filter);
  return tickets.map((t) => Object.assign({}, t, { sla: evaluateSla(t.sla, {}) }));
}

async function getTicketIdForContact(contactId) {
  return getStore().getTicketIdForContact(contactId);
}

// --- helpers ---------------------------------------------------------------

async function gatherOpenCandidates(store, connector, customerId) {
  const results = [];
  try {
    const fromPsa = await connector.searchOpenTickets({ customerId, limit: 50 });
    results.push(...fromPsa);
  } catch (err) {
    /* ignore PSA search errors for dedupe */
  }
  const local = await store.listTickets({ customerId, openOnly: true, limit: 50 });
  const seen = new Set(results.map((r) => r.ticketId || r.externalId));
  for (const t of local) {
    if (!seen.has(t.ticketId)) results.push(t);
  }
  return results;
}

function buildDescription(intake) {
  const parts = [intake.description || ''];
  if (intake.contactId) parts.push(`\n[Amazon Connect ContactId: ${intake.contactId}]`);
  if (intake.channel) parts.push(`[Channel: ${intake.channel}]`);
  return parts.filter(Boolean).join('\n').trim();
}

function normalizePriority(p) {
  if (!p) return null;
  const v = String(p).toLowerCase();
  return ['critical', 'high', 'medium', 'low'].includes(v) ? v : null;
}

function badInput(message) {
  const e = new Error(message);
  e.statusCode = 400;
  return e;
}

module.exports = {
  createTicket,
  updateTicket,
  getTicket,
  listTickets,
  getTicketIdForContact,
  VALID_STATUSES,
};
