'use strict';

/**
 * Dependency-free self-test for the connector suite.
 *
 * Runs the whole intake pipeline in simulation mode (no AWS, no PSA, no
 * Foundry credentials) so it can be executed anywhere with `node test/run.js`
 * or `npm test` from the api/ directory. Exits non-zero on the first failure.
 */

// Deterministic, credential-free environment.
process.env.PSA_CONNECTOR = 'helpdesk';
process.env.AUDIT_SILENT = 'true';
delete process.env.FOUNDRY_ENDPOINT;
delete process.env.AMAZON_CONNECT_WEBHOOK_SECRET;

const assert = require('assert');
const { MemoryStore, _setStoreForTest } = require('../shared/store');
const tickets = require('../shared/tickets');
const dedupe = require('../shared/dedupe');
const sla = require('../shared/sla');
const copilot = require('../shared/copilot');
const { normalizeEvent, isTerminalContactEvent } = require('../shared/connectors/amazonConnect');
const { listConnectors } = require('../shared/psa');

let passed = 0;
const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

// --- normalization ---------------------------------------------------------

test('normalizeEvent: EventBridge contact event', () => {
  const evt = {
    id: 'evt-1',
    'detail-type': 'Amazon Connect Contact Event',
    time: '2026-07-10T10:00:00Z',
    detail: {
      contactId: 'C-100',
      channel: 'VOICE',
      eventType: 'DISCONNECTED',
      queueInfo: { queueName: 'Support' },
      attributes: { customerId: 'ACME', customerName: 'Acme Co', subject: 'VPN down', priority: 'high' },
    },
  };
  const n = normalizeEvent(evt);
  assert.strictEqual(n.contactId, 'C-100');
  assert.strictEqual(n.channel, 'phone');
  assert.strictEqual(n.customerId, 'ACME');
  assert.strictEqual(n.terminal, true);
  assert.strictEqual(n.queue, 'Support');
});

test('normalizeEvent: simplified payload', () => {
  const n = normalizeEvent({ contactId: 'C-200', channel: 'chat', subject: 'Email issue', description: 'Cannot send email' });
  assert.strictEqual(n.contactId, 'C-200');
  assert.strictEqual(n.channel, 'chat');
});

test('isTerminalContactEvent', () => {
  assert.strictEqual(isTerminalContactEvent('DISCONNECTED'), true);
  assert.strictEqual(isTerminalContactEvent('CONNECTED_TO_AGENT'), false);
});

// --- dedupe ----------------------------------------------------------------

test('dedupe: jaccard + findDuplicate', () => {
  assert.ok(dedupe.jaccard(['vpn', 'down'], ['vpn', 'down']) === 1);
  const open = [{ ticketId: 'T1', subject: 'VPN not connecting', description: 'user vpn down', customerId: 'ACME', createdAt: new Date().toISOString() }];
  const m = dedupe.findDuplicate({ subject: 'VPN down', description: 'cannot connect vpn', customerId: 'ACME' }, open, { threshold: 0.2 });
  assert.ok(m && m.ticket.ticketId === 'T1', 'should find fuzzy duplicate');
});

test('dedupe: different customer is not a duplicate', () => {
  const open = [{ ticketId: 'T1', subject: 'VPN down', customerId: 'ACME', createdAt: new Date().toISOString() }];
  const m = dedupe.findDuplicate({ subject: 'VPN down', customerId: 'OTHER' }, open, { threshold: 0.2 });
  assert.strictEqual(m, null);
});

// --- SLA -------------------------------------------------------------------

test('sla: init + breach detection', () => {
  const created = '2026-07-10T00:00:00Z';
  const s = sla.initSla('critical', created);
  assert.strictEqual(s.priority, 'critical');
  // 20 min later, no response -> response breached (policy 15 min).
  const evaluated = sla.evaluateSla(s, { now: '2026-07-10T00:20:00Z' });
  assert.strictEqual(evaluated.responseBreached, true);
});

test('sla: resolving before deadline is not breached', () => {
  const created = '2026-07-10T00:00:00Z';
  const s = sla.initSla('low', created);
  const evaluated = sla.evaluateSla(s, { firstResponseAt: '2026-07-10T00:05:00Z', resolvedAt: '2026-07-10T01:00:00Z', now: '2026-07-10T01:00:00Z' });
  assert.strictEqual(evaluated.resolutionBreached, false);
  assert.strictEqual(evaluated.responseBreached, false);
});

// --- copilot heuristics ----------------------------------------------------

test('copilot: heuristic categorize + priority', async () => {
  const cat = await copilot.categorize({ subject: 'Suspected ransomware on server', description: 'files encrypted' });
  assert.strictEqual(cat.category, 'security');
  const pri = await copilot.recommendPriority({ subject: 'ransomware outage', description: 'production down' });
  assert.strictEqual(pri.priority, 'critical');
  assert.strictEqual(pri.requiresApproval, true);
});

test('copilot: draft update always requires approval', async () => {
  const draft = await copilot.draftCustomerUpdate({ ticketId: 'TKT-1', subject: 'VPN', status: 'in_progress' });
  assert.strictEqual(draft.requiresApproval, true);
  assert.ok(draft.body.length > 0);
});

// --- end-to-end service ----------------------------------------------------

test('service: create ticket from Amazon Connect intake', async () => {
  _setStoreForTest(new MemoryStore());
  const intake = normalizeEvent({ contactId: 'C-1', channel: 'phone', customerId: 'ACME', customerName: 'Acme', subject: 'Printer not working', description: 'office printer offline' });
  const out = await tickets.createTicket(intake, { source: 'amazon-connect' });
  assert.strictEqual(out.deduplicated, false);
  assert.ok(out.ticket.ticketId.startsWith('TKT-'));
  assert.ok(out.ticket.externalId, 'has PSA external id');
  assert.strictEqual(out.ticket.category, 'hardware');
  // Contact mapping established.
  const mapped = await tickets.getTicketIdForContact('C-1');
  assert.strictEqual(mapped, out.ticket.ticketId);
});

test('service: same ContactId does not open a second ticket', async () => {
  _setStoreForTest(new MemoryStore());
  const intake = normalizeEvent({ contactId: 'C-9', channel: 'phone', customerId: 'ACME', subject: 'VPN down', description: 'cannot connect vpn' });
  const first = await tickets.createTicket(intake, { source: 'amazon-connect' });
  const second = await tickets.createTicket(intake, { source: 'amazon-connect' });
  assert.strictEqual(second.deduplicated, true);
  assert.strictEqual(second.reason, 'contact-mapping');
  assert.strictEqual(second.ticket.ticketId, first.ticket.ticketId);
});

test('service: cross-channel fuzzy duplicate is suppressed', async () => {
  _setStoreForTest(new MemoryStore());
  const call = normalizeEvent({ contactId: 'C-A', channel: 'phone', customerId: 'ACME', subject: 'Email server down', description: 'outlook cannot send or receive email' });
  const first = await tickets.createTicket(call, { source: 'amazon-connect' });
  const email = normalizeEvent({ contactId: 'C-B', channel: 'email', customerId: 'ACME', subject: 'Email down', description: 'email not sending receive outlook server' });
  const second = await tickets.createTicket(email, { source: 'amazon-connect' });
  assert.strictEqual(second.deduplicated, true);
  assert.strictEqual(second.reason, 'fuzzy-match');
  assert.strictEqual(second.ticket.ticketId, first.ticket.ticketId);
  // The second contact is now linked to the same ticket.
  const mapped = await tickets.getTicketIdForContact('C-B');
  assert.strictEqual(mapped, first.ticket.ticketId);
});

test('service: update transitions SLA and status', async () => {
  _setStoreForTest(new MemoryStore());
  const intake = normalizeEvent({ contactId: 'C-U', channel: 'phone', customerId: 'ACME', subject: 'Laptop broken', description: 'screen cracked', priority: 'low' });
  const created = await tickets.createTicket(intake, { source: 'amazon-connect' });
  const updated = await tickets.updateTicket(created.ticket.ticketId, { status: 'in_progress', note: 'Agent investigating' }, { actor: 'tech@cyproteck.com' });
  assert.strictEqual(updated.status, 'in_progress');
  assert.ok(updated.sla.firstResponseAt, 'first response recorded');
  const full = await tickets.getTicket(created.ticket.ticketId);
  assert.ok(full.activities.some((a) => a.type === 'status.changed'));
  assert.ok(full.activities.some((a) => a.type === 'created'));
});

test('service: transcript is summarized on creation', async () => {
  _setStoreForTest(new MemoryStore());
  const intake = normalizeEvent({
    contactId: 'C-T',
    channel: 'phone',
    customerId: 'ACME',
    subject: 'Cannot access account',
    description: 'login issue',
    transcript: 'Customer said they are locked out. Agent will reset the password and re-enroll MFA. Customer was frustrated but calm by the end.',
  });
  const out = await tickets.createTicket(intake, { source: 'amazon-connect' });
  assert.ok(out.ticket.summary, 'summary attached');
  assert.ok(out.ticket.summary.summary.length > 0);
  assert.ok(Array.isArray(out.ticket.summary.actionItems));
});

// --- registry --------------------------------------------------------------

test('psa: registry lists all connectors with helpdesk active by default', () => {
  const list = listConnectors();
  const names = list.map((c) => c.name).sort();
  assert.deepStrictEqual(names, ['connectwise', 'halo', 'helpdesk', 'mspmanager', 'ninjaone']);
  assert.ok(list.find((c) => c.name === 'helpdesk').active);
});

// --- N-able MSP Manager connector -----------------------------------------

test('mspmanager: simulates when unconfigured and marks tickets simulated', async () => {
  const { MspManagerConnector } = require('../shared/psa/mspmanager');
  const c = new MspManagerConnector({}); // no env → simulation
  assert.strictEqual(c.isConfigured(), false);
  const res = await c.createTicket({ subject: 'Locked out', priority: 'medium' });
  assert.strictEqual(res.simulated, true);
  assert.ok(res.externalId, 'still returns an id in simulation');
  const probe = await c.testConnection();
  assert.strictEqual(probe.ok, false);
  assert.strictEqual(probe.configured, false);
});

test('mspmanager: reports configured + builds auth headers per scheme', () => {
  const { MspManagerConnector } = require('../shared/psa/mspmanager');
  const bearer = new MspManagerConnector({ MSPMANAGER_BASE_URL: 'https://api.mspmanager.com', MSPMANAGER_API_KEY: 'k' });
  assert.strictEqual(bearer.isConfigured(), true);
  assert.strictEqual(bearer._headers().Authorization, 'Bearer k');

  const apikey = new MspManagerConnector({ MSPMANAGER_BASE_URL: 'https://x', MSPMANAGER_AUTH: 'apikey', MSPMANAGER_API_KEY: 'k', MSPMANAGER_API_KEY_HEADER: 'X-Api-Key' });
  assert.strictEqual(apikey._headers()['X-Api-Key'], 'k');

  const basic = new MspManagerConnector({ MSPMANAGER_BASE_URL: 'https://x', MSPMANAGER_AUTH: 'basic', MSPMANAGER_USER: 'u', MSPMANAGER_PASSWORD: 'p' });
  assert.strictEqual(basic.isConfigured(), true);
  assert.strictEqual(basic._headers().Authorization, 'Basic ' + Buffer.from('u:p').toString('base64'));
});

test('mspmanager: routes Tier 2 to the escalation queue', () => {
  const { MspManagerConnector } = require('../shared/psa/mspmanager');
  const c = new MspManagerConnector({ MSPMANAGER_BASE_URL: 'https://x', MSPMANAGER_API_KEY: 'k', MSPMANAGER_DEFAULT_QUEUE: 'Service Desk', MSPMANAGER_TIER2_QUEUE: 'Security' });
  assert.strictEqual(c._queueFor({ tier: '1' }), 'Service Desk');
  assert.strictEqual(c._queueFor({ tier: '2' }), 'Security');
  assert.strictEqual(c._queueFor({ escalated: true }), 'Security');
});

// Enhancement suite (connector framework, dashboards, risk, RBAC, copilot,
// reports, audit) is defined separately and appended here.
for (const t of require('./enhancement.test')) tests.push(t);

// --- runner ----------------------------------------------------------------

(async () => {
  for (const t of tests) {
    try {
      await t.fn();
      passed += 1;
      console.log(`  ok   ${t.name}`);
    } catch (err) {
      console.error(`  FAIL ${t.name}`);
      console.error('       ' + (err && err.stack ? err.stack.split('\n').slice(0, 3).join('\n       ') : err));
      process.exitCode = 1;
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed`);
  if (process.exitCode) console.error('TESTS FAILED');
})();
