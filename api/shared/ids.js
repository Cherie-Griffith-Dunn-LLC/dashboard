'use strict';

const crypto = require('crypto');

/** RFC4122 v4 id. */
function uuid() {
  return crypto.randomUUID();
}

/** Short, human-scannable id with a prefix, e.g. `TKT-8f3a1c`. */
function shortId(prefix) {
  const hex = crypto.randomBytes(4).toString('hex');
  return prefix ? `${prefix}-${hex}` : hex;
}

/** Current time as an ISO-8601 string. */
function nowIso() {
  return new Date().toISOString();
}

module.exports = { uuid, shortId, nowIso };
