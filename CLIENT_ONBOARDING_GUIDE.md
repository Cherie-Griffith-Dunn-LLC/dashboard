# CLIENT_ONBOARDING_GUIDE.md

Onboarding a new customer (tenant) onto Security 360.

## Overview
Security 360 is multi-tenant. Every API read/write is scoped to a tenant id
resolved from the Entra `tid` claim (interactive users) or `x-tenant-id` /
`?tenant=` (service callers). Onboarding = establishing that tenant's identity,
connectors, roles, and (for healthcare) compliance scope.

## 1. Tenant identity & access
- Add the customer's Entra tenant to the app registration (or invite users as
  guests) so MSAL sign-in works.
- Assign roles (see RBAC below) to the customer's users and your MSP staff.

## 2. Roles (RBAC)
| Role | Typical assignee | Access |
| ---- | ---------------- | ------ |
| Owner | MSP platform admin | Everything |
| BusinessOwner | Customer executive | Dashboards, reports, Copilot, **Epic** |
| Analyst | MSP SOC/analyst | Dashboards, reports, Copilot, connector sync |
| Service | Automation / integrations | Connector sync, ticket write (API key) |
| Employee | Customer end user | Limited dashboard only |

Epic (PHI-adjacent) requires Owner or BusinessOwner.

## 3. Connectors
For each source the customer uses, add that connector's credentials to the
tenant's app settings (`CONNECTOR_FRAMEWORK.md` lists the env vars). Connectors
without credentials run in simulation mode — safe for a pre-integration demo.

Recommended first sync order: Microsoft → Azure → NinjaOne/SentinelOne →
ConnectWise/Halo → network/AWS → Epic (after approval).

Trigger the initial sync:
```
POST /api/connectors/all/sync        (Authorization: Analyst+/Owner or x-api-key)
Header: x-tenant-id: <customer-tenant>
```

## 4. Amazon Connect intake (if used)
- Point the customer's EventBridge/Lambda at
  `POST /api/webhooks/amazon-connect` with `x-connector-secret`.
- Choose the authoritative PSA (`PSA_CONNECTOR`) and configure its credentials.

## 5. Compliance scope
- HIPAA readiness is always on. Enable CMMC for defense-adjacent customers with
  `ENABLE_CMMC=true`.
- For PHI workloads confirm the **AWS BAA** (Amazon Connect) and Microsoft/Epic
  BAAs are in place before enabling live PHI-adjacent connectors.

## 6. Validate
```
GET /api/connectors                  # nine connectors, expected modes
GET /api/dashboard/executive         # risk score populated
GET /api/dashboard/compliance        # HIPAA readiness
POST /api/ai/copilot                 # four-part briefing
GET /api/reports/executive           # generates a briefing
```
Confirm audit events for the tenant appear in Application Insights.

## 7. Handover
- Share the executive and compliance reports as the baseline.
- Set up scheduled syncs and report delivery (Phase 2/5, `MVP_ENHANCEMENT_PLAN.md`).

## Offboarding
- Remove the tenant's connector credentials and role assignments.
- Purge tenant snapshots/tickets from the store; retain audit per policy.
