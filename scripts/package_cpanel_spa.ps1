# ==============================================================================
# DevCenterPoint — cPanel SPA Package Generator (devcenterpoint.com)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host ">>> [1/3] Building production bundle..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "..")
npm run build

Write-Host ">>> [2/3] Verifying .htaccess in dist..." -ForegroundColor Cyan
Copy-Item -Force "public/.htaccess" "dist/.htaccess"

Write-Host ">>> [3/3] Compressing dist into dist-cpanel.zip..." -ForegroundColor Cyan
$zipPath = "dist-cpanel.zip"
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}
Compress-Archive -Path "dist\*" -DestinationPath $zipPath -Force

Write-Host "`n=== cPanel Production Bundle Created Successfully! ===" -ForegroundColor Green
Write-Host "Archive: dist-cpanel.zip" -ForegroundColor Yellow
Write-Host "Target: Extract contents directly into /public_html on cPanel for devcenterpoint.com`n" -ForegroundColor Green
