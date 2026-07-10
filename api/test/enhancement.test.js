'use strict';

/**
 * Healthcare-visibility + Foundry enhancement test suite.
 *
 * Covers the connector lifecycle, dashboards, risk scoring, RBAC, four-part
 * Copilot, reporting, and tenant-scoped audit logging. Exported as an array of
 * { name, fn } and executed by test/run.js. Runs credential-free (simulation).
 */

process.env.AUDIT_SILENT = 'true';
process.env.ENABLE_CMMC = 'true';

const assert = require('assert');
const { MemoryStore, _setStoreForTest, getStore } = require('../shared/store');
const registry = require('../shared/framework/registry');
const { getDashboard } = require('../shared/dashboards');
const { computeRisk } = require('../shared/risk');
const { buildCompliance } = require('../shared/compliance');
const { generateReport } = require('../shared/reports');
const rbac = require('../shared/rbac');
const copilot = require('../shared/copilot');
const { audit, queryAudit } = require('../shared/audit');
const { MicrosoftConnector } = require('../connectors/microsoft');

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

function fresh() {
  _setStoreForTest(new MemoryStore());
}

// 1. Connector lifecycle
test('API: connector lifecycle connect/fetch/transform/sync', async () => {
  fresh();
  const c = new MicrosoftConnector({});
  const conn = await c.connect();
  assert.strictEqual(conn.connected, true);
  const raw = await c.fetchData({ tenantId: 'acme' });
  assert.ok(raw.totalUsers > 0);
  const data = c.transformData(raw);
  assert.ok(data.deviceCompliance && data.deviceCompliance.compliantPct >= 0);
  const result = await c.sync({ tenantId: 'acme' });
  assert.strictEqual(result.status, 'synced');
  const snap = await getStore().getConnectorSnapshot('acme', 'microsoft');
  assert.ok(snap && snap.data.licenseUsage);
});

// 2. Registry syncs all nine connectors
test('API: registry syncs all nine connectors', async () => {
  fresh();
  assert.strictEqual(registry.connectorNames().length, 9);
  const results = await registry.syncAll({ tenantId: 'acme' });
  assert.strictEqual(results.length, 9);
  assert.ok(results.every((r) => r.status === 'synced'));
});

// 3. Risk scoring produces a bounded score + top 10
test('API: executive risk scoring', async () => {
  fresh();
  await registry.syncAll({ tenantId: 'acme' });
  const snaps = await getStore().getTenantSnapshots('acme');
  const risk = computeRisk(snaps);
  assert.ok(risk.score >= 0 && risk.score <= 100);
  assert.ok(['low', 'moderate', 'high', 'critical'].includes(risk.rating));
  assert.ok(risk.topRisks.length <= 10);
  assert.strictEqual(risk.monthlyTrend.length, 6);
});

// 4. Dashboards: all six views assemble
test('API: all six dashboard views assemble', async () => {
  fresh();
  for (const view of ['executive', 'microsoft', 'vulnerabilities', 'epic', 'compliance', 'helpdesk']) {
    const d = await getDashboard(view, 'acme'); // eslint-disable-line no-await-in-loop
    assert.strictEqual(d.view, view);
    assert.ok(d.generatedAt);
  }
});

// 5. Determinism: same tenant => same risk score
test('API: dashboards are deterministic per tenant', async () => {
  fresh();
  const a = await getDashboard('executive', 'acme');
  fresh();
  const b = await getDashboard('executive', 'acme');
  assert.strictEqual(a.riskScore, b.riskScore);
  const c = await getDashboard('executive', 'other-tenant');
  assert.ok(typeof c.riskScore === 'number');
});

// 6. RBAC: epic requires elevated role; employees are limited
test('API: RBAC enforces capabilities', () => {
  assert.strictEqual(rbac.authorize({ roles: ['Owner'] }, 'dashboard:epic').ok, true);
  assert.strictEqual(rbac.authorize({ roles: ['BusinessOwner'] }, 'dashboard:epic').ok, true);
  assert.strictEqual(rbac.authorize({ roles: ['Employee'] }, 'dashboard:epic').ok, false);
  assert.strictEqual(rbac.authorize({ roles: ['Analyst'] }, 'connectors:sync').ok, true);
  assert.strictEqual(rbac.authorize({ roles: ['Employee'] }, 'connectors:sync').ok, false);
});

// 7. Copilot four-part response
test('API: Copilot returns four-part response', async () => {
  fresh();
  await registry.syncAll({ tenantId: 'acme' });
  const snaps = await getStore().getTenantSnapshots('acme');
  const risk = computeRisk(snaps);
  const out = await copilot.securityCopilot({ risk, question: 'What are our top risks?' });
  for (const key of ['summary', 'topRisks', 'nextActions', 'responsibleOwner']) {
    assert.ok(out[key] !== undefined, `missing ${key}`);
  }
  assert.ok(Array.isArray(out.topRisks) && Array.isArray(out.nextActions));
  assert.strictEqual(out.requiresApproval, true);
});

// 8. Reports: executive + compliance + connector-health
test('API: report generation', async () => {
  fresh();
  const exec = await generateReport('executive', 'acme');
  assert.strictEqual(exec.type, 'executive');
  assert.ok(exec.report.top10Risks.length <= 10);
  const comp = await generateReport('compliance', 'acme');
  assert.ok(comp.report.frameworks.length >= 1);
  const health = await generateReport('connector-health', 'acme');
  assert.strictEqual(health.report.connectors.length, 9);
});

// 9. Tenant-scoped audit logging
test('API: tenant-scoped audit logging', async () => {
  fresh();
  await audit({ tenantId: 't1', actor: 'a@x.com', action: 'dashboard.read', target: 'executive', outcome: 'success', detail: { transcript: 'PHI here' } });
  await audit({ tenantId: 't2', actor: 'b@x.com', action: 'dashboard.read', target: 'epic', outcome: 'success' });
  const t1 = await queryAudit('t1');
  const t2 = await queryAudit('t2');
  assert.strictEqual(t1.length, 1);
  assert.strictEqual(t2.length, 1);
  // PHI-like fields are redacted in audit detail.
  assert.strictEqual(t1[0].detail.transcript, '[redacted]');
  // Tenant isolation: t1 query never returns t2 records.
  assert.ok(t1.every((r) => r.tenantId === 't1'));
});

// 10. Compliance readiness incl. optional CMMC
test('API: compliance readiness (HIPAA + optional CMMC)', async () => {
  fresh();
  await registry.syncAll({ tenantId: 'acme' });
  const snaps = await getStore().getTenantSnapshots('acme');
  const compliance = buildCompliance(snaps);
  const frameworks = compliance.frameworks.map((f) => f.framework);
  assert.ok(frameworks.includes('HIPAA'));
  assert.ok(frameworks.includes('CMMC-L2')); // ENABLE_CMMC=true in this suite
  assert.ok(compliance.training.completionPct >= 0);
  assert.ok(compliance.evidence.coveragePct >= 0);
});

module.exports = tests;
