'use strict';

/**
 * POST /api/ai/copilot
 *
 * Server-side Security Copilot. Computes the tenant's risk model from connector
 * snapshots and returns the four-part response: Summary, Top Risks, Next
 * Actions, Responsible Owner. All AI calls happen here (never in the browser);
 * consequential recommendations are advisory (requiresApproval). Audited.
 *
 * Body: { question?: string }
 */

const http = require('../shared/http');
const { requireCaller } = require('../shared/auth');
const { authorize } = require('../shared/rbac');
const { ensureSnapshots } = require('../shared/dashboards');
const { computeRisk } = require('../shared/risk');
const copilot = require('../shared/copilot');
const { audit } = require('../shared/audit');

module.exports = async function (context, req) {
  try {
    const caller = requireCaller(req);
    if (!caller.ok) {
      context.res = http.unauthorized(caller.message);
      return;
    }
    const decision = authorize(caller, 'ai:copilot');
    if (!decision.ok) {
      context.res = http.forbidden(decision.message);
      return;
    }

    const body = http.parseBody(req);
    const tenantId = http.getTenantId(req);
    const snaps = await ensureSnapshots(tenantId, { actor: caller.email });
    const risk = computeRisk(snaps);
    const result = await copilot.securityCopilot({ question: body.question, risk, tenantId });

    await audit({
      tenantId,
      actor: caller.email,
      action: 'ai.copilot',
      target: 'security-briefing',
      outcome: 'success',
      detail: { generatedBy: result.generatedBy, question: body.question ? 'provided' : 'default' },
    });

    context.res = http.ok({
      response: result,
      format: ['summary', 'topRisks', 'nextActions', 'responsibleOwner'],
      riskScore: risk.score,
    });
  } catch (err) {
    context.log && context.log.error && context.log.error('AICopilot error', err);
    context.res = http.serverError(err.message);
  }
};
