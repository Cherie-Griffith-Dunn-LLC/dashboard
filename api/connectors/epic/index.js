'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween, monthlyTrend, pick } = require('../../shared/framework/sim');

const DEPARTMENTS = ['Emergency', 'Cardiology', 'Radiology', 'Oncology', 'Pediatrics', 'Surgery', 'Pharmacy', 'Lab', 'Billing', 'HIM'];

/**
 * Epic (EHR) connector.
 *
 * Feeds the healthcare access dashboard: "Epic users, departments, high-risk
 * access, inactive accounts, devices, access reviews, and audit indicators."
 *
 * Live integration to Epic requires an approved App Orchard / Vendor Services
 * engagement and organizational sign-off — see EPIC_APPROVAL_GUIDE.md. Live
 * config: EPIC_BASE_URL / EPIC_CLIENT_ID / EPIC_PRIVATE_KEY (JWT client-creds).
 * No PHI is fetched — only access-governance and audit *indicators*.
 */
class EpicConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'epic', category: 'ehr', domains: ['epic', 'compliance', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.EPIC_BASE_URL && this.env.EPIC_CLIENT_ID && this.env.EPIC_PRIVATE_KEY);
  }

  async connect() {
    return { connected: true, mode: this.mode(), note: 'Access-governance indicators only; no PHI retrieved.' };
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    const users = intBetween(rng, 200, 3000);
    const deptCount = intBetween(rng, 5, DEPARTMENTS.length);
    const departments = DEPARTMENTS.slice(0, deptCount).map((name) => ({
      name,
      users: intBetween(rng, 10, Math.round(users / deptCount) + 20),
      highRiskAccess: intBetween(rng, 0, 8),
    }));
    return {
      totalUsers: users,
      departments,
      breakGlassAccounts: intBetween(rng, 0, 10),
      inactiveOver90d: intBetween(rng, 0, Math.round(users * 0.15)),
      sharedWorkstations: intBetween(rng, 20, 200),
      unmanagedDevices: intBetween(rng, 0, 40),
      accessReviews: { due: intBetween(rng, 0, 6), overdue: intBetween(rng, 0, 4) },
      afterHoursAccessEvents: intBetween(rng, 0, 30),
      recordAccessTrend: monthlyTrend(rng, intBetween(rng, 100, 400), 6, 60),
    };
  }

  transformData(raw) {
    const highRiskAccess = raw.departments.reduce((s, d) => s + d.highRiskAccess, 0);
    const issues = [];
    if (raw.accessReviews.overdue > 0) issues.push({ severity: 'high', title: `${raw.accessReviews.overdue} overdue access reviews` });
    if (raw.breakGlassAccounts > 5) issues.push({ severity: 'high', title: `${raw.breakGlassAccounts} break-glass accounts active` });
    if (raw.inactiveOver90d > raw.totalUsers * 0.1) issues.push({ severity: 'medium', title: `${raw.inactiveOver90d} inactive accounts (>90d) retain access` });
    if (raw.unmanagedDevices > 0) issues.push({ severity: 'medium', title: `${raw.unmanagedDevices} unmanaged devices touch the EHR` });
    return {
      users: { total: raw.totalUsers, inactiveOver90d: raw.inactiveOver90d, breakGlassAccounts: raw.breakGlassAccounts },
      departments: raw.departments,
      highRiskAccess,
      devices: { sharedWorkstations: raw.sharedWorkstations, unmanaged: raw.unmanagedDevices },
      accessReviews: raw.accessReviews,
      auditIndicators: { afterHoursAccessEvents: raw.afterHoursAccessEvents, recordAccessTrend: raw.recordAccessTrend },
      issues,
    };
  }
}

module.exports = { EpicConnector };
