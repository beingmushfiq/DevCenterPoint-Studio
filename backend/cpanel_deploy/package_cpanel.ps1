# ==============================================================================
# DevCenterPoint Studio — cPanel Deployment Packager
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host ">>> [1/4] Compiling production frontend assets with Vite..." -ForegroundColor Cyan
Set-Location (Join-Path $PSScriptRoot "..")
npm run build

$distDir = Join-Path $PSScriptRoot "..\cpanel_dist"
$tempCore = Join-Path $distDir "dcp_core"
$tempPublic = Join-Path $distDir "public_html"

if (Test-Path $distDir) {
    Remove-Item -Recurse -Force $distDir
}

New-Item -ItemType Directory -Force -Path $tempCore, $tempPublic | Out-Null

Write-Host ">>> [2/4] Staging dcp_core (Private Laravel Backend)..." -ForegroundColor Cyan
$coreItems = @("app", "bootstrap", "config", "database", "resources", "routes", "storage", "vendor", "artisan", "composer.json", ".env.example")
foreach ($item in $coreItems) {
    $srcPath = Join-Path (Join-Path $PSScriptRoot "..") $item
    if (Test-Path $srcPath) {
        Copy-Item -Recurse -Force $srcPath (Join-Path $tempCore $item)
    }
}

# Ensure storage directories exist
$storageDirs = @("storage/app/public", "storage/framework/cache", "storage/framework/sessions", "storage/framework/views", "storage/logs")
foreach ($sDir in $storageDirs) {
    $dirPath = Join-Path $tempCore $sDir
    if (-not (Test-Path $dirPath)) {
        New-Item -ItemType Directory -Force -Path $dirPath | Out-Null
    }
}

Write-Host ">>> [3/4] Staging public_html (Web Root)..." -ForegroundColor Cyan
Copy-Item -Recurse -Force (Join-Path $PSScriptRoot "..\public\build") (Join-Path $tempPublic "build")
Copy-Item -Force (Join-Path $PSScriptRoot "index.php") (Join-Path $tempPublic "index.php")
Copy-Item -Force (Join-Path $PSScriptRoot ".htaccess") (Join-Path $tempPublic ".htaccess")
$publicRoot = Join-Path $PSScriptRoot "..\public"
if (Test-Path (Join-Path $publicRoot "favicon.ico")) {
    Copy-Item -Force (Join-Path $publicRoot "favicon.ico") (Join-Path $tempPublic "favicon.ico")
}
if (Test-Path (Join-Path $publicRoot "robots.txt")) {
    Copy-Item -Force (Join-Path $publicRoot "robots.txt") (Join-Path $tempPublic "robots.txt")
}

Write-Host ">>> [4/4] Creating ZIP archives for cPanel upload..." -ForegroundColor Cyan
Compress-Archive -Path "$tempCore\*" -DestinationPath (Join-Path $distDir "dcp_core.zip") -Force
Compress-Archive -Path "$tempPublic\*" -DestinationPath (Join-Path $distDir "public_html.zip") -Force

# Clean up raw staging directories to keep only ZIPs
Remove-Item -Recurse -Force $tempCore, $tempPublic

Write-Host "`n=== cPanel Deployment Packages Ready! ===" -ForegroundColor Green
Write-Host "1. dcp_core.zip    -> Extract into /home/username/dcp_core" -ForegroundColor Yellow
Write-Host "2. public_html.zip -> Extract into /home/username/public_html" -ForegroundColor Yellow
Write-Host "Output Directory: $distDir`n" -ForegroundColor Green
