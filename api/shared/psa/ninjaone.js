'use strict';

const { BasePsaConnector } = require('./base');

/**
 * NinjaOne (ticketing) connector.
 *
 * Config (all required for live mode):
 *   NINJAONE_BASE_URL      e.g. https://app.ninjarmm.com
 *   NINJAONE_CLIENT_ID
 *   NINJAONE_CLIENT_SECRET
 *   NINJAONE_BOARD_ID      (optional) ticket board id
 *
 * Auth: OAuth2 client-credentials against /ws/oauth/token, scope `monitoring management`.
 * Reference: NinjaOne API, POST /v2/ticketing/ticket.
 */
class NinjaOneConnector extends BasePsaConnector {
  constructor(env = process.env) {
    super('ninjaone');
    this.env = env;
    this._token = null;
    this._tokenExpiry = 0;
  }

  isConfigured() {
    const e = this.env;
    return Boolean(e.NINJAONE_BASE_URL && e.NINJAONE_CLIENT_ID && e.NINJAONE_CLIENT_SECRET);
  }

  _base() {
    return this.env.NINJAONE_BASE_URL.replace(/\/$/, '');
  }

  async _getToken() {
    if (this._token && Date.now() < this._tokenExpiry - 30000) return this._token;
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.env.NINJAONE_CLIENT_ID,
      client_secret: this.env.NINJAONE_CLIENT_SECRET,
      scope: 'monitoring management',
    });
    const res = await fetch(`${this._base()}/ws/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!res.ok) {
      const e = new Error(`NinjaOne auth failed: ${res.status}`);
      e.statusCode = res.status;
      throw e;
    }
    const data = await res.json();
    this._token = data.access_token;
    this._tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
    return this._token;
  }

  async _authHeaders() {
    const token = await this._getToken();
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  }

  async createTicket(payload) {
    if (!this.isConfigured()) return this._simulateCreate(payload);
    const body = {
      subject: (payload.subject || 'New ticket').slice(0, 200),
      description: { public: true, body: payload.description || '' },
      priority: mapPriority(payload.priority),
      status: 'NEW',
    };
    if (this.env.NINJAONE_BOARD_ID) body.ticketFormId = Number(this.env.NINJAONE_BOARD_ID);
    const data = await this.request(`${this._base()}/v2/ticketing/ticket`, {
      method: 'POST',
      headers: await this._authHeaders(),
      body,
    });
    return {
      externalId: String(data.id),
      url: `${this._base()}/#/ticketing/ticket/${data.id}`,
      simulated: false,
      raw: data,
    };
  }

  async updateTicket(externalId, patch) {
    if (!this.isConfigured()) return this._simulateUpdate(externalId, patch);
    const body = {};
    if (patch.status) body.status = String(patch.status).toUpperCase();
    if (patch.priority) body.priority = mapPriority(patch.priority);
    const data = await this.request(`${this._base()}/v2/ticketing/ticket/${externalId}`, {
      method: 'PATCH',
      headers: await this._authHeaders(),
      body,
    });
    return { externalId: String(externalId), simulated: false, raw: data };
  }
}

function mapPriority(p) {
  switch (String(p || '').toLowerCase()) {
    case 'critical':
      return 'HIGH';
    case 'high':
      return 'HIGH';
    case 'medium':
      return 'MEDIUM';
    default:
      return 'LOW';
  }
}

module.exports = { NinjaOneConnector };
