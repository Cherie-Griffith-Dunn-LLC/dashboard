/**
 * Security feed model — threats, alerts, and behavior-triggered training.
 *
 * Source of truth: SentinelOne (via N-able) as the primary EDR feed, with
 * Microsoft Defender + Microsoft Sentinel as the foundation. Everything here is
 * deterministic simulation until those connectors are credentialed (same safe
 * pattern as the rest of the app) — each row is tagged with its `source` so the
 * UI can show where it came from and swap to live data with no UI change.
 */

function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
const rand = seeded(20260805);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

export const SOURCES = { S1: 'SentinelOne', DEF: 'Microsoft Defender', SENT: 'Microsoft Sentinel' };

// ----------------------------- Threats -----------------------------
const THREAT_DEFS = [
  { type: 'Ransomware', sev: 'critical', desc: 'Encryption behavior detected and killed pre-execution', source: SOURCES.S1 },
  { type: 'Credential Theft', sev: 'critical', desc: 'LSASS memory access blocked on endpoint', source: SOURCES.DEF },
  { type: 'Malware', sev: 'high', desc: 'Trojan dropper quarantined from downloads folder', source: SOURCES.S1 },
  { type: 'Phishing', sev: 'high', desc: 'Credential-harvesting page reported by user', source: SOURCES.DEF },
  { type: 'Lateral Movement', sev: 'high', desc: 'Suspicious SMB activity between hosts', source: SOURCES.SENT },
  { type: 'Suspicious Sign-in', sev: 'medium', desc: 'Impossible-travel login, session revoked', source: SOURCES.SENT },
  { type: 'Exploit Attempt', sev: 'medium', desc: 'Exploit blocked against unpatched service', source: SOURCES.S1 },
  { type: 'PUA', sev: 'low', desc: 'Potentially unwanted application flagged', source: SOURCES.DEF },
];
const HOSTS = ['FIN-WKS-04', 'ENG-LAP-11', 'HR-WKS-02', 'OPS-SRV-01', 'SALES-LAP-07', 'CLIN-WKS-09', 'IT-ADMIN-01'];
const USERS = ['s.johnson', 'm.chen', 'e.rodriguez', 'd.kim', 'j.adams', 'r.brooks', 'p.patel'];
const AGES = ['3 min ago', '22 min ago', '1 hr ago', '3 hrs ago', '5 hrs ago', 'Yesterday'];

let _threats = null;
export function getThreats() {
  if (_threats) return _threats;
  _threats = Array.from({ length: 8 }, (_, i) => {
    const d = THREAT_DEFS[i % THREAT_DEFS.length];
    return {
      id: `T-${4200 + i}`,
      type: d.type,
      severity: d.sev,
      description: d.desc,
      host: pick(HOSTS),
      user: pick(USERS),
      source: d.source,
      status: rand() > 0.35 ? 'contained' : 'investigating',
      time: AGES[Math.min(i, AGES.length - 1)],
    };
  });
  return _threats;
}

// ----------------------------- Alerts -----------------------------
const ALERT_DEFS = [
  { title: 'Multiple failed MFA attempts', sev: 'high', source: SOURCES.SENT },
  { title: 'New device enrolled — pending compliance', sev: 'low', source: SOURCES.DEF },
  { title: 'Unusual outbound data volume', sev: 'medium', source: SOURCES.S1 },
  { title: 'Disabled endpoint protection detected', sev: 'high', source: SOURCES.S1 },
  { title: 'Conditional Access policy bypass attempt', sev: 'medium', source: SOURCES.SENT },
  { title: 'Shared mailbox over-permissioned', sev: 'low', source: SOURCES.DEF },
];
let _alerts = null;
export function getAlerts() {
  if (_alerts) return _alerts;
  _alerts = ALERT_DEFS.map((a, i) => ({
    id: `A-${900 + i}`,
    title: a.title,
    severity: a.sev,
    source: a.source,
    host: pick(HOSTS),
    status: rand() > 0.5 ? 'open' : 'acknowledged',
    time: AGES[Math.min(i, AGES.length - 1)],
  }));
  return _alerts;
}

// ------------------- Behavior-triggered training -------------------
// Peak "hack windows" — when idle machines are highest risk.
export const PEAK_WINDOWS = [
  { label: 'Morning break', start: '9:30 AM', end: '11:00 AM' },
  { label: 'Lunch', start: '11:00 AM', end: '1:00 PM' },
  { label: 'Afternoon break', start: '2:30 PM', end: '4:00 PM' },
];

export const COURSES = {
  'password-mfa': {
    title: 'Passwords & MFA', category: 'Access Security', duration: '18 min', level: 'Required',
    why: 'Reused or weak passwords are the #1 way attackers get in, and forgotten passwords often lead to risky resets.',
    impact: 'A single reused password can expose company email, files, and client data in minutes.',
    fix: 'Use a password manager, create long passphrases, and turn on multi-factor authentication everywhere.',
    lessons: ['Why passwords get cracked', 'Building a strong passphrase', 'Using a password manager', 'Setting up MFA', 'Knowledge check'],
  },
  'public-wifi': {
    title: 'Public Wi-Fi & Remote Access', category: 'Network Security', duration: '15 min', level: 'Required',
    why: 'Public Wi-Fi lets attackers on the same network intercept your traffic or impersonate the hotspot.',
    impact: 'Credentials and company data can be captured silently, with no sign anything happened.',
    fix: 'Always use the company VPN on untrusted networks, and avoid sensitive work on open Wi-Fi.',
    lessons: ['How open Wi-Fi is attacked', 'Spotting fake hotspots', 'Turning on the VPN', 'Knowledge check'],
  },
  'removable-media': {
    title: 'USB & Removable Media', category: 'Endpoint Security', duration: '12 min', level: 'Required',
    why: 'Unknown USB drives can auto-run malware or exfiltrate data the moment they are plugged in.',
    impact: 'One infected drive can drop ransomware onto the whole network.',
    fix: 'Never plug in unknown drives; use only IT-approved, encrypted devices for company data.',
    lessons: ['The "found USB" trap', 'How USB malware spreads', 'Approved devices only', 'Knowledge check'],
  },
  'data-handling': {
    title: 'Screenshots & Data Handling', category: 'Data Protection', duration: '14 min', level: 'Required',
    why: 'Screenshots and copied data often bypass security controls and end up in unmanaged places.',
    impact: 'Screenshotting client or PHI data can cause a reportable breach and compliance penalties.',
    fix: 'Keep sensitive data inside approved apps; avoid screenshots of protected information.',
    lessons: ['Where data leaks', 'Screenshots & PHI/PII', 'Safe sharing', 'Knowledge check'],
  },
  'session-lock': {
    title: 'Lock Your Screen', category: 'Physical Security', duration: '10 min', level: 'Required',
    why: 'An unlocked, unattended computer is an open door — especially during predictable break times when offices empty out.',
    impact: 'Anyone walking by can access email, files, and systems using your identity.',
    fix: 'Lock your screen every time you step away (Win+L / Ctrl+Cmd+Q). Set auto-lock to a few minutes.',
    lessons: ['Why unattended = unlocked door', 'Peak-risk break windows', 'One-key screen lock', 'Auto-lock settings', 'Knowledge check'],
  },
  'phishing': {
    title: 'Phishing Awareness', category: 'Email Security', duration: '25 min', level: 'Required',
    why: 'Phishing is the most common entry point for breaches and ransomware.',
    impact: 'One click can hand attackers credentials or drop malware company-wide.',
    fix: 'Slow down, verify senders, and report suspicious emails instead of clicking.',
    lessons: ['Anatomy of a phish', 'Spotting red flags', 'Business email compromise', 'Reporting safely', 'Knowledge check'],
  },
};

// The behavior → course rules. This is the auto-assignment engine.
export const TRIGGERS = [
  { id: 'password_reset', behavior: 'Forgets or resets their password', courseId: 'password-mfa', severity: 'medium', condition: 'On password reset' },
  { id: 'public_wifi', behavior: 'Connects to public / untrusted Wi-Fi', courseId: 'public-wifi', severity: 'high', condition: 'On untrusted network join' },
  { id: 'usb_insert', behavior: 'Plugs in a USB / removable drive', courseId: 'removable-media', severity: 'high', condition: 'On USB insert' },
  { id: 'print_screen', behavior: 'Uses Print Screen / takes screenshots', courseId: 'data-handling', severity: 'medium', condition: 'On screen capture of protected data' },
  { id: 'idle_40', behavior: 'Leaves computer idle & unlocked', courseId: 'session-lock', severity: 'medium', condition: 'Idle > 40 min (any time)' },
  { id: 'idle_13_peak', behavior: 'Leaves computer idle during peak hack windows', courseId: 'session-lock', severity: 'high', condition: 'Idle > 13 min during 9:30–11, 11–1, 2:30–4' },
];

export function courseFor(triggerId) {
  const t = TRIGGERS.find((x) => x.id === triggerId);
  return t ? { id: t.courseId, ...COURSES[t.courseId] } : null;
}

// Simulated live auto-assignments (what the engine has already assigned).
let _assignments = null;
export function getAssignments() {
  if (_assignments) return _assignments;
  const names = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'James Adams', 'Rachel Brooks', 'Priya Patel'];
  const statuses = ['assigned', 'in-progress', 'completed'];
  _assignments = names.slice(0, 6).map((name, i) => {
    const trig = TRIGGERS[i % TRIGGERS.length];
    return {
      id: `AS-${100 + i}`,
      employee: name,
      triggerId: trig.id,
      behavior: trig.behavior,
      course: COURSES[trig.courseId].title,
      courseId: trig.courseId,
      severity: trig.severity,
      status: statuses[i % statuses.length],
      when: AGES[Math.min(i, AGES.length - 1)],
    };
  });
  return _assignments;
}

export function severityColor(sev) {
  return { critical: '#f0616a', high: '#f0616a', medium: '#e0a72e', low: '#4f8ff7' }[sev] || '#8b93a4';
}

// A short knowledge check per course (so a course can actually be completed).
const CHECKS = {
  'password-mfa': { q: 'What is the best way to protect your accounts?', options: ['Reuse one strong password everywhere', 'Use a password manager + MFA', 'Write passwords on a sticky note'], answer: 1 },
  'public-wifi': { q: 'You need to work from a coffee shop. What should you do?', options: ['Connect to open Wi-Fi and log in normally', 'Turn on the company VPN first', 'Use any network named "Free Wi-Fi"'], answer: 1 },
  'removable-media': { q: 'You find a USB drive in the parking lot. What do you do?', options: ['Plug it in to see who it belongs to', 'Hand it to IT — never plug it in', 'Use it for extra storage'], answer: 1 },
  'data-handling': { q: 'How should you share protected client data?', options: ['Screenshot it and text it', 'Keep it inside approved apps only', 'Email it to your personal account'], answer: 1 },
  'session-lock': { q: 'You step away for a coffee break. What should you do?', options: ['Leave it — you\'ll be right back', 'Lock the screen (Win+L)', 'Just turn off the monitor'], answer: 1 },
  'phishing': { q: 'An urgent email asks you to click a link and log in. You should:', options: ['Click quickly before the deadline', 'Slow down, verify the sender, report if unsure', 'Forward it to the whole team'], answer: 1 },
};

/** Build the lesson slides for the in-app course player. */
export function courseSlides(courseId) {
  const c = COURSES[courseId];
  if (!c) return [];
  return [
    { kind: 'read', title: 'Why it matters', body: c.why },
    { kind: 'read', title: 'The risk to the company', body: c.impact },
    { kind: 'read', title: 'How to fix the behavior', body: c.fix },
    { kind: 'check', title: 'Quick check', check: CHECKS[courseId] || { q: 'Ready to apply what you learned?', options: ['Yes'], answer: 0 } },
  ];
}
