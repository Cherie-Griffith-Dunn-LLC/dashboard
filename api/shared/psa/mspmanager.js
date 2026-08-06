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
    return String(this.env.MSPMANAGER_BASE_URL || 'https://api.mspmanager.com/odata').replace(/\/$/, '');
  }

  _ticketsPath() {
    return this.env.MSPMANAGER_TICKETS_PATH || '/Tickets';
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

    // MSP Manager OData ticket shape (POST /odata/Tickets). Matches the Swagger
    // create model: title, description, ticketPriorityCode, and the GUID links
    // (contact/serviceItem/issueType/location/project) that associate the ticket
    // with a company and category. GUIDs come from the payload or Azure app
    // settings so they stay out of code.
    const e = this.env;
    const body = {
      title: (payload.subject || 'New support request').slice(0, 250),
      description: payload.description || payload.transcript || '',
      ticketPriorityCode: mapPriorityCode(payload.priority, e),
    };
    if (payload.dueDate) body.dueDate = payload.dueDate;
    // Tier 2 (security) can route to a different issue type / service item.
    const tier2 = String(payload.tier || '') === '2' || payload.escalated === true;
    const contactId = payload.contactId || e.MSPMANAGER_DEFAULT_CONTACT_ID;
    const locationId = payload.locationId || e.MSPMANAGER_DEFAULT_LOCATION_ID;
    const serviceItemId = (tier2 && e.MSPMANAGER_TIER2_SERVICE_ITEM_ID) || e.MSPMANAGER_SERVICE_ITEM_ID;
    const issueTypeId = (tier2 && e.MSPMANAGER_TIER2_ISSUE_TYPE_ID) || e.MSPMANAGER_ISSUE_TYPE_ID;
    if (contactId) body.contactId = contactId;
    if (locationId) body.locationId = locationId;
    if (serviceItemId) body.serviceItemId = serviceItemId;
    if (issueTypeId) body.issueTypeId = issueTypeId;
    if (e.MSPMANAGER_PROJECT_ID) body.projectId = e.MSPMANAGER_PROJECT_ID;

    const data = await this.request(`${this._baseUrl()}${this._ticketsPath()}`, {
      method: 'POST',
      headers: this._headers(),
      body,
    });
    const id = data && (data.ticketNumber || data.id || data.ticketId || data.number);
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
    if (patch.priority) body.ticketPriorityCode = mapPriorityCode(patch.priority, this.env);
    if (patch.note) body.description = patch.note;
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

// MSP Manager uses an integer ticketPriorityCode. Defaults are a sensible guess
// (low=0 … critical=3); override any level via MSPMANAGER_PRIORITY_<LEVEL> app
// settings once you confirm the exact codes in Swagger.
function mapPriorityCode(p, env = {}) {
  const key = String(p || 'medium').toLowerCase();
  const override = env[`MSPMANAGER_PRIORITY_${key.toUpperCase()}`];
  if (override != null && override !== '') return Number(override);
  const map = { low: 0, medium: 1, normal: 1, high: 2, critical: 3 };
  return map[key] != null ? map[key] : 1;
}

module.exports = { MspManagerConnector };
