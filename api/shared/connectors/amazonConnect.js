'use strict';

/**
 * Amazon Connect connector.
 *
 * Two responsibilities:
 *
 *  1. normalizeEvent() — turn an inbound event into a platform-neutral intake
 *     object the ticket service understands. It accepts three shapes:
 *       a. An EventBridge envelope for Amazon Connect **contact events**
 *          (detail-type "Amazon Connect Contact Event").
 *       b. An EventBridge envelope for Amazon Connect **Cases** change events.
 *       c. A simplified payload posted by a customer Lambda / integration
 *          (already-flattened fields). This is the easiest path for the
 *          Lambda / EventBridge -> Azure Functions Ticket API hop in the
 *          reference architecture.
 *
 *  2. An optional Cases/Tasks client so Amazon Connect can also operate
 *     standalone (Cases for issue tracking, Tasks for work assignment). This
 *     uses the AWS SDK when present and configured, and degrades to simulation
 *     otherwise — the PSA remains the authoritative record in the primary
 *     architecture, so this client is not on the default ticket path.
 *
 * References: Amazon Connect contact events, Cases, and Tasks (AWS docs).
 */

const { nowIso } = require('../ids');

const CHANNEL_MAP = {
  VOICE: 'phone',
  CHAT: 'chat',
  TASK: 'task',
  EMAIL: 'email',
};

/** Normalize any accepted inbound event into an intake object, or null. */
function normalizeEvent(event) {
  if (!event || typeof event !== 'object') return null;

  // (a/b) EventBridge envelope
  if (event['detail-type'] && event.detail) {
    const dt = String(event['detail-type']);
    if (dt.includes('Contact Event')) return normalizeContactEvent(event);
    if (dt.includes('Cases')) return normalizeCasesEvent(event);
    // Unknown but enveloped — flatten detail and treat as simplified.
    return normalizeSimplified(event.detail, event.id, event.time);
  }

  // (c) Simplified/flattened payload
  return normalizeSimplified(event, event.eventId, event.occurredAt);
}

function normalizeContactEvent(envelope) {
  const d = envelope.detail || {};
  const channel = CHANNEL_MAP[String(d.channel || '').toUpperCase()] || 'phone';
  const agent = d.agentInfo || {};
  const queue = d.queueInfo || {};
  const attrs = d.attributes || d.contactAttributes || {};
  return clean({
    eventId: envelope.id || d.contactId,
    eventType: d.eventType || 'CONTACT',
    channel,
    contactId: d.contactId,
    initialContactId: d.initialContactId || d.contactId,
    customerId: attrs.customerId || attrs.companyId || null,
    customerName: attrs.customerName || attrs.company || null,
    contactName: attrs.customerName || d.customerEndpoint?.address || null,
    contactEmail: attrs.email || null,
    contactNumber: d.customerEndpoint?.address || null,
    subject: attrs.subject || defaultSubject(channel, d),
    description: attrs.description || attrs.summary || '',
    transcript: attrs.transcript || null,
    priorityHint: attrs.priority || null,
    agent: agent.agentArn || agent.username || null,
    queue: queue.queueName || queue.queueArn || null,
    occurredAt: envelope.time || nowIso(),
    terminal: isTerminalContactEvent(d.eventType),
    raw: envelope,
  });
}

function normalizeCasesEvent(envelope) {
  const d = envelope.detail || {};
  const fields = flattenCaseFields(d.case || d);
  return clean({
    eventId: envelope.id || d.caseId,
    eventType: d.changeType || 'CASE',
    channel: 'case',
    contactId: fields.contactId || d.relatedItem?.contactId || null,
    caseId: d.caseId || fields.caseId || null,
    customerId: fields.customerId || null,
    customerName: fields.customerName || null,
    subject: fields.title || fields.subject || 'Amazon Connect case',
    description: fields.summary || fields.description || '',
    priorityHint: fields.priority || null,
    occurredAt: envelope.time || nowIso(),
    raw: envelope,
  });
}

function normalizeSimplified(payload, eventId, occurredAt) {
  if (!payload || typeof payload !== 'object') return null;
  const channel = normalizeChannel(payload.channel);
  return clean({
    eventId: eventId || payload.eventId || payload.contactId,
    eventType: payload.eventType || 'CONTACT',
    channel,
    contactId: payload.contactId,
    initialContactId: payload.initialContactId || payload.contactId,
    customerId: payload.customerId || null,
    customerName: payload.customerName || payload.company || null,
    contactName: payload.contactName || payload.customerName || null,
    contactEmail: payload.contactEmail || payload.email || null,
    contactNumber: payload.contactNumber || payload.phone || null,
    subject: payload.subject || defaultSubject(channel, payload),
    description: payload.description || payload.summary || '',
    transcript: payload.transcript || null,
    priorityHint: payload.priority || payload.priorityHint || null,
    agent: payload.agent || null,
    queue: payload.queue || null,
    occurredAt: occurredAt || payload.occurredAt || nowIso(),
    terminal: payload.terminal !== undefined ? Boolean(payload.terminal) : true,
    raw: payload,
  });
}

function normalizeChannel(channel) {
  if (!channel) return 'phone';
  const upper = String(channel).toUpperCase();
  if (CHANNEL_MAP[upper]) return CHANNEL_MAP[upper];
  return String(channel).toLowerCase();
}

function defaultSubject(channel, d) {
  const label = { phone: 'Phone call', chat: 'Chat session', email: 'Email', task: 'Task' }[channel] || 'Contact';
  const who = (d && (d.customerName || d.contactName)) || 'customer';
  return `${label} from ${who}`;
}

// A ticket should typically be created/finalized once the contact wraps up.
function isTerminalContactEvent(eventType) {
  const terminal = ['DISCONNECTED', 'CONTACT_DISCONNECTED', 'COMPLETED', 'ENDED'];
  return terminal.includes(String(eventType || '').toUpperCase());
}

function flattenCaseFields(caseObj) {
  if (!caseObj) return {};
  if (Array.isArray(caseObj.fields)) {
    const out = { caseId: caseObj.caseId };
    for (const f of caseObj.fields) {
      const val = f.value && (f.value.stringValue || f.value.doubleValue || f.value.booleanValue);
      if (f.id) out[f.id] = val;
    }
    return out;
  }
  return caseObj;
}

function clean(obj) {
  Object.keys(obj).forEach((k) => obj[k] === undefined && delete obj[k]);
  return obj;
}

// --- Optional Cases / Tasks client (standalone Amazon Connect mode) --------

/** Lazy, dependency-optional AWS SDK loader. Returns null when unavailable. */
function tryRequire(mod) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(mod);
  } catch (err) {
    return null;
  }
}

class AmazonConnectClient {
  constructor(env = process.env) {
    this.env = env;
  }

  isConfigured() {
    return Boolean(this.env.AWS_REGION && (this.env.AMAZON_CONNECT_DOMAIN_ID || this.env.AMAZON_CONNECT_INSTANCE_ID));
  }

  /** Create an Amazon Connect Case (standalone issue tracking). */
  async createCase(input) {
    const sdk = tryRequire('@aws-sdk/client-connectcases');
    if (!sdk || !this.env.AMAZON_CONNECT_DOMAIN_ID) {
      return { caseId: `SIM-CASE-${Date.now()}`, simulated: true, input };
    }
    const client = new sdk.ConnectCasesClient({ region: this.env.AWS_REGION });
    const res = await client.send(
      new sdk.CreateCaseCommand({
        domainId: this.env.AMAZON_CONNECT_DOMAIN_ID,
        templateId: this.env.AMAZON_CONNECT_CASE_TEMPLATE_ID,
        fields: caseFields(input),
      })
    );
    return { caseId: res.caseId, simulated: false, raw: res };
  }

  /** Create an Amazon Connect Task (standalone work assignment). */
  async createTask(input) {
    const sdk = tryRequire('@aws-sdk/client-connect');
    if (!sdk || !this.env.AMAZON_CONNECT_INSTANCE_ID) {
      return { taskId: `SIM-TASK-${Date.now()}`, simulated: true, input };
    }
    const client = new sdk.ConnectClient({ region: this.env.AWS_REGION });
    const res = await client.send(
      new sdk.StartTaskContactCommand({
        InstanceId: this.env.AMAZON_CONNECT_INSTANCE_ID,
        ContactFlowId: this.env.AMAZON_CONNECT_TASK_FLOW_ID,
        Name: (input.subject || 'Task').slice(0, 512),
        Description: (input.description || '').slice(0, 4096),
        References: input.ticketUrl
          ? { Ticket: { Type: 'URL', Value: input.ticketUrl } }
          : undefined,
      })
    );
    return { taskId: res.ContactId, simulated: false, raw: res };
  }
}

function caseFields(input) {
  const fields = [];
  if (input.subject) fields.push({ id: 'title', value: { stringValue: input.subject } });
  if (input.description) fields.push({ id: 'summary', value: { stringValue: input.description } });
  return fields;
}

module.exports = {
  normalizeEvent,
  normalizeChannel,
  isTerminalContactEvent,
  AmazonConnectClient,
  CHANNEL_MAP,
};
