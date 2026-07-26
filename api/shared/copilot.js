'use strict';

/**
 * Copilot / Foundry ticket intelligence tools.
 *
 * Each tool tries a live model first (Azure AI Foundry / Azure OpenAI chat
 * completions, configured via FOUNDRY_ENDPOINT + FOUNDRY_API_KEY +
 * FOUNDRY_DEPLOYMENT) and falls back to a deterministic heuristic so the API
 * is fully functional — and testable — without model credentials.
 *
 * Tools:
 *   summarizeTranscript  — call/chat transcript -> summary, sentiment, actions
 *   categorize           — ticket -> category, subcategory, tags
 *   recommendPriority    — ticket -> priority + rationale
 *   rootCause            — ticket + history -> hypothesis, evidence, remediation
 *   draftCustomerUpdate  — ticket -> customer-facing message (requires approval)
 *
 * Consequential outputs (customer-facing drafts, priority escalation) are
 * flagged `requiresApproval: true` so the caller keeps a human in the loop, per
 * the recommended architecture.
 */

const CATEGORY_RULES = [
  { category: 'security', tags: ['ransomware', 'malware', 'phishing', 'breach', 'virus', 'compromised', 'suspicious', 'unauthorized'] },
  { category: 'network', tags: ['vpn', 'wifi', 'network', 'internet', 'connection', 'dns', 'firewall', 'latency'] },
  { category: 'infrastructure', tags: ['server', 'outage', 'down', 'production', 'datacenter', 'backup', 'storage', 'vm', 'hypervisor'] },
  { category: 'email', tags: ['email', 'outlook', 'mailbox', 'spam', 'smtp', 'exchange'] },
  { category: 'access', tags: ['password', 'login', 'mfa', 'locked', 'reset', 'permission', 'access', 'account'] },
  { category: 'hardware', tags: ['printer', 'laptop', 'monitor', 'device', 'keyboard', 'battery', 'screen'] },
  { category: 'software', tags: ['install', 'update', 'license', 'application', 'crash', 'error', 'software'] },
];

const CRITICAL_TERMS = ['ransomware', 'breach', 'outage', 'down', 'production', 'urgent', 'critical', 'phishing', 'compromised', 'data loss'];
const HIGH_TERMS = ['cannot work', 'blocked', 'multiple users', 'vpn down', 'email down', 'not working', 'locked out'];

async function summarizeTranscript(input) {
  const transcript = typeof input === 'string' ? input : input && input.transcript;
  const context = (typeof input === 'object' && input) || {};
  const model = await callModel([
    { role: 'system', content: 'You summarize MSP support call/chat transcripts. Reply as strict JSON with keys: summary (string, <= 3 sentences), sentiment (positive|neutral|negative), actionItems (string[]).' },
    { role: 'user', content: `Transcript:\n${truncate(transcript, 6000)}` },
  ]);
  if (model) {
    const parsed = safeJson(model);
    if (parsed && parsed.summary) return withMeta(parsed, 'model');
  }
  return withMeta(heuristicSummary(transcript, context), 'heuristic');
}

async function categorize(ticket) {
  const text = `${ticket.subject || ''} ${ticket.description || ''} ${(ticket.tags || []).join(' ')}`;
  const model = await callModel([
    { role: 'system', content: 'Categorize an MSP ticket. Reply as strict JSON: { category, subcategory, tags: string[] }. category is one of security, network, email, access, hardware, software, other.' },
    { role: 'user', content: truncate(text, 2000) },
  ]);
  if (model) {
    const parsed = safeJson(model);
    if (parsed && parsed.category) return withMeta(parsed, 'model');
  }
  return withMeta(heuristicCategorize(text), 'heuristic');
}

async function recommendPriority(ticket) {
  const text = `${ticket.subject || ''} ${ticket.description || ''}`.toLowerCase();
  const model = await callModel([
    { role: 'system', content: 'Recommend an MSP ticket priority. Reply as strict JSON: { priority: critical|high|medium|low, rationale, requiresApproval: boolean }. requiresApproval is true when recommending critical.' },
    { role: 'user', content: truncate(text, 2000) },
  ]);
  if (model) {
    const parsed = safeJson(model);
    if (parsed && parsed.priority) return withMeta(parsed, 'model');
  }
  return withMeta(heuristicPriority(text), 'heuristic');
}

async function rootCause(input) {
  const { ticket, history } = normalizeRootCauseInput(input);
  const historyText = (history || []).map((h) => `- ${h.type || 'note'}: ${h.detail || ''}`).join('\n');
  const model = await callModel([
    { role: 'system', content: 'You are a root-cause analyst for an MSP. Reply as strict JSON: { hypothesis, confidence: low|medium|high, evidence: string[], remediation: string[], relatedPattern }.' },
    { role: 'user', content: truncate(`Ticket: ${ticket.subject}\n${ticket.description}\nHistory:\n${historyText}`, 4000) },
  ]);
  if (model) {
    const parsed = safeJson(model);
    if (parsed && parsed.hypothesis) return withMeta(parsed, 'model');
  }
  return withMeta(heuristicRootCause(ticket, history), 'heuristic');
}

async function draftCustomerUpdate(ticket) {
  const model = await callModel([
    { role: 'system', content: 'Draft a concise, professional customer-facing status update for an MSP ticket. Reply as strict JSON: { subject, body }.' },
    { role: 'user', content: truncate(`Ticket ${ticket.ticketId || ''}: ${ticket.subject}\nStatus: ${ticket.status}\nDetails: ${ticket.description}`, 3000) },
  ]);
  let draft;
  if (model) {
    const parsed = safeJson(model);
    draft = parsed && parsed.body ? parsed : null;
  }
  if (!draft) draft = heuristicDraft(ticket);
  // Customer-facing communication is always gated on human approval.
  return withMeta(Object.assign({ requiresApproval: true }, draft), model ? 'model' : 'heuristic');
}

// --- model plumbing --------------------------------------------------------

/**
 * Call the configured Foundry / Azure OpenAI chat completion endpoint.
 * Returns the assistant message string, or null when unconfigured / on error
 * (callers fall back to heuristics — the API never hard-fails on AI outages).
 */
async function callModel(messages, opts = {}) {
  const endpoint = process.env.FOUNDRY_ENDPOINT;
  const apiKey = process.env.FOUNDRY_API_KEY;
  const deployment = process.env.FOUNDRY_DEPLOYMENT;
  if (!endpoint || !apiKey || !deployment) return null;

  const apiVersion = process.env.FOUNDRY_API_VERSION || '2024-06-01';
  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs || 20000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        messages,
        temperature: opts.temperature != null ? opts.temperature : 0.2,
        max_tokens: opts.maxTokens || 500,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// --- heuristics ------------------------------------------------------------

function heuristicSummary(transcript, context) {
  const text = String(transcript || context.description || '').trim();
  if (!text) {
    return { summary: context.subject || 'No transcript provided.', sentiment: 'neutral', actionItems: [] };
  }
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0, 3).join(' ').slice(0, 500);
  const lower = text.toLowerCase();
  let sentiment = 'neutral';
  if (/(angry|frustrat|unacceptable|terrible|furious|worst)/.test(lower)) sentiment = 'negative';
  else if (/(thank|great|appreciate|resolved|happy|perfect)/.test(lower)) sentiment = 'positive';
  const actionItems = [];
  const actionRe = /\b(will|need to|should|must|follow up|call back|escalat|reset|reboot|replace|schedule)\b[^.!?]*/gi;
  let m;
  while ((m = actionRe.exec(text)) && actionItems.length < 5) actionItems.push(m[0].trim().slice(0, 120));
  return { summary: summary || text.slice(0, 300), sentiment, actionItems };
}

function heuristicCategorize(text) {
  const lower = String(text || '').toLowerCase();
  const hits = [];
  let best = { category: 'other', matched: 0 };
  for (const rule of CATEGORY_RULES) {
    const matched = rule.tags.filter((t) => lower.includes(t));
    if (matched.length) {
      hits.push(...matched);
      if (matched.length > best.matched) best = { category: rule.category, matched: matched.length, tag: matched[0] };
    }
  }
  return {
    category: best.category,
    subcategory: best.tag || null,
    tags: Array.from(new Set(hits)).slice(0, 8),
  };
}

function heuristicPriority(text) {
  const lower = String(text || '').toLowerCase();
  if (CRITICAL_TERMS.some((t) => lower.includes(t))) {
    return { priority: 'critical', rationale: 'Matched critical indicators (security/outage/urgency).', requiresApproval: true };
  }
  if (HIGH_TERMS.some((t) => lower.includes(t))) {
    return { priority: 'high', rationale: 'Work-blocking impact detected.', requiresApproval: false };
  }
  if (/(slow|intermittent|sometimes|minor|question|how do i)/.test(lower)) {
    return { priority: 'low', rationale: 'Low-impact or informational request.', requiresApproval: false };
  }
  return { priority: 'medium', rationale: 'Default priority; no strong signals.', requiresApproval: false };
}

function heuristicRootCause(ticket, history) {
  const cat = heuristicCategorize(`${ticket.subject || ''} ${ticket.description || ''}`);
  const repeat = (history || []).filter((h) => (h.type || '').includes('created') || (h.type || '').includes('duplicate')).length;
  const remediationByCategory = {
    network: ['Verify circuit/ISP status', 'Check firewall + VPN concentrator health', 'Confirm DNS resolution'],
    infrastructure: ['Check server/host and hypervisor health', 'Review recent changes and monitoring alerts', 'Validate backups before remediation'],
    email: ['Check mail-flow / connector health', 'Review spam quarantine', 'Validate DNS (MX/SPF/DKIM)'],
    access: ['Confirm account status in IdP', 'Reset credentials and re-enroll MFA', 'Review conditional-access policy'],
    security: ['Isolate affected host', 'Preserve evidence, engage IR runbook', 'Rotate exposed credentials'],
    hardware: ['Reseat/replace peripheral', 'Update device drivers', 'Test on known-good hardware'],
    software: ['Reinstall/repair application', 'Apply latest patch', 'Check license entitlement'],
  };
  return {
    hypothesis: `Likely a ${cat.category} issue${cat.subcategory ? ` related to ${cat.subcategory}` : ''}.`,
    confidence: repeat > 0 ? 'medium' : 'low',
    evidence: [
      `Category signals: ${cat.tags.join(', ') || 'none'}`,
      repeat > 0 ? `${repeat} related/duplicate contact(s) observed` : 'No prior related contacts found',
    ],
    remediation: remediationByCategory[cat.category] || ['Gather more diagnostics from the customer', 'Reproduce the issue'],
    relatedPattern: repeat > 0 ? 'possible-recurring-issue' : null,
  };
}

function heuristicDraft(ticket) {
  const ref = ticket.ticketId || ticket.externalId || '';
  return {
    subject: `Update on your support request ${ref}`.trim(),
    body:
      `Hello,\n\nThank you for contacting Cyproteck support regarding "${ticket.subject || 'your request'}". ` +
      `Our team is actively ${statusPhrase(ticket.status)} and we will keep you updated on our progress. ` +
      `If you have any additional details to share, simply reply to this message.\n\n` +
      `Best regards,\nCyproteck Service Desk`,
  };
}

function statusPhrase(status) {
  switch (String(status || '').toLowerCase()) {
    case 'resolved':
    case 'closed':
      return 'confirming the resolution of your issue';
    case 'in_progress':
      return 'working on your issue';
    default:
      return 'reviewing your request';
  }
}

// --- utils -----------------------------------------------------------------

function normalizeRootCauseInput(input) {
  if (input && input.ticket) return { ticket: input.ticket, history: input.history || [] };
  return { ticket: input || {}, history: [] };
}

function withMeta(obj, source) {
  return Object.assign({ generatedBy: source, generatedAt: new Date().toISOString() }, obj);
}

function truncate(text, max) {
  const s = String(text || '');
  return s.length > max ? s.slice(0, max) : s;
}

function safeJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    const match = String(text).match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

/**
 * Security Copilot — the four-part executive response required by the build
 * brief: { summary, topRisks, nextActions, responsibleOwner }.
 *
 * Given a risk/dashboard context it produces an executive-ready briefing. Uses
 * the live model when configured, else a deterministic composition from the
 * computed risk model. Consequential recommendations remain advisory
 * (requiresApproval) — the Copilot never takes action on its own.
 *
 * @param {object} context { question?, risk, tenantId }
 *   risk: output of shared/risk.computeRisk (score, topRisks, issueCounts, ...)
 */
async function securityCopilot(context = {}) {
  const risk = context.risk || {};
  const model = await callModel([
    {
      role: 'system',
      content:
        'You are the Cyproteck Security Copilot for a healthcare MSP. Reply as strict JSON with EXACTLY these keys: ' +
        'summary (string), topRisks (string[]), nextActions (string[]), responsibleOwner (string). ' +
        'Be concise and executive-ready.',
    },
    {
      role: 'user',
      content: truncate(
        `Question: ${context.question || 'Give me an executive security briefing.'}\n` +
          `Risk context: ${JSON.stringify(risk).slice(0, 3000)}`,
        4000
      ),
    },
  ]);
  if (model) {
    const parsed = safeJson(model);
    if (parsed && parsed.summary && parsed.topRisks && parsed.nextActions) {
      return withMeta(normalizeFourPart(parsed), 'model');
    }
  }
  return withMeta(heuristicFourPart(context), 'heuristic');
}

function normalizeFourPart(p) {
  return {
    summary: String(p.summary || ''),
    topRisks: toArray(p.topRisks),
    nextActions: toArray(p.nextActions),
    responsibleOwner: String(p.responsibleOwner || 'MSP Service Delivery Lead'),
    requiresApproval: true,
  };
}

function heuristicFourPart(context) {
  const risk = context.risk || {};
  const score = risk.score != null ? risk.score : 0;
  const rating = risk.rating || 'unknown';
  const counts = risk.issueCounts || {};
  const top = (risk.topRisks || []).slice(0, 5);
  const OWNER_BY_SEVERITY = { critical: 'MSP Security Lead (immediate escalation)', high: 'MSP Service Delivery Lead', medium: 'Assigned Technician', low: 'Help Desk' };

  const summary =
    `Overall risk is ${score}/100 (${rating}). ` +
    `There ${counts.critical === 1 ? 'is' : 'are'} ${counts.critical || 0} open critical, ` +
    `${counts.high || 0} high, and ${counts.medium || 0} medium issues across identity, endpoint, cloud, network, and EHR domains.`;

  const topRisks = top.length
    ? top.map((r) => `[${r.severity}] ${r.title} (${r.source})`)
    : ['No material risks detected in the latest connector sync.'];

  const nextActions = deriveNextActions(top);
  const worstSeverity = top[0] ? top[0].severity : 'low';

  return {
    summary,
    topRisks,
    nextActions,
    responsibleOwner: OWNER_BY_SEVERITY[worstSeverity] || 'MSP Service Delivery Lead',
    requiresApproval: true,
  };
}

function deriveNextActions(topRisks) {
  if (!topRisks.length) return ['Maintain current controls; continue scheduled connector syncs and reviews.'];
  const actions = [];
  for (const r of topRisks.slice(0, 4)) {
    const t = String(r.title).toLowerCase();
    if (t.includes('mfa')) actions.push('Enforce MFA on all remaining users via conditional access.');
    else if (t.includes('patch')) actions.push('Deploy missing critical patches within the SLA window.');
    else if (t.includes('access review')) actions.push('Complete overdue EHR access reviews and revoke stale access.');
    else if (t.includes('threat') || t.includes('infected')) actions.push('Isolate affected endpoints and run the incident-response runbook.');
    else if (t.includes('storage') || t.includes('encrypt')) actions.push('Remediate exposed/unencrypted cloud resources and enable KMS encryption.');
    else actions.push(`Remediate: ${r.title}.`);
  }
  return Array.from(new Set(actions));
}

function toArray(v) {
  if (Array.isArray(v)) return v.map(String);
  if (v == null) return [];
  return [String(v)];
}

module.exports = {
  summarizeTranscript,
  categorize,
  recommendPriority,
  rootCause,
  draftCustomerUpdate,
  securityCopilot,
  callModel,
  // exported for tests
  heuristicCategorize,
  heuristicPriority,
  heuristicSummary,
  heuristicFourPart,
};
