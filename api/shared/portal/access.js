"use strict";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const keys = new Map();
function failure(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}

function registry(env = process.env) {
  try {
    const value = JSON.parse(env.PORTAL_TENANTS_JSON || "{}");
    if (!value || Array.isArray(value) || typeof value !== "object")
      throw new Error();
    return value;
  } catch (_) {
    throw failure(503, "Company access configuration needs attention.");
  }
}

// Only verified, API-audience access tokens reach this function in production.
// Membership is assigned by immutable Entra tenant + object ID, never an email domain.
function resolveMembership(claims, tenants, clientId) {
  if (
    claims.ver !== "2.0" ||
    !GUID.test(claims.tid || "") ||
    !GUID.test(claims.oid || "") ||
    claims.azp !== clientId ||
    !(claims.scp || "").split(" ").includes("Portal.Read")
  ) {
    throw failure(403, "This account cannot access the customer portal.");
  }
  const tenant = Object.hasOwn(tenants, claims.tid)
    ? tenants[claims.tid]
    : null;
  const member =
    tenant?.members && Object.hasOwn(tenant.members, claims.oid)
      ? tenant.members[claims.oid]
      : null;
  if (
    tenant?.enabled !== true ||
    member?.enabled !== true ||
    !["employee", "executive"].includes(member.role)
  ) {
    throw failure(
      403,
      "Your company administrator needs to approve your portal access.",
    );
  }
  return {
    tenantId: claims.tid,
    objectId: claims.oid,
    tenant,
    member,
    companyWide: member.role === "executive",
  };
}

async function verifyAccessToken(token, tenants, env, testKey) {
  const { decodeJwt, createRemoteJWKSet, jwtVerify } = await import("jose");
  let claims;
  try {
    const hint = decodeJwt(token);
    // Untrusted tid selects only a configured tenant and a fixed Microsoft URL.
    if (!GUID.test(hint.tid || "") || !Object.hasOwn(tenants, hint.tid))
      throw new Error();
    const issuer = `https://login.microsoftonline.com/${hint.tid}/v2.0`;
    if (!keys.has(issuer))
      keys.set(
        issuer,
        createRemoteJWKSet(
          new URL(
            `https://login.microsoftonline.com/${hint.tid}/discovery/v2.0/keys`,
          ),
        ),
      );
    ({ payload: claims } = await jwtVerify(token, testKey || keys.get(issuer), {
      issuer,
      audience: env.PORTAL_API_AUDIENCE,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "nbf", "tid", "oid", "azp", "scp"],
      clockTolerance: 5,
    }));
  } catch (_) {
    throw failure(
      401,
      "Your session could not be verified. Please sign in again.",
    );
  }
  return resolveMembership(claims, tenants, env.PORTAL_SPA_CLIENT_ID);
}

async function authenticate(req, env = process.env) {
  if (env.CUSTOMER_PORTAL_ENABLED !== "true")
    throw failure(503, "The customer portal is being prepared.");
  if (
    !GUID.test(env.PORTAL_API_AUDIENCE || "") ||
    !GUID.test(env.PORTAL_SPA_CLIENT_ID || "")
  ) {
    throw failure(503, "Secure sign-in configuration needs attention.");
  }
  const token = /^Bearer ([^\s]+)$/.exec(req.headers?.authorization || "")?.[1];
  if (!token || token.length > 16384)
    throw failure(401, "Please sign in to continue.");
  return verifyAccessToken(token, registry(env), env);
}

module.exports = {
  authenticate,
  verifyAccessToken,
  resolveMembership,
  registry,
  failure,
  GUID,
};
