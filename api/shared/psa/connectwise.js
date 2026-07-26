'use strict';

const { BasePsaConnector } = require('./base');

/**
 * ConnectWise Manage (PSA) connector.
 *
 * Config (all required for live mode):
 *   CONNECTWISE_SITE            e.g. https://na.myconnectwise.net
 *   CONNECTWISE_COMPANY_ID
 *   CONNECTWISE_PUBLIC_KEY
 *   CONNECTWISE_PRIVATE_KEY
 *   CONNECTWISE_CLIENT_ID
 *   CONNECTWISE_BOARD           (optional) service board name
 *
 * Reference: ConnectWise Manage REST API, POST /service/tickets.
 */
class ConnectWiseConnector extends BasePsaConnector {
  constructor(env = process.env) {
    super('connectwise');
    this.env = env;
  }

  isConfigured() {
    const e = this.env;
    return Boolean(
      e.CONNECTWISE_SITE &&
        e.CONNECTWISE_COMPANY_ID &&
        e.CONNECTWISE_PUBLIC_KEY &&
        e.CONNECTWISE_PRIVATE_KEY &&
        e.CONNECTWISE_CLIENT_ID
    );
  }

  _baseUrl() {
    return `${this.env.CONNECTWISE_SITE.replace(/\/$/, '')}/v4_6_release/apis/3.0`;
  }

  _headers() {
    const e = this.env;
    const basic = Buffer.from(
      `${e.CONNECTWISE_COMPANY_ID}+${e.CONNECTWISE_PUBLIC_KEY}:${e.CONNECTWISE_PRIVATE_KEY}`
    ).toString('base64');
    return {
      Authorization: `Basic ${basic}`,
      clientId: e.CONNECTWISE_CLIENT_ID,
      'Content-Type': 'application/json',
    };
  }

  async createTicket(payload) {
    if (!this.isConfigured()) return this._simulateCreate(payload);
    const body = {
      summary: (payload.subject || 'New ticket').slice(0, 100),
      initialDescription: payload.description || '',
      priority: mapPriority(payload.priority),
    };
    if (this.env.CONNECTWISE_BOARD) body.board = { name: this.env.CONNECTWISE_BOARD };
    if (payload.customerName) body.company = { identifier: payload.customerId || payload.customerName };
    const data = await this.request(`${this._baseUrl()}/service/tickets`, {
      method: 'POST',
      headers: this._headers(),
      body,
    });
    return {
      externalId: String(data.id),
      url: data._info && data._info.ticket_href ? data._info.ticket_href : null,
      simulated: false,
      raw: data,
    };
  }

  async updateTicket(externalId, patch) {
    if (!this.isConfigured()) return this._simulateUpdate(externalId, patch);
    const ops = [];
    if (patch.status) ops.push({ op: 'replace', path: 'status/name', value: patch.status });
    if (patch.priority) ops.push({ op: 'replace', path: 'priority/name', value: mapPriority(patch.priority) });
    const data = await this.request(`${this._baseUrl()}/service/tickets/${externalId}`, {
      method: 'PATCH',
      headers: this._headers(),
      body: ops,
    });
    return { externalId: String(externalId), simulated: false, raw: data };
  }
}

function mapPriority(p) {
  switch (String(p || '').toLowerCase()) {
    case 'critical':
      return 'Priority 1 - Critical';
    case 'high':
      return 'Priority 2 - High';
    case 'medium':
      return 'Priority 3 - Medium';
    default:
      return 'Priority 4 - Low';
  }
}

module.exports = { ConnectWiseConnector };
