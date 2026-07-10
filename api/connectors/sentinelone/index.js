'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend } = require('../../shared/framework/sim');

/**
 * SentinelOne (EDR) connector.
 *
 * Feeds "endpoint health and threat trends". Live mode uses the SentinelOne
 * management API (SENTINELONE_BASE_URL / SENTINELONE_API_TOKEN).
 */
class SentinelOneConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'sentinelone', category: 'endpoint', domains: ['vulnerabilities', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.SENTINELONE_BASE_URL && this.env.SENTINELONE_API_TOKEN);
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    const agents = intBetween(rng, 60, 500);
    return {
      agents,
      online: Math.round(agents * (0.85 + rng() * 0.13)),
      outOfDate: intBetween(rng, 0, Math.round(agents * 0.2)),
      infected: intBetween(rng, 0, 6),
      threatsBlocked30d: intBetween(rng, 20, 400),
      activeThreats: intBetween(rng, 0, 8),
      threatTrend: monthlyTrend(rng, intBetween(rng, 5, 40), 6, 12),
    };
  }

  transformData(raw) {
    const protectedPct = Math.round(((raw.agents - raw.outOfDate) / raw.agents) * 100);
    const issues = [];
    if (raw.activeThreats > 0) issues.push({ severity: 'critical', title: `${raw.activeThreats} active EDR threats` });
    if (raw.infected > 0) issues.push({ severity: 'critical', title: `${raw.infected} endpoints flagged infected` });
    if (raw.outOfDate > raw.agents * 0.1) issues.push({ severity: 'medium', title: `${raw.outOfDate} agents out of date` });
    return {
      endpointHealth: {
        agents: raw.agents,
        online: raw.online,
        onlinePct: Math.round((raw.online / raw.agents) * 100),
        outOfDate: raw.outOfDate,
        protectedPct,
      },
      threats: { activeThreats: raw.activeThreats, infected: raw.infected, blocked30d: raw.threatsBlocked30d },
      threatTrend: raw.threatTrend,
      issues,
    };
  }
}

module.exports = { SentinelOneConnector };
