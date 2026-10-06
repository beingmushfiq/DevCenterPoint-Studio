# ==============================================================================
# DevCenterPoint Studio - local pre-flight before a cPanel deployment
# ==============================================================================
# Run this from anywhere before deploying:
#
#   powershell -ExecutionPolicy Bypass -File deploy/prepare-deploy.ps1
#   powershell -ExecutionPolicy Bypass -File deploy/prepare-deploy.ps1 -Target All
#
# It delegates to backend/cpanel_deploy/package_cpanel.ps1 and prints the
# deployment checklist. Pick the smallest target that fits your change:
#
#   -Target Frontend  (default)  after changing resources/ (React/Tailwind/CSS)
#                                -> public_html.zip
#   -Target Vendor     (rare)    after changing composer.lock/composer.json
#                                -> vendor.zip
#   -Target All                  both
#
# Backend/content-only changes (app/, config/, routes/, database/) need NO
# archive - they travel via Git and are synced by deploy/cpanel-deploy.sh.
# ==============================================================================
[CmdletBinding()]
param(
    [ValidateSet('Frontend', 'Vendor', 'All')]
    [string] $Target = 'Frontend'
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$packager = Join-Path $repoRoot "backend\cpanel_deploy\package_cpanel.ps1"
$distDir  = Join-Path $repoRoot "backend\cpanel_dist"

Write-Host ""
Write-Host "=== DevCenterPoint Studio - deploy pre-flight (target: $Target) ===" -ForegroundColor White
Write-Host ""

& powershell -ExecutionPolicy Bypass -File $packager -Target $Target
if ($LASTEXITCODE -ne 0) { throw "Packager failed with exit code $LASTEXITCODE" }

$uploadNames = @()
if ($Target -eq 'Frontend' -or $Target -eq 'All') { $uploadNames += "public_html.zip" }
if ($Target -eq 'Vendor'   -or $Target -eq 'All') { $uploadNames += "vendor.zip" }

foreach ($name in $uploadNames) {
    $zip = Join-Path $distDir $name
    if (-not (Test-Path $zip)) { throw "Expected archive not found: $zip" }
}

Write-Host "=== Checklist ===" -ForegroundColor White
Write-Host ""
Write-Host "  1. Upload to the server (cPanel -> File Manager -> ~/cpanel_uploads):" -ForegroundColor Yellow
foreach ($name in $uploadNames) {
    Write-Host "       ~/cpanel_uploads/$name" -ForegroundColor Gray
}
Write-Host ""
Write-Host "  2. Deploy the source code (cPanel -> Terminal):" -ForegroundColor Yellow
Write-Host "       cd ~/repositories/DevCenterPoint-Studio" -ForegroundColor Gray
Write-Host "       git pull" -ForegroundColor Gray
Write-Host "       bash deploy/cpanel-deploy.sh   # auto-applies uploaded archives" -ForegroundColor Gray
Write-Host "     (or cPanel -> Git Version Control -> Update from Remote, then Deploy HEAD Commit)" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Verify: fetch https://devcenterpoint.com/build/manifest.json" -ForegroundColor Yellow
Write-Host "       The app entry must match the freshly built hash." -ForegroundColor Gray
Write-Host ""
Write-Host "Packager output: $distDir" -ForegroundColor Green
Write-Host ""
