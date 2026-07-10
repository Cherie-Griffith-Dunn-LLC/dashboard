'use strict';

/**
 * Duplicate-ticket prevention.
 *
 * Two independent signals, checked cheapest-first by the ticket service:
 *
 *   1. Exact contact match — the Amazon `ContactId` is already mapped to a
 *      ticket. Handled in the service via the store mapping (authoritative).
 *
 *   2. Fuzzy match — a recently-opened ticket for the same customer whose
 *      subject/description is textually similar. This catches the classic
 *      "customer calls, then emails, then opens a portal ticket about the same
 *      outage" fan-out. Implemented here as pure functions so it is testable
 *      and free of I/O.
 */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'of', 'in', 'on', 'for',
  'with', 'my', 'our', 'we', 'i', 'it', 'this', 'that', 'was', 'has', 'have',
  'cant', 'cannot', 'not', 'please', 'help', 'issue', 'problem', 'ticket',
]);

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  return normalizeText(text)
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/** Jaccard similarity of two token sets. Range [0,1]. */
function jaccard(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) if (b.has(t)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function textOf(ticketLike) {
  return `${ticketLike.subject || ''} ${ticketLike.description || ''}`;
}

/**
 * Find the best duplicate among candidates for a new intake.
 *
 * @param {object} candidate       normalized intake { subject, description, customerId, occurredAt }
 * @param {Array}  openTickets     open tickets (same customer) from the PSA/store
 * @param {object} opts            { windowMins=1440, threshold=0.55, now }
 * @returns {object|null}          { ticket, score } or null
 */
function findDuplicate(candidate, openTickets, opts = {}) {
  const windowMins = opts.windowMins != null ? opts.windowMins : Number(process.env.DEDUPE_WINDOW_MINS || 1440);
  const threshold = opts.threshold != null ? opts.threshold : Number(process.env.DEDUPE_THRESHOLD || 0.55);
  const now = opts.now ? new Date(opts.now).getTime() : Date.now();

  const candTokens = tokenize(textOf(candidate));
  if (candTokens.length === 0) return null;

  let best = null;
  for (const t of openTickets || []) {
    if (candidate.customerId && t.customerId && candidate.customerId !== t.customerId) continue;
    const createdMs = new Date(t.createdAt || t.occurredAt || now).getTime();
    if (Number.isFinite(createdMs) && now - createdMs > windowMins * 60000) continue;

    const score = jaccard(candTokens, tokenize(textOf(t)));
    if (score >= threshold && (!best || score > best.score)) {
      best = { ticket: t, score: Number(score.toFixed(3)) };
    }
  }
  return best;
}

module.exports = { normalizeText, tokenize, jaccard, findDuplicate };
