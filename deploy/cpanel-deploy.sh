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
# Many cPanel hosts put a *CGI* build first on PATH. Running artisan through it
# emits HTTP headers and silently drops the command name, so every candidate is
# verified to be the `cli` SAPI before being accepted.
is_php_cli() {
  local bin
  bin="$(command -v "$1" 2>/dev/null)" || return 1
  [ -x "$bin" ] || return 1
  [ "$("$bin" -r 'echo PHP_SAPI;' 2>/dev/null)" = "cli" ]
}

detect_php() {
  local candidate
  for candidate in \
    php \
    ea-php85 \
    ea-php84 \
    ea-php83 \
    /usr/local/bin/ea-php85 \
    /usr/local/bin/ea-php84 \
    /usr/local/bin/ea-php83 \
    /opt/cpanel/ea-php85/root/usr/bin/php \
    /opt/cpanel/ea-php84/root/usr/bin/php \
    /opt/cpanel/ea-php83/root/usr/bin/php \
    /opt/cpanel/ea-php82/root/usr/bin/php \
    /usr/local/bin/php \
    /usr/bin/php
  do
    if is_php_cli "$candidate"; then
      command -v "$candidate" 2>/dev/null || echo "$candidate"
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

# Top-level files. composer.lock travels with the code so `composer install`
# resolves the exact dependency versions that were tested locally.
for item in artisan composer.json composer.lock .env.production.example; do
  if [ -f "$APP_SRC/$item" ]; then
    sync_file "$APP_SRC/$item" "$CORE/$item"
    ok "synced $item"
  else
    warn "missing $item (skipped)"
  fi
done

# Composer dependencies. vendor/ IS committed to the repository because the
# cPanel host may not ship a Composer binary, and $WEBROOT/index.php
# hard-requires "$CORE/vendor/autoload.php". Synced as a whole tree (its own
# call so the storage-oriented --exclude flags above do not strip package
# internals such as a vendored `app/` or `logs/` directory).
if [ -d "$APP_SRC/vendor" ]; then
  sync_tree "$APP_SRC/vendor/" "$CORE/vendor/" --delete
  ok "synced vendor/ ($(find "$CORE/vendor" -type f | wc -l | tr -d ' ') files)"
else
  warn "vendor/ missing from the repository - the host will need Composer to install it"
fi

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

# Static site assets served straight from the web root (logos, favicon, SEO files).
# These are referenced by absolute URL (e.g. /logo-horizontal.svg) in the React components.
for entry in favicon.ico favicon.svg apple-touch-icon.png robots.txt sitemap.xml llms.txt llms-full.txt \
             logo.svg logo-horizontal.svg logo-mark.svg logo-mark-white.svg \
             og-image.svg og-image.png google3dd4624b67199596.html; do
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
else
  # ---------------------------------------------------------------------------
  # 6a. Bootstrap .env on the very first deploy
  #     Prefers .env.production.example; never overwrites an existing .env.
  # ---------------------------------------------------------------------------
  if [ ! -f "$CORE/.env" ]; then
    ENV_TEMPLATE=""
    if [ -f "$CORE/.env.production.example" ]; then
      ENV_TEMPLATE="$CORE/.env.production.example"
    elif [ -f "$APP_SRC/.env.example" ]; then
      ENV_TEMPLATE="$APP_SRC/.env.example"
      sync_file "$APP_SRC/.env.example" "$CORE/.env.example"
    fi

    if [ -n "$ENV_TEMPLATE" ]; then
      cp -f "$ENV_TEMPLATE" "$CORE/.env"
      ok "created .env from $(basename "$ENV_TEMPLATE")"
      warn "fill in DB_PASSWORD / MAIL_* in $CORE/.env, then re-deploy to run migrations"
    else
      warn "no .env template found - create $CORE/.env manually"
    fi
  else
    ok ".env already present (left untouched)"
  fi

  run_artisan() { ( cd "$CORE" && "$PHP_BIN" artisan "$@" ); }

  # ---------------------------------------------------------------------------
  # 6b. Ensure APP_KEY exists (required for encryption / sessions)
  # ---------------------------------------------------------------------------
  if [ -f "$CORE/.env" ]; then
    if grep -q '^APP_KEY=$' "$CORE/.env" || ! grep -q '^APP_KEY=base64:' "$CORE/.env"; then
      if run_artisan key:generate --force >/dev/null 2>&1; then
        ok "APP_KEY generated"
      else
        warn "could not generate APP_KEY - run 'php artisan key:generate' manually"
      fi
    else
      ok "APP_KEY already set"
    fi
  fi

  # ---------------------------------------------------------------------------
  # 6c. Clear stale caches before migrating
  # ---------------------------------------------------------------------------
  run_artisan config:clear >/dev/null 2>&1 || true
  run_artisan route:clear  >/dev/null 2>&1 || true
  run_artisan view:clear   >/dev/null 2>&1 || true
  run_artisan cache:clear  >/dev/null 2>&1 || true
  ok "caches cleared"

  # ---------------------------------------------------------------------------
  # 6d. Migrate, then seed ONLY when the database is empty.
  #     This gives a fresh server its CMS content and admin user without ever
  #     resetting the admin password on subsequent deploys.
  # ---------------------------------------------------------------------------
  if run_artisan migrate --force; then
    ok "migrations applied"

    # `|| true` keeps `set -e`/`pipefail` from aborting the deploy if tinker
    # cannot reach the database; the empty result is handled below.
    USER_COUNT="$(run_artisan tinker --execute='echo App\Models\User::count();' 2>/dev/null | tr -cd '0-9' || true)"
    if [ "$USER_COUNT" = "0" ]; then
      if run_artisan db:seed --force; then
        ok "database seeded with initial CMS content"
      else
        warn "db:seed failed - run 'php artisan db:seed --force' manually"
      fi
    elif [ -n "$USER_COUNT" ]; then
      ok "database already seeded ($USER_COUNT users) - seed skipped"
    else
      warn "could not read the user count - seed skipped (run db:seed manually if needed)"
    fi
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
