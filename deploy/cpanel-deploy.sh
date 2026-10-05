#!/usr/bin/env bash
# ==============================================================================
# DevCenterPoint Studio — cPanel Git Version Control deploy script
# ==============================================================================
# Runs on the server, from the cPanel Git working copy, on every
# "Update from Remote" / "Deploy HEAD Commit".
#
# Target layout (home /home/devcente):
#   $REPO    = ~/repositories/DevCenterPoint-Studio   (cPanel Git clone)
#   $CORE    = ~/dcp_core                             (private Laravel app)
#   $WEBROOT = ~/public_html                          (web root for the domain)
#
# Idempotent: safe to run repeatedly. Never deletes user uploads, never
# overwrites .env, never removes vendor/.
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# Configuration (overridable via environment variables)
# ------------------------------------------------------------------------------
REPO="${REPO:-$HOME/repositories/DevCenterPoint-Studio}"
CORE="${CORE:-$HOME/dcp_core}"
WEBROOT="${WEBROOT:-$HOME/public_html}"
APP_SRC="$REPO/backend"

# ------------------------------------------------------------------------------
# Output helpers
# ------------------------------------------------------------------------------
if [ -t 1 ]; then
  C_RESET="\033[0m"; C_INFO="\033[36m"; C_OK="\033[32m"; C_WARN="\033[33m"; C_ERR="\033[31m"
else
  C_RESET=""; C_INFO=""; C_OK=""; C_WARN=""; C_ERR=""
fi

step() { printf "${C_INFO}>>> %s${C_RESET}\n" "$1"; }
ok()   { printf "${C_OK}    + %s${C_RESET}\n" "$1"; }
warn() { printf "${C_WARN}    ! %s${C_RESET}\n" "$1"; }
fail() { printf "${C_ERR}    x %s${C_RESET}\n" "$1" >&2; }

# Resolve a usable PHP CLI binary (cPanel hosts vary a lot).
detect_php() {
  if command -v php >/dev/null 2>&1; then
    command -v php
    return 0
  fi
  for candidate in \
    /usr/local/bin/php \
    /usr/bin/php \
    /opt/cpanel/ea-php84/root/usr/bin/php \
    /opt/cpanel/ea-php83/root/usr/bin/php \
    /opt/cpanel/ea-php82/root/usr/bin/php
  do
    if [ -x "$candidate" ]; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

HAS_RSYNC=0
if command -v rsync >/dev/null 2>&1; then
  HAS_RSYNC=1
fi

# Mirror a directory into $dst, with a cp -R fallback for hosts without rsync.
sync_tree() {
  local src="$1" dst="$2"; shift 2
  if [ "$HAS_RSYNC" -eq 1 ]; then
    rsync -a --no-perms --no-owner --no-group "$@" "$src" "$dst"
  else
    mkdir -p "$dst"
    cp -Rf "$src"/. "$dst"/
  fi
}

# Copy a single file, creating the parent directory when needed.
sync_file() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  cp -f "$src" "$dst"
}

# ------------------------------------------------------------------------------
# 0. Pre-flight
# ------------------------------------------------------------------------------
step "Pre-flight checks"
[ -d "$APP_SRC" ] || { fail "Laravel app not found at $APP_SRC (is the repo layout intact?)"; exit 1; }
[ -f "$APP_SRC/artisan" ] || { fail "artisan not found in $APP_SRC"; exit 1; }

PHP_BIN=""
if PHP_BIN="$(detect_php)"; then
  ok "PHP CLI: $PHP_BIN ($("$PHP_BIN" -r 'echo PHP_VERSION;' 2>/dev/null))"
else
  PHP_BIN=""
  warn "No PHP CLI found on PATH; artisan tasks will be skipped."
fi

mkdir -p "$CORE" "$WEBROOT"
ok "Repository : $REPO"
ok "App target : $CORE"
ok "Web root   : $WEBROOT"

# ------------------------------------------------------------------------------
# 1. Sync the Laravel application into the private directory
#    NOTE: .env, vendor/, and runtime storage are never clobbered.
# ------------------------------------------------------------------------------
step "Syncing Laravel application into $CORE"

# Directories that make up the application code.
for item in app bootstrap config database resources routes storage; do
  if [ -d "$APP_SRC/$item" ]; then
    sync_tree "$APP_SRC/$item/" "$CORE/$item/" \
      --exclude '/.env' \
      --exclude '/.env.*' \
      --exclude '/framework/cache/' \
      --exclude '/framework/sessions/' \
      --exclude '/framework/views/' \
      --exclude '/logs/' \
      --exclude '/app/'
    ok "synced $item/"
  else
    warn "missing $item/ (skipped)"
  fi
done

# Top-level files.
for item in artisan composer.json; do
  if [ -f "$APP_SRC/$item" ]; then
    sync_file "$APP_SRC/$item" "$CORE/$item"
    ok "synced $item"
  else
    warn "missing $item (skipped)"
  fi
done

# ------------------------------------------------------------------------------
# 2. Ensure writable runtime directories exist
# ------------------------------------------------------------------------------
step "Ensuring runtime directories"
for dir in \
  "$CORE/storage/app/public" \
  "$CORE/storage/framework/cache/data" \
  "$CORE/storage/framework/sessions" \
  "$CORE/storage/framework/views" \
  "$CORE/storage/logs" \
  "$CORE/bootstrap/cache" \
  "$WEBROOT/build"
do
  mkdir -p "$dir"
done
chmod -R u+rwX "$CORE/storage" "$CORE/bootstrap/cache" 2>/dev/null || true
ok "storage/ and bootstrap/cache ready"

# ------------------------------------------------------------------------------
# 3. Composer dependencies (best effort; vendor/ may already be present)
# ------------------------------------------------------------------------------
step "Resolving PHP dependencies"
COMPOSER_BIN=""
if command -v composer >/dev/null 2>&1; then
  COMPOSER_BIN="$(command -v composer)"
elif [ -n "$PHP_BIN" ] && [ -f "$CORE/composer.phar" ]; then
  COMPOSER_BIN="$PHP_BIN $CORE/composer.phar"
fi

if [ -n "$COMPOSER_BIN" ]; then
  if ( cd "$CORE" && $COMPOSER_BIN install --no-dev --no-interaction --prefer-dist \
        --optimize-autoloader --no-progress ); then
    ok "composer install complete"
  else
    warn "composer install failed - continuing with the existing vendor/ directory"
  fi
else
  warn "composer not available - using the vendor/ directory already in $CORE"
fi

# ------------------------------------------------------------------------------
# 4. Publish compiled frontend assets + public entrypoint files
# ------------------------------------------------------------------------------
step "Publishing public assets to $WEBROOT"
if [ -d "$APP_SRC/public/build" ]; then
  sync_tree "$APP_SRC/public/build/" "$WEBROOT/build/" --delete
  ok "build/ assets published"
else
  warn "backend/public/build not found - did you commit the built assets?"
fi

for entry in index.php .htaccess; do
  if [ -f "$APP_SRC/cpanel_deploy/$entry" ]; then
    sync_file "$APP_SRC/cpanel_deploy/$entry" "$WEBROOT/$entry"
    ok "copied $entry"
  else
    warn "missing cpanel_deploy/$entry"
  fi
done

for entry in favicon.ico robots.txt; do
  if [ -f "$APP_SRC/public/$entry" ]; then
    sync_file "$APP_SRC/public/$entry" "$WEBROOT/$entry"
    ok "copied $entry"
  fi
done

# ------------------------------------------------------------------------------
# 5. Public storage symlink (media/uploads)
# ------------------------------------------------------------------------------
step "Linking public storage"
LINK_TARGET="$CORE/storage/app/public"
if [ -L "$WEBROOT/storage" ]; then
  rm -f "$WEBROOT/storage"
fi
if [ ! -e "$WEBROOT/storage" ]; then
  if ln -s "$LINK_TARGET" "$WEBROOT/storage" 2>/dev/null; then
    ok "storage -> $LINK_TARGET"
  else
    warn "could not create the storage symlink (artisan storage:link will retry)"
  fi
else
  ok "storage path already present"
fi

# ------------------------------------------------------------------------------
# 6. Artisan housekeeping (guarded: needs .env + PHP CLI)
# ------------------------------------------------------------------------------
step "Running Artisan tasks"
if [ -z "$PHP_BIN" ]; then
  warn "skipped - no PHP CLI available"
elif [ ! -f "$CORE/.env" ]; then
  warn "skipped - $CORE/.env does not exist yet. Create it from .env.example, then re-deploy."
else
  run_artisan() { ( cd "$CORE" && "$PHP_BIN" artisan "$@" ); }

  run_artisan config:clear >/dev/null 2>&1 || true
  run_artisan route:clear  >/dev/null 2>&1 || true
  run_artisan view:clear   >/dev/null 2>&1 || true
  run_artisan cache:clear  >/dev/null 2>&1 || true
  ok "caches cleared"

  if run_artisan migrate --force; then
    ok "migrations applied"
  else
    warn "migrations reported an issue (check the database connection in .env)"
  fi

  run_artisan storage:link >/dev/null 2>&1 || true

  run_artisan config:cache && ok "config cached" || warn "config:cache failed"
  run_artisan route:cache  && ok "routes cached"  || warn "route:cache failed"
  run_artisan view:cache   && ok "views cached"   || warn "view:cache failed"
fi

# ------------------------------------------------------------------------------
# Done
# ------------------------------------------------------------------------------
printf "\n${C_OK}=== Deployment complete ===${C_RESET}\n"
printf "  App   : %s\n" "$CORE"
printf "  Public: %s\n" "$WEBROOT"
printf "  Site  : https://devcenterpoint.com\n\n"
