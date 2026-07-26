'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend } = require('../../shared/framework/sim');

/**
 * Microsoft 365 / Entra ID connector.
 *
 * Feeds the "Microsoft admins, risky users, license usage, device compliance,
 * and conditional access" dashboard. Live mode uses Microsoft Graph
 * (MICROSOFT_TENANT_ID / MICROSOFT_CLIENT_ID / MICROSOFT_CLIENT_SECRET);
 * simulation mode produces deterministic representative metrics.
 */
class MicrosoftConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'microsoft', category: 'identity', domains: ['microsoft', 'executive', 'compliance'] }, env);
  }

  isConfigured() {
    const e = this.env;
    return Boolean(e.MICROSOFT_TENANT_ID && e.MICROSOFT_CLIENT_ID && e.MICROSOFT_CLIENT_SECRET);
  }

  async connect() {
    // Live: acquire a Graph client-credentials token; here we report readiness.
    return { connected: true, mode: this.mode(), scopes: ['Directory.Read.All', 'DeviceManagementManagedDevices.Read.All'] };
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    const totalUsers = intBetween(rng, 80, 600);
    const admins = intBetween(rng, 3, 12);
    const licensed = Math.round(totalUsers * (0.7 + rng() * 0.25));
    return {
      totalUsers,
      globalAdmins: admins,
      privilegedRoles: intBetween(rng, admins, admins + 8),
      riskyUsers: intBetween(rng, 0, 15),
      mfaEnforcedPct: intBetween(rng, 70, 100),
      licenses: {
        purchased: licensed + intBetween(rng, 0, 40),
        assigned: licensed,
      },
      devices: {
        total: intBetween(rng, totalUsers, totalUsers * 2),
        compliant: 0, // filled in transform
        nonCompliantPct: intBetween(rng, 2, 25),
      },
      conditionalAccessPolicies: intBetween(rng, 3, 20),
      caGaps: intBetween(rng, 0, 6),
      trend: monthlyTrend(rng, intBetween(rng, 0, 12), 6, 4),
    };
  }

  transformData(raw) {
    const compliant = Math.round(raw.devices.total * (1 - raw.devices.nonCompliantPct / 100));
    const licenseUtil = raw.licenses.purchased
      ? Math.round((raw.licenses.assigned / raw.licenses.purchased) * 100)
      : 0;
    const issues = [];
    if (raw.globalAdmins > 8) issues.push({ severity: 'high', title: `${raw.globalAdmins} global admins (target <= 8)` });
    if (raw.mfaEnforcedPct < 95) issues.push({ severity: 'high', title: `MFA enforced on only ${raw.mfaEnforcedPct}% of users` });
    if (raw.caGaps > 0) issues.push({ severity: 'medium', title: `${raw.caGaps} conditional-access coverage gaps` });
    if (raw.devices.nonCompliantPct > 10) issues.push({ severity: 'medium', title: `${raw.devices.nonCompliantPct}% devices non-compliant` });
    return {
      admins: { globalAdmins: raw.globalAdmins, privilegedRoles: raw.privilegedRoles },
      riskyUsers: raw.riskyUsers,
      mfaEnforcedPct: raw.mfaEnforcedPct,
      licenseUsage: { purchased: raw.licenses.purchased, assigned: raw.licenses.assigned, utilizationPct: licenseUtil },
      deviceCompliance: { total: raw.devices.total, compliant, compliantPct: Math.round((compliant / raw.devices.total) * 100) },
      conditionalAccess: { policies: raw.conditionalAccessPolicies, gaps: raw.caGaps },
      riskyUserTrend: raw.trend,
      issues,
    };
  }
}

module.exports = { MicrosoftConnector };
