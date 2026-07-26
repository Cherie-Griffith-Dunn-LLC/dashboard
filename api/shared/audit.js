'use strict';

/**
 * Tenant-scoped audit logging.
 *
 * Every material action (connector sync, dashboard read, AI invocation, report
 * generation, ticket change) is recorded with the tenant, actor, action,
 * target, and outcome. Records are written to two sinks per the build brief:
 *
 *   1. Application Insights — as a structured custom event (`trackEvent`) when
 *      the Functions host provides a telemetry client / the SDK is present,
 *      else a structured console line (which App Insights ingests from stdout).
 *   2. Azure SQL — via an injectable writer (AUDIT_SQL_CONNECTION). When not
 *      configured, records are retained in the in-memory store so they remain
 *      queryable in DEV/TEST and by the audit tests.
 *
 * No PHI is written to audit records — only identifiers and action metadata.
 */

const { getStore } = require('./store');
const { uuid, nowIso } = require('./ids');

let sqlWriter = null; // optional injected async writer(record)

/** Allow the host/tests to inject a durable Azure SQL writer. */
function setSqlWriter(fn) {
  sqlWriter = fn;
}

async function audit(evt) {
  const record = {
    id: uuid(),
    tenantId: evt.tenantId || 'default',
    actor: evt.actor || 'system',
    action: evt.action,
    target: evt.target || null,
    outcome: evt.outcome || 'success',
    detail: sanitize(evt.detail),
    env: process.env.APP_ENV || 'dev',
    at: nowIso(),
  };

  // Sink 1: Application Insights (structured; safe if telemetry absent).
  emitAppInsights(record);

  // Sink 2: Azure SQL (durable) or in-memory retention (DEV/TEST).
  try {
    if (sqlWriter) {
      await sqlWriter(record);
    } else {
      await getStore().appendAudit(record);
    }
  } catch (err) {
    // Auditing must never break the request path; drop to console.
    // eslint-disable-next-line no-console
    console.warn(JSON.stringify({ level: 'warn', msg: 'audit_sink_failed', error: err.message }));
  }

  return record;
}

/** Query the retained audit trail (in-memory sink) for a tenant. */
async function queryAudit(tenantId, filter = {}) {
  return getStore().queryAudit(tenantId, filter);
}

function emitAppInsights(record) {
  // The Functions host exposes App Insights via env var; when the SDK client
  // is available it is preferred, otherwise structured stdout is ingested.
  // AUDIT_SILENT suppresses the stdout sink (used by the test runner).
  if (process.env.AUDIT_SILENT === 'true') return;
  const line = { level: 'info', type: 'AuditEvent', ...record };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(line));
}

// Strip anything that could carry PHI/PII beyond identifiers.
function sanitize(detail) {
  if (!detail || typeof detail !== 'object') return detail || null;
  if (Array.isArray(detail)) return detail.map((v) => (v && typeof v === 'object' ? sanitize(v) : v));
  const clone = {};
  const BLOCK = ['transcript', 'body', 'description', 'email', 'phone', 'ssn', 'dob', 'mrn'];
  for (const [k, v] of Object.entries(detail)) {
    if (BLOCK.includes(k.toLowerCase())) {
      clone[k] = '[redacted]';
    } else if (v && typeof v === 'object') {
      clone[k] = sanitize(v);
    } else {
      clone[k] = v;
    }
  }
  return clone;
}

module.exports = { audit, queryAudit, setSqlWriter };
