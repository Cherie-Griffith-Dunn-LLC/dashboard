# EPIC_APPROVAL_GUIDE.md

Requirements and steps to move the Epic connector from simulation to a live,
approved integration. Epic access is gated by both Epic's program requirements
and the customer health system's governance.

> **Important:** The Epic connector retrieves **access-governance and audit
> _indicators_ only** (user/role/access-review/inactive-account metrics). It is
> designed **not** to pull PHI (clinical record content). Keep it that way
> unless a specific, BAA-covered use case requires otherwise.

## 1. Program & legal prerequisites
- **Epic program enrollment:** engage via Epic **App Orchard / Vendor Services**
  (or the health system's Epic team for an internal integration). Obtain the
  client registration and the specific APIs/scopes approved.
- **Health system sign-off:** the customer's Epic governance / security team must
  approve the integration, scopes, and data flow.
- **BAA:** ensure a Business Associate Agreement covers Cyproteck for any
  PHI-adjacent processing before enabling live mode.
- **Scope minimization:** request the narrowest scopes needed for access
  governance (users, roles, audit metadata) — not clinical data.

## 2. Technical setup (live mode)
Configure the tenant's app settings:
| Variable | Purpose |
| -------- | ------- |
| `EPIC_BASE_URL` | Epic FHIR/REST base for the environment |
| `EPIC_CLIENT_ID` | Registered client id |
| `EPIC_PRIVATE_KEY` | JWT signing key for backend OAuth2 (client-credentials / SMART backend services) |

Implement the live `connect()` (JWT assertion → token) and `fetchData()`
(approved endpoints) in `api/connectors/epic/index.js`. The existing
`transformData()` output shape stays the same, so dashboards, risk scoring, and
compliance need no changes.

## 3. Security controls
- **RBAC:** the `epic` dashboard requires Owner or BusinessOwner
  (`api/shared/rbac.js`). Do not broaden this.
- **Audit:** every Epic dashboard read and connector sync is audited with tenant
  + actor. Audit detail redacts PHI-like fields.
- **Encryption:** store `EPIC_PRIVATE_KEY` in Key Vault; use CMK/KMS for any
  at-rest data derived from Epic.
- **Least privilege:** the integration account holds only the approved scopes.

## 4. Validation before go-live
1. `POST /api/connectors/epic/sync` (Owner/Analyst) → `mode: 'live'`.
2. `GET /api/dashboard/epic` → users, departments, high-risk access, inactive
   accounts, access reviews, audit indicators populated from live data.
3. Confirm **no PHI** appears in snapshots, dashboard payloads, or audit records.
4. Confirm audit events for `dashboard.read` (target `epic`) are recorded.

## 5. Ongoing governance
- Periodic access reviews of the integration account.
- Re-attest scopes at each Epic upgrade.
- Monitor the compliance dashboard's access-review and audit indicators.

## Simulation until approved
Until approval is complete, the connector runs in simulation mode: deterministic,
representative, non-PHI metrics that exercise the full dashboard/risk/compliance
pipeline. This lets onboarding and demos proceed without any Epic data access.
