# Laravel + Inertia.js + React CMS Architecture Blueprint

> **Status:** APPROVED & ARCHITECTED  
> **Target Environment:** cPanel Shared / VPS Hosting (Apache + PHP 8.2/8.3 + MySQL)  
> **Framework Stack:** Laravel 11/12 + Inertia.js v2 + React 19 + Tailwind CSS v4  
> **Scope:** 100% dynamic CMS control (every section, segment, block, navigation, and footer) + Lead/Subscriber CRM

---

## 1. Executive Summary & Goals

DevCenterPoint Studio is evolving into a **complete, full-stack dynamic platform** where:
1. **Total CMS Sovereignty:** Every single visible element on the website—from `<head>` SEO tags, announcement badges, navigation links, hero headlines, portfolio case studies, interactive milestone charts, testimonials, pricing/timeline tiers, FAQ accordions, down to footer columns and legal disclaimers—is completely configurable and editable via an intuitive React Admin CMS.
2. **Reliable cPanel Hosting Architecture:** Engineered specifically for standard cPanel environments, utilizing a secure two-tier directory layout (core code above web root, static assets in `public_html`), standard MySQL database connectivity, local/CI asset bundling (`npm run build`), and automated cPanel Cron execution.
3. **Full Firebase Deprecation:** Replaces client-side Firestore, anonymous authentication, and external Cloud Functions with native Laravel Eloquent models, secure session authentication, CSRF tokens, native queued mail notifications (`Mailable`), and signed 1-click unsubscribe routes.

---

## 2. Complete Website Section-by-Section CMS Inventory

To ensure **100% of the website is manageable via CMS**, the system maps every UI segment to an editable CMS module:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FULL SITE CMS MAPPING                           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. GLOBAL & SEO           │ Meta title, description, OG image, scripts │
│ 2. NAVIGATION / HEADER    │ Logo, menu links, CTA button, sound toggle │
│ 3. HERO SECTION           │ Status badge, headlines, subcopy, CTAs     │
│ 4. MARQUEE / POSITIONING  │ Trust tickers, highlight badges            │
│ 5. CAPABILITIES / SERVICES│ Service cards, feature lists, tech badges  │
│ 6. SELECTED WORK          │ Case studies, metrics, tags, gallery, URLs │
│ 7. ENGINEERING PHILOSOPHY │ Core principles, milestones, diagrams      │
│ 8. TECH ECOSYSTEM         │ Categories, technology items, tiers        │
│ 9. PROCESS & METHODOLOGY  │ Workflow phases, deliverables, timelines   │
│ 10. EFFICIENCY METRICS    │ Chart datasets, ROI metrics, comparisons   │
│ 11. ABOUT & PRINCIPLES    │ Studio narrative, values, team members     │
│ 12. TESTIMONIALS          │ Client quotes, author roles, avatar photos │
│ 13. FAQ ACCORDION         │ Category tabs, questions & rich answers    │
│ 14. INQUIRY BUILDER (CRM) │ Service tiers, budget options, lead triage │
│ 15. NEWSLETTER SIGNUP     │ Catchphrases, placeholders, confirmation   │
│ 16. FOOTER                │ Brand bio, contact info, socials, policies │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Design (MySQL on cPanel)

### 3.1. Entity Models (Structured Relational Data)

#### `users` (Admin Authentication & Roles)
- `id`, `name`, `email` (unique), `password`, `role` (`superadmin`, `editor`), `remember_token`, `timestamps`

#### `inquiries` (Lead CRM Pipeline)
- `id`, `reference_number` (e.g. `DCP-2026-8942`), `name`, `email`, `company`, `project_types` (JSON), `budget_range`, `timeline`, `details` (text), `status` (`new`, `reviewed`, `contacted`, `closed`), `internal_notes` (text), `ip_address`, `timestamps`

#### `newsletter_subscribers` (Audience & Mailing List)
- `id`, `email` (unique), `status` (`subscribed`, `unsubscribed`), `unsubscribe_token` (unique hash), `unsubscribed_at`, `ip_address`, `timestamps`

#### `projects` (Portfolio & Deep Case Studies)
- `id`, `slug` (unique), `title`, `tagline`, `category`, `client`, `year`, `duration`, `overview` (text), `problem` (text), `solution` (text), `metrics` (JSON array: `[{"label": "Throughput", "value": "+340%"}]`), `tech_stack` (JSON array), `thumbnail_url`, `hero_image_url`, `gallery` (JSON array of image paths), `live_url`, `github_url`, `is_featured` (bool), `display_order` (int), `is_published` (bool), `timestamps`

#### `capabilities` (Services & Offerings)
- `id`, `slug` (unique), `title`, `tagline`, `description` (text), `icon_name` (Lucide icon identifier), `features` (JSON array of bullet deliverables), `technologies` (JSON array), `display_order` (int), `is_active` (bool), `timestamps`

#### `milestones` (Engineering Philosophy)
- `id`, `number` (e.g. `"01"`), `title`, `tagline`, `description` (text), `metric_label`, `metric_value`, `code_preview` (text/JSON), `display_order` (int), `is_active` (bool), `timestamps`

#### `team_members` (About & Studio Leadership)
- `id`, `name`, `role`, `bio` (text), `avatar_url`, `social_links` (JSON: `{"linkedin": "...", "github": "...", "x": "..."}`), `display_order` (int), `is_active` (bool), `timestamps`

#### `faqs` (Frequently Asked Questions)
- `id`, `category` (`Process`, `Pricing`, `Technical`, `Architecture`), `question`, `answer` (text), `display_order` (int), `is_published` (bool), `timestamps`

---

### 3.2. Universal Page Blocks & Site Settings

To empower **every segment and block** to be edited without needing rigid migrations every time a label changes, we implement a dual-layer settings & section system:

#### `page_sections` (Granular Content Blocks)
| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary Key |
| `section_key` | `VARCHAR(100)` | e.g. `'hero'`, `'process'`, `'metrics'`, `'footer'` |
| `block_key` | `VARCHAR(100)` | e.g. `'headline'`, `'subcopy'`, `'cta_primary'`, `'chart_data'` |
| `content` | `LONGTEXT` / `JSON` | Structured content, text, media URL, or nested array |
| `is_visible` | `BOOLEAN` | Global toggle to show/hide specific section or block |
| `display_order` | `INT` | Ordering priority |
| `timestamps` | `TIMESTAMP` | Created / Updated |

#### `site_settings` (Global Configuration)
- Keys:
  - `site_name`, `logo_text`, `logo_image_url`, `favicon_url`
  - `seo_meta_title`, `seo_meta_description`, `seo_keywords`, `seo_og_image_url`
  - `header_cta_text`, `header_cta_link`, `sound_enabled_default`
  - `contact_email`, `contact_phone`, `office_address`
  - `social_github`, `social_linkedin`, `social_x`, `social_discord`
  - `footer_copyright_text`, `footer_tagline`
  - `custom_head_scripts` (e.g. Google Tag Manager / Analytics), `custom_body_scripts`

---

## 4. Admin Panel UI & CMS Control Center (Inertia + React)

The Admin Panel (`/admin`) is organized into dedicated control centers:

```
┌─────────────────────────────────────────────────────────────┐
│                 DEVCENTERPOINT CMS ADMIN                    │
├─────────────────┬───────────────────────────────────────────┤
│ 📊 Dashboard    │ Lead metrics, subscriber growth, quick actions
│ 📥 Inquiries    │ Review leads, update status, internal notes
│ 📧 Subscribers  │ Manage subscribers, CSV export, unsub audit
│ 🚀 Projects     │ Portfolio case studies, media uploads, metrics
│ ⚡ Capabilities │ Services, features, tech stack badges
│ 🧭 Philosophy   │ Engineering milestones, principles, code previews
│ 📈 Metrics      │ Live efficiency charts and comparison data
│ 👥 Team         │ Studio members, roles, bios, social links
│ ❓ FAQs         │ Accordion Q&As grouped by category
│ 🧱 Page Blocks  │ Header, Hero, Marquee, Process, Footer blocks
│ ⚙️ Site Settings│ Global SEO, branding, contact info, scripts
└─────────────────┴───────────────────────────────────────────┘
```

---

## 5. cPanel Hosting Architecture & Deployment Guide

cPanel shared and VPS hosting environments have specific security and server requirements. Below is the battle-tested, secure deployment architecture for Laravel + Inertia.js on cPanel:

### 5.1. Directory Structure on cPanel
Never place the entire Laravel directory inside `public_html`. That exposes `.env`, storage logs, and source code. Instead, use a **split root** layout:

```
/home/username/
├── dcp_core/                  # Core Laravel application (PRIVATE - NOT accessible from web)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/               # App logs, framework cache, uploaded media
│   ├── vendor/
│   ├── .env                   # DB credentials, APP_KEY, mail configs (PROTECTED)
│   └── artisan
│
└── public_html/               # Web Document Root (PUBLIC)
    ├── build/                 # Compiled Vite assets (JS, CSS, fonts)
    ├── storage -> /home/username/dcp_core/storage/app/public  (Symlink for media uploads)
    ├── index.php              # Bootstrap entrypoint
    ├── .htaccess              # Apache rewrite rules & security headers
    └── favicon.ico
```

### 5.2. `public_html/index.php` Configuration
In `public_html/index.php`, update the paths to point to the `dcp_core` directory:

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../dcp_core/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../dcp_core/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../dcp_core/bootstrap/app.php')
    ->handleRequest(Request::capture());
```

### 5.3. Apache `.htaccess` for cPanel
Ensure `public_html/.htaccess` contains:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

# Prevent directory listings
Options -Indexes

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>
```

### 5.4. PHP & MultiPHP Configuration
- **PHP Version:** Set to **PHP 8.2 or 8.3** in cPanel `MultiPHP Manager`.
- **Extensions Required:** Ensure `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `curl`, and `gd` (for image processing) are active in `Select PHP Version` / `MultiPHP INI Editor`.
- **Limits:**
  - `memory_limit = 256M`
  - `upload_max_filesize = 32M`
  - `post_max_size = 32M`
  - `max_execution_time = 120`

### 5.5. Asset Building & Pre-Compilation (Local / CI)
Because shared cPanel servers generally lack Node.js daemons and memory for large Vite builds:
1. Run `npm run build` on your development machine (or CI pipeline).
2. This generates the production `public/build` bundle containing the React SPA, Tailwind v4 CSS, and Inertia components.
3. Upload `public/build` directly into `public_html/build/`.

### 5.6. Storage Symlink on cPanel
For uploaded images (project screenshots, team avatars):
Run via cPanel Terminal:
```bash
cd /home/username/dcp_core
php artisan storage:link
```
*Fallback for shared cPanel accounts without SSH/Terminal access:*  
Create a temporary PHP route or script that runs:
```php
symlink('/home/username/dcp_core/storage/app/public', '/home/username/public_html/storage');
```

### 5.7. Automated cPanel Cron Job
To process queued emails (inquiry alerts, newsletter welcome) and scheduled tasks:
In cPanel **Cron Jobs**, add a job to run every minute:
```cron
* * * * * cd /home/username/dcp_core && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Implementation Stages & Verification Checklist

1. **Phase 1: Laravel Scaffolding in `/backend`**
   - Initialize clean Laravel 11/12 with Inertia.js React starter.
   - Configure session authentication with CSRF protection.
2. **Phase 2: Full Database Migrations & Data Seeders**
   - Create migrations for all entities and `page_sections`.
   - Seed database using content from existing `src/data/*.ts` files so nothing is lost.
3. **Phase 3: React Admin CMS Panels**
   - Build UI for Dashboard, Inquiries CRM, Subscribers, Projects, Capabilities, Milestones, FAQs, and Page Blocks.
4. **Phase 4: Public Landing Page Integration**
   - Adapt public landing page (`Home.tsx`) to render seamlessly from Inertia props with full animations, sound engine, and theme controls.
5. **Phase 5: cPanel Deployment Packager**
   - Create an automated script or clear procedure to package `dcp_core` and `public_html` ready for cPanel FTP/File Manager upload.
