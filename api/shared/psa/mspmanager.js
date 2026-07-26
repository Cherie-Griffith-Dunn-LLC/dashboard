'use strict';

const { BasePsaConnector } = require('./base');

/**
 * N-able MSP Manager (PSA / Help Desk) connector.
 *
 * This is the authoritative ticketing backend for the CyproSecure Helpdesk
 * chat (Tier 1 → Tier 2). When configured it creates real tickets in MSP
 * Manager; otherwise it falls back to simulation so the pipeline stays testable.
 *
 * Config (Azure Static Web App → Configuration → Application settings):
 *   PSA_CONNECTOR            = mspmanager        (make this connector authoritative)
 *   MSPMANAGER_BASE_URL      = https://api.mspmanager.com   (CONFIRM from your Swagger page)
 *   MSPMANAGER_AUTH          = bearer | apikey | basic       (default: bearer)
 *   MSPMANAGER_API_KEY       = <API key from My Account → Settings → Security → API Key>
 *   MSPMANAGER_API_KEY_HEADER= <header name>     (only for AUTH=apikey; default: x-api-key)
 *   MSPMANAGER_USER          = <username>        (only for AUTH=basic)
 *   MSPMANAGER_PASSWORD      = <password>        (only for AUTH=basic)
 *   MSPMANAGER_TICKETS_PATH  = /v1/tickets       (CONFIRM from Swagger; override if different)
 *   MSPMANAGER_DEFAULT_QUEUE = <Tier 1 queue/board name>     (optional)
 *   MSPMANAGER_TIER2_QUEUE   = <Tier 2 / Security queue name>(optional)
 *
 * The three values marked CONFIRM come straight off the Swagger/OpenAPI page
 * inside your MSP Manager account (base URL shown at the top; the exact create
 * path and field names are listed under the Tickets endpoint). They are all
 * env-driven so no code change is needed to finalize them.
 *
 * SECURITY: the API key lives only in Azure app settings and is read here via
 * process.env on the server. It is never sent to the browser.
 */
class MspManagerConnector extends BasePsaConnector {
  constructor(env = process.env) {
    super('mspmanager');
    this.env = env;
  }

  isConfigured() {
    const e = this.env;
    if (!e.MSPMANAGER_BASE_URL) return false;
    const auth = (e.MSPMANAGER_AUTH || 'bearer').toLowerCase();
    if (auth === 'basic') return Boolean(e.MSPMANAGER_USER && e.MSPMANAGER_PASSWORD);
    return Boolean(e.MSPMANAGER_API_KEY);
  }

  describe() {
    return {
      name: this.name,
      configured: this.isConfigured(),
      mode: this.isConfigured() ? 'live' : 'simulation',
      baseUrl: this.env.MSPMANAGER_BASE_URL || null,
      auth: (this.env.MSPMANAGER_AUTH || 'bearer').toLowerCase(),
    };
  }

  _baseUrl() {
    return String(this.env.MSPMANAGER_BASE_URL || 'https://api.mspmanager.com').replace(/\/$/, '');
  }

  _ticketsPath() {
    return this.env.MSPMANAGER_TICKETS_PATH || '/v1/tickets';
  }

  _headers() {
    const e = this.env;
    const auth = (e.MSPMANAGER_AUTH || 'bearer').toLowerCase();
    const headers = { 'Content-Type': 'application/json' };
    if (auth === 'basic') {
      const basic = Buffer.from(`${e.MSPMANAGER_USER}:${e.MSPMANAGER_PASSWORD}`).toString('base64');
      headers.Authorization = `Basic ${basic}`;
    } else if (auth === 'apikey') {
      headers[e.MSPMANAGER_API_KEY_HEADER || 'x-api-key'] = e.MSPMANAGER_API_KEY;
    } else {
      headers.Authorization = `Bearer ${e.MSPMANAGER_API_KEY}`;
    }
    return headers;
  }

  /** Which MSP Manager queue/board a ticket lands in, by tier. */
  _queueFor(payload) {
    const tier2 = String(payload.tier || '') === '2' || payload.escalated === true;
    if (tier2 && this.env.MSPMANAGER_TIER2_QUEUE) return this.env.MSPMANAGER_TIER2_QUEUE;
    return this.env.MSPMANAGER_DEFAULT_QUEUE || undefined;
  }

  async createTicket(payload) {
    if (!this.isConfigured()) return this._simulateCreate(payload);

    // MSP Manager ticket shape. Field names are isolated here so they can be
    // reconciled against the Swagger schema without touching the rest of the app.
    const body = {
      subject: (payload.subject || 'New support request').slice(0, 200),
      description: payload.description || payload.transcript || '',
      priority: mapPriority(payload.priority),
    };
    const queue = this._queueFor(payload);
    if (queue) body.queue = queue;
    if (payload.customerId) body.companyId = payload.customerId;
    else if (payload.customerName) body.companyName = payload.customerName;
    if (payload.contactId) body.contactId = payload.contactId;
    if (payload.contactEmail) body.contactEmail = payload.contactEmail;

    const data = await this.request(`${this._baseUrl()}${this._ticketsPath()}`, {
      method: 'POST',
      headers: this._headers(),
      body,
    });
    const id = data && (data.id || data.ticketId || data.number);
    return {
      externalId: id != null ? String(id) : null,
      url: (data && (data.url || data.href)) || null,
      simulated: false,
      raw: data,
    };
  }

  async updateTicket(externalId, patch) {
    if (!this.isConfigured()) return this._simulateUpdate(externalId, patch);
    const body = {};
    if (patch.status) body.status = patch.status;
    if (patch.priority) body.priority = mapPriority(patch.priority);
    if (patch.note) body.note = patch.note;
    const data = await this.request(`${this._baseUrl()}${this._ticketsPath()}/${externalId}`, {
      method: 'PATCH',
      headers: this._headers(),
      body,
    });
    return { externalId: String(externalId), simulated: false, raw: data };
  }

  /** Lightweight connectivity probe used by the setup/test step. */
  async testConnection() {
    if (!this.isConfigured()) {
      return { ok: false, configured: false, message: 'MSP Manager credentials not set' };
    }
    try {
      // A cheap authenticated GET; path is env-overridable for tenants whose
      // discovery route differs. Any 2xx means auth + base URL are correct.
      const probePath = this.env.MSPMANAGER_PROBE_PATH || this._ticketsPath();
      await this.request(`${this._baseUrl()}${probePath}?limit=1`, { headers: this._headers() });
      return { ok: true, configured: true, message: 'Authenticated with MSP Manager' };
    } catch (err) {
      return { ok: false, configured: true, statusCode: err.statusCode || null, message: err.message };
    }
  }
}

function mapPriority(p) {
  switch (String(p || '').toLowerCase()) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Normal';
    default:
      return 'Low';
  }
}

module.exports = { MspManagerConnector };
