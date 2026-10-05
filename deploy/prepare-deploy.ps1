# ==============================================================================
# DevCenterPoint Studio - Local pre-flight before a cPanel Git deployment
# ==============================================================================
# Run this from the repository root (or double-click) before pushing to the
# branch that cPanel Git Version Control pulls from.
#
#   powershell -ExecutionPolicy Bypass -File deploy/prepare-deploy.ps1
#
# It builds the Laravel (backend) frontend assets into backend/public/build so
# they can be committed, then prints the deployment checklist.
# ==============================================================================

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$backend  = Join-Path $repoRoot "backend"
$buildDir = Join-Path $backend "public\build"

function Write-Step($msg) { Write-Host ">>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    + $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "    ! $msg" -ForegroundColor Yellow }

Write-Host ""
Write-Host "=== DevCenterPoint Studio - deploy pre-flight ===" -ForegroundColor White
Write-Host ""

# ------------------------------------------------------------------------------
# 1. Build the Laravel frontend assets
# ------------------------------------------------------------------------------
Write-Step "Building backend frontend assets (Vite)"
Push-Location $backend
try {
    if (-not (Test-Path (Join-Path $backend "node_modules"))) {
        Write-Warn "node_modules missing - running npm ci"
        npm ci
    }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed with exit code $LASTEXITCODE" }
    Write-Ok "Vite build complete"
}
finally {
    Pop-Location
}

if (-not (Test-Path (Join-Path $buildDir "manifest.json"))) {
    throw "Build manifest not found at $buildDir\manifest.json"
}
Write-Ok "Manifest present: public\build\manifest.json"

# ------------------------------------------------------------------------------
# 2. Optional: build the standalone root SPA (only if publishing it separately)
# ------------------------------------------------------------------------------
$distDir = Join-Path $repoRoot "dist"
if (Test-Path (Join-Path $repoRoot "package.json")) {
    Write-Step "Root SPA detected (optional static build)"
    Write-Warn "Skipped by default. Run 'npm run build' at the repo root only if the"
    Write-Warn "standalone SPA is published as a separate static site."
    if (Test-Path $distDir) { Write-Ok "Existing root build found at dist\" }
}

# ------------------------------------------------------------------------------
# 3. Stage the freshly built assets for commit
# ------------------------------------------------------------------------------
Write-Step "Staging built assets for the Git-driven deploy"
Push-Location $repoRoot
try {
    git add backend/public/build
    git status --short backend/public/build
}
finally {
    Pop-Location
}

# ------------------------------------------------------------------------------
# 4. Deployment checklist
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "=== Checklist ===" -ForegroundColor White
Write-Host ""
Write-Host "  1. Commit the rebuilt assets:" -ForegroundColor Yellow
Write-Host "       git commit -m ""build: refresh production assets""" -ForegroundColor Gray
Write-Host "       git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. In cPanel -> Git Version Control:" -ForegroundColor Yellow
Write-Host "       - Create the repository pointing at this GitHub repo." -ForegroundColor Gray
Write-Host "         (clone path: ~/repositories/DevCenterPoint-Studio)" -ForegroundColor Gray
Write-Host "       - Click ""Update from Remote"", then ""Deploy HEAD Commit""." -ForegroundColor Gray
Write-Host ""
Write-Host "  3. First-time server setup (once only):" -ForegroundColor Yellow
Write-Host "       - The deploy script copies backend\.env.production.example to" -ForegroundColor Gray
Write-Host "         ~/dcp_core/.env on first run and generates APP_KEY for you." -ForegroundColor Gray
Write-Host "       - Fill in DB_PASSWORD and MAIL_* in ~/dcp_core/.env, then re-deploy." -ForegroundColor Gray
Write-Host "         (DB: devcente_studio / devcente_studiousr on 127.0.0.1)" -ForegroundColor Gray
Write-Host "       - Set the document root of devcenterpoint.com to ~/public_html" -ForegroundColor Gray
Write-Host "       - The seed runs only when the users table is empty; change the" -ForegroundColor Gray
Write-Host "         admin@devcenterpoint.com password right after the first deploy." -ForegroundColor Gray
Write-Host ""
Write-Host "  4. cPanel cron (scheduler):" -ForegroundColor Yellow
Write-Host "       * * * * * cd /home/devcente/dcp_core && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1" -ForegroundColor Gray
Write-Host ""
Write-Host "Deploy script: deploy/cpanel-deploy.sh (run automatically by .cpanel.yml)" -ForegroundColor Green
Write-Host ""
