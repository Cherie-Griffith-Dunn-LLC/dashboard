'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend } = require('../../shared/framework/sim');

/**
 * NinjaOne (RMM) connector.
 *
 * Feeds "patch compliance and endpoint health" plus device inventory. Live
 * mode uses the NinjaOne API (NINJAONE_BASE_URL / NINJAONE_CLIENT_ID /
 * NINJAONE_CLIENT_SECRET, OAuth2 client-credentials).
 *
 * Note: the ticket-write side of NinjaOne lives in shared/psa/ninjaone.js; this
 * connector is the read/sync side that feeds dashboards.
 */
class NinjaOneConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'ninjaone', category: 'rmm', domains: ['vulnerabilities', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.NINJAONE_BASE_URL && this.env.NINJAONE_CLIENT_ID && this.env.NINJAONE_CLIENT_SECRET);
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    const devices = intBetween(rng, 60, 500);
    const missingPatches = intBetween(rng, 0, Math.round(devices * 0.4));
    return {
      devices,
      servers: intBetween(rng, 2, 40),
      workstations: devices,
      missingCriticalPatches: intBetween(rng, 0, Math.round(devices * 0.1)),
      missingPatches,
      offlineOver7d: intBetween(rng, 0, Math.round(devices * 0.1)),
      diskHealthWarnings: intBetween(rng, 0, 12),
      patchTrend: monthlyTrend(rng, intBetween(rng, 80, 99), 6, 6),
    };
  }

  transformData(raw) {
    const patched = raw.devices - raw.missingPatches;
    const patchCompliancePct = Math.round((patched / raw.devices) * 100);
    const issues = [];
    if (raw.missingCriticalPatches > 0) issues.push({ severity: 'critical', title: `${raw.missingCriticalPatches} devices missing critical patches` });
    if (patchCompliancePct < 90) issues.push({ severity: 'high', title: `Patch compliance at ${patchCompliancePct}% (target >= 95%)` });
    if (raw.offlineOver7d > 0) issues.push({ severity: 'low', title: `${raw.offlineOver7d} devices offline >7 days` });
    return {
      inventory: { devices: raw.devices, servers: raw.servers, workstations: raw.workstations },
      patchCompliance: {
        compliancePct: patchCompliancePct,
        missingPatches: raw.missingPatches,
        missingCriticalPatches: raw.missingCriticalPatches,
        trend: raw.patchTrend,
      },
      endpointHealth: { offlineOver7d: raw.offlineOver7d, diskHealthWarnings: raw.diskHealthWarnings },
      issues,
    };
  }
}

module.exports = { NinjaOneConnector };
