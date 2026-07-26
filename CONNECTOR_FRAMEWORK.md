# CONNECTOR_FRAMEWORK.md

The connector framework standardizes how Security 360 ingests data from every
source system. It defines one lifecycle, one normalized snapshot shape, and one
registry, so adding a source is a small, predictable change.

## The lifecycle

Every connector extends `api/shared/framework/baseConnector.js` and implements
the required four stages:

| Stage | Method | Responsibility |
| ----- | ------ | -------------- |
| Connect | `connect()` | Establish/verify a session (auth, health probe). Returns `{ connected, mode }`. |
| Fetch | `fetchData(ctx)` | Pull raw provider data. Live mode calls the provider API; simulation mode delegates to `simulateFetch(ctx)`. |
| Transform | `transformData(raw, ctx)` | Normalize raw data into the connector's **domain metrics** + an `issues[]` list. |
| Sync | `sync(ctx)` | Orchestrate connect → fetch → transform → persist a tenant snapshot → audit. Never throws for provider outages; returns `{ status: 'error' }`. |

`sync()` persists a snapshot via the state store and writes a `connector.sync`
audit event. The aggregation and risk layers only ever read snapshots, so they
are decoupled from provider specifics.

## Snapshot shape

```jsonc
{
  "connector": "microsoft",
  "category": "identity",
  "domains": ["microsoft", "executive", "compliance"],
  "tenantId": "<tenant>",
  "mode": "live | simulation",
  "simulated": true,
  "data": { /* transformed domain metrics + issues[] */ },
  "syncedAt": "ISO-8601"
}
```

Each connector's `data.issues[]` entries are `{ severity, title }` where
severity ∈ `critical | high | medium | low`. Risk scoring consumes these
uniformly (see `RISK_SCORING.md`).

## The nine connectors

| Connector | Category | Feeds domains | Live config |
| --------- | -------- | ------------- | ----------- |
| `microsoft` | identity | microsoft, executive, compliance | `MICROSOFT_TENANT_ID/_CLIENT_ID/_CLIENT_SECRET` |
| `sentinelone` | endpoint | vulnerabilities, executive | `SENTINELONE_BASE_URL/_API_TOKEN` |
| `epic` | ehr | epic, compliance, executive | `EPIC_BASE_URL/_CLIENT_ID/_PRIVATE_KEY` |
| `ninjaone` | rmm | vulnerabilities, executive | `NINJAONE_BASE_URL/_CLIENT_ID/_CLIENT_SECRET` |
| `connectwise` | psa | helpdesk, executive | `CONNECTWISE_SITE/_COMPANY_ID/_PUBLIC_KEY/_PRIVATE_KEY/_CLIENT_ID` |
| `halo` | psa | helpdesk, executive | `HALO_BASE_URL/_CLIENT_ID/_CLIENT_SECRET` |
| `network` | network | vulnerabilities, executive | `NETWORK_SCANNER_URL/_API_KEY` |
| `azure` | cloud | vulnerabilities, executive, compliance | `AZURE_SUBSCRIPTION_ID/_TENANT_ID/_CLIENT_ID/_CLIENT_SECRET` |
| `aws` | cloud | vulnerabilities, executive | `AWS_REGION` + keys/role |

> The PSA connectors here are the **read/sync** side (dashboards). The
> **ticket-write** side lives separately in `api/shared/psa/` and is used by the
> Amazon Connect intake pipeline.

## Simulation mode

When credentials are absent a connector runs in simulation mode:
- Data is deterministic per tenant (seeded PRNG in `framework/sim.js`), so
  dashboards are stable and tests can assert exact values.
- It flows through the **same** `transformData` path as live data — only the
  numbers change when real credentials are added.
- It is **not** a frontend fixture: it originates in the connector layer,
  server-side, and is marked `simulated: true` end-to-end.

## Adding a connector

1. Create `api/connectors/<name>/index.js` extending `BaseConnector` with
   `{ name, category, domains }`.
2. Implement `isConfigured()`, `simulateFetch()`, `transformData()`, and (for
   live mode) override `connect()`/`fetchData()`.
3. Register it in `api/shared/framework/registry.js`.
4. Add a test case to `api/test/enhancement.test.js`.

## Registry API (`framework/registry.js`)

- `connectorNames()` → the nine names
- `getDataConnector(name)` → instance
- `describeAll()` → readiness descriptors (used by `GET /api/connectors`)
- `syncConnector(name, ctx)` / `syncAll(ctx)` → run the lifecycle
