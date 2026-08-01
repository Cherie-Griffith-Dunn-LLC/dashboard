<#
.SYNOPSIS
  Build the CyproSecure 360 dashboard and deploy it to Azure Static Web Apps
  from PowerShell — no GitHub Actions required.

.DESCRIPTION
  Runs the same steps as the CI workflow, locally:
    1. npm install
    2. npm run build   (produces ./build)
    3. Azure Static Web Apps CLI deploy ./build to production

  Prerequisites (one-time):
    - Node.js LTS + npm         https://nodejs.org  (check: node -v)
    - The SWA deployment token   Azure Portal -> your Static Web App ->
                                 Overview -> "Manage deployment token"

  SECURITY: never hard-code the token. Pass it with -DeploymentToken, or set
  $env:SWA_DEPLOYMENT_TOKEN before running. The script also accepts it via a
  secure prompt if neither is provided.

.EXAMPLE
  # Option A - set once for the session, then run
  $env:SWA_DEPLOYMENT_TOKEN = "xxxxxxxx"
  ./deploy.ps1

.EXAMPLE
  # Option B - pass explicitly
  ./deploy.ps1 -DeploymentToken "xxxxxxxx"

.EXAMPLE
  # Preview/staging environment instead of production
  ./deploy.ps1 -Environment staging
#>

[CmdletBinding()]
param(
  [string]$DeploymentToken = $env:SWA_DEPLOYMENT_TOKEN,
  [string]$Environment = "production",
  [string]$RedirectUri = "https://app.cyprosecure.com"
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Assert-Command($name, $help) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "'$name' was not found. $help"
  }
}

Write-Host "==> Checking prerequisites" -ForegroundColor Cyan
Assert-Command node "Install Node.js LTS from https://nodejs.org"
Assert-Command npm  "npm ships with Node.js - reinstall Node.js LTS"
Write-Host "    node $(node -v), npm $(npm -v)"

if ([string]::IsNullOrWhiteSpace($DeploymentToken)) {
  $secure = Read-Host -AsSecureString "Enter your SWA deployment token"
  $DeploymentToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if ([string]::IsNullOrWhiteSpace($DeploymentToken)) {
  throw "No deployment token provided. Get it from Azure Portal -> Static Web App -> Manage deployment token."
}

Write-Host "==> Installing dependencies (npm install)" -ForegroundColor Cyan
npm install

Write-Host "==> Building production bundle (npm run build)" -ForegroundColor Cyan
$env:CI = "false"                       # treat warnings as warnings, not errors
$env:REACT_APP_REDIRECT_URI = $RedirectUri
npm run build
if (-not (Test-Path "./build/index.html")) {
  throw "Build did not produce ./build/index.html - check the output above."
}

Write-Host "==> Deploying ./build to Azure ($Environment)" -ForegroundColor Cyan
# npx fetches the SWA CLI on first use; no global install needed.
npx --yes @azure/static-web-apps-cli deploy ./build `
  --deployment-token $DeploymentToken `
  --env $Environment

Write-Host "==> Done. Live at $RedirectUri (allow a few minutes for propagation)." -ForegroundColor Green
