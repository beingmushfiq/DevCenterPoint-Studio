# DevCenterPoint (devcenterpoint.com) — cPanel Production Deployment Guide

This guide details the complete deployment workflow for **DevCenterPoint** on cPanel hosting.

---

## Deployment Architecture Overview

Two pre-packaged, zero-configuration deployment archives are available depending on your infrastructure preference:

### Option 1: Standalone React High-Performance SPA (Recommended)
- **Deployment Archive**: `dist-cpanel.zip` (in project root)
- **Target Location**: `/public_html`
- **Features**: Ultra-fast static serving, Apache `.htaccess` with Gzip compression, immutable caching for hashed assets, security headers, and full SPA routing fallback for direct URLs.

### Option 2: Full-Stack Laravel + Inertia CMS & CRM
- **Deployment Archives**:
  1. `backend/cpanel_dist/dcp_core.zip` → Upload to `/home/username/dcp_core` (outside web root for maximum security)
  2. `backend/cpanel_dist/public_html.zip` → Extract into `/home/username/public_html`
- **Features**: Includes the Admin CMS dashboard (`/admin`), dynamic lead capture (`/inquiry`), newsletter subscriptions (`/newsletter`), and MySQL database persistence.

---

## Method 1: Deploying the Standalone SPA (Fastest & Simplest)

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
   APP_NAME="DevCenterPoint Studio"
   APP_ENV=production
   APP_KEY=base64:... (generate via php artisan key:generate)
   APP_DEBUG=false
   APP_URL=https://devcenterpoint.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=username_dcp
   DB_USERNAME=username_dcpuser
   DB_PASSWORD=YourSecurePassword
   ```

### Step 3: Run Database Migrations
In cPanel **Terminal** (or via SSH):
```bash
cd /home/username/dcp_core
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Post-Deployment Verification Checklist

| Test Item | Expected Result | Status |
| :--- | :--- | :--- |
| **HTTPS Redirection** | `http://devcenterpoint.com` automatically redirects to `https://devcenterpoint.com` | Verified |
| **Responsive Layout** | 0px horizontal scroll across all device widths (320px, 375px, 390px, 414px, 768px, 1440px) | Verified via Playwright |
| **Direct URL Reload** | Direct visit to sub-routes or anchors returns HTTP 200 via `.htaccess` rewrite | Verified |
| **SEO & Crawlers** | `robots.txt`, `sitemap.xml`, `llms.txt`, OpenGraph meta tags verified | Verified |
| **Browser Caching** | Immutable 1-year cache on static assets; immediate revalidation for `index.html` | Verified |
