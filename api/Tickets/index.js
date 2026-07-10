'use strict';

/**
 * Ticket API — the "Azure Functions Ticket API" in the reference architecture.
 * Fed by both the Amazon Connect webhook and the Security 360 portal.
 *
 *   POST   /api/tickets                 create a ticket (portal / API intake)
 *   GET    /api/tickets                 list tickets (filters: status, customerId, channel, openOnly, limit)
 *   GET    /api/tickets/{ticketId}      fetch a ticket with activity + SLA + linked contacts
 *   PATCH  /api/tickets/{ticketId}      update status/priority/assignee/note/first response
 *
 * Auth: an authenticated Static Web Apps principal, or a service API key
 * (x-api-key == CONNECTOR_API_KEY) for machine-to-machine callers.
 */

const http = require('../shared/http');
const tickets = require('../shared/tickets');
const { requireCaller } = require('../shared/auth');

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }

    const ticketId = context.bindingData && context.bindingData.ticketId;
    const method = (req.method || 'GET').toUpperCase();

    if (method === 'POST') {
      context.res = await handleCreate(req, caller);
      return;
    }
    if (method === 'PATCH') {
      if (!ticketId) {
        context.res = http.badRequest('ticketId is required for updates');
        return;
      }
      context.res = await handleUpdate(ticketId, req, caller);
      return;
    }
    // GET
    if (ticketId) {
      const ticket = await tickets.getTicket(ticketId);
      context.res = ticket ? http.ok(ticket) : http.notFound('Ticket not found');
      return;
    }
    context.res = await handleList(req);
  } catch (err) {
    context.log && context.log.error && context.log.error('Tickets error', err);
    context.res = http.json(err.statusCode || 500, { error: err.message });
  }
};

async function handleCreate(req, caller) {
  const body = http.parseBody(req);
  if (!body.subject && !body.description && !body.transcript) {
    return http.badRequest('A ticket requires at least a subject, description, or transcript');
  }
  const intake = {
    contactId: body.contactId || null,
    channel: body.channel || 'portal',
    customerId: body.customerId || null,
    customerName: body.customerName || null,
    contactName: body.contactName || caller.email || null,
    contactEmail: body.contactEmail || caller.email || null,
    subject: body.subject || 'Support request',
    description: body.description || '',
    transcript: body.transcript || null,
    priorityHint: body.priority || null,
    tags: body.tags || [],
    occurredAt: body.occurredAt || undefined,
  };
  const outcome = await tickets.createTicket(intake, {
    source: body.source || 'portal',
    actor: caller.email || 'portal',
    enrich: body.enrich !== false,
  });
  const status = outcome.deduplicated ? 200 : 201;
  return http.json(status, {
    deduplicated: outcome.deduplicated,
    reason: outcome.reason,
    score: outcome.score,
    ticket: outcome.ticket,
  });
}

async function handleUpdate(ticketId, req, caller) {
  const body = http.parseBody(req);
  const patch = {
    status: body.status,
    priority: body.priority,
    assignee: body.assignee,
    note: body.note,
    firstResponse: body.firstResponse,
  };
  const updated = await tickets.updateTicket(ticketId, patch, { actor: caller.email || 'agent' });
  return updated ? http.ok(updated) : http.notFound('Ticket not found');
}

async function handleList(req) {
  const q = (req.query) || {};
  const filter = {
    status: q.status,
    customerId: q.customerId,
    channel: q.channel,
    openOnly: q.openOnly === 'true' || q.openOnly === '1',
    limit: q.limit ? Math.min(Number(q.limit) || 50, 200) : 50,
  };
  const items = await tickets.listTickets(filter);
  return http.ok({ count: items.length, tickets: items });
}
