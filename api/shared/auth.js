'use strict';

/**
 * Caller authentication for management endpoints.
 *
 * Accepts either:
 *   - An authenticated Azure Static Web Apps principal (interactive users), or
 *   - A service API key in `x-api-key` matching CONNECTOR_API_KEY (the portal
 *     backend, Lambda, or other machine-to-machine callers).
 *
 * When neither CONNECTOR_API_KEY nor a principal is present, the endpoint is
 * open only if ALLOW_ANONYMOUS_API=true (intended for local development). The
 * readiness endpoint surfaces that state so it is never silently insecure.
 */

const { getClientPrincipal } = require('./http');
const crypto = require('crypto');

function requireCaller(req) {
  const principal = getClientPrincipal(req);
  if (principal) {
    return { ok: true, email: principal.email, roles: principal.roles, via: 'principal' };
  }

  const apiKey = process.env.CONNECTOR_API_KEY;
  const presented = req && req.headers && req.headers['x-api-key'];
  if (apiKey && presented && timingSafeEqualStr(presented, apiKey)) {
    return { ok: true, email: 'service', roles: ['Service'], via: 'api-key' };
  }

  if (process.env.ALLOW_ANONYMOUS_API === 'true') {
    return { ok: true, email: 'anonymous', roles: [], via: 'anonymous' };
  }

  return { ok: false, message: 'Authentication required (Static Web Apps principal or x-api-key)' };
}

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = { requireCaller };
