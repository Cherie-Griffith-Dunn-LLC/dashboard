"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  resolveMembership,
  verifyAccessToken,
  authenticate,
} = require("../shared/portal/access");
const {
  collection,
  defender,
  sentinel,
  token,
} = require("../shared/portal/microsoft");
const { listCases, profilesFor } = require("../shared/portal/cases");
const { approvedPackage } = require("../shared/portal/downloads");
const { createHandler } = require("../CustomerPortal");
const T = "11111111-1111-4111-8111-111111111111",
  OTHER = "22222222-2222-4222-8222-222222222222";
const O = "33333333-3333-4333-8333-333333333333",
  SPA = "44444444-4444-4444-8444-444444444444",
  AUD = "55555555-5555-4555-8555-555555555555";
const ARN = (n) =>
  `arn:aws:profile:us-east-1:123456789012:domains/customers/profiles/${n}`;
const claims = { ver: "2.0", tid: T, oid: O, azp: SPA, scp: "Portal.Read" };
const company = {
  enabled: true,
  companyName: "Test Company",
  defenderEnabled: true,
  caseProfiles: [ARN("one"), ARN("two")],
  members: {
    [O]: {
      enabled: true,
      role: "employee",
      displayName: "Member One",
      caseProfileArn: ARN("one"),
    },
  },
};
const employee = () => resolveMembership(claims, { [T]: company }, SPA);
const executive = () => ({
  ...employee(),
  companyWide: true,
  member: { ...company.members[O], role: "executive" },
});
const env = { PORTAL_API_AUDIENCE: AUD, PORTAL_SPA_CLIENT_ID: SPA };

test("member access is bound to tenant and object ID, not claimed email or role", () => {
  const a = resolveMembership(
    { ...claims, roles: ["executive"], email: "ceo@example.com" },
    { [T]: company },
    SPA,
  );
  assert.equal(a.companyWide, false);
  for (const change of [
    { tid: OTHER },
    { oid: OTHER },
    { azp: OTHER },
    { scp: "User.Read" },
    { ver: "1.0" },
  ])
    assert.throws(() =>
      resolveMembership({ ...claims, ...change }, { [T]: company }, SPA),
    );
  assert.throws(() =>
    resolveMembership(claims, { [T]: { ...company, enabled: false } }, SPA),
  );
});

test("cryptographic checks reject wrong issuer/audience/expiry/signature", async () => {
  const { generateKeyPair, SignJWT } = await import("jose");
  const key = await generateKeyPair("RS256"),
    wrong = await generateKeyPair("RS256");
  async function signed(opts = {}) {
    return new SignJWT({ ...claims, ...opts.claims })
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setNotBefore("0s")
      .setExpirationTime(opts.exp || "5m")
      .setIssuer(opts.iss || `https://login.microsoftonline.com/${T}/v2.0`)
      .setAudience(opts.aud || AUD)
      .sign(opts.key || key.privateKey);
  }
  const a = await verifyAccessToken(
    await signed(),
    { [T]: company },
    env,
    key.publicKey,
  );
  assert.equal(a.tenantId, T);
  for (const opts of [
    { aud: OTHER },
    { iss: `https://login.microsoftonline.com/${OTHER}/v2.0` },
    { exp: "-1h" },
    { key: wrong.privateKey },
    { claims: { tid: OTHER } },
  ])
    await assert.rejects(() =>
      signed(opts).then((t) =>
        verifyAccessToken(t, { [T]: company }, env, key.publicKey),
      ),
    );
});

test("API key, SWA headers and anonymous development flags do not bypass portal JWT", async () => {
  await assert.rejects(
    () =>
      authenticate(
        {
          headers: {
            "x-api-key": "anything",
            "x-ms-client-principal": "anything",
          },
        },
        {
          ...env,
          CUSTOMER_PORTAL_ENABLED: "true",
          ALLOW_ANONYMOUS_API: "true",
        },
      ),
    { statusCode: 401 },
  );
});

test("employees cannot trigger company Microsoft API reads", async () => {
  const fail = () => {
    throw new Error("should not call");
  };
  assert.equal(
    (await defender(employee(), {}, { token: fail })).status,
    "restricted",
  );
  assert.equal(
    (await sentinel(employee(), {}, { token: fail })).status,
    "restricted",
  );
});

test("Defender uses customer tenant and returns genuine zero only after successful reads", async () => {
  const calls = [];
  const result = await defender(
    executive(),
    {},
    {
      token: async (t, scope) => {
        calls.push(t, scope);
        return "test-token";
      },
      collection: async () => ({ items: [], partial: false }),
    },
  );
  assert.equal(calls[0], T);
  assert.match(calls[1], /securitycenter/);
  assert.equal(result.status, "connected");
  assert.equal(result.devices.length, 0);
  await assert.rejects(() =>
    defender(
      executive(),
      {},
      {
        token: async () => {
          throw new Error("consent missing");
        },
      },
    ),
  );
});

test("Sentinel Lighthouse uses managing tenant and exact approved customer workspace", async () => {
  const a = executive();
  a.tenant = {
    ...a.tenant,
    sentinel: {
      enabled: true,
      subscriptionId: OTHER,
      resourceGroup: "client-rg",
      workspace: "client-logs",
      accessMode: "lighthouse",
    },
  };
  let fetched;
  const result = await sentinel(
    a,
    { PORTAL_MANAGING_TENANT_ID: SPA },
    {
      token: async (t) => {
        assert.equal(t, SPA);
        return "test";
      },
      collection: async (url) => {
        fetched = url;
        return { items: [], partial: false };
      },
    },
  );
  assert.equal(result.status, "connected");
  assert.ok(
    fetched.includes(`/subscriptions/${OTHER}/resourceGroups/client-rg/`),
  );
});

test("pagination does not leak bearer tokens to a different host or workspace", async () => {
  for (const nextLink of [
    "https://evil.example/api/machines",
    "https://api.security.microsoft.com/api/alerts",
  ]) {
    let calls = 0;
    await assert.rejects(() =>
      collection(
        "https://api.security.microsoft.com/api/machines",
        "test",
        async () => {
          calls++;
          return { ok: true, json: async () => ({ value: [], nextLink }) };
        },
      ),
    );
    assert.equal(calls, 1);
  }
});

test("pagination marks capped data partial and handles provider errors", async () => {
  const r = await collection(
    "https://api.security.microsoft.com/api/machines",
    "test",
    async () => ({
      ok: true,
      json: async () => ({
        value: [{ id: "one" }],
        nextLink: "https://api.security.microsoft.com/api/machines?$skip=1",
      }),
    }),
    1,
  );
  assert.equal(r.partial, true);
  assert.equal(r.items.length, 1);
  await assert.rejects(() =>
    collection(
      "https://api.security.microsoft.com/api/machines",
      "test",
      async () => ({ ok: false, status: 403 }),
    ),
  );
});

test("token failures return a safe message without upstream secret echoes", async () => {
  await assert.rejects(
    () =>
      token(
        T,
        "test-scope",
        {
          PORTAL_MICROSOFT_CLIENT_ID: SPA,
          PORTAL_MICROSOFT_CLIENT_SECRET: "not-real",
        },
        async () => ({
          ok: false,
          json: async () => ({ error: "secret echo" }),
        }),
      ),
    (e) => !e.message.includes("secret echo"),
  );
});

function row(profile) {
  return {
    caseId: "case-1",
    fields: [
      { id: "customer_id", value: { stringValue: profile } },
      { id: "title", value: { stringValue: "VPN assistance" } },
      { id: "status", value: { stringValue: "open" } },
      {
        id: "created_datetime",
        value: { stringValue: new Date().toISOString() },
      },
    ],
  };
}
test("employee case queries bind only their server-approved profile and ignore company request input", async () => {
  let query;
  async function* pages(_, input) {
    query = input;
    yield { cases: [row(ARN("one"))] };
  }
  const result = await listCases(
    employee(),
    { AWS_REGION: "us-east-1", PORTAL_CASES_DOMAIN_ID: "domain" },
    pages,
  );
  assert.equal(query.filter.field.equalTo.value.stringValue, ARN("one"));
  assert.equal(result.scope, "own");
  assert.equal(result.monthlyTotal, 1);
  assert.equal(result.submittedBy, undefined);
});

test("company scope requires executive assignment and rejects returned cross-company tickets", async () => {
  assert.deepEqual(profilesFor(executive()), [ARN("one"), ARN("two")]);
  async function* bad() {
    yield { cases: [row(ARN("another-company"))] };
  }
  await assert.rejects(() =>
    listCases(
      employee(),
      { AWS_REGION: "us-east-1", PORTAL_CASES_DOMAIN_ID: "domain" },
      bad,
    ),
  );
  assert.throws(() => profilesFor({ ...employee(), member: {} }));
});

test("downloads require exact tenant, approval, integrity metadata and unexpired package", () => {
  const a = employee();
  const pkg = {
    approved: true,
    tenantId: T,
    blobName: `${T}/windows.zip`,
    sha256: "a".repeat(64),
    expiresAt: "2099-01-01T00:00:00Z",
  };
  a.tenant = { ...a.tenant, onboarding: { windows: pkg } };
  assert.equal(approvedPackage(a, "windows"), pkg);
  for (const patch of [
    { approved: false },
    { tenantId: OTHER },
    { blobName: `${OTHER}/windows.zip` },
    { blobName: `${T}/../other.zip` },
    { sha256: "bad" },
    { expiresAt: "2020-01-01" },
  ])
    assert.throws(() =>
      approvedPackage(
        {
          ...a,
          tenant: {
            ...a.tenant,
            onboarding: { windows: { ...pkg, ...patch } },
          },
        },
        "windows",
      ),
    );
});

test("request cannot override company or access scope; profile output excludes registry secrets", async () => {
  let passed;
  const handler = createHandler({
    authenticate: async () => employee(),
    listCases: async (access) => {
      passed = access;
      return { tickets: [] };
    },
  });
  const context = { bindingData: { section: "tickets" } };
  await handler(context, {
    query: { tenant: OTHER, scope: "company" },
    headers: { "x-tenant-id": OTHER },
  });
  assert.equal(passed.tenantId, T);
  assert.equal(passed.companyWide, false);
  const profile = { bindingData: { section: "profile" } };
  await handler(profile, {});
  assert.ok(!profile.res.body.includes("caseProfileArn"));
  assert.equal(profile.res.headers["Cache-Control"], "no-store");
});

test("unauthorized requests never call providers and unexpected errors are redacted", async () => {
  let called = false;
  const h = createHandler({
    authenticate: async () => {
      throw Object.assign(new Error("Sign in"), { statusCode: 401 });
    },
    defender: async () => {
      called = true;
    },
  });
  const c = { bindingData: { section: "defender" } };
  await h(c, {});
  assert.equal(c.res.status, 401);
  assert.equal(called, false);
  const broken = createHandler({
    authenticate: async () => executive(),
    defender: async () => {
      throw new Error("sensitive backend detail");
    },
  });
  await broken(c, {});
  assert.equal(c.res.status, 502);
  assert.ok(!c.res.body.includes("sensitive"));
});
