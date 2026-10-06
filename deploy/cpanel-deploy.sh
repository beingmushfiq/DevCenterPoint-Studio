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
# dotenv helpers — read and set a single key while leaving the rest of the file
# (APP_KEY, MAIL_*, everything) completely intact.
# ------------------------------------------------------------------------------
env_get() {
  local file="$1" key="$2"
  [ -f "$file" ] || return 1
  # `|` as the delimiter so values containing `/` (paths) survive.
  sed -n "s|^${key}=||p" "$file" | tail -n 1
}

# Replaces `KEY=...` in place, or appends it when absent. Written via awk so
# backslashes, `&`, and `/` in the value need no escaping.
env_set() {
  local file="$1" key="$2" value="$3"
  [ -f "$file" ] || return 1
  awk -v k="$key" -v v="$value" '
    $0 ~ "^" k "=" { print k "=" v; found = 1; next }
    { print }
    END { if (!found) print k "=" v }
  ' "$file" > "$file.tmp" && mv -f "$file.tmp" "$file"
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

  # SQLite is the production database, so the PDO driver is a hard requirement.
  # Without it Laravel throws "could not find driver" on the first request.
  if "$PHP_BIN" -m 2>/dev/null | grep -qi '^pdo_sqlite'; then
    ok "pdo_sqlite available"
  else
    fail "pdo_sqlite is NOT enabled for this PHP build."
    fail "Enable it in cPanel > MultiPHP INI Editor > 'extension=pdo_sqlite', or"
    fail "switch the account to a PHP version that ships it, then re-deploy."
    exit 1
  fi
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

# The live SQLite database holds the entire site's data. Preserve it across the
# sync: rsync gets an --exclude below, but the `cp` fallback ignores excludes.
SQLITE_BACKUP=""
if [ -f "$CORE/database/database.sqlite" ]; then
  SQLITE_BACKUP="$(mktemp)"
  cp -f "$CORE/database/database.sqlite" "$SQLITE_BACKUP"
fi

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
      --exclude '/app/' \
      --exclude '*.sqlite' \
      --exclude '*.sqlite-*'
    ok "synced $item/"
  else
    warn "missing $item/ (skipped)"
  fi
done

# public/ must exist inside $CORE as well as $WEBROOT.
# `@vite` resolves the manifest with public_path(), which is anchored to the app
# root ($CORE/public), NOT the web root. Publishing build/ to $WEBROOT alone
# leaves that path missing, so Laravel throws ViteManifestNotFoundException and
# every page returns HTTP 500. $WEBROOT serves the files; $CORE/public satisfies
# the framework's path lookup.
if [ -d "$APP_SRC/public" ]; then
  sync_tree "$APP_SRC/public/" "$CORE/public/" \
    --exclude '/hot' \
    --exclude '/storage' \
    --exclude '*.sqlite' \
    --exclude '*.sqlite-*'
  # A stray `hot` file makes Vite assume a dev server is running and emit
  # localhost URLs. It is gitignored, but strip it defensively.
  rm -f "$CORE/public/hot"
  ok "synced public/ into app root (manifest at \$CORE/public/build)"
else
  warn "missing public/ (skipped)"
fi

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

# Restore the live SQLite database that was preserved before the sync. Done with
# the WAL sidecars removed so the restored file is read from a clean state.
if [ -n "$SQLITE_BACKUP" ]; then
  mkdir -p "$CORE/database"
  cp -f "$SQLITE_BACKUP" "$CORE/database/database.sqlite"
  rm -f "$CORE/database/database.sqlite-wal" "$CORE/database/database.sqlite-shm"
  rm -f "$SQLITE_BACKUP"
  ok "preserved live database.sqlite across sync"
fi

# ------------------------------------------------------------------------------
# 1b. Apply uploaded archives (vendor/ + compiled assets)
#     The repository ships source only. The bulky generated trees
#     (backend/vendor and backend/public/build) arrive as the archives
#     ~/cpanel_uploads/vendor.zip and public_html.zip, produced locally by:
#       backend/cpanel_deploy/package_cpanel.ps1 -Target All
#     The applier is non-destructive: it never touches ~/dcp_core/.env, the live
#     SQLite database, or runtime storage.
# ------------------------------------------------------------------------------
step "Applying uploaded archives (if any)"
REPO="$REPO" CORE="$CORE" WEBROOT="$WEBROOT" bash "$REPO/deploy/apply-uploads.sh" \
  || warn "apply-uploads.sh reported an issue - continuing with repo-provided files"

# Composer dependencies. $WEBROOT/index.php hard-requires
# "$CORE/vendor/autoload.php", so vendor/ must be present. It normally arrives
# inside vendor.zip (applied above); a committed vendor/ is still honoured for
# backwards compatibility.
if [ -d "$APP_SRC/vendor" ]; then
  sync_tree "$APP_SRC/vendor/" "$CORE/vendor/"
  ok "synced vendor/ from the repository ($(find "$CORE/vendor" -type f | wc -l | tr -d ' ') files)"
elif [ -f "$CORE/vendor/autoload.php" ]; then
  ok "vendor/ already present from the uploaded archive ($(find "$CORE/vendor" -type f | wc -l | tr -d ' ') files)"
else
  warn "vendor/ missing - upload vendor.zip to ~/cpanel_uploads, or commit vendor/, or install Composer"
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
  ok "build/ assets published from the repository"
elif [ -f "$WEBROOT/build/manifest.json" ]; then
  ok "build/ assets already present from public_html.zip"
else
  warn "no compiled assets found - upload public_html.zip to ~/cpanel_uploads, or run the local packager"
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
for entry in favicon.ico favicon.svg apple-touch-icon.png robots.txt llms.txt llms-full.txt \
             logo.svg logo-horizontal.svg logo-mark.svg logo-mark-white.svg \
             og-image.svg og-image.png google3dd4624b67199596.html; do
  if [ -f "$APP_SRC/public/$entry" ]; then
    sync_file "$APP_SRC/public/$entry" "$WEBROOT/$entry"
    ok "copied $entry"
  fi
done

# sitemap.xml is now generated by the /sitemap.xml route. A leftover static file
# would satisfy Apache's `RewriteCond !-f` and shadow the route, so remove it.
if [ -f "$WEBROOT/sitemap.xml" ]; then
  rm -f "$WEBROOT/sitemap.xml"
  ok "removed stale static sitemap.xml (served by /sitemap.xml route)"
fi
rm -f "$CORE/public/sitemap.xml"

# Fail fast on the two conditions that produce an unreadable HTTP 500.
# `@vite` aborts the whole request when the manifest is unreadable, so catching
# it here turns a silent outage into an explicit deploy error.
MANIFEST_CORE="$CORE/public/build/manifest.json"
if [ ! -f "$MANIFEST_CORE" ]; then
  fail "Vite manifest missing at $MANIFEST_CORE"
  fail "Without it every page returns HTTP 500 (ViteManifestNotFoundException)."
  exit 1
fi
if [ ! -r "$MANIFEST_CORE" ]; then
  fail "Vite manifest is not readable: $MANIFEST_CORE"
  exit 1
fi
ok "Vite manifest present: $MANIFEST_CORE"

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
    else
      warn "no .env template found - create $CORE/.env manually"
    fi
  else
    ok ".env already present (left untouched)"
  fi

  # ---------------------------------------------------------------------------
  # 6a-bis. Reconcile the database config.
  #     An existing .env may still point at MySQL with credentials that are
  #     stale (a `#` in a password truncates it, producing "Access denied").
  #     SQLite needs no credentials, so switching is safe and idempotent.
  #     Only DB_CONNECTION / DB_DATABASE are touched; every other key,
  #     including APP_KEY and MAIL_*, is left exactly as it was.
  # ---------------------------------------------------------------------------
  if [ -f "$CORE/.env" ]; then
    SQLITE_FILE="$CORE/database/database.sqlite"
    CURRENT_DRIVER="$(env_get "$CORE/.env" DB_CONNECTION || true)"

    if [ "$CURRENT_DRIVER" != "sqlite" ]; then
      mkdir -p "$CORE/database"
      env_set "$CORE/.env" DB_CONNECTION sqlite
      env_set "$CORE/.env" DB_DATABASE "$SQLITE_FILE"
      # The old DB_HOST/DB_USERNAME/DB_PASSWORD lines are left in place: they are
      # inert while the driver is sqlite, and keeping them makes a switch back to
      # MySQL a one-line change.
      warn "switched DB_CONNECTION '$CURRENT_DRIVER' -> 'sqlite' in .env"
    fi

    # An absolute DB_DATABASE is required; a relative path resolves unpredictably
    # under cPanel's document-root / CLI working-directory split.
    DB_PATH_NOW="$(env_get "$CORE/.env" DB_DATABASE || true)"
    case "$DB_PATH_NOW" in
      /*) ok "DB_DATABASE=$DB_PATH_NOW" ;;
      *)  env_set "$CORE/.env" DB_DATABASE "$SQLITE_FILE"
          ok "DB_DATABASE set to $SQLITE_FILE" ;;
    esac

    # Create the database file up front so the very first request never 500s on
    # a missing file, even before `migrate` has a chance to run.
    [ -f "$SQLITE_FILE" ] || { touch "$SQLITE_FILE"; ok "created database.sqlite"; }
    chmod u+rw "$SQLITE_FILE" 2>/dev/null || true
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
