'use strict';

/**
 * HTTP helpers shared across the connector functions.
 *
 * These keep the individual Azure Functions thin: parse/validate input,
 * build consistent JSON responses, and centralize the two auth models used
 * by the API:
 *   1. Azure Static Web Apps client principal (management endpoints).
 *   2. A shared webhook secret (Amazon Connect / EventBridge ingestion).
 */

const crypto = require('crypto');

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** Build a JSON HTTP response object for an Azure Functions `context.res`. */
function json(status, body, headers) {
  return {
    status,
    headers: Object.assign({}, JSON_HEADERS, headers || {}),
    body: body === undefined ? '' : JSON.stringify(body),
  };
}

const ok = (body) => json(200, body);
const created = (body) => json(201, body);
const badRequest = (message, details) => json(400, { error: message, details });
const unauthorized = (message) => json(401, { error: message || 'Unauthorized' });
const forbidden = (message) => json(403, { error: message || 'Forbidden' });
const notFound = (message) => json(404, { error: message || 'Not found' });
const conflict = (body) => json(409, body);
const serverError = (message, details) => json(500, { error: message || 'Internal error', details });

/** Parse a request body that may arrive as an object or a JSON string. */
function parseBody(req) {
  if (!req || req.body === undefined || req.body === null || req.body === '') return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch (err) {
    const e = new Error('Request body is not valid JSON');
    e.statusCode = 400;
    throw e;
  }
}

/**
 * Decode the Azure Static Web Apps client principal header.
 * Returns null when the caller is unauthenticated.
 */
function getClientPrincipal(req) {
  const header = req && req.headers && req.headers['x-ms-client-principal'];
  if (!header) return null;
  try {
    const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
    const claims = decoded.claims || [];
    const emailClaim = claims.find((c) => c.typ === 'preferred_username' || c.typ === 'emails');
    return {
      userId: decoded.userId,
      userDetails: decoded.userDetails,
      identityProvider: decoded.identityProvider,
      roles: decoded.userRoles || [],
      email: emailClaim ? emailClaim.val : decoded.userDetails,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Resolve the tenant id for a request. Priority:
 *   1. explicit `tenant` query param or `x-tenant-id` header (service callers),
 *   2. the principal's Entra tenant-id claim,
 *   3. 'default'.
 * Tenant isolation is enforced by scoping every store read/write to this id.
 */
function getTenantId(req) {
  const q = (req && req.query) || {};
  if (q.tenant) return String(q.tenant);
  const header = req && req.headers && req.headers['x-tenant-id'];
  if (header) return String(header);
  const principal = getClientPrincipal(req);
  if (principal && Array.isArray(principal.roles)) {
    const raw = req.headers['x-ms-client-principal'];
    try {
      const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
      const claim = (decoded.claims || []).find(
        (c) => c.typ === 'http://schemas.microsoft.com/identity/claims/tenantid' || c.typ === 'tid'
      );
      if (claim) return claim.val;
    } catch (err) {
      /* fall through */
    }
  }
  return 'default';
}

/** True when the principal holds any of the supplied roles. */
function hasAnyRole(principal, roles) {
  if (!principal || !Array.isArray(principal.roles)) return false;
  return roles.some((r) => principal.roles.includes(r));
}

/**
 * Verify an inbound Amazon Connect / EventBridge webhook.
 *
 * Two accepted modes:
 *   - Static shared secret in the `x-connector-secret` header.
 *   - HMAC-SHA256 signature of the raw body in `x-connector-signature`
 *     (hex), keyed by the same secret. Timing-safe comparison.
 *
 * When AMAZON_CONNECT_WEBHOOK_SECRET is unset the webhook runs open — only
 * appropriate for local development; the readiness check surfaces this.
 */
function verifyWebhook(req, rawBody) {
  const secret = process.env.AMAZON_CONNECT_WEBHOOK_SECRET;
  if (!secret) return { ok: true, mode: 'open' };

  const headers = (req && req.headers) || {};
  const presented = headers['x-connector-secret'];
  if (presented && timingSafeEqualStr(presented, secret)) {
    return { ok: true, mode: 'secret' };
  }

  const signature = headers['x-connector-signature'];
  if (signature) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody || '')
      .digest('hex');
    if (timingSafeEqualStr(signature, expected)) {
      return { ok: true, mode: 'hmac' };
    }
  }

  return { ok: false, mode: secret ? 'required' : 'open' };
}

/** Constant-time string comparison that never throws on length mismatch. */
function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still run a comparison to keep timing roughly constant.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Re-serialize a request body for signature verification. */
function rawBodyOf(req) {
  if (!req || req.body === undefined || req.body === null) return '';
  if (typeof req.body === 'string') return req.body;
  try {
    return JSON.stringify(req.body);
  } catch (err) {
    return '';
  }
}

module.exports = {
  json,
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
  parseBody,
  getClientPrincipal,
  getTenantId,
  hasAnyRole,
  verifyWebhook,
  rawBodyOf,
};
