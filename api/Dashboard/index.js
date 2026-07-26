'use strict';

/**
 * GET /api/dashboard/{view}
 *
 * Returns an aggregated, tenant-scoped dashboard view. Views: executive,
 * microsoft, vulnerabilities, epic, compliance, helpdesk. RBAC-gated per view
 * (epic requires an elevated role). Reads are audited.
 */

const http = require('../shared/http');
const { requireCaller } = require('../shared/auth');
const { authorize } = require('../shared/rbac');
const { getDashboard } = require('../shared/dashboards');
const { audit } = require('../shared/audit');

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }
    const view = context.bindingData && context.bindingData.view;
    const decision = authorize(caller, `dashboard:${String(view).toLowerCase()}`);
    if (!decision.ok) {
      context.res = http.forbidden(decision.message);
      return;
    }

    const tenantId = http.getTenantId(req);
    const data = await getDashboard(view, tenantId, { actor: caller.email });
    await audit({ tenantId, actor: caller.email, action: 'dashboard.read', target: view, outcome: 'success' });
    context.res = http.ok(data);
  } catch (err) {
    context.log && context.log.error && context.log.error('Dashboard error', err);
    context.res = http.json(err.statusCode || 500, { error: err.message });
  }
};
