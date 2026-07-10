'use strict';

/**
 * GET /api/connectors
 *
 * Readiness / configuration report for the connector suite. Powers a
 * Security 360 integrations panel and doubles as an operational health check:
 * it shows which PSA is authoritative, whether Amazon Connect ingestion is
 * secured, whether Foundry/Copilot is live vs heuristic, and flags insecure
 * development toggles.
 */

const http = require('../shared/http');
const { listConnectors } = require('../shared/psa');
const { AmazonConnectClient } = require('../shared/connectors/amazonConnect');

module.exports = async function (context) {
  const ac = new AmazonConnectClient();
  const foundryLive = Boolean(process.env.FOUNDRY_ENDPOINT && process.env.FOUNDRY_API_KEY && process.env.FOUNDRY_DEPLOYMENT);
  const webhookSecured = Boolean(process.env.AMAZON_CONNECT_WEBHOOK_SECRET);
  const apiSecured = Boolean(process.env.CONNECTOR_API_KEY) && process.env.ALLOW_ANONYMOUS_API !== 'true';

  const warnings = [];
  if (!webhookSecured) warnings.push('AMAZON_CONNECT_WEBHOOK_SECRET is not set — the webhook accepts unsigned events.');
  if (process.env.ALLOW_ANONYMOUS_API === 'true') warnings.push('ALLOW_ANONYMOUS_API=true — management endpoints are unauthenticated.');

  context.res = http.ok({
    activePsa: process.env.PSA_CONNECTOR || 'helpdesk',
    psaConnectors: listConnectors(),
    amazonConnect: {
      intake: 'webhook',
      standaloneCasesTasks: ac.isConfigured() ? 'live' : 'simulation',
      webhookSecured,
    },
    copilot: {
      mode: foundryLive ? 'foundry' : 'heuristic',
      tools: ['summarize', 'categorize', 'priority', 'root-cause', 'draft-update'],
    },
    security: { managementApiSecured: apiSecured },
    warnings,
  });
};
