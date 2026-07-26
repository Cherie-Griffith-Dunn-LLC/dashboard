'use strict';

const { shortId, nowIso } = require('../ids');

/**
 * Base class for PSA / ITSM connectors.
 *
 * A PSA connector is the adapter between the Security 360 ticket service and
 * an authoritative MSP ticketing platform (ConnectWise, Halo, NinjaOne, or an
 * internal help desk). Every connector implements the same small surface so
 * the ticket service never needs to know which platform is behind it:
 *
 *   createTicket(payload)         -> { externalId, url, raw, simulated }
 *   updateTicket(externalId, p)   -> { externalId, raw, simulated }
 *   getTicket(externalId)         -> { externalId, raw } | null
 *   searchOpenTickets(query)      -> [{ externalId, subject, ... }]
 *
 * When a connector's credentials are not configured it runs in "simulation"
 * mode: calls succeed, return synthetic identifiers, and set `simulated: true`
 * so upstream systems and the readiness endpoint can tell live traffic apart
 * from demo traffic. This is what lets the whole intake pipeline be exercised
 * end-to-end before real PSA credentials are provisioned.
 */
class BasePsaConnector {
  constructor(name) {
    this.name = name;
  }

  /** Subclasses override: are the credentials/URL for this PSA present? */
  isConfigured() {
    return false;
  }

  /** A minimal readiness descriptor for the /connectors listing. */
  describe() {
    return {
      name: this.name,
      configured: this.isConfigured(),
      mode: this.isConfigured() ? 'live' : 'simulation',
    };
  }

  async createTicket(payload) {
    return this._simulateCreate(payload);
  }

  async updateTicket(externalId, patch) {
    return this._simulateUpdate(externalId, patch);
  }

  async getTicket() {
    return null;
  }

  async searchOpenTickets() {
    return [];
  }

  // --- simulation helpers -------------------------------------------------

  _simulateCreate(payload) {
    const externalId = shortId(this.name.slice(0, 3).toUpperCase());
    return {
      externalId,
      url: null,
      simulated: true,
      raw: { simulated: true, connector: this.name, receivedAt: nowIso(), payload },
    };
  }

  _simulateUpdate(externalId, patch) {
    return {
      externalId,
      simulated: true,
      raw: { simulated: true, connector: this.name, updatedAt: nowIso(), patch },
    };
  }

  // --- shared HTTP helper -------------------------------------------------

  /**
   * Thin JSON fetch wrapper with timeout + consistent error surface. Uses the
   * Node 18+ global fetch, so no SDK dependency is required for REST PSAs.
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs || 15000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: Object.assign({ Accept: 'application/json' }, options.headers || {}),
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      const text = await res.text();
      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (err) {
          data = text;
        }
      }
      if (!res.ok) {
        const e = new Error(`${this.name} PSA request failed: ${res.status}`);
        e.statusCode = res.status;
        e.responseBody = data;
        throw e;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = { BasePsaConnector };
