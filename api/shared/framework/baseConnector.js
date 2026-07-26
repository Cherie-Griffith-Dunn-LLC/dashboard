'use strict';

/**
 * Base class for data connectors.
 *
 * Every connector implements the required four-stage lifecycle from the build
 * brief:
 *
 *   connect()          -> establish/verify a session; returns { connected, mode }
 *   fetchData(ctx)     -> pull raw provider data (live) or seeded data (sim)
 *   transformData(raw) -> normalize into the connector's domain metrics
 *   sync(ctx)          -> orchestrate connect -> fetch -> transform -> persist
 *                         a tenant-scoped snapshot, with audit logging
 *
 * Connectors declare the dashboard `domains` they feed so the aggregation layer
 * can assemble each view without hard-coding provider knowledge. When
 * credentials are absent a connector runs in `simulation` mode: it produces
 * deterministic, representative data (see framework/sim.js) marked
 * `simulated: true`, and the exact same transform path is used for live data.
 */

const { getStore } = require('../store');
const { seeded } = require('./sim');
const { audit } = require('../audit');

class BaseConnector {
  /**
   * @param {object} meta { name, category, domains: string[] }
   * @param {object} env  environment (defaults to process.env)
   */
  constructor(meta, env = process.env) {
    this.name = meta.name;
    this.category = meta.category || 'general';
    this.domains = meta.domains || [];
    this.env = env;
  }

  /** Subclasses override: are live credentials present? */
  isConfigured() {
    return false;
  }

  mode() {
    return this.isConfigured() ? 'live' : 'simulation';
  }

  describe() {
    return {
      name: this.name,
      category: this.category,
      domains: this.domains,
      configured: this.isConfigured(),
      mode: this.mode(),
    };
  }

  /** A deterministic PRNG scoped to this connector + tenant. */
  rng(tenantId) {
    return seeded(`${this.name}:${tenantId || 'default'}`);
  }

  // --- lifecycle ----------------------------------------------------------

  /**
   * Establish or verify connectivity. Live connectors override to perform a
   * real auth/health probe; the default reports simulation readiness.
   */
  async connect() {
    return { connected: true, mode: this.mode() };
  }

  /**
   * Fetch raw provider data. Live connectors override. In simulation mode the
   * default delegates to `simulateFetch`, which subclasses implement.
   */
  async fetchData(ctx = {}) {
    if (this.isConfigured()) {
      throw new Error(`${this.name}.fetchData() not implemented for live mode`);
    }
    return this.simulateFetch(ctx);
  }

  /** Subclasses implement: produce raw, provider-shaped simulation data. */
  simulateFetch() {
    return {};
  }

  /**
   * Normalize raw data into the connector's domain metrics. Subclasses
   * override. Must return a plain object keyed by domain metric names.
   */
  transformData(raw) {
    return raw;
  }

  /**
   * Full sync: connect -> fetch -> transform -> persist snapshot -> audit.
   * Returns the persisted snapshot descriptor. Never throws for expected
   * provider outages; surfaces `status: 'error'` instead so sync-all degrades
   * gracefully.
   *
   * @param {object} ctx { tenantId, actor }
   */
  async sync(ctx = {}) {
    const tenantId = ctx.tenantId || 'default';
    const startedAt = new Date().toISOString();
    try {
      const connection = await this.connect();
      const raw = await this.fetchData(ctx);
      const data = this.transformData(raw, ctx);
      const snapshot = {
        connector: this.name,
        category: this.category,
        domains: this.domains,
        tenantId,
        mode: this.mode(),
        simulated: this.mode() === 'simulation',
        connection,
        data,
        syncedAt: new Date().toISOString(),
        startedAt,
      };
      await getStore().saveConnectorSnapshot(tenantId, this.name, snapshot);
      await audit({
        tenantId,
        actor: ctx.actor || 'system',
        action: 'connector.sync',
        target: this.name,
        outcome: 'success',
        detail: { mode: snapshot.mode, domains: this.domains },
      });
      return { status: 'synced', connector: this.name, mode: snapshot.mode, syncedAt: snapshot.syncedAt };
    } catch (err) {
      await audit({
        tenantId,
        actor: ctx.actor || 'system',
        action: 'connector.sync',
        target: this.name,
        outcome: 'error',
        detail: { message: err.message },
      });
      return { status: 'error', connector: this.name, error: err.message };
    }
  }
}

module.exports = { BaseConnector };
