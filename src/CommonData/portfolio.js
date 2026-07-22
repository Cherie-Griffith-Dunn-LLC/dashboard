/**
 * Multi-tenant portfolio model for the CyproTeck MSSP console.
 *
 * This is the "god-view" dataset: every managed client company, each with its
 * own employees, security posture, alerts, tickets, compliance and trend data.
 * The MSSP (CyproTeck) rolls all of these up; drilling into a company exposes
 * that single tenant's full picture.
 *
 * Today this is a rich, deterministic simulation so the full experience is
 * visible end-to-end. Each company carries a `tenantId` and `live` flag; when a
 * client's real connectors are wired, swap that company's block for live data
 * fetched through `dashboardService` — the UI is agnostic to the source.
 */

// Deterministic pseudo-random so the portfolio is stable across renders/builds.
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const FIRST = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Ashley', 'Robert', 'Maria', 'Daniel', 'Lauren', 'Kevin', 'Nicole', 'Brandon', 'Rachel', 'Marcus', 'Priya', 'Andre', 'Chloe', 'Devon'];
const LAST = ['Johnson', 'Chen', 'Rodriguez', 'Kim', 'Williams', 'Patel', 'Brooks', 'Nguyen', 'Silva', 'Adams', 'Foster', 'Reed', 'Morgan', 'Bailey', 'Cole', 'Hughes', 'Ramos', 'Ellis', 'Ward', 'Diaz'];
const DEVICES = ['Windows Laptop', 'MacBook Pro', 'MacBook Air', 'Windows Desktop', 'iPad Pro', 'Surface Pro'];
const ISSUE_POOL = [
  'Failed MFA login attempts (3)',
  'Weak password detected',
  'Missing critical security update',
  'Phishing email clicked',
  'Outdated browser version',
  'Training incomplete: Phishing Awareness',
  'Unmanaged device flagged',
  'Suspicious sign-in from new location',
  'Local admin rights not justified',
  'Shared mailbox over-permissioned',
];

function makeEmployees(rand, count, depts) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    const riskScore = Math.floor(rand() * 95) + 5;
    const status = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
    const issueCount = status === 'high' ? 2 + Math.floor(rand() * 2) : status === 'medium' ? 1 + Math.floor(rand() * 2) : Math.floor(rand() * 2);
    const issues = [];
    for (let j = 0; j < issueCount; j++) {
      const pick = ISSUE_POOL[Math.floor(rand() * ISSUE_POOL.length)];
      if (!issues.includes(pick)) issues.push(pick);
    }
    out.push({
      id: i + 1,
      name,
      department: depts[Math.floor(rand() * depts.length)],
      riskScore,
      status,
      threats: status === 'high' ? 3 + Math.floor(rand() * 5) : status === 'medium' ? 1 + Math.floor(rand() * 2) : 0,
      issues,
      device: DEVICES[Math.floor(rand() * DEVICES.length)],
      mfa: rand() > 0.15,
      lastActive: ['2 min ago', '18 min ago', '1 hour ago', '3 hours ago', 'Yesterday'][Math.floor(rand() * 5)],
    });
  }
  return out.sort((a, b) => b.riskScore - a.riskScore);
}

function trend(rand, end) {
  // 6-month trend ending near the company's current score.
  const pts = [];
  let v = end - 8 - Math.floor(rand() * 10);
  for (let i = 0; i < 6; i++) {
    v += Math.floor(rand() * 6) - 1;
    pts.push(Math.max(35, Math.min(99, v)));
  }
  pts[5] = end;
  return pts;
}

const COMPANY_SEEDS = [
  { tenantId: '0d9acab6-2b9d-4883-8617-f3fdea4b02d6', name: 'CGD LLC', domain: 'cgdgovsolutions.com', industry: 'Government Solutions', logo: '🏛️', headcount: 20, score: 88, live: true, framework: 'CMMC', depts: ['Operations', 'Contracts', 'Finance', 'IT', 'Program Mgmt'] },
  { tenantId: 'demo-acme-healthcare', name: 'Acme Healthcare', domain: 'acmehealthcare.com', industry: 'Healthcare', logo: '🏥', headcount: 250, score: 74, live: false, framework: 'HIPAA', depts: ['Clinical', 'Billing', 'IT', 'HR', 'Records', 'Pharmacy'] },
  { tenantId: 'demo-tech-solutions', name: 'Tech Solutions Inc', domain: 'techsolutions.com', industry: 'Technology', logo: '💻', headcount: 180, score: 91, live: false, framework: 'SOC 2', depts: ['Engineering', 'Product', 'Sales', 'Support', 'Finance'] },
  { tenantId: 'demo-finance-group', name: 'Finance Group LLC', domain: 'financegroup.com', industry: 'Financial Services', logo: '🏦', headcount: 95, score: 82, live: false, framework: 'PCI DSS', depts: ['Advisory', 'Compliance', 'Operations', 'IT', 'Client Services'] },
  { tenantId: 'demo-metro-legal', name: 'Metro Legal Partners', domain: 'metrolegal.com', industry: 'Legal', logo: '⚖️', headcount: 60, score: 69, live: false, framework: 'ISO 27001', depts: ['Litigation', 'Corporate', 'Paralegal', 'IT', 'Admin'] },
  { tenantId: 'demo-summit-mfg', name: 'Summit Manufacturing', domain: 'summitmfg.com', industry: 'Manufacturing', logo: '🏭', headcount: 320, score: 63, live: false, framework: 'NIST 800-171', depts: ['Plant Floor', 'Engineering', 'Supply Chain', 'IT/OT', 'HR', 'Quality'] },
  { tenantId: 'demo-brightpath-edu', name: 'BrightPath Education', domain: 'brightpath.edu', industry: 'Education', logo: '🎓', headcount: 140, score: 78, live: false, framework: 'FERPA', depts: ['Faculty', 'Admissions', 'IT', 'Student Services', 'Finance'] },
];

function buildCompany(seed) {
  const rand = seeded(seed.name.split('').reduce((a, c) => a + c.charCodeAt(0), 7));
  const employees = makeEmployees(rand, Math.min(seed.headcount, 8 + Math.floor(rand() * 4)), seed.depts);
  const critical = employees.filter((e) => e.status === 'high').length;
  const alerts = {
    critical,
    high: critical + Math.floor(rand() * 4),
    medium: 6 + Math.floor(rand() * 18),
    low: 12 + Math.floor(rand() * 40),
  };
  const openTickets = 2 + Math.floor(rand() * 12);
  return {
    ...seed,
    headcount: seed.headcount,
    monitoredEmployees: employees.length,
    securityScore: seed.score,
    scoreTrend: trend(rand, seed.score),
    threatsBlocked: 200 + Math.floor(rand() * 2400),
    alerts,
    openTickets,
    compliance: { framework: seed.framework, score: Math.max(55, seed.score - 4 + Math.floor(rand() * 12)) },
    trainingCompletion: 45 + Math.floor(rand() * 50),
    mfaCoverage: Math.round((employees.filter((e) => e.mfa).length / employees.length) * 100),
    endpointCompliance: 60 + Math.floor(rand() * 38),
    status: seed.score >= 85 ? 'excellent' : seed.score >= 72 ? 'good' : seed.score >= 65 ? 'fair' : 'at-risk',
    employees,
    recentAlerts: buildAlerts(rand, seed.name),
  };
}

function buildAlerts(rand, company) {
  const templates = [
    { sev: 'high', icon: '🔴', title: 'Ransomware attempt blocked', detail: `Endpoint protection isolated a ransomware payload before execution` },
    { sev: 'high', icon: '🔴', title: 'Impossible travel sign-in', detail: `Sign-in from two countries within 20 minutes — session revoked` },
    { sev: 'medium', icon: '🟠', title: 'Phishing campaign quarantined', detail: `Suspicious emails delivered to multiple mailboxes — all quarantined` },
    { sev: 'medium', icon: '🟠', title: 'Unpatched critical CVE', detail: `A critical vulnerability was detected on managed endpoints` },
    { sev: 'low', icon: '🟡', title: 'New device enrolled', detail: `A device was enrolled and is pending compliance evaluation` },
    { sev: 'low', icon: '🟡', title: 'MFA challenge failures', detail: `Repeated MFA failures flagged for review` },
  ];
  const times = ['32 min ago', '2 hours ago', '5 hours ago', 'Yesterday', '2 days ago'];
  const n = 3 + Math.floor(rand() * 2);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = templates[Math.floor(rand() * templates.length)];
    out.push({ ...t, time: times[Math.floor(rand() * times.length)], company });
  }
  return out;
}

let _portfolio = null;
export function getPortfolio() {
  if (!_portfolio) _portfolio = COMPANY_SEEDS.map(buildCompany);
  return _portfolio;
}

export function getCompany(tenantId) {
  return getPortfolio().find((c) => c.tenantId === tenantId) || null;
}

/** Aggregate every company into the MSSP rollup KPIs. */
export function computeRollup(companies = getPortfolio()) {
  const sum = (fn) => companies.reduce((a, c) => a + fn(c), 0);
  const employeesProtected = sum((c) => c.headcount);
  const weightedScore = Math.round(
    companies.reduce((a, c) => a + c.securityScore * c.headcount, 0) / (employeesProtected || 1)
  );
  return {
    companies: companies.length,
    liveCompanies: companies.filter((c) => c.live).length,
    employeesProtected,
    avgSecurityScore: weightedScore,
    threatsBlocked: sum((c) => c.threatsBlocked),
    criticalAlerts: sum((c) => c.alerts.critical),
    highAlerts: sum((c) => c.alerts.high),
    openTickets: sum((c) => c.openTickets),
    atRisk: companies.filter((c) => c.status === 'at-risk' || c.status === 'fair').length,
    avgTraining: Math.round(sum((c) => c.trainingCompletion) / (companies.length || 1)),
    avgCompliance: Math.round(sum((c) => c.compliance.score) / (companies.length || 1)),
  };
}

export function statusColor(status) {
  // Muted, enterprise-SOC semantic palette (SentinelOne-like).
  return { excellent: '#3fc98a', good: '#4f8ff7', fair: '#e0a72e', 'at-risk': '#f0616a' }[status] || '#8b93a4';
}
