'use strict';

const { BasePsaConnector } = require('./base');

/**
 * HaloPSA connector.
 *
 * Config (all required for live mode):
 *   HALO_BASE_URL        e.g. https://cyproteck.halopsa.com
 *   HALO_CLIENT_ID
 *   HALO_CLIENT_SECRET
 *   HALO_TENANT          (optional, for multi-tenant Halo)
 *
 * Auth: OAuth2 client-credentials against /auth/token, scope `all`.
 * Reference: HaloPSA API, POST /api/Tickets (array-wrapped body).
 */
class HaloConnector extends BasePsaConnector {
  constructor(env = process.env) {
    super('halo');
    this.env = env;
    this._token = null;
    this._tokenExpiry = 0;
  }

  isConfigured() {
    const e = this.env;
    return Boolean(e.HALO_BASE_URL && e.HALO_CLIENT_ID && e.HALO_CLIENT_SECRET);
  }

  _base() {
    return this.env.HALO_BASE_URL.replace(/\/$/, '');
  }

  async _getToken() {
    if (this._token && Date.now() < this._tokenExpiry - 30000) return this._token;
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.env.HALO_CLIENT_ID,
      client_secret: this.env.HALO_CLIENT_SECRET,
      scope: 'all',
    });
    const url = `${this._base()}/auth/token${this.env.HALO_TENANT ? `?tenant=${this.env.HALO_TENANT}` : ''}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!res.ok) {
      const e = new Error(`Halo auth failed: ${res.status}`);
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
    const body = [
      {
        summary: (payload.subject || 'New ticket').slice(0, 250),
        details: payload.description || '',
        priority_id: mapPriority(payload.priority),
        source: payload.source || 'Amazon Connect',
      },
    ];
    const data = await this.request(`${this._base()}/api/Tickets`, {
      method: 'POST',
      headers: await this._authHeaders(),
      body,
    });
    const ticket = Array.isArray(data) ? data[0] : data;
    return {
      externalId: String(ticket.id),
      url: `${this._base()}/tickets?id=${ticket.id}`,
      simulated: false,
      raw: ticket,
    };
  }

  async updateTicket(externalId, patch) {
    if (!this.isConfigured()) return this._simulateUpdate(externalId, patch);
    const body = [{ id: Number(externalId) }];
    if (patch.status) body[0].status_id = patch.status;
    if (patch.priority) body[0].priority_id = mapPriority(patch.priority);
    const data = await this.request(`${this._base()}/api/Tickets`, {
      method: 'POST',
      headers: await this._authHeaders(),
      body,
    });
    return { externalId: String(externalId), simulated: false, raw: data };
  }
}

// Halo priority ids are tenant-specific; these are the common defaults.
function mapPriority(p) {
  switch (String(p || '').toLowerCase()) {
    case 'critical':
      return 1;
    case 'high':
      return 2;
    case 'medium':
      return 3;
    default:
      return 4;
  }
}

module.exports = { HaloConnector };
