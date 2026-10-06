# ==============================================================================
# DevCenterPoint Studio - cPanel Deployment Packager
# ==============================================================================
# Builds the Vite assets and produces two upload archives:
#
#   backend/cpanel_dist/dcp_core.zip     -> extract into ~/dcp_core
#   backend/cpanel_dist/public_html.zip  -> extract into ~/public_html
#
# This replaces committing backend/vendor and backend/public/build to the
# repository. Only source code travels through Git; the bulky generated trees
# ship in these zips.
#
# Safe by construction: the live .env and the SQLite database are NEVER included,
# and runtime storage (logs, cache, sessions, views) is stripped, so extracting
# the archive on the server cannot clobber production state.
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File backend/cpanel_deploy/package_cpanel.ps1
# ==============================================================================
$ErrorActionPreference = "Stop"

$backendRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$distDir     = Join-Path $backendRoot "cpanel_dist"
$stageCore   = Join-Path $distDir "stage/dcp_core"
$stagePublic = Join-Path $distDir "stage/public_html"

function Write-Step($msg) { Write-Host ">>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    + $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "    ! $msg" -ForegroundColor Yellow }

Write-Host ""
Write-Host "=== DevCenterPoint Studio - cPanel packager ===" -ForegroundColor White
Write-Host ""

# ------------------------------------------------------------------------------
# 1. Compile production frontend assets
# ------------------------------------------------------------------------------
Write-Step "[1/4] Building frontend assets (Vite)"
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

# ------------------------------------------------------------------------------
# 2. Fresh staging directories
# ------------------------------------------------------------------------------
if (Test-Path $distDir) { Remove-Item -Recurse -Force $distDir }
New-Item -ItemType Directory -Force -Path $stageCore, $stagePublic | Out-Null

# Copy a path into a destination, honouring a set of filesystem-name excludes.
function Copy-Tree {
    param(
        [Parameter(Mandatory)] [string] $Source,
        [Parameter(Mandatory)] [string] $Destination,
        [string[]] $ExcludeDirs  = @(),
        [string[]] $ExcludeFiles = @()
    )
    if (-not (Test-Path $Source)) { return }

    $item = Get-Item $Source
    if ($item.PSIsContainer) {
        New-Item -ItemType Directory -Force -Path $Destination | Out-Null
        foreach ($child in Get-ChildItem -Force $Source) {
            if ($child.PSIsContainer -and ($ExcludeDirs -contains $child.Name)) { continue }
            if (-not $child.PSIsContainer) {
                $excluded = $false
                foreach ($pattern in $ExcludeFiles) {
                    if ($child.Name -like $pattern) { $excluded = $true; break }
                }
                if ($excluded) { continue }
            }
            Copy-Tree -Source $child.FullName -Destination (Join-Path $Destination $child.Name) `
                      -ExcludeDirs $ExcludeDirs -ExcludeFiles $ExcludeFiles
        }
    }
    else {
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
        Copy-Item -Force $Source $Destination
    }
}

# ------------------------------------------------------------------------------
# 3. Stage dcp_core (private Laravel application)
# ------------------------------------------------------------------------------
Write-Step "[2/4] Staging dcp_core (private Laravel app + vendor)"

# Runtime + secret directories that must never ship in the archive.
$coreExcludeDirs = @(".git", ".idea", ".vscode", "node_modules", "cpanel_dist")
# Runtime storage subdirectories are recreated empty below.
$storageExcludeDirs = @("cache", "sessions", "views", "logs", "testing", "pail")

foreach ($item in @("app", "bootstrap", "config", "database", "public", "resources", "routes", "vendor")) {
    $src = Join-Path $backendRoot $item
    if ($item -eq "public") { continue }  # handled in the web-root section
    if (Test-Path $src) {
        Copy-Tree -Source $src -Destination (Join-Path $stageCore $item) `
                  -ExcludeDirs $coreExcludeDirs `
                  -ExcludeFiles @(".env", ".env.production", ".env.backup", "*.sqlite", "*.sqlite-*", "*.log", "hot")
    }
}

# storage/ - copy the skeleton but strip runtime output.
Copy-Tree -Source (Join-Path $backendRoot "storage") -Destination (Join-Path $stageCore "storage") `
          -ExcludeDirs $storageExcludeDirs -ExcludeFiles @("*.log", "*.sqlite", "*.sqlite-*")

# Recreate the empty runtime directories the app expects to exist.
foreach ($sDir in @(
    "storage/app/public",
    "storage/app/private",
    "storage/framework/cache/data",
    "storage/framework/sessions",
    "storage/framework/views",
    "storage/framework/testing",
    "storage/logs",
    "bootstrap/cache"
)) {
    New-Item -ItemType Directory -Force -Path (Join-Path $stageCore $sDir) | Out-Null
}

# Top-level application files. `.env.production.example` becomes the server's
# first-run .env template; the real .env is intentionally absent.
foreach ($file in @("artisan", "composer.json", "composer.lock", ".env.production.example")) {
    $src = Join-Path $backendRoot $file
    if (Test-Path $src) {
        Copy-Item -Force $src (Join-Path $stageCore $file)
    }
    else {
        Write-Warn "missing $file (skipped)"
    }
}
Write-Ok "dcp_core staged"

# ------------------------------------------------------------------------------
# 4. Stage public_html (web root)
# ------------------------------------------------------------------------------
Write-Step "[3/4] Staging public_html (web root)"

Copy-Tree -Source (Join-Path $backendRoot "public/build") -Destination (Join-Path $stagePublic "build")
Copy-Item -Force (Join-Path $backendRoot "public/.htaccess") (Join-Path $stagePublic ".htaccess")

# The Laravel entrypoint file that points at ../dcp_core.
Copy-Item -Force (Join-Path $PSScriptRoot "index.php") (Join-Path $stagePublic "index.php")

# Static, non-hashed assets served straight from the web root.
foreach ($asset in @(
    "favicon.ico", "favicon.svg", "apple-touch-icon.png", "robots.txt", "llms.txt", "llms-full.txt",
    "logo.svg", "logo-horizontal.svg", "logo-mark.svg", "logo-mark-white.svg",
    "og-image.svg", "og-image.png", "google3dd4624b67199596.html"
)) {
    $src = Join-Path (Join-Path $backendRoot "public") $asset
    if (Test-Path $src) {
        Copy-Item -Force $src (Join-Path $stagePublic $asset)
    }
}
Write-Ok "public_html staged"

# ------------------------------------------------------------------------------
# 5. Create the ZIP archives
# ------------------------------------------------------------------------------
Write-Step "[4/4] Creating ZIP archives"

$coreZip   = Join-Path $distDir "dcp_core.zip"
$publicZip = Join-Path $distDir "public_html.zip"

# Use the .NET ZipFile API instead of Compress-Archive - it is dramatically
# faster on the ~27 MB vendor tree (thousands of small files).
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Entry names are forced to use "/" separators so the archive extracts correctly
# with `unzip` on Linux (Windows-created archives may otherwise use "\").
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

$t0 = Get-Date
Zip-Directory -Source $stageCore -Destination $coreZip
Write-Ok ("dcp_core.zip created in {0:N1}s" -f ((Get-Date) - $t0).TotalSeconds)

$t1 = Get-Date
Zip-Directory -Source $stagePublic -Destination $publicZip
Write-Ok ("public_html.zip created in {0:N1}s" -f ((Get-Date) - $t1).TotalSeconds)

Remove-Item -Recurse -Force (Join-Path $distDir "stage")

$coreMb   = "{0:N1}" -f ((Get-Item $coreZip).Length   / 1MB)
$publicMb = "{0:N1}" -f ((Get-Item $publicZip).Length / 1MB)

Write-Host ""
Write-Host "=== cPanel deployment packages ready ===" -ForegroundColor Green
Write-Host "  dcp_core.zip    ($coreMb MB)  -> extract into ~/dcp_core"       -ForegroundColor Yellow
Write-Host "  public_html.zip ($publicMb MB)  -> extract into ~/public_html"  -ForegroundColor Yellow
Write-Host "  Output: $distDir" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Upload both zips into ~/cpanel_uploads on the server (File Manager)." -ForegroundColor Gray
Write-Host "  2. In cPanel -> Git Version Control: 'Update from Remote' then 'Deploy HEAD Commit'." -ForegroundColor Gray
Write-Host "     The deploy script auto-extracts any zips found in ~/cpanel_uploads." -ForegroundColor Gray
Write-Host ""
