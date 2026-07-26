'use strict';

/**
 * SLA policy engine + ticket activity records.
 *
 * SLA policies are keyed by priority and express two clocks:
 *   - response:   time to first human response
 *   - resolution: time to resolve
 *
 * Defaults are sensible MSP targets and can be overridden per priority with
 * SLA_POLICIES_JSON (a JSON object of { priority: { responseMins, resolutionMins } }).
 * All calculations are pure so they are trivially testable.
 */

const DEFAULT_POLICIES = {
  critical: { responseMins: 15, resolutionMins: 4 * 60 },
  high: { responseMins: 30, resolutionMins: 8 * 60 },
  medium: { responseMins: 60, resolutionMins: 24 * 60 },
  low: { responseMins: 4 * 60, resolutionMins: 72 * 60 },
};

function loadPolicies() {
  if (!process.env.SLA_POLICIES_JSON) return DEFAULT_POLICIES;
  try {
    return Object.assign({}, DEFAULT_POLICIES, JSON.parse(process.env.SLA_POLICIES_JSON));
  } catch (err) {
    return DEFAULT_POLICIES;
  }
}

function policyFor(priority) {
  const policies = loadPolicies();
  return policies[String(priority || 'low').toLowerCase()] || policies.low;
}

/** Build the initial SLA state for a ticket created at `createdAt`. */
function initSla(priority, createdAt) {
  const policy = policyFor(priority);
  const start = new Date(createdAt).getTime();
  return {
    priority: String(priority || 'low').toLowerCase(),
    policy,
    responseDueAt: new Date(start + policy.responseMins * 60000).toISOString(),
    resolutionDueAt: new Date(start + policy.resolutionMins * 60000).toISOString(),
    firstResponseAt: null,
    resolvedAt: null,
    responseBreached: false,
    resolutionBreached: false,
  };
}

/**
 * Recompute SLA state given lifecycle timestamps. Pure: returns a new object.
 *   opts.firstResponseAt / opts.resolvedAt — set when those milestones occur.
 *   opts.now — evaluation time (defaults to actual now).
 *   opts.priority — if the priority changed, re-derive the due dates.
 *   opts.createdAt — required when priority changes.
 */
function evaluateSla(sla, opts = {}) {
  let next = Object.assign({}, sla);

  if (opts.priority && opts.priority !== sla.priority && opts.createdAt) {
    const rebuilt = initSla(opts.priority, opts.createdAt);
    next.priority = rebuilt.priority;
    next.policy = rebuilt.policy;
    next.responseDueAt = rebuilt.responseDueAt;
    next.resolutionDueAt = rebuilt.resolutionDueAt;
  }

  if (opts.firstResponseAt && !next.firstResponseAt) next.firstResponseAt = opts.firstResponseAt;
  if (opts.resolvedAt) next.resolvedAt = opts.resolvedAt;

  const now = opts.now ? new Date(opts.now).getTime() : Date.now();

  // Response breach: no first response by the due time.
  const responseDeadline = new Date(next.responseDueAt).getTime();
  if (next.firstResponseAt) {
    next.responseBreached = new Date(next.firstResponseAt).getTime() > responseDeadline;
  } else {
    next.responseBreached = now > responseDeadline;
  }

  // Resolution breach: not resolved by the due time.
  const resolutionDeadline = new Date(next.resolutionDueAt).getTime();
  if (next.resolvedAt) {
    next.resolutionBreached = new Date(next.resolvedAt).getTime() > resolutionDeadline;
  } else {
    next.resolutionBreached = now > resolutionDeadline;
  }

  next.status = deriveSlaStatus(next, now);
  return next;
}

function deriveSlaStatus(sla, now) {
  if (sla.resolutionBreached || sla.responseBreached) return 'breached';
  const nearest = sla.resolvedAt
    ? Infinity
    : new Date(sla.resolutionDueAt).getTime() - now;
  if (nearest !== Infinity && nearest < 30 * 60000) return 'at_risk';
  return 'on_track';
}

/** Build a normalized activity record for the ticket audit trail. */
function activityRecord(type, detail, actor, at) {
  return {
    type,
    detail: detail || null,
    actor: actor || 'system',
    at: at || new Date().toISOString(),
  };
}

module.exports = {
  DEFAULT_POLICIES,
  policyFor,
  initSla,
  evaluateSla,
  deriveSlaStatus,
  activityRecord,
};
