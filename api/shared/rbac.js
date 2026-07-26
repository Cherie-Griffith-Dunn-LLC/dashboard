'use strict';

/**
 * Role-based access control.
 *
 * Roles come from the Static Web Apps principal (see api/GetRoles) or the
 * service API key. Permissions are coarse-grained and map to the dashboard,
 * connector, AI, and reporting capabilities. Healthcare/PHI-adjacent views
 * (Epic) require an elevated role.
 */

const PERMISSIONS = {
  Owner: ['*'],
  BusinessOwner: ['dashboard.read', 'reports.read', 'ai.invoke', 'connectors.read', 'epic.read'],
  Analyst: ['dashboard.read', 'reports.read', 'ai.invoke', 'connectors.read', 'connectors.sync'],
  Service: ['connectors.sync', 'connectors.read', 'dashboard.read', 'tickets.write'],
  Employee: ['dashboard.read.limited'],
};

// Which permission each capability requires.
const CAPABILITY = {
  'dashboard:executive': 'dashboard.read',
  'dashboard:microsoft': 'dashboard.read',
  'dashboard:vulnerabilities': 'dashboard.read',
  'dashboard:epic': 'epic.read',
  'dashboard:compliance': 'dashboard.read',
  'dashboard:helpdesk': 'dashboard.read',
  'connectors:sync': 'connectors.sync',
  'connectors:read': 'connectors.read',
  'ai:copilot': 'ai.invoke',
  'reports:generate': 'reports.read',
};

function permittedFor(roles) {
  const set = new Set();
  for (const role of roles || []) {
    for (const p of PERMISSIONS[role] || []) set.add(p);
  }
  return set;
}

function hasPermission(roles, permission) {
  const set = permittedFor(roles);
  return set.has('*') || set.has(permission);
}

/**
 * Authorize a caller for a capability key (e.g. 'dashboard:epic').
 * @returns {{ ok: boolean, permission?: string, message?: string }}
 */
function authorize(caller, capability) {
  const permission = CAPABILITY[capability];
  if (!permission) return { ok: false, message: `Unknown capability: ${capability}` };
  const roles = (caller && caller.roles) || [];
  if (hasPermission(roles, permission)) return { ok: true, permission };
  return { ok: false, permission, message: `Requires '${permission}' (roles: ${roles.join(', ') || 'none'})` };
}

module.exports = { PERMISSIONS, CAPABILITY, authorize, hasPermission, permittedFor };
