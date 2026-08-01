# CyproSecure 360 — Azure Setup (step by step)

End-to-end setup to host the dashboard on **Azure Static Web Apps** with a
custom domain, Entra ID sign-in, the connector API, and the N-able MSP Manager
helpdesk integration. Deploy is done from PowerShell (`deploy.ps1`) — no GitHub
Actions required.

Legend: ✅ = you've already done this · ⬜ = to do.

---

## Part 0 — Prerequisites (one-time)
⬜ An Azure subscription (portal.azure.com, sign in as `cherie@cyproteck.com`).
⬜ **Node.js LTS** installed on your PC — https://nodejs.org (verify: `node -v`).
⬜ The project code on your PC (clone of the repo / this branch).

---

## Part 1 — Create the Static Web App
1. Azure Portal → **Create a resource** → search **Static Web App** → **Create**.
2. Fill in:
   - **Subscription / Resource Group:** pick existing, or create `cyprosecure-rg`.
   - **Name:** `cyprosecure-dashboard`.
   - **Plan type:** **Standard** (needed for custom auth + more app settings).
   - **Region:** closest to you (e.g. East US 2).
   - **Deployment source:** choose **Other** (we deploy from PowerShell, not GitHub).
3. **Review + create → Create.** When it finishes, **Go to resource**.

> If a Static Web App already exists (the `thankful-desert-05ea0e50f` one), you
> can reuse it — just skip to Part 4.

---

## Part 2 — Custom domain (app.cyprosecure.com)  ✅ (done)
1. Static Web App → **Custom domains → + Add → Custom domain on other DNS**.
2. Enter `app.cyprosecure.com`; Azure shows a **CNAME** target
   (`<name>.azurestaticapps.net`).
3. In **GoDaddy** DNS for `cyprosecure.com`: add a **CNAME**, Name `app`,
   Value = the Azure target.
4. Back in Azure → **Validate**. SSL is issued automatically → status **Ready**.

---

## Part 3 — Entra ID sign-in (redirect URI)  ✅ (done)
1. Azure Portal → **Entra ID → App registrations →** your app
   (client `1d40f6b3-9072-4a0a-af48-6e423e58d0d6`).
2. **Authentication →** under **Single-page application** add redirect URI
   `https://app.cyprosecure.com`; add the same under front-channel logout.
3. **Save.**

---

## Part 4 — Application settings (Configuration)
These are **server-side** settings the connector API reads. The browser never
sees them. Static Web App → **Settings → Configuration → Application settings →
+ Add** for each:

**Core**
| Name | Value |
| --- | --- |
| `CONNECTOR_API_KEY` | a long random string you generate (machine-to-machine key) |
| `APP_ENV` | `PROD` |

**N-able MSP Manager helpdesk** (see `NABLE_MSPMANAGER_SETUP.md` for the two
values to confirm from your Swagger page)
| Name | Value |
| --- | --- |
| `PSA_CONNECTOR` | `mspmanager` |
| `MSPMANAGER_BASE_URL` | your API base URL (from Swagger) |
| `MSPMANAGER_AUTH` | `bearer` (or `apikey` / `basic`) |
| `MSPMANAGER_API_KEY` | your MSP Manager API key |
| `MSPMANAGER_TICKETS_PATH` | e.g. `/v1/tickets` (from Swagger) |
| `MSPMANAGER_DEFAULT_QUEUE` | your Tier 1 queue name |
| `MSPMANAGER_TIER2_QUEUE` | your Tier 2 / Security queue name |

Click **Save** (this restarts the API with the new values).

> ⚠️ Never paste these secret values into chat or commit them to the repo — they
> live only here in Azure.

---

## Part 5 — Deploy from PowerShell
1. Static Web App → **Overview → Manage deployment token** → copy it.
2. On your PC, open **PowerShell** in the project folder and run:
   ```powershell
   $env:SWA_DEPLOYMENT_TOKEN = "<paste-deployment-token>"
   ./deploy.ps1
   ```
   This installs, builds, and deploys `./build` to production.
   - First time only, if scripts are blocked:
     `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`
3. Wait for `==> Done.` (~1–2 minutes).

---

## Part 6 — Verify
1. Open `https://app.cyprosecure.com`.
2. **Sign in** with your Microsoft account — should land on the Portfolio
   Command Center (MSSP view).
3. Open the **Helpdesk** (bottom-right), submit a test message, and confirm a
   ticket appears in **N-able MSP Manager** (the queue you set in Part 4).
4. Toggle **light/dark** with the sun/moon button to confirm theming.

---

## Troubleshooting
- **`AADSTS50011` redirect mismatch** → Part 3 URI doesn't exactly match
  `https://app.cyprosecure.com`.
- **Site loads but assets 404** → `homepage` in `package.json` must match the
  domain you're serving (currently `https://app.cyprosecure.com`).
- **Helpdesk tickets stay "simulated"** → Part 4 MSP Manager settings missing or
  `PSA_CONNECTOR` not set to `mspmanager`; re-check base URL/auth from Swagger.
- **`running scripts is disabled`** → run the `Set-ExecutionPolicy` line above.
