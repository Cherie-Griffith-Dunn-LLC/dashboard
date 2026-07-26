'use strict';

const { BasePsaConnector } = require('./base');
const { getStore } = require('../store');
const { shortId, nowIso } = require('../ids');

/**
 * Internal Help Desk connector.
 *
 * This is the default authoritative store when no external PSA is configured.
 * Unlike the external connectors it is always "configured" — it persists into
 * the local state store — so the ticket service always has a working backend.
 * It also implements searchOpenTickets so duplicate-prevention works out of
 * the box in single-platform deployments.
 */
class HelpDeskConnector extends BasePsaConnector {
  constructor() {
    super('helpdesk');
  }

  isConfigured() {
    return true;
  }

  describe() {
    return { name: this.name, configured: true, mode: 'internal' };
  }

  async createTicket(payload) {
    const externalId = shortId('HD');
    return {
      externalId,
      url: null,
      simulated: false,
      raw: { connector: this.name, createdAt: nowIso(), payload },
    };
  }

  async updateTicket(externalId, patch) {
    return {
      externalId,
      simulated: false,
      raw: { connector: this.name, updatedAt: nowIso(), patch },
    };
  }

  async searchOpenTickets(query = {}) {
    const store = getStore();
    const tickets = await store.listTickets({
      customerId: query.customerId,
      openOnly: true,
      limit: query.limit || 50,
    });
    return tickets.map((t) => ({
      externalId: t.externalId,
      ticketId: t.ticketId,
      subject: t.subject,
      description: t.description,
      channel: t.channel,
      createdAt: t.createdAt,
    }));
  }
}

module.exports = { HelpDeskConnector };
