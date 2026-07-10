'use strict';

/**
 * Dashboard aggregation.
 *
 * Assembles each dashboard view from the tenant's connector snapshots (plus
 * live ticket data from the ticket store where relevant). Views:
 *
 *   executive       - risk score, top 10 risks, open criticals, monthly trend
 *   microsoft       - admins, risky users, licenses, device compliance, CA
 *   vulnerabilities - vulnerabilities, patch compliance, endpoint health, threats
 *   epic            - EHR users, departments, high-risk access, reviews, audit
 *   compliance      - HIPAA/CMMC readiness, policy gaps, training, evidence
 *   helpdesk        - aging, security tickets, department trends, repeat issues
 *
 * If no snapshots exist for the tenant yet, an on-demand sync is triggered so
 * a first-time view is never empty.
 */

const { getStore } = require('./store');
const { syncAll } = require('./framework/registry');
const { computeRisk } = require('./risk');
const { buildCompliance } = require('./compliance');
const tickets = require('./tickets');

const VIEWS = ['executive', 'microsoft', 'vulnerabilities', 'epic', 'compliance', 'helpdesk'];

async function ensureSnapshots(tenantId, ctx = {}) {
  let snaps = await getStore().getTenantSnapshots(tenantId);
  if (!snaps.length) {
    await syncAll({ tenantId, actor: ctx.actor || 'system' });
    snaps = await getStore().getTenantSnapshots(tenantId);
  }
  return snaps;
}

function byConnector(snaps) {
  const map = {};
  for (const s of snaps) map[s.connector] = s.data || {};
  return map;
}

async function getDashboard(view, tenantId, ctx = {}) {
  const v = String(view || '').toLowerCase();
  if (!VIEWS.includes(v)) {
    const err = new Error(`Unknown dashboard view: ${view}`);
    err.statusCode = 404;
    throw err;
  }
  const snaps = await ensureSnapshots(tenantId, ctx);
  const data = byConnector(snaps);
  const meta = {
    view: v,
    tenantId,
    simulated: snaps.some((s) => s.simulated),
    generatedAt: new Date().toISOString(),
  };

  switch (v) {
    case 'executive':
      return Object.assign(meta, buildExecutive(snaps, data));
    case 'microsoft':
      return Object.assign(meta, { microsoft: data.microsoft || null });
    case 'vulnerabilities':
      return Object.assign(meta, buildVulnerabilities(data));
    case 'epic':
      return Object.assign(meta, { epic: data.epic || null });
    case 'compliance':
      return Object.assign(meta, buildCompliance(snaps));
    case 'helpdesk':
      return Object.assign(meta, await buildHelpdesk(data, tenantId));
    default:
      return meta;
  }
}

function buildExecutive(snaps, data) {
  const risk = computeRisk(snaps);
  return {
    riskScore: risk.score,
    rating: risk.rating,
    openCriticalIssues: risk.openCriticalIssues,
    issueCounts: risk.issueCounts,
    topRisks: risk.topRisks,
    monthlyTrend: risk.monthlyTrend,
    categoryScores: risk.categoryScores,
    domainHighlights: {
      identity: data.microsoft ? { riskyUsers: data.microsoft.riskyUsers, mfaEnforcedPct: data.microsoft.mfaEnforcedPct } : null,
      endpoints: data.sentinelone ? data.sentinelone.endpointHealth : null,
      cloud: data.azure ? { secureScorePct: data.azure.secureScorePct } : null,
      healthcare: data.epic ? { highRiskAccess: data.epic.highRiskAccess } : null,
    },
  };
}

function buildVulnerabilities(data) {
  const azure = data.azure || {};
  const aws = data.aws || {};
  const ninja = data.ninjaone || {};
  const s1 = data.sentinelone || {};
  const net = data.network || {};
  const totals = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const v of [azure.vulnerabilities, aws.securityHub]) {
    if (!v) continue;
    totals.critical += v.critical || 0;
    totals.high += v.high || 0;
    totals.medium += v.medium || 0;
    totals.low += v.low || 0;
  }
  return {
    vulnerabilities: totals,
    patchCompliance: ninja.patchCompliance || null,
    endpointHealth: {
      edr: s1.endpointHealth || null,
      rmm: ninja.endpointHealth || null,
    },
    threats: s1.threats || null,
    threatTrend: s1.threatTrend || null,
    networkExposure: net.exposure || null,
    cloud: { azureSecureScorePct: azure.secureScorePct, awsFindings: aws.securityHub || null },
  };
}

async function buildHelpdesk(data, tenantId) {
  // Prefer ConnectWise, fall back to Halo, for the PSA analytics shape.
  const psa = data.connectwise || data.halo || {};
  // Blend in live tickets from the Amazon Connect / portal pipeline.
  const live = await tickets.listTickets({ limit: 200 });
  const liveOpen = live.filter((t) => !['resolved', 'closed', 'cancelled'].includes(String(t.status).toLowerCase()));
  const liveSecurity = live.filter((t) => t.category === 'security' || t.category === 'infrastructure');
  const slaBreaches = live.filter((t) => t.sla && t.sla.status === 'breached').length;
  return {
    summary: {
      openTickets: (psa.openTickets || 0) + liveOpen.length,
      securityTickets: (psa.securityTickets || 0) + liveSecurity.length,
      liveTickets: live.length,
      slaBreaches,
    },
    aging: psa.aging || null,
    departmentTrends: psa.departmentTrends || null,
    repeatIssues: psa.repeatIssues || null,
    volumeTrend: psa.volumeTrend || null,
    liveTicketSample: liveOpen.slice(0, 10).map((t) => ({ ticketId: t.ticketId, subject: t.subject, priority: t.priority, status: t.status, sla: t.sla && t.sla.status })),
  };
}

module.exports = { getDashboard, VIEWS, ensureSnapshots };
