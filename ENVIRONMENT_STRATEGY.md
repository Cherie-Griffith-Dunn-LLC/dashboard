# ENVIRONMENT_STRATEGY.md

Separate DEV, TEST, and PROD environments for Security 360.

## Principles
- **Isolation:** each environment has its own Static Web App, Function app
  settings, connector credentials, storage, and Application Insights.
- **Config over code:** behavior is driven by app settings, not branches. The
  same build artifact promotes across environments.
- **Least privilege & no PHI outside PROD:** DEV/TEST use simulation-mode
  connectors (no real provider data). PROD uses live credentials under BAA.

## `APP_ENV`
Every environment sets `APP_ENV` (`dev` | `test` | `prod`). It is stamped onto
every audit record and surfaced by `GET /api/connectors`. Guard rails key off it
(e.g. `ALLOW_ANONYMOUS_API=true` is permitted only in DEV).

| Setting | DEV | TEST | PROD |
| ------- | --- | ---- | ---- |
| `APP_ENV` | `dev` | `test` | `prod` |
| Connector credentials | none (simulation) | sandbox/test tenants | live (BAA) |
| `ALLOW_ANONYMOUS_API` | `true` (local only) | unset | unset |
| `CONNECTOR_API_KEY` | dev key | test key | Key Vault secret |
| `AMAZON_CONNECT_WEBHOOK_SECRET` | optional | set | Key Vault secret |
| `FOUNDRY_*` | unset (heuristic) | test deployment | prod deployment |
| `ENABLE_CMMC` | as needed | as needed | per-tenant |
| State store | in-memory | in-memory / Table | Azure Table/Cosmos + Azure SQL |
| Audit SQL (`setSqlWriter`) | in-memory | Azure SQL (test) | Azure SQL (prod) |

## Branch / promotion flow
```
feature/* ──PR──► main
   │                │
   ▼                ▼
  DEV (auto)      TEST (auto on merge)
                    │  (manual approval)
                    ▼
                  PROD (promote same artifact)
```
- DEV deploys from feature branches / local (`npm start`, Functions Core Tools).
- TEST deploys on merge to `main`.
- PROD is a gated promotion of the exact TEST artifact (no rebuild).

## Secrets
- PROD/TEST secrets live in **Azure Key Vault**, referenced by app settings.
- No secrets in the repo. `.env` is gitignored; `env (1).example` documents keys.

## Data handling by environment
- **DEV/TEST:** simulation connectors only; no PHI; audit retained in-memory or a
  non-PHI test SQL database.
- **PROD:** live connectors under BAA; PHI-adjacent access (Epic) gated by RBAC
  and encrypted at rest (CMK/KMS). Audit detail redacts PHI-like fields.
