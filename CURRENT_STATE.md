# CURRENT_STATE.md

_Last updated: 2026-07-10_

Snapshot of the Cyproteck **Security 360** MVP after incorporating the
Healthcare Visibility + Microsoft Foundry build brief. The enhancement was
layered onto the existing application **without a rebuild**: the React shell and
Azure AD auth are unchanged; all new capability lives in the server-side
connector-services API under `/api`.

## Architecture at a glance

```
Browser (React SPA, Azure AD / MSAL)
        │  (no direct AI or provider calls)
        ▼
Azure Static Web Apps  ──►  /api  (Azure Functions, Node 18)
        │
        ├─ Intake:      Amazon Connect webhook ─► ticket service ─► PSA (authoritative)
        ├─ Connectors:  Microsoft, SentinelOne, Epic, NinjaOne, ConnectWise,
        │               Halo, network, Azure, AWS   (connect→fetch→transform→sync)
        ├─ Analytics:   risk scoring, dashboards, compliance, reports
        ├─ AI:          server-side Security Copilot (Foundry) — four-part output
        └─ Governance:  RBAC, tenant-scoped audit (App Insights + Azure SQL)
```

## What exists today

### Frontend (`/src`) — unchanged shell + new service
- React SPA with Azure AD (MSAL) authentication and role gating.
- **New:** `src/services/dashboardService.js` — thin client over the API. The
  browser never calls an AI provider directly; Copilot goes through
  `/api/ai/copilot`. No mock data fixtures.

### Connector-services API (`/api`)
| Area | Location |
| ---- | -------- |
| Amazon Connect intake + ticketing | `AmazonConnectWebhook/`, `Tickets/`, `shared/tickets.js`, `shared/connectors/amazonConnect.js` |
| Ticket Copilot tools | `CopilotTools/`, `shared/copilot.js` |
| Connector framework (lifecycle) | `shared/framework/baseConnector.js`, `registry.js`, `sim.js` |
| Nine data connectors | `connectors/<microsoft|sentinelone|epic|ninjaone|connectwise|halo|network|azure|aws>/` |
| Risk scoring | `shared/risk.js` |
| Dashboards | `shared/dashboards.js`, API `Dashboard/` |
| Compliance (HIPAA/CMMC) | `shared/compliance.js` |
| Reports | `shared/reports.js`, API `Reports/` |
| Security Copilot (four-part) | `shared/copilot.js#securityCopilot`, API `AICopilot/` |
| RBAC | `shared/rbac.js` |
| Audit logging | `shared/audit.js` (App Insights + Azure SQL/in-memory) |
| Connector sync | API `ConnectorSync/` |
| PSA ticket adapters | `shared/psa/` (ConnectWise, Halo, NinjaOne, help desk) |

## Dashboards delivered (data/API level)
- **Executive** — risk score, top 10 risks, open critical issues, monthly trend.
- **Microsoft** — admins, risky users, license usage, device compliance, conditional access.
- **Vulnerabilities** — vulnerabilities, patch compliance, endpoint health, threat trends.
- **Epic (healthcare)** — users, departments, high-risk access, inactive accounts, devices, access reviews, audit indicators.
- **Compliance** — HIPAA (and optional CMMC) readiness, policy gaps, training, evidence tracking.
- **Help desk** — aging, security tickets, department trends, repeat issues, and Foundry root-cause tooling.

## Connector lifecycle
Every connector implements **connect → fetchData → transformData → sync**. Live
mode uses provider APIs when credentials are present; otherwise the connector
runs in **simulation** mode, producing deterministic, tenant-seeded,
representative data through the identical transform path (clearly marked
`simulated: true`). No data fixtures live in the frontend.

## API routes
- Dashboards: `GET /api/dashboard/{executive|microsoft|vulnerabilities|epic|compliance|helpdesk}`
- Connector sync: `POST /api/connectors/{connector|all}/sync`, `GET /api/connectors`
- AI: `POST /api/ai/copilot`
- Reporting: `GET /api/reports/{executive|compliance|connector-health|security-posture}`
- Intake/ticketing: `POST /api/webhooks/amazon-connect`, `GET|POST|PATCH /api/tickets[/{id}]`, `POST /api/copilot/{tool}`

## Governance
- **RBAC** — Owner / BusinessOwner / Analyst / Service / Employee. Epic (PHI-adjacent) requires an elevated role.
- **Audit** — every material action recorded with tenant, actor, action, target, outcome to Application Insights (structured events) and Azure SQL (durable; in-memory retention in DEV/TEST). PHI-like fields are redacted from audit detail.
- **Tenancy** — all reads/writes are scoped to the resolved tenant id (Entra `tid` claim, `x-tenant-id`, or `?tenant=`).

## Environments
DEV / TEST / PROD separation via `APP_ENV` and per-environment app settings.
See `ENVIRONMENT_STRATEGY.md`.

## Verification (this iteration)
- **API tests:** `cd api && npm test` → 25 passing (15 intake/ticketing + 10 connector/risk/dashboard/RBAC/Copilot/report/audit).
- **Frontend service tests:** `src/services/dashboardService.test.js` (transport-mocked; no fixtures; no direct AI calls).
- **Production React build:** `npm run build`.
- No unresolved merge conflicts; no frontend mock fixtures; no direct browser AI calls.

## Known gaps / next steps
- Connectors run in simulation until provider credentials are configured (live REST/SDK paths are stubbed with clear TODOs where a provider call is required).
- `api_location` in the Static Web Apps workflow is still `""`; activating the API is a one-line change (see `DEPLOYMENT_GUIDE.md`).
- State store is in-memory; swap to Azure Table/Cosmos + Azure SQL for durable PROD state (interfaces already async).
- Frontend dashboard **views** (charts) consume the API but the visual pages are a follow-up; the data contracts are stable.
