'use strict';

/**
 * PSA connector registry.
 *
 * Resolves the authoritative ticketing backend. The active connector is chosen
 * by PSA_CONNECTOR (connectwise | halo | ninjaone | helpdesk); it defaults to
 * the internal help desk so the API is always functional. External connectors
 * that are selected but not yet credentialed fall back to simulation mode (see
 * BasePsaConnector), which keeps the intake pipeline testable end-to-end.
 */

const { HelpDeskConnector } = require('./helpdesk');
const { ConnectWiseConnector } = require('./connectwise');
const { HaloConnector } = require('./halo');
const { NinjaOneConnector } = require('./ninjaone');

const FACTORIES = {
  helpdesk: () => new HelpDeskConnector(),
  connectwise: () => new ConnectWiseConnector(),
  halo: () => new HaloConnector(),
  ninjaone: () => new NinjaOneConnector(),
};

const cache = new Map();

function getConnector(name) {
  const key = String(name || process.env.PSA_CONNECTOR || 'helpdesk').toLowerCase();
  const factory = FACTORIES[key];
  if (!factory) {
    const err = new Error(`Unknown PSA connector: ${key}`);
    err.statusCode = 400;
    throw err;
  }
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key);
}

/** The connector the service treats as the authoritative record. */
function getActiveConnector() {
  return getConnector(process.env.PSA_CONNECTOR || 'helpdesk');
}

/** Readiness descriptors for every known PSA connector. */
function listConnectors() {
  return Object.keys(FACTORIES).map((name) => {
    const c = FACTORIES[name]();
    const d = c.describe();
    d.active = name === String(process.env.PSA_CONNECTOR || 'helpdesk').toLowerCase();
    return d;
  });
}

function _resetCache() {
  cache.clear();
}

module.exports = { getConnector, getActiveConnector, listConnectors, _resetCache };
