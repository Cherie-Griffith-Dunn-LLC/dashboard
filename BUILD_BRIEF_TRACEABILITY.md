# BUILD_BRIEF_TRACEABILITY.md

Traceability from each Healthcare Visibility + Microsoft Foundry build-brief
requirement to the code and docs that implement it. Status: ✅ implemented
(simulation-ready), 🟡 partial/follow-up.

| # | Brief requirement | Implementation | Status |
| - | ----------------- | -------------- | ------ |
| 1 | Executive risk score, top 10 risks, open critical issues, monthly trends | `api/shared/risk.js`, `Dashboard/` (executive), `RISK_SCORING.md` | ✅ |
| 2 | Microsoft admins, risky users, license usage, device compliance, conditional access | `api/connectors/microsoft/`, dashboard `microsoft` | ✅ |
| 3 | Vulnerabilities, patch compliance, endpoint health, threat trends | `connectors/azure`, `sentinelone`, `ninjaone`, `network`, `aws`; dashboard `vulnerabilities` | ✅ |
| 4 | Epic users, departments, high-risk access, inactive accounts, devices, access reviews, audit indicators | `api/connectors/epic/`, dashboard `epic`, `EPIC_APPROVAL_GUIDE.md` | ✅ |
| 5 | HIPAA + optional CMMC readiness, policy gaps, training, evidence tracking | `api/shared/compliance.js`, dashboard `compliance` (`ENABLE_CMMC`) | ✅ |
| 6 | Help desk aging, security tickets, department trends, repeat issues, Foundry root-cause | `connectors/connectwise`+`halo`, dashboard `helpdesk`, `shared/copilot.js#rootCause` | ✅ |
| 7 | Connector lifecycle: connect, fetchData, transformData, sync | `api/shared/framework/baseConnector.js`, `CONNECTOR_FRAMEWORK.md` | ✅ |
| 8 | Connector folders: Microsoft, SentinelOne, Epic, NinjaOne, ConnectWise, Halo, network, Azure, AWS | `api/connectors/<name>/` (9) | ✅ |
| 9 | Dashboard, connector-sync, AI, reporting API routes | `Dashboard/`, `ConnectorSync/`, `AICopilot/`, `Reports/` | ✅ |
| 10 | Tenant-scoped audit logging in App Insights + Azure SQL | `api/shared/audit.js` (dual sink, PHI redaction) | ✅ |
| 11 | Separate DEV / TEST / PROD strategy | `APP_ENV`, `ENVIRONMENT_STRATEGY.md` | ✅ |
| 12 | Four-part Copilot: Summary, Top Risks, Next Actions, Responsible Owner | `shared/copilot.js#securityCopilot`, `AICopilot/` | ✅ |
| 13 | Required CURRENT_STATE.md | `CURRENT_STATE.md` | ✅ |
| 14 | RBAC | `api/shared/rbac.js`, enforced in every route | ✅ |
| 15 | No frontend mock fixtures | Data originates server-side in connectors; frontend service has none | ✅ |
| 16 | No direct browser AI calls | Copilot only via `/api/ai/copilot`; verified by frontend test | ✅ |

## Verification mapping

| Brief verification claim | Evidence |
| ------------------------ | -------- |
| 2 frontend service tests | `src/services/dashboardService.test.js` (3 tests, transport-mocked) — `npm test` |
| 9 API/connector/RBAC/Copilot/report/audit tests | `api/test/enhancement.test.js` (10 tests) — `cd api && npm test` (25 total with intake suite) |
| Production React build | `npm run build` → "Compiled successfully." |
| No frontend mock fixtures | See #15 |
| No direct browser AI calls | See #16 |
| No unresolved code conflicts | Clean tree; no conflict markers |

## Documentation deliverables

`CURRENT_STATE.md`, `BUILD_BRIEF_TRACEABILITY.md`, `MVP_ENHANCEMENT_PLAN.md`,
`RISK_SCORING.md`, `CONNECTOR_FRAMEWORK.md`, `ENVIRONMENT_STRATEGY.md`,
`DEPLOYMENT_GUIDE.md`, `CLIENT_ONBOARDING_GUIDE.md`, `EPIC_APPROVAL_GUIDE.md`.

## Follow-ups (tracked in MVP_ENHANCEMENT_PLAN.md)
- Live provider API paths (currently simulation-ready with clear TODOs).
- Durable state (Azure Table/Cosmos + Azure SQL) replacing the in-memory store.
- Frontend chart pages consuming the stable dashboard data contracts.
- Activate `api_location` in the Static Web Apps workflow.
