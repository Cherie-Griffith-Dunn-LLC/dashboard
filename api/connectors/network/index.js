'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween } = require('../../shared/framework/sim');

/**
 * Network connector.
 *
 * Feeds network exposure/health into the vulnerabilities and executive views:
 * external exposure, firewall posture, and device reachability. Live mode can
 * be backed by a scanner or firewall API (NETWORK_SCANNER_URL / NETWORK_API_KEY).
 */
class NetworkConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'network', category: 'network', domains: ['vulnerabilities', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.NETWORK_SCANNER_URL && this.env.NETWORK_API_KEY);
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    return {
      externalHosts: intBetween(rng, 1, 30),
      openHighRiskPorts: intBetween(rng, 0, 8),
      expiringCerts30d: intBetween(rng, 0, 6),
      firewallRulesReviewedDays: intBetween(rng, 0, 400),
      vulnerableServices: intBetween(rng, 0, 12),
      segmentationGaps: intBetween(rng, 0, 5),
    };
  }

  transformData(raw) {
    const issues = [];
    if (raw.openHighRiskPorts > 0) issues.push({ severity: 'high', title: `${raw.openHighRiskPorts} high-risk ports exposed externally` });
    if (raw.expiringCerts30d > 0) issues.push({ severity: 'medium', title: `${raw.expiringCerts30d} TLS certs expiring within 30 days` });
    if (raw.firewallRulesReviewedDays > 180) issues.push({ severity: 'medium', title: `Firewall rules not reviewed in ${raw.firewallRulesReviewedDays} days` });
    if (raw.segmentationGaps > 0) issues.push({ severity: 'medium', title: `${raw.segmentationGaps} network segmentation gaps (clinical/guest)` });
    return {
      exposure: { externalHosts: raw.externalHosts, openHighRiskPorts: raw.openHighRiskPorts, vulnerableServices: raw.vulnerableServices },
      certificates: { expiring30d: raw.expiringCerts30d },
      firewall: { lastReviewedDays: raw.firewallRulesReviewedDays, segmentationGaps: raw.segmentationGaps },
      issues,
    };
  }
}

module.exports = { NetworkConnector };
