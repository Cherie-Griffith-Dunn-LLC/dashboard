# Security 360 Connector Services (Azure Functions API)

This `/api` folder is the **connector and ticketing backend** for the Security 360
portal. It implements the intake and integration layer from the Cyproteck
architecture:

```
Phone / chat / email / portal
        │
   Amazon Connect ──► Lambda / EventBridge ─┐
        │                                    ├─►  Azure Functions Ticket API  ◄── Security 360 portal
   (contact/case events)                     │            │
                                             │            ▼
                                      MSP PSA / ITSM (authoritative ticket record)
                                             │
                                             ▼
                              Dashboards + Security Copilot (Foundry)
```

**Design principles**

- The **MSP PSA/ITSM is the authoritative ticket record.** Amazon Connect is the
  communications/intake layer.
- Every Amazon `ContactId` maps to exactly one PSA `TicketId`.
- **Foundry / Security Copilot** categorizes, summarizes, recommends priority, finds
  root cause, and drafts customer updates — with **human approval** for consequential
  actions (`requiresApproval: true`).
- Everything runs in **simulation mode** with no cloud credentials so the pipeline is
  testable end-to-end before AWS / PSA / Foundry are provisioned.

## Endpoints

| Method | Route | Purpose |
| ------ | ----- | ------- |
| `POST` | `/api/webhooks/amazon-connect` | Ingest Amazon Connect contact/case events (single, EventBridge envelope, or batch). Idempotent per `eventId`. |
| `POST` | `/api/tickets` | Create a ticket (portal / API intake). |
| `GET`  | `/api/tickets` | List tickets (`status`, `customerId`, `channel`, `openOnly`, `limit`). |
| `GET`  | `/api/tickets/{ticketId}` | Fetch a ticket with activity trail, SLA, and linked contacts. |
| `PATCH`| `/api/tickets/{ticketId}` | Update `status` / `priority` / `assignee` / `note` / `firstResponse`. |
| `POST` | `/api/copilot/{tool}` | Copilot tools: `summarize`, `categorize`, `priority`, `root-cause`, `draft-update`. |
| `GET`  | `/api/connectors` | Readiness/health report for the connector suite. |
| `POST` | `/api/GetRoles` | Existing role resolver (unchanged). |

### Core capabilities (mapped to the enhancement list)

- **`amazon-connect` connector** — `shared/connectors/amazonConnect.js` (event
  normalization + optional standalone Cases/Tasks client).
- **Ticket creation/update APIs** — `Tickets/` + `shared/tickets.js`.
- **Amazon Connect event webhook** — `AmazonConnectWebhook/`.
- **Contact-to-ticket mapping** — `shared/store.js` (`ContactId ⇄ TicketId`).
- **SLA and ticket activity records** — `shared/sla.js` + the store's activity trail.
- **Call/chat transcript summarization** — `shared/copilot.js#summarizeTranscript`.
- **Copilot ticket & root-cause tools** — `shared/copilot.js` via `/api/copilot/*`.
- **Duplicate-ticket prevention** — `shared/dedupe.js` (exact `ContactId` match +
  fuzzy subject/description match within a time window).

## PSA connectors

The authoritative backend is selected with `PSA_CONNECTOR`
(`helpdesk` | `connectwise` | `halo` | `ninjaone`; default `helpdesk`). External
connectors that are selected but not yet credentialed run in **simulation mode** and
tag results with `simulated: true`.

## Configuration

All settings are environment variables (Azure Functions App Settings). None are
required to run in simulation mode.

| Variable | Purpose |
| -------- | ------- |
| `PSA_CONNECTOR` | Active PSA: `helpdesk` (default), `connectwise`, `halo`, `ninjaone`. |
| `AMAZON_CONNECT_WEBHOOK_SECRET` | Shared secret / HMAC key for the webhook. **Set in production.** |
| `CONNECTOR_API_KEY` | Service API key accepted in `x-api-key` for M2M callers. |
| `ALLOW_ANONYMOUS_API` | `true` disables auth on management endpoints (**local dev only**). |
| `FOUNDRY_ENDPOINT` / `FOUNDRY_API_KEY` / `FOUNDRY_DEPLOYMENT` | Azure AI Foundry / Azure OpenAI for live Copilot (else heuristic fallback). |
| `SLA_POLICIES_JSON` | Override SLA targets per priority. |
| `DEDUPE_WINDOW_MINS` / `DEDUPE_THRESHOLD` | Duplicate-detection tuning (defaults 1440 / 0.55). |
| `CONNECTWISE_*` / `HALO_*` / `NINJAONE_*` | Per-PSA credentials (see the connector source). |
| `AWS_REGION`, `AMAZON_CONNECT_INSTANCE_ID`, `AMAZON_CONNECT_DOMAIN_ID`, `AMAZON_CONNECT_CASE_TEMPLATE_ID`, `AMAZON_CONNECT_TASK_FLOW_ID` | Optional standalone Cases/Tasks client. |

## Running the tests

```bash
cd api
npm test        # node test/run.js — no network/credentials required
```

## Deployment note

The current Static Web Apps workflow sets `api_location: ""`, so this API is **not**
deployed by that pipeline yet. To activate it, set `api_location: "api"` in
`.github/workflows/*.yml` (and ensure the SWA plan includes managed functions). It is
left unchanged here to avoid altering the existing production deploy without review.

## State persistence

The shipped store is in-memory (`shared/store.js`) — sufficient for the MVP and tests,
and a warm Functions host keeps it alive between invocations. For production, back it
with Azure Table Storage / Cosmos DB behind the same async interface (see the sketch at
the bottom of `store.js`); no caller changes are required.

## HIPAA / PHI

Amazon Connect is HIPAA-eligible, but using it for PHI requires an AWS BAA and a
compliant configuration end-to-end: recording/transcript retention, KMS encryption,
redaction, least-privilege permissions, and equivalent controls on every downstream
system (this API, the PSA, and Foundry). Transcripts handled by
`summarizeTranscript` should be governed accordingly before enabling PHI workloads.
