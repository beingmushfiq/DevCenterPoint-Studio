# DevCenterPoint (devcenterpoint.com) — cPanel Production Deployment Guide

This guide details the complete deployment workflow for **DevCenterPoint** on cPanel hosting.

---

> **NOTE — canonical deployment method.** The production site for `devcenterpoint.com` is the
> **full-stack Laravel + Inertia app** (`backend/`), deployed automatically via **cPanel Git Version
> Control** using `.cpanel.yml` → `deploy/cpanel-deploy.sh`.
> That is the only method that keeps the CMS, inquiries, newsletter, and header/footer templates online.
>
> The manual upload methods below are **legacy** and are retained for reference only. In particular,
> the standalone SPA archive (`dist-cpanel.zip`) is **no longer the recommended path** — the root
> `src/` app is a design reference; it has no CMS and would take `/admin` and the form endpoints offline.

---

## Deployment Architecture Overview

Two deployment shapes exist in this repository:

### Canonical: Full-Stack Laravel + Inertia CMS (Git-driven, recommended)
- **Deployment method**: cPanel **Git Version Control** running `.cpanel.yml` → `deploy/cpanel-deploy.sh`
- **Target Layout**:
  1. `~/dcp_core` → private Laravel application (outside the web root)
  2. `~/public_html` → web root for `devcenterpoint.com`
- **Features**: Admin CMS dashboard (`/admin`), customizable header/footer templates, dynamic lead capture, newsletter subscriptions, and database persistence.

### Legacy: Standalone React SPA (manual upload)
- **Deployment Archive**: `dist-cpanel.zip` (built from the root `src/` app)
- **Target Location**: `/public_html`
- **Features**: Static serving only — no CMS, no admin, no form persistence.

---

## Method 1: Deploying the Standalone SPA (Legacy)

### Step 1: Upload Archive to cPanel
1. Log in to your **cPanel** account.
2. Open **File Manager** from the *Files* section.
3. Navigate into the **`public_html`** directory (or your addon domain folder for `devcenterpoint.com`).
4. Click **Upload** in the top toolbar.
5. Upload **`dist-cpanel.zip`** from your project root.

### Step 2: Extract & Organize
1. Right-click `dist-cpanel.zip` inside `public_html` and select **Extract**.
2. Confirm the extraction path is `/public_html/`.
3. Verify that the following files are present directly in `public_html`:
   - `index.html`
   - `.htaccess`
   - `assets/` (contains CSS & JS bundles)
   - `favicon.ico`, `favicon.svg`, `logo.svg`, `og-image.svg`
   - `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`
4. Delete the uploaded `dist-cpanel.zip` archive to save disk space.

### Step 3: Verify `.htaccess` Visibility
In cPanel File Manager:
- Click **Settings** (top right corner).
- Ensure **Show Hidden Files (dotfiles)** is checked.
- Confirm `.htaccess` is present. It automatically handles:
  - Enforcing HTTPS redirect
  - Canonicalizing `www.devcenterpoint.com` to `https://devcenterpoint.com`
  - SPA routing: all client routes load `index.html` without 404 errors
  - Gzip / Deflate compression
  - Long-term immutable caching for `/assets/*`

---

## Method 2: Deploying the Laravel + Inertia CMS Backend

### Step 1: Upload Core & Web Root
1. In cPanel File Manager:
   - Navigate to your home directory (`/home/username/`).
   - Create a folder named **`dcp_core`** (or extract `dcp_core.zip` directly here).
   - Extract `dcp_core.zip` inside `/home/username/dcp_core`.
2. Navigate to **`public_html`**:
   - Upload and extract `public_html.zip`.
   - Ensure `index.php` and `.htaccess` reside directly in `public_html`.

### Step 2: Configure Environment (`.env`)
1. In `/home/username/dcp_core/`, copy `.env.example` to `.env`.
2. Update the environment variables:
   ```env
   APP_NAME="DevCenterPoint"
   APP_ENV=production
   APP_KEY=base64:... (generate via php artisan key:generate)
   APP_DEBUG=false
   APP_URL=https://devcenterpoint.com

   DB_CONNECTION=sqlite
   DB_DATABASE=/home/devcente/dcp_core/database/database.sqlite
   ```

### Step 3: Run Database Migrations
In cPanel **Terminal** (or via SSH):
```bash
cd /home/username/dcp_core
php artisan migrate --force
php artisan db:seed --force   # first deploy only (creates admin user + CMS content)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> **SQLite notes.** The database is a single file at
> `~/dcp_core/database/database.sqlite`, created automatically by
> `migrate --force`. Keep `DB_DATABASE` as an **absolute path**. Include
> `~/dcp_core/database/` in your cPanel backups — it holds all site data.
> Requires the `pdo_sqlite` extension; verify with
> `php -m | grep -i sqlite` (you need both `pdo_sqlite` and `sqlite3`).

> **Trap: `php` may resolve to a CGI build, not the CLI.**
> On many cPanel hosts the first `php` on `PATH` is the CGI/FastCGI binary. Running
> artisan through it prints HTTP headers (such as `Content-type: text/html`) and the
> **full command list instead of executing your command** — it silently drops the
> arguments. Check with:
> ```bash
> php -i | grep -i "Server API"     # must say: Command Line Interface
> ```
> If it says `CGI/FastCGI`, call the CLI binary explicitly:
> ```bash
> /opt/cpanel/ea-php84/root/usr/bin/php artisan migrate --force
> ```
> or make it permanent for the session:
> ```bash
> alias php=/opt/cpanel/ea-php84/root/usr/bin/php
> ```
> The deploy script auto-detects a CLI build and skips CGI binaries, but manual
> commands in this guide still depend on your shell resolving `php` correctly.


---

## Method 3: Automatic Deployment via cPanel Git Version Control (Recommended for the Laravel app)

This is the primary, repeatable deployment path for **devcenterpoint.com**. cPanel clones the
repository and runs the deployment tasks automatically on every push you deploy.

### Target Directory Layout (`/home/devcente`)

```
/home/devcente/
├── repositories/
│   └── DevCenterPoint-Studio/     # cPanel Git working clone (private)
├── dcp_core/                      # PRIVATE Laravel application (not web-served)
└── public_html/                   # WEB ROOT for devcenterpoint.com
    ├── build/                     # compiled Vite assets
    ├── storage -> ../dcp_core/storage/app/public
    ├── index.php -> ../dcp_core
    ├── .htaccess
    ├── favicon.ico
    └── robots.txt
```

> `dcp_core` is deliberately outside `public_html` so `.env`, `vendor/`, `storage/` and logs are
> never web-accessible.

### Deployment Artifacts (in the repository)

| File | Role |
| :--- | :--- |
| `.cpanel.yml` | cPanel task definition — `cd`s into the clone and runs the deploy script |
| `deploy/cpanel-deploy.sh` | Server-side, idempotent deploy: sync app → `dcp_core`, apply uploaded archives, publish assets → `public_html`, composer, artisan |
| `deploy/apply-uploads.sh` | Server-side: extracts the uploaded ZIPs into `~/dcp_core` and `~/public_html` (never touches `.env`, the SQLite DB, or runtime storage) |
| `deploy/prepare-deploy.ps1` | Local pre-flight: runs the packager and prints the upload/deploy checklist |
| `backend/cpanel_deploy/package_cpanel.ps1` | Local packager: builds the Vite assets and produces `dcp_core.zip` + `public_html.zip` |

### One-Time cPanel Setup

1. **Create the repository** in cPanel → *Files* → **Git Version Control** → *Create*:
   - Clone URL: `https://github.com/beingmushfiq/DevCenterPoint-Studio.git`
   - Repository Path: `repositories/DevCenterPoint-Studio` (cPanel fills this in)
   - Branch: `main`
2. **Create the private app directory**: `~/dcp_core` (File Manager → New Folder).
3. **Create the `.env`** at `~/dcp_core/.env`. The deploy script copies
   `backend/.env.production.example` there automatically on the first run. The
   **SQLite database needs no credentials**, so the only values you may want to set are
   the `MAIL_*` entries. The script generates `APP_KEY`
   for you and **never overwrites an existing `.env`**.
   ```env
   APP_NAME="DevCenterPoint"
   APP_ENV=production
   APP_KEY=            # auto-generated by the deploy script
   APP_DEBUG=false
   APP_URL=https://devcenterpoint.com

   DB_CONNECTION=sqlite
   DB_DATABASE=/home/devcente/dcp_core/database/database.sqlite
   ```
4. **Set the domain document root**: cPanel → *Domains* → `devcenterpoint.com` →
   document root `public_html`.
5. **Add the scheduler cron** (cPanel → *Cron Jobs*). Use the **CLI** PHP binary —
   a CGI binary will fail silently. Run `which -a php` and pick the one whose
   `php -i | grep -i "Server API"` reports `Command Line Interface`, e.g.
   `/opt/cpanel/ea-php84/root/usr/bin/php`:
   ```cron
   * * * * * cd /home/devcente/dcp_core && /opt/cpanel/ea-php84/root/usr/bin/php artisan schedule:run >> /dev/null 2>&1
   ```

> **First-deploy seeding:** after migrating, the deploy script counts rows in the `users`
> table and runs `db:seed --force` **only when it is empty**. That populates the CMS content
> and creates `admin@devcenterpoint.com`. On every later deploy the seed is skipped, so your
> admin password is never reset. **Change that password immediately after the first deploy.**

### Every Deployment

The repository ships **source code only** — `backend/vendor/` and `backend/public/build/` are
**not** committed. They travel as two ZIP archives produced locally by the packager:

```powershell
powershell -ExecutionPolicy Bypass -File deploy/prepare-deploy.ps1
```

That builds the Vite assets and writes:

| Archive | Extract target on the server |
| :--- | :--- |
| `backend/cpanel_dist/dcp_core.zip` | `~/dcp_core` (app code + `vendor/`) |
| `backend/cpanel_dist/public_html.zip` | `~/public_html` (`build/`, `index.php`, `.htaccess`, static assets) |

Then:

1. **Upload both ZIPs** to `~/cpanel_uploads/` on the server (cPanel → *File Manager* →
   navigate to your home directory → create `cpanel_uploads` if it does not exist → *Upload*).
   Keep the file names exactly `dcp_core.zip` and `public_html.zip`.
2. Push the source changes (if any) and, in cPanel → **Git Version Control**, click
   **Update from Remote**, then **Deploy HEAD Commit**.

The deploy script order is: sync app files → preserve the live SQLite DB → **apply the uploaded
archives** (`deploy/apply-uploads.sh`) → ensure storage dirs → `composer install` (best effort) →
publish `build/` + entrypoint files → create the `storage` symlink → bootstrap `.env`
(first run only) → **reconcile the database config** → generate `APP_KEY` → `migrate --force` →
seed only when the database is empty → re-cache config/routes/views.

> **Uploaded archives are optional but expected.** With no ZIPs in `~/cpanel_uploads/`, the
> applier simply reports "nothing to do" and the deploy continues with whatever is already on the
> server (or a repo-provided `vendor/`). Upload fresh ZIPs whenever `composer.lock` or the
> frontend source changes.

> **Why ZIPs instead of committing the trees?** `vendor/` is ~27 MB and `build/` is ~2 MB of
> content-hashed output — committing them bloats every clone and every diff. They are regenerated
> deterministically from `composer.lock` and the frontend source, so they ship as throwaway
> artifacts instead.
>
> **The applier is non-destructive.** `deploy/apply-uploads.sh` never overwrites
> `~/dcp_core/.env`, never replaces the live `database.sqlite`, and writes nothing into runtime
> storage (`logs/`, `framework/cache/`, `sessions/`, `views/`). It also mirrors `~/public_html/build/`
> into `~/dcp_core/public/build/`, because `@vite` resolves the manifest relative to the app root —
> without that mirror every page would throw `ViteManifestNotFoundException` (HTTP 500).

> **Database self-heal.** On every deploy the script checks `DB_CONNECTION` in
> `~/dcp_core/.env` and switches it to `sqlite` when it is anything else, sets
> `DB_DATABASE` to the absolute path `~/dcp_core/database/database.sqlite`, and creates
> that file if missing. Only those two keys are touched — `APP_KEY`, `MAIL_*`, and
> everything else are left byte-identical, and a second run changes nothing. This exists
> because a leftover MySQL config (e.g. a password containing `#`, which dotenv treats as
> the start of a comment, silently truncating it) previously caused an unrecoverable
> HTTP 500 on every request.
>
> **`pdo_sqlite` is a hard requirement.** The deploy aborts with a clear message if the
> resolved PHP CLI lacks it. Enable it in cPanel → *MultiPHP INI Editor*, or check with
> `php -m | grep -i pdo_sqlite`.

> **Note:** `backend/vendor/` and `backend/public/build/` are **not** committed (see
> `backend/.gitignore`). They are produced locally by `backend/cpanel_deploy/package_cpanel.ps1`
> and uploaded as `dcp_core.zip` / `public_html.zip`.

---

## Post-Deployment Verification Checklist

| Test Item | Expected Result | Status |
| :--- | :--- | :--- |
| **HTTPS Redirection** | `http://devcenterpoint.com` automatically redirects to `https://devcenterpoint.com` | Verified |
| **Responsive Layout** | 0px horizontal scroll across all device widths (320px, 375px, 390px, 414px, 768px, 1440px) | Verified via Playwright |
| **Direct URL Reload** | Direct visit to sub-routes or anchors returns HTTP 200 via `.htaccess` rewrite | Verified |
| **SEO & Crawlers** | `robots.txt`, `sitemap.xml`, `llms.txt`, OpenGraph meta tags verified | Verified |
| **Browser Caching** | Immutable 1-year cache on static assets; immediate revalidation for `index.html` | Verified |
