'use strict';

/**
 * Reporting: executive, compliance, and connector-health reports composed from
 * the dashboard/risk/compliance layers. Reports are returned as structured
 * JSON (a renderer or the portal turns them into PDF/board decks). Generation
 * is audited.
 */

const { getStore } = require('./store');
const { ensureSnapshots } = require('./dashboards');
const { computeRisk } = require('./risk');
const { buildCompliance } = require('./compliance');
const { getDashboard } = require('./dashboards');
const { audit } = require('./audit');

const REPORT_TYPES = ['executive', 'compliance', 'connector-health', 'security-posture'];

async function generateReport(type, tenantId, ctx = {}) {
  const t = String(type || '').toLowerCase();
  if (!REPORT_TYPES.includes(t)) {
    const err = new Error(`Unknown report type: ${type}`);
    err.statusCode = 404;
    throw err;
  }
  const snaps = await ensureSnapshots(tenantId, ctx);
  let report;
  switch (t) {
    case 'executive':
      report = await executiveReport(snaps, tenantId, ctx);
      break;
    case 'compliance':
      report = complianceReport(snaps);
      break;
    case 'connector-health':
      report = connectorHealthReport(snaps);
      break;
    case 'security-posture':
      report = await postureReport(snaps, tenantId, ctx);
      break;
    default:
      report = {};
  }

  await audit({
    tenantId,
    actor: ctx.actor || 'system',
    action: 'report.generate',
    target: t,
    outcome: 'success',
  });

  return {
    type: t,
    tenantId,
    generatedAt: new Date().toISOString(),
    generatedBy: ctx.actor || 'system',
    simulated: snaps.some((s) => s.simulated),
    report,
  };
}

async function executiveReport(snaps, tenantId, ctx) {
  const risk = computeRisk(snaps);
  const exec = await getDashboard('executive', tenantId, ctx);
  return {
    title: 'Executive Security Briefing',
    riskScore: risk.score,
    rating: risk.rating,
    openCriticalIssues: risk.openCriticalIssues,
    top10Risks: risk.topRisks,
    monthlyTrend: risk.monthlyTrend,
    domainHighlights: exec.domainHighlights,
  };
}

function complianceReport(snaps) {
  const compliance = buildCompliance(snaps);
  return { title: 'Compliance Readiness Report', ...compliance };
}

function connectorHealthReport(snaps) {
  return {
    title: 'Connector Health Report',
    connectors: snaps.map((s) => ({
      connector: s.connector,
      mode: s.mode,
      simulated: s.simulated,
      domains: s.domains,
      syncedAt: s.syncedAt,
      issues: (s.data && s.data.issues && s.data.issues.length) || 0,
    })),
    syncedCount: snaps.length,
  };
}

async function postureReport(snaps, tenantId, ctx) {
  const vuln = await getDashboard('vulnerabilities', tenantId, ctx);
  const risk = computeRisk(snaps);
  return {
    title: 'Security Posture Report',
    riskScore: risk.score,
    categoryScores: risk.categoryScores,
    vulnerabilities: vuln.vulnerabilities,
    patchCompliance: vuln.patchCompliance,
    threats: vuln.threats,
    networkExposure: vuln.networkExposure,
  };
}

module.exports = { generateReport, REPORT_TYPES };
