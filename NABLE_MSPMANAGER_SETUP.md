# Connecting the Helpdesk chat to N-able MSP Manager

The CyproSecure Helpdesk chat (Tier 1 → Tier 2) routes tickets through the
server-side ticket API, which hands off to whichever PSA connector is active.
This wires that connector to **N-able MSP Manager** so chats become real tickets.

Your MSP Manager tenant: `cyproteck` on `app.mspmanager.com` (US).

---

## 1. Generate an API key (do NOT paste it into code or chat)

In MSP Manager: **User menu (top-right) → My Account → Settings → Security → API Key**.
Give the key's role permission to **read Companies/Contacts and create Tickets**.

## 2. Confirm two values from your Swagger page

Open the public API/Swagger page from inside MSP Manager (My Account → the API
link). At the top of that page you'll see:

- **Base URL** — the real API host (e.g. `https://api.mspmanager.com`). Put it in
  `MSPMANAGER_BASE_URL`.
- **Create-ticket path + auth** — under the **Tickets** endpoint, note the exact
  POST path (e.g. `/v1/tickets`) and how it authenticates (Bearer key, an API-key
  header, or Basic username/password). Set `MSPMANAGER_TICKETS_PATH` and
  `MSPMANAGER_AUTH` accordingly.

> These are env-driven precisely so you can finalize them without a code change.

## 3. Add the settings in Azure (server-side only)

**Azure Portal → your Static Web App → Settings → Configuration → Application settings.**
Add:

| Setting | Value |
| --- | --- |
| `PSA_CONNECTOR` | `mspmanager` (makes MSP Manager the authoritative backend) |
| `MSPMANAGER_BASE_URL` | base URL from step 2 |
| `MSPMANAGER_AUTH` | `bearer` (default), or `apikey` / `basic` per step 2 |
| `MSPMANAGER_API_KEY` | your key from step 1 (for `bearer`/`apikey`) |
| `MSPMANAGER_API_KEY_HEADER` | header name — only if `MSPMANAGER_AUTH=apikey` |
| `MSPMANAGER_USER` / `MSPMANAGER_PASSWORD` | only if `MSPMANAGER_AUTH=basic` |
| `MSPMANAGER_TICKETS_PATH` | create path from step 2 (default `/v1/tickets`) |
| `MSPMANAGER_DEFAULT_QUEUE` | Tier 1 queue/board name (optional) |
| `MSPMANAGER_TIER2_QUEUE` | Tier 2 / Security queue name (optional) |

The API key lives **only** in Azure. The browser never receives it — the chat
calls `/api/tickets`, and the Azure Function calls MSP Manager server-side.

## 4. Ticket routing

- **Tier 1** chats → `MSPMANAGER_DEFAULT_QUEUE`.
- **Security-sensitive** chats (breach/ransomware/phishing/etc.) auto-escalate to
  **Tier 2** → `MSPMANAGER_TIER2_QUEUE`.
- Priority maps automatically: `critical→Critical`, `high→High`, `medium→Normal`,
  `low→Low` (adjust in `api/shared/psa/mspmanager.js#mapPriority` if your MSP
  Manager uses different priority labels).

## 5. Company mapping

Tickets attach to the right client via `customerId` / `customerName`. Once the key
is set we can pull your MSP Manager company list and match each portfolio company
by name/domain automatically — no manual ID lookups.

## 6. Verify

Until the settings are present the connector runs in **simulation** (tickets
succeed, marked `simulated`), so the chat is always functional. After configuring,
a quick `testConnection()` call (any 2xx from an authenticated GET) confirms the
base URL + auth are correct before going live.

Fallback behavior: if the ticket API is ever unreachable, the chat keeps working
in local/demo mode — the in-app queue still shows the ticket; it just isn't
synced to MSP Manager (no `✓ MSP Manager` badge).
