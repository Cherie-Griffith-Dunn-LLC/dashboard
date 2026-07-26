'use strict';

/**
 * POST /api/connectors/{connector}/sync
 *
 * Runs the connect -> fetchData -> transformData -> sync lifecycle for a single
 * connector, or all nine when {connector} is "all". Tenant-scoped and audited.
 * RBAC: requires the connectors.sync permission (Analyst / Service / Owner).
 */

const http = require('../shared/http');
const { requireCaller } = require('../shared/auth');
const { authorize } = require('../shared/rbac');
const { syncConnector, syncAll, connectorNames } = require('../shared/framework/registry');

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }
    const decision = authorize(caller, 'connectors:sync');
    if (!decision.ok) {
      context.res = http.forbidden(decision.message);
      return;
    }

    const connector = String((context.bindingData && context.bindingData.connector) || '').toLowerCase();
    const tenantId = http.getTenantId(req);
    const ctx = { tenantId, actor: caller.email };

    if (connector === 'all') {
      const results = await syncAll(ctx);
      context.res = http.ok({ tenantId, synced: results.length, results });
      return;
    }
    if (!connectorNames().includes(connector)) {
      context.res = http.notFound(`Unknown connector: ${connector}`, { available: connectorNames() });
      return;
    }
    const result = await syncConnector(connector, ctx);
    context.res = result.status === 'error' ? http.json(502, result) : http.ok(result);
  } catch (err) {
    context.log && context.log.error && context.log.error('ConnectorSync error', err);
    context.res = http.json(err.statusCode || 500, { error: err.message });
  }
};
