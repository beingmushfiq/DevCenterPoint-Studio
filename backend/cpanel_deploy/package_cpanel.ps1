# ==============================================================================
# DevCenterPoint Studio - cPanel Deployment Packager
# ==============================================================================
# Produces the upload archives for the cPanel deploy. The repository ships
# source only (backend/vendor and backend/public/build are gitignored); the
# bulky generated trees travel in these zips instead.
#
# Pick the SMALLEST target that fits your change - most deploys need none at all:
#
#   -Target Frontend   (default)  ~1 min   upload public_html.zip
#       Rebuilds Vite and packs the compiled assets. Use after changing anything
#       under resources/ (React, Tailwind, CSS). Backend PHP changes need NO zip.
#
#   -Target Vendor     (rare)     ~1 min   upload vendor.zip
#       Packs backend/vendor. Use only after `composer.lock` / `composer.json`
#       changes. vendor/ is zipped straight from disk (no slow staging copy).
#
#   -Target All        both
#
# Backend/content-only changes (app/, config/, routes/, database/, Blade) are
# carried by Git and synced by deploy/cpanel-deploy.sh - do NOT pack anything.
#
# Safe by construction: the live .env, the SQLite database, and runtime storage
# (logs, cache, sessions, views) are never included, so extracting on the server
# cannot clobber production state.
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File backend/cpanel_deploy/package_cpanel.ps1
#   powershell -ExecutionPolicy Bypass -File backend/cpanel_deploy/package_cpanel.ps1 -Target Vendor
# ==============================================================================
[CmdletBinding()]
param(
    [ValidateSet('Frontend', 'Vendor', 'All')]
    [string] $Target = 'Frontend'
)

$ErrorActionPreference = "Stop"

$backendRoot  = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$distDir      = Join-Path $backendRoot "cpanel_dist"
$stagePublic  = Join-Path $distDir "stage/public_html"
$vendorSource = Join-Path $backendRoot "vendor"

$doFrontend = ($Target -eq 'Frontend' -or $Target -eq 'All')
$doVendor   = ($Target -eq 'Vendor'   -or $Target -eq 'All')

function Write-Step($msg) { Write-Host ">>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    + $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "    ! $msg" -ForegroundColor Yellow }

# Zip a directory using the .NET API (far faster than Compress-Archive on the
# ~27 MB vendor tree). Entry names are forced to use "/" so the archive extracts
# correctly with `unzip` on Linux.
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Zip-Directory {
    param(
        [Parameter(Mandatory)] [string] $Source,
        [Parameter(Mandatory)] [string] $Destination
    )
    $sourceRoot = (Resolve-Path $Source).Path.TrimEnd('\', '/')
    if (Test-Path $Destination) { Remove-Item -Force $Destination }

    $zip = [System.IO.Compression.ZipFile]::Open($Destination, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files = Get-ChildItem -File -Recurse -Force $sourceRoot
        foreach ($file in $files) {
            $rel = $file.FullName.Substring($sourceRoot.Length).TrimStart('\', '/')
            $entryName = $rel.Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $zip, $file.FullName, $entryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null
        }
    }
    finally {
        $zip.Dispose()
    }
}

Write-Host ""
Write-Host "=== DevCenterPoint Studio - cPanel packager (target: $Target) ===" -ForegroundColor White
Write-Host ""

New-Item -ItemType Directory -Force -Path $distDir | Out-Null

# ------------------------------------------------------------------------------
# Frontend: rebuild Vite and pack the web root
# ------------------------------------------------------------------------------
if ($doFrontend) {
    Write-Step "[1/2] Building frontend assets (Vite)"
    Push-Location $backendRoot
    try {
        if (-not (Test-Path (Join-Path $backendRoot "node_modules"))) {
            Write-Warn "node_modules missing - running npm ci"
            npm ci
        }
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "npm run build failed with exit code $LASTEXITCODE" }
    }
    finally {
        Pop-Location
    }

    if (-not (Test-Path (Join-Path $backendRoot "public/build/manifest.json"))) {
        throw "Build manifest not found at backend/public/build/manifest.json"
    }
    Write-Ok "Vite build complete (manifest present)"

    # Stage public_html: build/ + entrypoint + static assets at the zip root so
    # the archive extracts directly into ~/public_html.
    if (Test-Path $stagePublic) { Remove-Item -Recurse -Force $stagePublic }
    New-Item -ItemType Directory -Force -Path $stagePublic | Out-Null

    Copy-Item -Recurse -Force (Join-Path $backendRoot "public/build") (Join-Path $stagePublic "build")
    Copy-Item -Force (Join-Path $backendRoot "public/.htaccess")       (Join-Path $stagePublic ".htaccess")
    # The Laravel entrypoint that points at ../dcp_core.
    Copy-Item -Force (Join-Path $PSScriptRoot "index.php")             (Join-Path $stagePublic "index.php")

    foreach ($asset in @(
        "favicon.ico", "favicon.svg", "apple-touch-icon.png", "robots.txt", "llms.txt", "llms-full.txt",
        "logo.svg", "logo-horizontal.svg", "logo-mark.svg", "logo-mark-white.svg",
        "og-image.svg", "og-image.png", "google3dd4624b67199596.html"
    )) {
        $src = Join-Path (Join-Path $backendRoot "public") $asset
        if (Test-Path $src) { Copy-Item -Force $src (Join-Path $stagePublic $asset) }
    }

    $publicZip = Join-Path $distDir "public_html.zip"
    $t0 = Get-Date
    Zip-Directory -Source $stagePublic -Destination $publicZip
    Remove-Item -Recurse -Force (Join-Path $distDir "stage")
    Write-Ok ("public_html.zip created in {0:N1}s" -f ((Get-Date) - $t0).TotalSeconds)
}

# ------------------------------------------------------------------------------
# Vendor: pack Composer dependencies straight from disk (no staging copy)
# ------------------------------------------------------------------------------
if ($doVendor) {
    if (-not (Test-Path (Join-Path $vendorSource "autoload.php"))) {
        throw "vendor/autoload.php not found - run 'composer install' before packaging vendor."
    }

    Write-Step "[Vendor] Zipping Composer dependencies"
    $vendorZip = Join-Path $distDir "vendor.zip"
    $t1 = Get-Date
    Zip-Directory -Source $vendorSource -Destination $vendorZip
    Write-Ok ("vendor.zip created in {0:N1}s" -f ((Get-Date) - $t1).TotalSeconds)
}

# ------------------------------------------------------------------------------
# Summary + next steps
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "=== cPanel deployment packages ready ===" -ForegroundColor Green

$uploads = @()
if ($doFrontend) {
    $mb = "{0:N1}" -f ((Get-Item (Join-Path $distDir "public_html.zip")).Length / 1MB)
    Write-Host "  public_html.zip ($mb MB)  -> extract into ~/public_html" -ForegroundColor Yellow
    $uploads += "public_html.zip"
}
if ($doVendor) {
    $mb = "{0:N1}" -f ((Get-Item (Join-Path $distDir "vendor.zip")).Length / 1MB)
    Write-Host "  vendor.zip      ($mb MB)  -> extract into ~/dcp_core/vendor" -ForegroundColor Yellow
    $uploads += "vendor.zip"
}
Write-Host "  Output: $distDir" -ForegroundColor Green

if ($uploads.Count -gt 0) {
    $names = $uploads -join ", "
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  1. Upload $names into ~/cpanel_uploads on the server (File Manager)." -ForegroundColor Gray
    Write-Host "  2. cPanel > Terminal:" -ForegroundColor Gray
    Write-Host "       cd ~/repositories/DevCenterPoint-Studio && git pull" -ForegroundColor Gray
    Write-Host "       bash deploy/cpanel-deploy.sh" -ForegroundColor Gray
    Write-Host "     The deploy script auto-applies any archives found in ~/cpanel_uploads." -ForegroundColor Gray
}
Write-Host ""
