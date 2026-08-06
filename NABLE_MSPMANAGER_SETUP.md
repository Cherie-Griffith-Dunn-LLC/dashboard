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

Confirmed from Swagger: MSP Manager's public API is an **OData** API. Create a
ticket = `POST https://api.mspmanager.com/odata/Tickets` with this body:
`{ title, description, dueDate, ticketPriorityCode, serviceItemId, contactId,
locationId, issueTypeId, projectId }`. Auth is **Basic** (a service login).

| Setting | Value |
| --- | --- |
| `PSA_CONNECTOR` | `mspmanager` |
| `MSPMANAGER_BASE_URL` | `https://api.mspmanager.com/odata` |
| `MSPMANAGER_AUTH` | `basic` |
| `MSPMANAGER_USER` / `MSPMANAGER_PASSWORD` | a dedicated MSP Manager service login |
| `MSPMANAGER_TICKETS_PATH` | `/tickets` (default, lowercase) |
| `MSPMANAGER_DEFAULT_CONTACT_ID` | GUID — default requester contact (from `GET /Contacts`) |
| `MSPMANAGER_ISSUE_TYPE_ID` | GUID — default issue type (from `GET /IssueTypes`) |
| `MSPMANAGER_SERVICE_ITEM_ID` | GUID — default service item (from `GET /ServiceItems`) |
| `MSPMANAGER_DEFAULT_LOCATION_ID` | GUID — optional (from `GET /Locations`) |
| `MSPMANAGER_TIER2_ISSUE_TYPE_ID` / `MSPMANAGER_TIER2_SERVICE_ITEM_ID` | optional — route security tickets differently |
| `MSPMANAGER_PROJECT_ID` | optional GUID |
| `MSPMANAGER_PRIORITY_LOW/MEDIUM/HIGH/CRITICAL` | optional — override the `ticketPriorityCode` number per level |

**How to get the GUIDs:** in the same Swagger page, expand `GET /IssueTypes`,
`GET /ServiceItems`, `GET /Contacts`, `GET /Locations` → **Try it out → Execute**
→ copy the `id` of the one you want. Those `id` values are the GUIDs above.
(Priority codes: defaults are low=0, medium=1, high=2, critical=3 — confirm in the
Swagger enum and override with the `MSPMANAGER_PRIORITY_*` settings if different.)

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
