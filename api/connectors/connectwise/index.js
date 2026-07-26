'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend } = require('../../shared/framework/sim');

/**
 * ConnectWise Manage (PSA) read/sync connector.
 *
 * Feeds the help-desk analytics dashboard: "help desk aging, security tickets,
 * department trends, repeat issues." Ticket *writes* use shared/psa/connectwise.
 * Live config mirrors that adapter (CONNECTWISE_SITE / _COMPANY_ID / _PUBLIC_KEY
 * / _PRIVATE_KEY / _CLIENT_ID).
 */
class ConnectWiseConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'connectwise', category: 'psa', domains: ['helpdesk', 'executive'] }, env);
  }

  isConfigured() {
    const e = this.env;
    return Boolean(e.CONNECTWISE_SITE && e.CONNECTWISE_COMPANY_ID && e.CONNECTWISE_PUBLIC_KEY && e.CONNECTWISE_PRIVATE_KEY && e.CONNECTWISE_CLIENT_ID);
  }

  simulateFetch(ctx) {
    return simulateHelpdesk(this.rng(ctx.tenantId));
  }

  transformData(raw) {
    return transformHelpdesk(raw);
  }
}

// Shared help-desk shape used by both PSA read connectors.
function simulateHelpdesk(rng) {
  const open = intBetween(rng, 20, 200);
  return {
    openTickets: open,
    securityTickets: intBetween(rng, 0, Math.round(open * 0.3)),
    aging: {
      under24h: intBetween(rng, 5, open),
      d1to3: intBetween(rng, 0, Math.round(open * 0.4)),
      d3to7: intBetween(rng, 0, Math.round(open * 0.2)),
      over7d: intBetween(rng, 0, Math.round(open * 0.15)),
    },
    departmentTrends: [
      { department: 'Clinical', tickets: intBetween(rng, 5, 60) },
      { department: 'Administrative', tickets: intBetween(rng, 5, 50) },
      { department: 'Finance', tickets: intBetween(rng, 2, 30) },
      { department: 'IT', tickets: intBetween(rng, 5, 40) },
    ],
    repeatIssues: [
      { issue: 'Password reset / account lockout', count: intBetween(rng, 5, 40) },
      { issue: 'VPN connectivity', count: intBetween(rng, 3, 25) },
      { issue: 'Printer / peripheral', count: intBetween(rng, 2, 20) },
      { issue: 'Email delivery', count: intBetween(rng, 1, 18) },
    ],
    volumeTrend: monthlyTrend(rng, intBetween(rng, 50, 150), 6, 25),
  };
}

function transformHelpdesk(raw) {
  const issues = [];
  if (raw.aging.over7d > raw.openTickets * 0.1) issues.push({ severity: 'medium', title: `${raw.aging.over7d} tickets aging over 7 days` });
  if (raw.securityTickets > 0) issues.push({ severity: 'high', title: `${raw.securityTickets} open security tickets` });
  const topRepeat = raw.repeatIssues.slice().sort((a, b) => b.count - a.count)[0];
  if (topRepeat && topRepeat.count > 20) issues.push({ severity: 'low', title: `Recurring: ${topRepeat.issue} (${topRepeat.count})` });
  return {
    openTickets: raw.openTickets,
    securityTickets: raw.securityTickets,
    aging: raw.aging,
    departmentTrends: raw.departmentTrends,
    repeatIssues: raw.repeatIssues.slice().sort((a, b) => b.count - a.count),
    volumeTrend: raw.volumeTrend,
    issues,
  };
}

module.exports = { ConnectWiseConnector, simulateHelpdesk, transformHelpdesk };
