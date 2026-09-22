"use strict";

const { failure } = require("./access");
const {
  ConnectCasesClient,
  paginateSearchCases,
} = require("@aws-sdk/client-connectcases");
let client;
const profilePattern =
  /^arn:aws:profile:[a-z0-9-]+:\d{12}:domains\/[^/]+\/profiles\/[^/]+$/;

function profilesFor(access) {
  const profiles = access.companyWide
    ? access.tenant.caseProfiles
    : [access.member.caseProfileArn];
  if (
    !Array.isArray(profiles) ||
    !profiles.length ||
    profiles.some((p) => !profilePattern.test(p || ""))
  ) {
    throw failure(503, "Your support account is awaiting its company link.");
  }
  return [...new Set(profiles)];
}

async function listCases(
  access,
  env = process.env,
  paginate = paginateSearchCases,
) {
  if (!env.PORTAL_CASES_DOMAIN_ID || !env.AWS_REGION)
    throw failure(503, "Ticket connection is awaiting setup.");
  const profiles = profilesFor(access);
  if (!client)
    client = new ConnectCasesClient({
      region: env.AWS_REGION,
      maxAttempts: 2,
      requestHandler: { connectionTimeout: 3000, requestTimeout: 12000 },
    });
  const items = new Map();
  let pages = 0,
    partial = false;
  const fields = [
    "customer_id",
    "title",
    "status",
    "reference_number",
    "created_datetime",
    "last_updated_datetime",
  ];
  outer: for (let offset = 0; offset < profiles.length; offset += 10) {
    const filters = profiles
      .slice(offset, offset + 10)
      .map((arn) => ({
        field: { equalTo: { id: "customer_id", value: { stringValue: arn } } },
      }));
    const input = {
      domainId: env.PORTAL_CASES_DOMAIN_ID,
      fields: fields.map((id) => ({ id })),
      filter: filters.length === 1 ? filters[0] : { orAll: filters },
      sorts: [{ fieldId: "created_datetime", sortOrder: "Desc" }],
    };
    for await (const page of paginate({ client, pageSize: 100 }, input)) {
      for (const row of page.cases || []) {
        const data = Object.fromEntries(
          (row.fields || []).map((f) => [f.id, f.value?.stringValue]),
        );
        // Defense in depth: never trust an upstream result outside our bound profiles.
        if (!profiles.includes(data.customer_id))
          throw failure(502, "Ticket ownership could not be verified.");
        const member = Object.values(access.tenant.members).find(
          (m) => m.caseProfileArn === data.customer_id,
        );
        items.set(row.caseId, {
          id: row.caseId,
          reference: data.reference_number,
          title: data.title,
          status: data.status,
          createdAt: data.created_datetime,
          updatedAt: data.last_updated_datetime,
          submittedBy: member?.displayName || "Company member",
        });
      }
      if (++pages >= 20 && (page.nextToken || offset + 10 < profiles.length)) {
        partial = true;
        break outer;
      }
    }
  }
  const tickets = [...items.values()].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt)),
  );
  const month = new Date().toISOString().slice(0, 7);
  const thisMonth = tickets.filter((t) => t.createdAt?.startsWith(month));
  return {
    status: "connected",
    scope: access.companyWide ? "company" : "own",
    checkedAt: new Date().toISOString(),
    partial,
    tickets,
    month,
    monthlyTotal: thisMonth.length,
    submittedBy: access.companyWide
      ? thisMonth.reduce((counts, t) => {
          counts[t.submittedBy] = (counts[t.submittedBy] || 0) + 1;
          return counts;
        }, Object.create(null))
      : undefined,
  };
}
module.exports = { listCases, profilesFor };
