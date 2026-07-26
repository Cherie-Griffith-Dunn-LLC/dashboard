'use strict';

/**
 * GET /api/reports/{type}
 *
 * Generates a structured report: executive, compliance, connector-health, or
 * security-posture. Tenant-scoped, RBAC-gated (reports.read), and audited.
 */

const http = require('../shared/http');
const { requireCaller } = require('../shared/auth');
const { authorize } = require('../shared/rbac');
const { generateReport } = require('../shared/reports');

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }
    const decision = authorize(caller, 'reports:generate');
    if (!decision.ok) {
      context.res = http.forbidden(decision.message);
      return;
    }

    const type = context.bindingData && context.bindingData.type;
    const tenantId = http.getTenantId(req);
    const report = await generateReport(type, tenantId, { actor: caller.email });
    context.res = http.ok(report);
  } catch (err) {
    context.log && context.log.error && context.log.error('Reports error', err);
    context.res = http.json(err.statusCode || 500, { error: err.message });
  }
};
