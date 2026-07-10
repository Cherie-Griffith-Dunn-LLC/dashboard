'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { simulateHelpdesk, transformHelpdesk } = require('../connectwise');

/**
 * HaloPSA read/sync connector.
 *
 * Alternate PSA source for the help-desk analytics dashboard (same normalized
 * shape as the ConnectWise connector). Ticket writes use shared/psa/halo. Live
 * config mirrors that adapter (HALO_BASE_URL / HALO_CLIENT_ID / HALO_CLIENT_SECRET).
 */
class HaloConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'halo', category: 'psa', domains: ['helpdesk', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.HALO_BASE_URL && this.env.HALO_CLIENT_ID && this.env.HALO_CLIENT_SECRET);
  }

  simulateFetch(ctx) {
    return simulateHelpdesk(this.rng(ctx.tenantId));
  }

  transformData(raw) {
    return transformHelpdesk(raw);
  }
}

module.exports = { HaloConnector };
