# DEPLOYMENT_GUIDE.md

How to build, configure, and deploy Security 360 (React SPA + Azure Functions
API) on Azure Static Web Apps.

## Components
- **Frontend:** Create React App → static assets in `build/`.
- **API:** Azure Functions (Node 18) in `/api`.

## Local development
```bash
# Frontend
npm install --legacy-peer-deps
npm start                     # http://localhost:3000

# API (Azure Functions Core Tools v4)
cd api
npm install
func start                    # http://localhost:7071/api

# API tests (no credentials needed)
npm test                      # 25 passing
```
Set `ALLOW_ANONYMOUS_API=true` in `api/local.settings.json` for local API auth
bypass (DEV only). Never set it in TEST/PROD.

## Build
```bash
npm run build                 # -> build/  ("Compiled successfully")
```

## Activating the API in the Static Web Apps workflow
The current workflow (`.github/workflows/azure-static-web-apps-*.yml`) sets
`api_location: ""`, so the Functions API is **not** deployed yet. To activate:

```yaml
with:
  app_location: "/"
  api_location: "api"        # <— was ""
  output_location: "build"
```
Ensure the Static Web Apps plan includes managed functions, then redeploy. This
was left unchanged in code to avoid altering the existing production deploy
without review.

## Required app settings (API)
Configure per environment (Portal → Static Web App → Configuration, or Key Vault
references). See `ENVIRONMENT_STRATEGY.md` and `env (1).example` for the full
list. Minimum for a functional PROD:
- `APP_ENV=prod`
- `AMAZON_CONNECT_WEBHOOK_SECRET`, `CONNECTOR_API_KEY`
- `PSA_CONNECTOR` + that PSA's credentials
- Connector credentials for each live source (Microsoft, Azure, etc.)
- `FOUNDRY_ENDPOINT/_API_KEY/_DEPLOYMENT` for live Copilot
- Application Insights connection (for audit sink)

## Frontend build-time settings
- `REACT_APP_AZURE_CLIENT_ID`, `REACT_APP_AZURE_TENANT_ID`, `REACT_APP_REDIRECT_URI`
- `REACT_APP_API_BASE` (defaults to `/api`)

## Health checks post-deploy
1. `GET /api/connectors` → shows `environment`, PSA, and nine data connectors with mode.
2. `POST /api/connectors/all/sync` (authorized) → 200 with nine `synced`.
3. `GET /api/dashboard/executive` → risk score + top risks.
4. `POST /api/ai/copilot` → four-part response.
5. Confirm audit events land in Application Insights (`AuditEvent`).

## Rollback
Redeploy the previous artifact (frontend is a static bundle; API is stateless
aside from the pluggable store). No schema migrations in the current build.
