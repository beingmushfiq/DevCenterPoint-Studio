# ==============================================================================
# DevCenterPoint Studio - local pre-flight before a cPanel deployment
# ==============================================================================
# Run this from anywhere before deploying:
#
#   powershell -ExecutionPolicy Bypass -File deploy/prepare-deploy.ps1
#
# It builds the frontend and produces the two upload archives (dcp_core.zip and
# public_html.zip) via backend/cpanel_deploy/package_cpanel.ps1, then prints the
# deployment checklist.
#
# The repository no longer commits backend/vendor or backend/public/build; these
# archives carry them to the server instead.
# ==============================================================================
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$packager = Join-Path $repoRoot "backend\cpanel_deploy\package_cpanel.ps1"

Write-Host ""
Write-Host "=== DevCenterPoint Studio - deploy pre-flight ===" -ForegroundColor White
Write-Host ""

& powershell -ExecutionPolicy Bypass -File $packager
if ($LASTEXITCODE -ne 0) { throw "Packager failed with exit code $LASTEXITCODE" }

$distDir    = Join-Path $repoRoot "backend\cpanel_dist"
$coreZip    = Join-Path $distDir "dcp_core.zip"
$publicZip  = Join-Path $distDir "public_html.zip"

foreach ($zip in @($coreZip, $publicZip)) {
    if (-not (Test-Path $zip)) { throw "Expected archive not found: $zip" }
}

Write-Host "=== Checklist ===" -ForegroundColor White
Write-Host ""
Write-Host "  1. Upload BOTH archives to the server (cPanel -> File Manager):" -ForegroundColor Yellow
Write-Host "       ~/cpanel_uploads/dcp_core.zip"    -ForegroundColor Gray
Write-Host "       ~/cpanel_uploads/public_html.zip" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Deploy the source code (cPanel -> Git Version Control):" -ForegroundColor Yellow
Write-Host "       - 'Update from Remote' (pull the latest commit)" -ForegroundColor Gray
Write-Host "       - 'Deploy HEAD Commit' (runs deploy/cpanel-deploy.sh," -ForegroundColor Gray
Write-Host "         which auto-applies the uploaded archives)" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Verify: fetch https://devcenterpoint.com/build/manifest.json" -ForegroundColor Yellow
Write-Host "       The app entry must match the freshly built hash." -ForegroundColor Gray
Write-Host ""
Write-Host "Packager output: $distDir" -ForegroundColor Green
Write-Host ""
