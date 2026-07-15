/**
 * Security 360 dashboard service (frontend).
 *
 * Thin client over the connector-services API. The browser NEVER calls an AI
 * provider directly — Copilot requests go to our server-side `/api/ai/copilot`
 * route, which holds the Foundry credentials and enforces RBAC/audit. There are
 * no mock fixtures here: every method returns live API data (which may itself
 * be connector simulation data server-side until integrations are credentialed).
 */

const API_BASE = process.env.REACT_APP_API_BASE || '/api';

const DASHBOARD_VIEWS = ['executive', 'microsoft', 'vulnerabilities', 'epic', 'compliance', 'helpdesk'];
const REPORT_TYPES = ['executive', 'compliance', 'connector-health', 'security-posture'];

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: Object.assign({ Accept: 'application/json' }, options.body ? { 'Content-Type': 'application/json' } : {}, options.headers || {}),
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      data = text;
    }
  }
  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.body = data;
    throw error;
  }
  return data;
}

/** Fetch an aggregated dashboard view. */
export function getDashboard(view) {
  if (!DASHBOARD_VIEWS.includes(view)) {
    return Promise.reject(new Error(`Unknown dashboard view: ${view}`));
  }
  return apiFetch(`/dashboard/${view}`);
}

/** Convenience: the executive risk overview. */
export function getExecutiveOverview() {
  return getDashboard('executive');
}

/** List connector configuration/health. */
export function listConnectors() {
  return apiFetch('/connectors');
}

/** Trigger a connector sync (single name or "all"). */
export function syncConnector(connector = 'all') {
  return apiFetch(`/connectors/${connector}/sync`, { method: 'POST' });
}

/**
 * Ask the Security Copilot. Returns the four-part response
 * ({ summary, topRisks, nextActions, responsibleOwner }) from the server.
 */
export function askCopilot(question) {
  return apiFetch('/ai/copilot', { method: 'POST', body: { question } });
}

/**
 * Create a helpdesk ticket. Routes through the server-side ticket service,
 * which hands off to the active PSA connector (N-able MSP Manager once
 * PSA_CONNECTOR=mspmanager and its credentials are set in Azure). The browser
 * never holds PSA credentials — they live only in server app settings.
 */
export function createTicket(ticket) {
  return apiFetch('/tickets', { method: 'POST', body: ticket });
}

/** Generate a structured report. */
export function getReport(type) {
  if (!REPORT_TYPES.includes(type)) {
    return Promise.reject(new Error(`Unknown report type: ${type}`));
  }
  return apiFetch(`/reports/${type}`);
}

export const DashboardService = {
  getDashboard,
  getExecutiveOverview,
  listConnectors,
  syncConnector,
  askCopilot,
  getReport,
  DASHBOARD_VIEWS,
  REPORT_TYPES,
};

export default DashboardService;
