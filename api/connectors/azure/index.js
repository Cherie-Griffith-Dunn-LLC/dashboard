'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend } = require('../../shared/framework/sim');

/**
 * Azure / Microsoft Defender for Cloud connector.
 *
 * Feeds the vulnerabilities view: cloud vulnerabilities, secure score, and
 * resource posture. Live mode uses the Azure Resource Manager + Defender APIs
 * (AZURE_SUBSCRIPTION_ID / AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET).
 */
class AzureConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'azure', category: 'cloud', domains: ['vulnerabilities', 'executive', 'compliance'] }, env);
  }

  isConfigured() {
    const e = this.env;
    return Boolean(e.AZURE_SUBSCRIPTION_ID && e.AZURE_TENANT_ID && e.AZURE_CLIENT_ID && e.AZURE_CLIENT_SECRET);
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    const resources = intBetween(rng, 20, 300);
    return {
      resources,
      secureScorePct: intBetween(rng, 45, 92),
      vulnerabilities: {
        critical: intBetween(rng, 0, 10),
        high: intBetween(rng, 0, 40),
        medium: intBetween(rng, 5, 120),
        low: intBetween(rng, 10, 200),
      },
      unencryptedResources: intBetween(rng, 0, 12),
      publicStorage: intBetween(rng, 0, 5),
      secureScoreTrend: monthlyTrend(rng, intBetween(rng, 45, 90), 6, 8),
    };
  }

  transformData(raw) {
    const v = raw.vulnerabilities;
    const total = v.critical + v.high + v.medium + v.low;
    const issues = [];
    if (v.critical > 0) issues.push({ severity: 'critical', title: `${v.critical} critical cloud vulnerabilities` });
    if (raw.publicStorage > 0) issues.push({ severity: 'high', title: `${raw.publicStorage} publicly-exposed storage resources` });
    if (raw.unencryptedResources > 0) issues.push({ severity: 'high', title: `${raw.unencryptedResources} resources without encryption at rest` });
    if (raw.secureScorePct < 70) issues.push({ severity: 'medium', title: `Defender secure score ${raw.secureScorePct}% (target >= 80%)` });
    return {
      resources: raw.resources,
      secureScorePct: raw.secureScorePct,
      secureScoreTrend: raw.secureScoreTrend,
      vulnerabilities: Object.assign({ total }, v),
      posture: { unencryptedResources: raw.unencryptedResources, publicStorage: raw.publicStorage },
      issues,
    };
  }
}

module.exports = { AzureConnector };
