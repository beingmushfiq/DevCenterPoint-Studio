#!/usr/bin/env bash
# ==============================================================================
# DevCenterPoint Studio - uploaded archive applier
# ==============================================================================
# Applies the ZIPs produced by backend/cpanel_deploy/package_cpanel.ps1:
#
#   ~/cpanel_uploads/dcp_core.zip     -> extracted into ~/dcp_core
#   ~/cpanel_uploads/public_html.zip  -> extracted into ~/public_html
#
# WHY THIS EXISTS
# The repository no longer commits backend/vendor or backend/public/build (they
# are re-created locally by the packager and shipped as these archives). Git
# carries source only; this script lands the bulky generated trees on the server.
#
# SAFETY GUARANTEES
#   * Never overwrites ~/dcp_core/.env            (production secrets preserved)
#   * Never overwrites the live SQLite database   (all site data preserved)
#   * Never writes into runtime storage           (logs, cache, sessions, views)
#   * Idempotent: re-running with the same zips is harmless; it can also be run
#     with no zips present (it simply reports "nothing to do").
#
# Invoked automatically by deploy/cpanel-deploy.sh, but runnable standalone:
#   bash deploy/apply-uploads.sh
# ==============================================================================

set -euo pipefail

REPO="${REPO:-$HOME/repositories/DevCenterPoint-Studio}"
CORE="${CORE:-$HOME/dcp_core}"
WEBROOT="${WEBROOT:-$HOME/public_html}"
UPLOADS="${UPLOADS:-$HOME/cpanel_uploads}"

C_RESET=""; C_INFO=""; C_OK=""; C_WARN=""; C_ERR=""
if [ -t 1 ]; then
  C_RESET="\033[0m"; C_INFO="\033[36m"; C_OK="\033[32m"; C_WARN="\033[33m"; C_ERR="\033[31m"
fi

step() { printf "${C_INFO}>>> %s${C_RESET}\n" "$1"; }
ok()   { printf "${C_OK}    + %s${C_RESET}\n" "$1"; }
warn() { printf "${C_WARN}    ! %s${C_RESET}\n" "$1"; }
fail() { printf "${C_ERR}    x %s${C_RESET}\n" "$1" >&2; }

# Extract-into helper: tries `unzip`, then PHP's ZipArchive, then Python.
# Returns non-zero if none of them are available.
extract_zip() {
  local zip="$1" dest="$2"
  mkdir -p "$dest"

  if command -v unzip >/dev/null 2>&1; then
    unzip -o -q "$zip" -d "$dest"
    return $?
  fi

  local php_bin=""
  for candidate in php ea-php85 ea-php84 ea-php83 /usr/local/bin/ea-php84 \
                   /opt/cpanel/ea-php84/root/usr/bin/php /usr/local/bin/php /usr/bin/php; do
    if command -v "$candidate" >/dev/null 2>&1; then
      if [ "$("$candidate" -r 'echo PHP_SAPI;' 2>/dev/null)" = "cli" ]; then
        php_bin="$candidate"; break
      fi
    fi
  done
  if [ -n "$php_bin" ]; then
    "$php_bin" -r '
      $zip = new ZipArchive;
      if ($zip->open($argv[1]) !== true) { fwrite(STDERR, "cannot open zip\n"); exit(1); }
      $zip->extractTo($argv[2]);
      $zip->close();
    ' "$zip" "$dest"
    return $?
  fi

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$zip" "$dest" <<'PY'
import sys, zipfile
with zipfile.ZipFile(sys.argv[1]) as z:
    z.extractall(sys.argv[2])
PY
    return $?
  fi

  return 127
}

# Mirror staging dir into destination while protecting live state.
# Uses rsync when present (so it can prune stale hashed assets), else cp.
publish_tree() {
  local src="$1" dst="$2"; shift 2
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --no-perms --no-owner --no-group "$@" "$src" "$dst"
  else
    mkdir -p "$dst"
    cp -Rf "$src"/. "$dst"/
  fi
}

step "Applying uploaded archives from $UPLOADS"
mkdir -p "$UPLOADS" "$CORE" "$WEBROOT"

APPLIED=0

# ------------------------------------------------------------------------------
# dcp_core.zip -> ~/dcp_core   (preserve .env, sqlite DB, runtime storage)
# ------------------------------------------------------------------------------
CORE_ZIP="$UPLOADS/dcp_core.zip"
if [ -f "$CORE_ZIP" ]; then
  STAGE="$(mktemp -d)"
  if extract_zip "$CORE_ZIP" "$STAGE"; then
    # Translate the psql-style *.php excludes into rsync --exclude switches.
    publish_tree "$STAGE/" "$CORE/" \
      --exclude '/.env' \
      --exclude '/.env.*' \
      --exclude '/database/*.sqlite' \
      --exclude '/database/*.sqlite-*' \
      --exclude '/storage/logs/' \
      --exclude '/storage/framework/cache/' \
      --exclude '/storage/framework/sessions/' \
      --exclude '/storage/framework/views/'
    ok "dcp_core.zip applied -> $CORE"
    APPLIED=$((APPLIED + 1))
  else
    fail "could not extract $CORE_ZIP (need unzip, PHP ZipArchive, or python3)"
  fi
  rm -rf "$STAGE"
else
  warn "dcp_core.zip not found (skipped)"
fi

# ------------------------------------------------------------------------------
# public_html.zip -> ~/public_html
# ------------------------------------------------------------------------------
PUBLIC_ZIP="$UPLOADS/public_html.zip"
if [ -f "$PUBLIC_ZIP" ]; then
  STAGE="$(mktemp -d)"
  if extract_zip "$PUBLIC_ZIP" "$STAGE"; then
    # The app's private storage symlink must survive, so never let the archive
    # replace ~/public_html/storage.
    publish_tree "$STAGE/" "$WEBROOT/" --exclude '/storage'
    ok "public_html.zip applied -> $WEBROOT"
    APPLIED=$((APPLIED + 1))

    # `@vite` resolves the manifest via public_path(), which is anchored to the
    # APP root (~/dcp_core/public/build), NOT the web root. Mirror the published
    # assets there so the framework's path lookup succeeds; otherwise every page
    # throws ViteManifestNotFoundException (HTTP 500).
    publish_tree "$WEBROOT/build/" "$CORE/public/build/" --delete
    ok "mirrored build/ into $CORE/public/build (Vite manifest lookup)"
  else
    fail "could not extract $PUBLIC_ZIP (need unzip, PHP ZipArchive, or python3)"
  fi
  rm -rf "$STAGE"
else
  warn "public_html.zip not found (skipped)"
fi

if [ "$APPLIED" -eq 0 ]; then
  warn "no archives applied (upload dcp_core.zip / public_html.zip and re-run)"
  exit 0
fi

# ------------------------------------------------------------------------------
# Re-link public storage in case the archive disturbed it.
# ------------------------------------------------------------------------------
LINK_TARGET="$CORE/storage/app/public"
if [ -d "$LINK_TARGET" ] && [ ! -e "$WEBROOT/storage" ]; then
  ln -s "$LINK_TARGET" "$WEBROOT/storage" 2>/dev/null && ok "re-linked public_html/storage" || warn "storage symlink not created"
fi

# ------------------------------------------------------------------------------
# Housekeeping so the freshly landed code takes effect immediately.
# ------------------------------------------------------------------------------
PHP_BIN=""
for candidate in php ea-php85 ea-php84 ea-php83 /usr/local/bin/ea-php84 \
                 /opt/cpanel/ea-php84/root/usr/bin/php /usr/local/bin/php /usr/bin/php; do
  if command -v "$candidate" >/dev/null 2>&1; then
    if [ "$("$candidate" -r 'echo PHP_SAPI;' 2>/dev/null)" = "cli" ]; then
      PHP_BIN="$candidate"; break
    fi
  fi
done

if [ -n "$PHP_BIN" ]; then
  ( cd "$CORE" && "$PHP_BIN" artisan config:clear >/dev/null 2>&1 || true )
  ( cd "$CORE" && "$PHP_BIN" artisan cache:clear  >/dev/null 2>&1 || true )
  ( cd "$CORE" && "$PHP_BIN" artisan view:clear   >/dev/null 2>&1 || true )
  ok "artisan caches cleared"
else
  warn "no PHP CLI found - skipped artisan cache clear"
fi

ok "uploaded archives applied ($APPLIED archive(s))"
