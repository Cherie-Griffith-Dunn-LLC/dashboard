'use strict';

/**
 * POST /api/copilot/{tool}
 *
 * Foundry / Security Copilot ticket tools. Each tool returns structured JSON
 * and, for consequential actions, flags `requiresApproval` so a human stays in
 * the loop. When a ticketId is supplied the tool loads the stored ticket and
 * its activity history for richer context.
 *
 *   summarize      body: { transcript, subject?, description? } | { ticketId }
 *   categorize     body: ticket fields | { ticketId }
 *   priority       body: ticket fields | { ticketId }
 *   root-cause     body: { ticket, history } | { ticketId }
 *   draft-update   body: ticket fields | { ticketId }   (always requiresApproval)
 *
 * Auth: same as the ticket API (principal or service API key).
 */

const http = require('../shared/http');
const copilot = require('../shared/copilot');
const tickets = require('../shared/tickets');
const { requireCaller } = require('../shared/auth');

const TOOLS = {
  summarize: async (body) => copilot.summarizeTranscript(body),
  categorize: async (body) => copilot.categorize(body),
  priority: async (body) => copilot.recommendPriority(body),
  'root-cause': async (body) => copilot.rootCause(body),
  'draft-update': async (body) => copilot.draftCustomerUpdate(body),
};

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }

    const tool = context.bindingData && context.bindingData.tool;
    const handler = TOOLS[tool];
    if (!handler) {
      context.res = http.badRequest(`Unknown copilot tool: ${tool}`, { available: Object.keys(TOOLS) });
      return;
    }

    let body = http.parseBody(req);

    // Enrich from a stored ticket when only a ticketId is given.
    if (body.ticketId) {
      const ticket = await tickets.getTicket(body.ticketId);
      if (!ticket) {
        context.res = http.notFound('Ticket not found');
        return;
      }
      if (tool === 'root-cause') {
        body = { ticket, history: ticket.activities || [] };
      } else if (tool === 'summarize') {
        body = { transcript: (ticket.summary && ticket.summary.summary) || ticket.description, subject: ticket.subject, description: ticket.description, ticketId: ticket.ticketId };
      } else {
        body = Object.assign({}, ticket, body);
      }
    }

    const result = await handler(body);
    context.res = http.ok({ tool, result });
  } catch (err) {
    context.log && context.log.error && context.log.error('CopilotTools error', err);
    context.res = http.serverError(err.message);
  }
};
