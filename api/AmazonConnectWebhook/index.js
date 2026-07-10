'use strict';

/**
 * POST /api/webhooks/amazon-connect
 *
 * Ingestion endpoint for Amazon Connect contact/case events delivered through
 * Lambda / EventBridge (the "Lambda / EventBridge -> Azure Functions Ticket
 * API" hop in the reference architecture). Accepts a single event, an
 * EventBridge envelope, or a batch (array / { events: [...] }).
 *
 * For each event it normalizes the payload and creates (or de-duplicates) a
 * ticket, maintaining the ContactId -> TicketId mapping. Idempotent per
 * eventId so EventBridge's at-least-once delivery cannot create duplicates.
 *
 * Auth: shared secret / HMAC via verifyWebhook (AMAZON_CONNECT_WEBHOOK_SECRET).
 */

const http = require('../shared/http');
const { normalizeEvent } = require('../shared/connectors/amazonConnect');
const tickets = require('../shared/tickets');
const { getStore } = require('../shared/store');

module.exports = async function (context, req) {
  try {
    const rawBody = http.rawBodyOf(req);
    const auth = http.verifyWebhook(req, rawBody);
    if (!auth.ok) {
      context.res = http.unauthorized('Invalid webhook signature/secret');
      return;
    }

    const body = http.parseBody(req);
    const events = extractEvents(body);
    if (!events.length) {
      context.res = http.badRequest('No events found in payload');
      return;
    }

    const store = getStore();
    const results = [];
    for (const raw of events) {
      const intake = normalizeEvent(raw);
      if (!intake || !intake.contactId) {
        results.push({ status: 'skipped', reason: 'unrecognized-or-missing-contactId' });
        continue;
      }

      // Only open a ticket on terminal contact events (call/chat wrapped up),
      // unless the payload explicitly opts in. Non-terminal lifecycle events
      // still refresh the mapping but do not create tickets.
      if (intake.terminal === false && !body.forceCreate) {
        results.push({ status: 'acknowledged', contactId: intake.contactId, eventType: intake.eventType });
        continue;
      }

      // Idempotency fast-path: EventBridge delivers at-least-once. The
      // ContactId->TicketId mapping in createTicket is the authoritative guard
      // against double-creation; this key is a cheap short-circuit for repeated
      // identical deliveries. It is only recorded AFTER a successful create, so
      // a transient failure re-drives the event rather than dropping it.
      const idemKey = `evt:${intake.eventId || intake.contactId}`;
      const seen = await store.checkAndSetIdempotency(idemKey, { at: new Date().toISOString() });
      if (seen) {
        const mappedId = await tickets.getTicketIdForContact(intake.contactId);
        results.push({ status: 'duplicate-event', contactId: intake.contactId, ticketId: mappedId });
        continue;
      }

      let outcome;
      try {
        outcome = await tickets.createTicket(intake, { source: 'amazon-connect' });
      } catch (err) {
        // Release the idempotency reservation so the event can be retried.
        await store.releaseIdempotency(idemKey);
        results.push({ status: 'error', contactId: intake.contactId, error: err.message });
        continue;
      }
      results.push({
        status: outcome.deduplicated ? 'deduplicated' : 'created',
        reason: outcome.reason,
        contactId: intake.contactId,
        ticketId: outcome.ticket.ticketId,
        externalId: outcome.ticket.externalId,
        priority: outcome.ticket.priority,
        simulated: outcome.ticket.simulated,
      });
    }

    context.res = http.ok({ received: events.length, results });
  } catch (err) {
    context.log && context.log.error && context.log.error('AmazonConnectWebhook error', err);
    context.res = http.serverError(err.message);
  }
};

function extractEvents(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.events)) return body.events;
  if (Array.isArray(body.Records)) return body.Records.map((r) => r.body || r);
  if (body && Object.keys(body).length) return [body];
  return [];
}
