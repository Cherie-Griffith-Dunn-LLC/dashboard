# MVP_ENHANCEMENT_PLAN.md

The phased plan for evolving the Security 360 MVP from the current
simulation-ready state to a fully live, multi-tenant healthcare MSP platform.

## Phase 0 — Foundation (DONE)
- Amazon Connect intake + PSA ticketing (webhook, contact→ticket mapping, SLA, dedupe, ticket Copilot tools).
- Connector framework with the required lifecycle and nine connectors.
- Risk scoring, six dashboard views, HIPAA/CMMC compliance, reporting.
- Server-side Security Copilot (four-part), RBAC, tenant-scoped audit.
- Tests (25 API + 3 frontend), production build, docs.

## Phase 1 — Live connectors
Replace simulation with provider integrations, one connector at a time behind
its existing `isConfigured()` gate. Order by value/effort:
1. **Microsoft Graph** (identity, devices, CA) — highest signal.
2. **Azure / Defender** (cloud vulnerabilities, secure score).
3. **NinjaOne / SentinelOne** (patch + endpoint + threats).
4. **ConnectWise / Halo** (help-desk analytics; ticket-write already wired).
5. **Network scanner / AWS Security Hub**.
6. **Epic** — after App Orchard / Vendor Services approval (see `EPIC_APPROVAL_GUIDE.md`).

Acceptance per connector: live `connect()` health probe, real `fetchData()`,
same `transformData()` output shape, snapshot marked `mode: 'live'`.

## Phase 2 — Durable state & scale
- Swap the in-memory store for Azure Table Storage / Cosmos DB (tickets,
  mappings, snapshots) — interfaces are already async.
- Route audit to Azure SQL via `setSqlWriter()`; retain App Insights events.
- Scheduled connector syncs (timer-triggered Function) per tenant.

## Phase 3 — Foundry / Copilot depth
- Wire `FOUNDRY_ENDPOINT/_API_KEY/_DEPLOYMENT` for live four-part briefings,
  transcript summarization, and root-cause (heuristic fallback stays as backstop).
- Human-approval workflow UI for consequential Copilot actions (`requiresApproval`).

## Phase 4 — Frontend dashboard pages
- Build the six dashboard views as React pages consuming the stable API data
  contracts (`dashboardService`). No data fixtures; charts render live API data.
- Executive view first (risk score, top 10, trend), then domain views.

## Phase 5 — Multi-tenant onboarding & reporting
- Self-service tenant onboarding (see `CLIENT_ONBOARDING_GUIDE.md`).
- Scheduled report delivery (executive/compliance) with PDF rendering.
- CMMC enablement per tenant (`ENABLE_CMMC`).

## Cross-cutting
- Secrets in Azure Key Vault; per-environment app settings.
- Least-privilege connector credentials; KMS/CMK where PHI is in scope.
- Expand the test suite alongside each live connector.
