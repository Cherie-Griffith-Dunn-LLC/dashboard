/**
 * Portfolio model tests — validate the MSSP rollup + drill-down data is
 * internally consistent and deterministic (stable across renders/builds).
 */
import { getPortfolio, getCompany, computeRollup, statusColor } from './portfolio';

describe('portfolio model', () => {
  test('produces a stable set of companies with required fields', () => {
    const p1 = getPortfolio();
    const p2 = getPortfolio();
    expect(p1).toBe(p2); // memoized, stable reference
    expect(p1.length).toBeGreaterThanOrEqual(6);
    for (const c of p1) {
      expect(c.tenantId).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.securityScore).toBeGreaterThan(0);
      expect(c.securityScore).toBeLessThanOrEqual(100);
      expect(c.employees.length).toBeGreaterThan(0);
      expect(c.scoreTrend).toHaveLength(6);
      expect(['excellent', 'good', 'fair', 'at-risk']).toContain(c.status);
      expect(c.compliance.framework).toBeTruthy();
      // employees sorted by risk descending
      const risks = c.employees.map((e) => e.riskScore);
      expect([...risks].sort((a, b) => b - a)).toEqual(risks);
    }
  });

  test('exactly one live tenant (CGD LLC) today', () => {
    const live = getPortfolio().filter((c) => c.live);
    expect(live).toHaveLength(1);
    expect(live[0].name).toBe('CGD LLC');
  });

  test('getCompany resolves by tenantId and returns null for unknown', () => {
    const first = getPortfolio()[0];
    expect(getCompany(first.tenantId).name).toBe(first.name);
    expect(getCompany('nope')).toBeNull();
  });

  test('rollup aggregates match the underlying companies', () => {
    const companies = getPortfolio();
    const r = computeRollup(companies);
    expect(r.companies).toBe(companies.length);
    expect(r.employeesProtected).toBe(companies.reduce((a, c) => a + c.headcount, 0));
    expect(r.threatsBlocked).toBe(companies.reduce((a, c) => a + c.threatsBlocked, 0));
    expect(r.liveCompanies).toBe(1);
    // weighted average score lands within the min/max of member scores
    const scores = companies.map((c) => c.securityScore);
    expect(r.avgSecurityScore).toBeGreaterThanOrEqual(Math.min(...scores));
    expect(r.avgSecurityScore).toBeLessThanOrEqual(Math.max(...scores));
  });

  test('statusColor returns a color for every status', () => {
    for (const s of ['excellent', 'good', 'fair', 'at-risk']) {
      expect(statusColor(s)).toMatch(/^#/);
    }
  });
});
