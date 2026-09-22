# CyproSecure 360 customer security and IT portal

Implementation branch: `feature/customer-security-portal`. Prepared September 22, 2026.
This is a tested implementation candidate, not a claim of live Microsoft connections.
No customer license, Azure resource, subscription, package or partner association was created by this change.

## Included

- Responsive dark/teal customer workspace: overview, devices, incidents, support cases and device setup.
- Explicit connection/error states; no fabricated security scores or demo records in the new portal.
- Defender for Endpoint device inventory and unresolved alerts via live application APIs.
- Microsoft Sentinel incidents in an administrator-approved customer workspace, using direct access or Lighthouse.
- Read-only Amazon Connect Cases lists, employee-only scope or explicit executive company scope; monthly UTC totals and submitter breakdown.
- Approved, tenant-specific private Blob onboarding ZIP downloads with expiry and SHA-256 integrity checks.
- Entra v2 access-token verification (signature, tenant-specific issuer, audience, expiry, not-before, object ID, authorized SPA and delegated scope).
- Server-assigned tenant/object-ID membership. Query parameters, client roles, email domains, API keys and anonymous development flags cannot elevate portal access.
- Separate backend staging command that excludes existing legacy ticket, anonymous and simulation endpoints.
- Pull requests run checks but cannot execute the production deployment step.

## Microsoft setup (administrator access needed)

Use a pilot company first. The existing app code identifies the Cyproteck managing tenant as
`ff4945f1-e101-4ac8-a78f-798156ea9cdf`; verify it in Entra before configuring anything.
Do not derive tenant IDs or CEO privileges from company email domains.

1. Confirm the SPA app registration used by the deployed site. Source currently defaults to
   `1d40f6b3-9072-4a0a-af48-6e423e58d0d6`. Set its SPA redirect URI to
   `https://app.cyproteck.com` and the test environment URI if needed. Keep existing required URIs during migration.
2. Create or use a separate multitenant **portal API** registration, with requested access-token version 2.
   Expose delegated `Portal.Read` scope; authorize the confirmed SPA client. Record its GUID as the API audience.
   Obtain consent for each pilot tenant. Do not use Graph `User.Read` or an ID token as a portal API token.
3. Create or use a multitenant **Microsoft security reader** application. Grant only Defender for Endpoint
   application permissions `Machine.Read.All` and `Alert.Read.All`. Obtain customer administrator consent
   separately in each participating tenant. Store its credential in Key Vault and reference it from server app settings.
   The current adapter uses a server-side client credential; no credential is embedded in the browser.
   Verify Defender licensing and actual device onboarding in the customer tenant.
4. For Sentinel, identify the customer's subscription, resource group and Log Analytics workspace with Sentinel enabled.
   Give the security reader service principal **Microsoft Sentinel Reader** at that workspace, either through
   the customer's direct RBAC assignment or a confirmed Azure Lighthouse delegation from the managing tenant.
   `accessMode: lighthouse` acquires the ARM token in the managing tenant. Direct mode uses the customer tenant.
   Lighthouse access to Azure resources does not replace Defender tenant consent.
5. Verify the data connectors, analytics rules and incident generation inside Sentinel. Reading incidents is not
   equivalent to setting up ingestion or active protection. This implementation does not enable paid ingestion,
   deploy response rules, isolate devices or change customer security policy.

## Function app settings

Use a dedicated Azure Functions app with Node 22 and a managed identity, linked through the Static Web Apps
backend integration. Check the SWA hosting plan and existing backend before linking: only one Functions app
can be linked; do not replace an existing backend without accounting for its routes.
The linked Functions backend requires an eligible SWA plan (Standard or supported Dedicated plan).
Test that the customer Authorization bearer header reaches the handler through the chosen link/auth configuration.
Direct requests are also JWT-validated; never disable application validation to fix a routing issue.

| Setting | Value / purpose |
| --- | --- |
| `CUSTOMER_PORTAL_ENABLED` | Keep `false` until pilot configuration is complete; `true` activates authenticated API. |
| `PORTAL_API_AUDIENCE` | GUID of the portal API registration (Entra v2 token audience). |
| `PORTAL_SPA_CLIENT_ID` | Verified SPA registration GUID, checked against `azp`. |
| `PORTAL_TENANTS_JSON` | Server-only approved tenant/member/workspace registry; schema example below. |
| `PORTAL_MICROSOFT_CLIENT_ID` | Security reader application GUID. |
| `PORTAL_MICROSOFT_CLIENT_SECRET` | Key Vault reference resolved by Azure, never a frontend setting. |
| `PORTAL_MANAGING_TENANT_ID` | Cyproteck tenant GUID verified in Entra; used for Lighthouse mode. |
| `PORTAL_CASES_DOMAIN_ID` | Existing Connect Cases domain: `50ecd013-2869-4c6a-a4e5-c029ab66b70f`. |
| `AWS_REGION` | `us-east-1`. |
| AWS credential provider | Provision a least-privilege runtime provider for `cases:SearchCases` against the existing domain. No AWS credentials have been provisioned in Azure by this change. Prefer federation/short-lived credentials; any credential material must stay in managed secret storage. |
| `PORTAL_DOWNLOAD_STORAGE_ACCOUNT` | Azure storage account containing approved onboarding ZIP packages. |
| `PORTAL_DOWNLOAD_CONTAINER` | Private container; give Function managed identity Blob Data Reader for this container. |

The registry is a first-release controlled configuration, not a complete self-service onboarding system.
An administrator must verify membership and update the configuration for additions, departures, CEO access and
profile mapping changes. Use stable approved customer profile ARNs. Do not treat all same-domain addresses as executives.
Company `caseProfiles` must include all verified profiles belonging to that company, including former submitters if
history must remain visible. Map profile ARNs to members for submitter names. Unmapped historical names appear as
“Company member”; monthly submitter totals group by displayed name in this version.

```json
{
  "CUSTOMER_TENANT_GUID": {
    "enabled": true,
    "companyName": "Verified company name",
    "defenderEnabled": true,
    "sentinel": {
      "enabled": true,
      "accessMode": "lighthouse",
      "subscriptionId": "CUSTOMER_SUBSCRIPTION_GUID",
      "resourceGroup": "customer-security-rg",
      "workspace": "customer-security-logs"
    },
    "caseProfiles": ["arn:aws:profile:us-east-1:ACCOUNT_ID:domains/PROFILE_DOMAIN/profiles/PROFILE_ID"],
    "members": {
      "CUSTOMER_USER_OBJECT_GUID": {
        "enabled": true,
        "role": "executive",
        "displayName": "Approved company administrator",
        "caseProfileArn": "arn:aws:profile:us-east-1:ACCOUNT_ID:domains/PROFILE_DOMAIN/profiles/PROFILE_ID"
      }
    },
    "onboarding": {
      "windows": {
        "approved": true,
        "tenantId": "CUSTOMER_TENANT_GUID",
        "blobName": "CUSTOMER_TENANT_GUID/windows-onboarding.zip",
        "sha256": "REPLACE_WITH_64_CHARACTER_PACKAGE_SHA256",
        "expiresAt": "REPLACE_WITH_PACKAGE_EXPIRY_ISO8601"
      }
    }
  }
}
```

The example is not deployable until its placeholders are replaced with verified IDs. `role` can be
`employee` or `executive`. Employees can access their own tickets and approved company downloads; company device
and incident inventories require executive assignment. Staff cross-company management remains in the existing
MSP console; this release intentionally provides no customer-controlled tenant switch.

## Device downloads and licensing

Download each onboarding package from the **correct customer's** Microsoft Defender portal; package contents
are tenant-specific. Review the package and included platform instructions, record SHA-256 and expiry, then upload
it to the private container under that tenant's GUID prefix. Do not place packages in Git, public static assets,
or email their access keys. Upload ZIP packages under 20 MiB. macOS/Linux may also require separate Microsoft
software installation and organization policy; supply those steps inside the package or in an approved guide.
Downloading is not proof of installation: verify sensor health and onboarding in Defender after the client installs.
Intune/GPO or another managed deployment process may be preferable for company fleets. Mobile rollout is not yet included.

## Microsoft consumption and partner recognition

Keep client protection and Sentinel resources in the customer's appropriate tenant/subscription. Actual Azure
usage (for example Sentinel ingestion and retention) incurs charges to that subscription's billing arrangement.
Reading APIs or downloading Defender does not automatically create attributable Azure consumption or partner points.

- **Azure attribution:** verify Cyproteck's Partner ID and location ID, then use Partner Admin Link with the identity
  actually managing authorized customer resources. Lighthouse provides delegated management, not automatic PAL enrollment.
- **Partner earned credit:** a distinct eligibility calculation under applicable CSP Azure plan, RBAC and billing rules;
  PAL alone does not guarantee PEC.
- **Defender/Microsoft 365 usage:** validate the applicable customer association and CPOR/partner program requirements
  in Partner Center. Licensed active usage and qualifying workloads matter; installer counts are not usage credit.
- Confirm attribution in Partner Center reporting after onboarding. No earned-credit amount is shown in the customer UI.
- Do not enable unnecessary ingestion just to increase consumption. Agree on client telemetry, budget and retention first.

## Build, test and release

```sh
npm ci --ignore-scripts
npm ci --prefix api --ignore-scripts
npm run test:portal --prefix api
CI=true npm test -- --watchAll=false --runInBand
REACT_APP_CUSTOMER_PORTAL_ENABLED=true REACT_APP_PORTAL_API_SCOPE=api://YOUR_API_GUID/Portal.Read npm run build
node scripts/stage-customer-api.cjs
```

`dist/customer-api` contains only the new CustomerPortal function, required shared code, host settings and dependencies.
Install production dependencies there (`npm ci --omit=dev --ignore-scripts`) and deploy using the approved Azure
Function deployment process. **Do not deploy the entire legacy `api` folder as customer-facing endpoints.**
This staging command does not deploy or provision resources.

Set repository build variables only after pilot backend verification:
`REACT_APP_CUSTOMER_PORTAL_ENABLED=true`, `REACT_APP_PORTAL_API_SCOPE=api://API_GUID/Portal.Read`,
`REACT_APP_ENTRA_CLIENT_ID=SPA_GUID`, `REACT_APP_ENTRA_REDIRECT_URI=https://app.cyproteck.com`.
The production workflow still deploys the frontend only. Backend deployment and linking are separate gates.
The new portal stays off by default; disabling the frontend flag and rebuilding restores the existing dashboard.

Pilot acceptance:
1. Authorized customer executive signs in; real company, devices, incidents and ticket IDs match provider consoles.
2. Employee sees only own tickets; second tenant cannot read the first tenant by changing URL, headers or claims.
3. Revoked membership fails closed. Microsoft consent failure displays connection unavailable, not zero threats.
4. Approved package downloads only within its tenant; expired/mismatched package is rejected. Confirm device appears
   in the right customer's Defender inventory after installing, not simply after downloading.
5. Compare UTC monthly case totals and submitters with Connect. API caps are explicitly marked partial.
6. Confirm sign-out, narrow viewport layout, screen-reader labels and keyboard navigation in a real browser.
7. Check customer subscription costs/retention and partner association reporting independently.

## Remaining integration work

- Obtain Microsoft admin access/consent, verify tenant IDs and pilot deployment, provision runtime credentials and live packages.
- Complete browser-based visual/accessibility and live tenant acceptance tests. Unit fixtures do not prove live API access.
- Federate the existing Cognito support session with Entra or add an approved server bridge. The new support button currently
  opens `https://cyproteck.com/support` and can require a second login. New tickets/chat still use that working page.
- Add customer-facing case conversation/transcript detail and inline creation after the identity bridge is verified.
  Internal notes are not exposed in this release.
- Finish two-way Amazon Connect email after AWS resolves case `178991667200381`; this change does not resolve that quota error.
- Add durable self-service company provisioning and monitoring/sync controls for larger tenant counts.

## Official references

- https://learn.microsoft.com/en-us/defender-endpoint/api/exposed-apis-create-app-partners
- https://learn.microsoft.com/en-us/defender-endpoint/api/get-machines
- https://learn.microsoft.com/en-us/defender-endpoint/api/get-alerts
- https://learn.microsoft.com/en-us/rest/api/securityinsights/incidents/list?view=rest-securityinsights-2025-09-01
- https://learn.microsoft.com/en-us/azure/lighthouse/how-to/manage-sentinel-workspaces
- https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/link-partner-id
- https://learn.microsoft.com/en-us/azure/lighthouse/concepts/cloud-solution-provider
- https://learn.microsoft.com/en-us/partner-center/incentives/incentives-manage-customer-associations
- https://learn.microsoft.com/en-us/azure/static-web-apps/functions-bring-your-own
- https://docs.aws.amazon.com/connect/latest/APIReference/API_connect-cases_SearchCases.html
