"use strict";

const { GUID, failure } = require("./access");
const tokenCache = new Map();
const DEFENDER = "https://api.security.microsoft.com";
const ARM = "https://management.azure.com";

async function token(tenantId, scope, env = process.env, fetcher = fetch) {
  if (
    !GUID.test(tenantId || "") ||
    !GUID.test(env.PORTAL_MICROSOFT_CLIENT_ID || "") ||
    !env.PORTAL_MICROSOFT_CLIENT_SECRET
  ) {
    throw failure(503, "Microsoft connection is not configured.");
  }
  const key = `${tenantId}|${env.PORTAL_MICROSOFT_CLIENT_ID}|${scope}`;
  const existing = tokenCache.get(key);
  if (existing?.until > Date.now() + 60000) return existing.value;
  const response = await fetcher(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.PORTAL_MICROSOFT_CLIENT_ID,
        client_secret: env.PORTAL_MICROSOFT_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope,
      }),
    },
  );
  if (!response.ok)
    throw failure(502, "Microsoft access needs administrator attention.");
  const data = await response.json();
  if (!data.access_token || !Number.isFinite(data.expires_in))
    throw failure(502, "Microsoft authentication did not complete.");
  tokenCache.set(key, {
    value: data.access_token,
    until: Date.now() + data.expires_in * 1000,
  });
  return data.access_token;
}

async function collection(start, bearer, fetcher = fetch, maxPages = 10) {
  const first = new URL(start);
  if (![DEFENDER, ARM].includes(first.origin))
    throw failure(502, "Unexpected Microsoft endpoint.");
  let next = start;
  const items = [],
    seen = new Set();
  for (let page = 0; next && page < maxPages; page++) {
    const url = new URL(next);
    // Do not forward credentials to another host or another Sentinel workspace.
    if (
      url.origin !== first.origin ||
      url.pathname !== first.pathname ||
      url.username ||
      url.password ||
      url.hash ||
      seen.has(url.href)
    ) {
      throw failure(502, "Microsoft returned an invalid continuation.");
    }
    seen.add(url.href);
    const response = await fetcher(url.href, {
      headers: { Authorization: `Bearer ${bearer}` },
      redirect: "error",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok)
      throw failure(
        502,
        response.status === 429
          ? "Microsoft is busy. Please retry shortly."
          : "Microsoft data could not be read. Check consent and permissions.",
      );
    const data = await response.json();
    if (!Array.isArray(data.value))
      throw failure(502, "Microsoft returned an unexpected response.");
    items.push(...data.value);
    next = data["@odata.nextLink"] || data.nextLink || null;
  }
  return { items, partial: Boolean(next) };
}

async function defender(access, env = process.env, deps = {}) {
  if (!access.companyWide)
    return {
      status: "restricted",
      message:
        "Company security visibility is available to approved company administrators.",
    };
  if (access.tenant.defenderEnabled !== true)
    return {
      status: "not_connected",
      message: "Defender onboarding is awaiting administrator setup.",
    };
  const bearer = await (deps.token || token)(
    access.tenantId,
    "https://api.securitycenter.microsoft.com/.default",
    env,
  );
  const read = deps.collection || collection;
  const [devices, alerts] = await Promise.all([
    read(`${DEFENDER}/api/machines?$top=1000`, bearer),
    read(
      `${DEFENDER}/api/alerts?$top=1000&$filter=status%20ne%20%27Resolved%27`,
      bearer,
    ),
  ]);
  return {
    status: "connected",
    checkedAt: new Date().toISOString(),
    partial: devices.partial || alerts.partial,
    devices: devices.items.map((d) => ({
      id: d.id,
      name: d.computerDnsName,
      os: d.osPlatform,
      health: d.healthStatus,
      risk: d.riskScore,
      exposure: d.exposureLevel,
      onboarding: d.onboardingStatus,
      lastSeen: d.lastSeen,
    })),
    alerts: alerts.items.map((a) => ({
      id: a.id,
      title: a.title,
      severity: a.severity,
      status: a.status,
      deviceId: a.machineId,
      createdAt: a.alertCreationTime,
    })),
  };
}

async function sentinel(access, env = process.env, deps = {}) {
  if (!access.companyWide)
    return {
      status: "restricted",
      message:
        "Incident visibility is available to approved company administrators.",
    };
  const config = access.tenant.sentinel;
  if (!config?.enabled)
    return {
      status: "not_connected",
      message: "Sentinel workspace connection is awaiting setup.",
    };
  if (
    !GUID.test(config.subscriptionId || "") ||
    !/^[\w().-]{1,90}$/.test(config.resourceGroup || "") ||
    !/^[\w-]{4,63}$/.test(config.workspace || "")
  ) {
    throw failure(503, "Sentinel workspace configuration needs attention.");
  }
  // Lighthouse authenticates in the managing tenant; direct consent uses the customer tenant.
  const authTenant =
    config.accessMode === "lighthouse"
      ? env.PORTAL_MANAGING_TENANT_ID
      : access.tenantId;
  const bearer = await (deps.token || token)(
    authTenant,
    `${ARM}/.default`,
    env,
  );
  const path = `/subscriptions/${config.subscriptionId}/resourceGroups/${encodeURIComponent(config.resourceGroup)}/providers/Microsoft.OperationalInsights/workspaces/${encodeURIComponent(config.workspace)}/providers/Microsoft.SecurityInsights/incidents`;
  const result = await (deps.collection || collection)(
    `${ARM}${path}?api-version=2025-09-01&$top=100`,
    bearer,
  );
  return {
    status: "connected",
    checkedAt: new Date().toISOString(),
    partial: result.partial,
    incidents: result.items.map((i) => ({
      id: i.name,
      title: i.properties?.title,
      severity: i.properties?.severity,
      status: i.properties?.status,
      number: i.properties?.incidentNumber,
      createdAt: i.properties?.createdTimeUtc,
      updatedAt: i.properties?.lastModifiedTimeUtc,
    })),
  };
}
module.exports = { token, collection, defender, sentinel };
