'use strict';

/**
 * Data-connector registry.
 *
 * Resolves the nine connectors required by the build brief and exposes
 * lifecycle helpers used by the connector-sync API and the dashboard
 * aggregation layer. These are *data ingestion* connectors (connect ->
 * fetchData -> transformData -> sync); the ticket-write PSA adapters live
 * separately under shared/psa.
 */

const { MicrosoftConnector } = require('../../connectors/microsoft');
const { SentinelOneConnector } = require('../../connectors/sentinelone');
const { EpicConnector } = require('../../connectors/epic');
const { NinjaOneConnector } = require('../../connectors/ninjaone');
const { ConnectWiseConnector } = require('../../connectors/connectwise');
const { HaloConnector } = require('../../connectors/halo');
const { NetworkConnector } = require('../../connectors/network');
const { AzureConnector } = require('../../connectors/azure');
const { AwsConnector } = require('../../connectors/aws');

const FACTORIES = {
  microsoft: () => new MicrosoftConnector(),
  sentinelone: () => new SentinelOneConnector(),
  epic: () => new EpicConnector(),
  ninjaone: () => new NinjaOneConnector(),
  connectwise: () => new ConnectWiseConnector(),
  halo: () => new HaloConnector(),
  network: () => new NetworkConnector(),
  azure: () => new AzureConnector(),
  aws: () => new AwsConnector(),
};

function connectorNames() {
  return Object.keys(FACTORIES);
}

function getDataConnector(name) {
  const key = String(name || '').toLowerCase();
  const factory = FACTORIES[key];
  if (!factory) {
    const err = new Error(`Unknown connector: ${key}`);
    err.statusCode = 404;
    throw err;
  }
  return factory();
}

function describeAll() {
  return connectorNames().map((n) => FACTORIES[n]().describe());
}

/** Sync a single connector for a tenant. */
async function syncConnector(name, ctx) {
  return getDataConnector(name).sync(ctx);
}

/** Sync every connector for a tenant; returns per-connector results. */
async function syncAll(ctx) {
  const results = [];
  for (const name of connectorNames()) {
    // Sequential keeps the in-memory store deterministic and audit ordering clean.
    results.push(await getDataConnector(name).sync(ctx)); // eslint-disable-line no-await-in-loop
  }
  return results;
}

module.exports = { connectorNames, getDataConnector, describeAll, syncConnector, syncAll };
