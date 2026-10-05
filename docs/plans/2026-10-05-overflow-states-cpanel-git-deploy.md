# Overflow Containment, Resilient UI States & cPanel Git Auto-Deploy

**Date:** 2026-10-05
**Target:** `devcenterpoint.com` (main portfolio) — cPanel shared hosting, home directory `/home/devcente`
**Primary app:** Laravel 12 + Inertia v2 + React 19 + Tailwind v4 (`backend/`)
**Secondary app:** Root React/Vite SPA (`src/`) — legacy standalone build, retained

---

## 0. Evidence From Headless Automation

Re-ran `scripts/diag-overflow.mjs` (Playwright, `page.route` interception serving `dist/` from `https://dcp.local`) across viewports 320 / 375 / 390 / 414 / 768 / 1024 / 1440 / 1920.

Result:

| Viewport | `documentElement.scrollWidth > clientWidth` | Verdict |
|---|---|---|
| all tested | `false` | Document never reports overflow |

**Why the SPA looks clean:** the root `src/index.css` already contains a containment block (`html, body { overflow-x: hidden; max-width: 100vw; }`, `img/svg/video/canvas/iframe { max-width: 100% }`, `overflow-wrap: break-word`). That block **masks** any child blowout, so `scrollWidth` stays clamped.

**Offenders found anyway** (elements whose `getBoundingClientRect().right` exceeds the viewport — the "overflowing to the right side" the user sees when inspecting):

1. Horizontal scroll rails — e.g. Capability tab `<button>` `over=1284px` at 320px. **Expected**: children of `overflow-x-auto no-scrollbar` rails are legitimately off-canvas. Not a bug.
2. `Hero.tsx` decorative orb at 1024px — `absolute top-36 right-1/4 translate-x-1/2 w-md h-112 …` produced `over=9px`, `w=502 L=531 R=1033`. **Real bug**: `w-md` (28rem) + `right-1/4` + `translate-x-1/2` pushes past the right edge on mid-size viewports.

**Root cause of the production symptom:** the deployment stylesheet [`backend/resources/css/app.css`](file:///d:/DevCenterPoint-Studio/backend/resources/css/app.css) **does not contain the containment block** that `src/index.css` has, and it is missing the `.no-scrollbar` utility class entirely — yet 5 components use `no-scrollbar`. The Laravel/Inertia build therefore has **no horizontal containment at all**, so the same decorative orbs, rails, and long tokens visibly overflow on `devcenterpoint.com`.

---

## 1. Objectives

| # | Objective | Success Criteria |
|---|---|---|
| O1 | Eliminate visible horizontal overflow on the Laravel deployment | `backend/resources/css/app.css` carries full containment parity with `src/index.css`; decorative orbs clamped; `no-scrollbar` defined |
| O2 | Give every data-driven surface explicit **loading / error / empty** states | No section silently vanishes or falls back without a visible state; global render errors are caught |
| O3 | Prepare the codebase for cPanel at `/home/devcente` | Two-tier split: `/home/devcente/dcp_core` (private) + `/home/devcente/public_html` (web root) |
| O4 | Automatic deployment via cPanel **Git Version Control** | `.cpanel.yml` at repo root triggers an idempotent server-side deploy script |
| O5 | Provide proper deployment scripts | `deploy/cpanel-deploy.sh` (server), `deploy/prepare-deploy.ps1` (local pre-flight) |

---

## 2. Directory Layout Decision

`/home/devcente` is the cPanel home. The **most proper** split (industry-standard two-tier, keeps `.env`, `vendor/`, `storage/`, and SQLite/logs outside the web root):

```
/home/devcente/
├── repositories/
│   └── DevCenterPoint-Studio/        # cPanel Git Version Control working clone
├── dcp_core/                         # PRIVATE Laravel application (not web-served)
│   ├── app/ bootstrap/ config/ database/ resources/ routes/
│   ├── storage/  vendor/  artisan  .env
└── public_html/                      # WEB ROOT for devcenterpoint.com
    ├── build/                        # compiled Vite assets (JS/CSS)
    ├── storage -> ../dcp_core/storage/app/public
    ├── index.php                     # bootstrap -> ../dcp_core
    ├── .htaccess
    ├── favicon.ico
    └── robots.txt
```

Rationale:
- `dcp_core` matches the existing `backend/cpanel_deploy/index.php` bootstrap (`__DIR__.'/../dcp_core/...'`) and both existing deployment guides — no code changes required to the entrypoint.
- `public_html` is the single document root for the addon/primary domain `devcenterpoint.com`.
- Git clone lives in `~/repositories/<name>`, which is cPanel's fixed convention and is never web-accessible.

---

## 3. Workstream A — Overflow Containment

### A1. Port containment into the Laravel stylesheet
File: [`backend/resources/css/app.css`](file:///d:/DevCenterPoint-Studio/backend/resources/css/app.css)

Add to `@layer base` (mirroring `src/index.css`):

```css
*, *::before, *::after { box-sizing: border-box; }

html {
  overflow-x: hidden;
  max-width: 100vw;
  width: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  overflow-x: hidden;
  max-width: 100vw;
  width: 100%;
  margin: 0;
  padding: 0;
}

img, svg, video, canvas, iframe { max-width: 100%; }

h1,h2,h3,h4,h5,h6,p,a,button,span,li { overflow-wrap: break-word; }

pre { max-width: 100%; overflow-x: auto; white-space: pre; }

button, a { -webkit-tap-highlight-color: transparent; }
```

Add the missing utility used by 5 components:

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

### A2. Clamp the decorative orbs
Files: `backend/resources/js/Components/Hero.tsx` and `src/components/Hero.tsx` (line 73).

Change the offending orb from `right-1/4 translate-x-1/2 w-md h-112` to a viewport-safe position that keeps the glow but cannot exceed the right edge (e.g. `right-0 translate-x-1/3 w-80 h-80 sm:w-md sm:h-112`). Hero already has `overflow-hidden`, so the fix is belt-and-braces for the orbs' animated `floatOrb2` transform.

### A3. Verify
Re-run `scripts/diag-overflow.mjs`; assert offender list no longer contains a Hero orb (`L≈531 R≈1033` at 1024px).

---

## 4. Workstream B — Resilient UI States

### B1. Global error boundary (previously absent — zero matches for `ErrorBoundary` in repo)
New: `backend/resources/js/Components/ErrorBoundary.tsx` — class component implementing `componentDidCatch`, rendering a branded fallback card with a "Reload" action. Registered in `app.tsx` wrapping `<App />`.

### B2. Reusable section state component
New: `backend/resources/js/Components/SectionState.tsx` — one component, three variants:
- `loading` — shimmer skeleton rows (uses existing `.animate-shimmer`)
- `empty` — icon + title + description + optional action
- `error` — `AlertCircle` + message + optional retry

Props: `variant`, `title`, `description`, `actionLabel`, `onAction`, `icon`.

### B3. Wire states into data-driven public sections

| Component | Current behaviour | Change |
|---|---|---|
| `CapabilitiesSection.tsx` | `cms.capabilities.length > 0 ? map : CAPABILITIES_DATA` — silently falls back | If CMS array is present but empty → render `SectionState variant="empty"`. Keep static fallback only when the prop is `undefined`. Guard `activeCapability` against empty arrays (`.find(...) ?? [0]` currently throws on `[0]` of empty). |
| `SelectedWorkSection.tsx` | Same silent fallback; filtered list can be empty | Keep fallback for `undefined`; add `SectionState variant="empty"` for an empty **filtered** result with a "Show All" action. |
| `TestimonialsSection.tsx` | `cms.testimonials.length > 0 ? filter : DEFAULT_TESTIMONIALS` | Add empty state when CMS array exists but all items are unpublished/empty. |
| `FAQSection.tsx` | Already has an empty state for zero search matches ✅ | No change (verified). |
| `NewsletterSignup.tsx` | Already has idle/success/error ✅ | No change (verified). |
| `ProjectInquiryBuilder.tsx` | Already has submitting/success/error ✅ | No change (verified). |
| `AboutPrinciples.tsx` | Team silent fallback | Add empty state for team grid. |

### B4. Laravel HTTP error views
Add branded `backend/resources/views/errors/404.blade.php` and `503.blade.php` so server-level errors render on-brand instead of the default Laravel page.

---

## 5. Workstream C — cPanel Git Auto-Deploy

### C1. `.cpanel.yml` (repo root)
cPanel's Git Version Control executes `deployment.tasks` from the repository working copy. Keep it thin and delegate to a script:

```yaml
---
deployment:
  tasks:
    - export REPO="$HOME/repositories/DevCenterPoint-Studio"
    - export CORE="$HOME/dcp_core"
    - export WEBROOT="$HOME/public_html"
    - cd "$REPO"
    - bash deploy/cpanel-deploy.sh
```

### C2. `deploy/cpanel-deploy.sh` (server-side, idempotent, bash)
Responsibilities, in order:
1. Resolve `REPO` / `CORE` / `WEBROOT` from env with sane `$HOME` defaults; fail fast if `backend/` is missing.
2. Sync Laravel app → `dcp_core` (rsync when available, else `cp -R`): `app bootstrap config database resources routes storage artisan composer.json`.
3. Ensure writable `storage/{app/public,framework/{cache,sessions,views},logs}` and `bootstrap/cache`.
4. `composer install --no-dev --optimize-autoloader` when `composer` is on `PATH` (best-effort, skip with notice otherwise).
5. Sync `backend/public/build` → `WEBROOT/build`; copy `backend/cpanel_deploy/index.php`, `backend/cpanel_deploy/.htaccess`, `backend/public/favicon.ico`, `backend/public/robots.txt`.
6. Create the `storage` symlink `WEBROOT/storage -> CORE/storage/app/public` if absent.
7. Artisan (guarded by `.env` + `artisan` presence): `migrate --force`, `storage:link`, `config:cache`, `route:cache`, `view:cache`.
8. Never overwrite `dcp_core/.env`.
9. Echo a clear summary and exit non-zero on any hard failure.

### C3. `deploy/prepare-deploy.ps1` (local pre-flight)
- Build the Laravel frontend (`backend`: `npm ci` if needed, `npm run build`) so `backend/public/build` is fresh.
- Optionally build the root SPA (`dist/`) if the standalone static site is also published.
- Print a checklist: commit built assets, set `.env` keys, cPanel Git "Pull or Deploy HEAD", cron line.

### C4. Built assets must travel with Git
`backend/.gitignore` currently ignores `/public/build`. Because the deploy is Git-driven, committed build output is required. Plan: add a negation so `backend/public/build/**` is tracked, and commit the current build. `vendor/` stays ignored and is resolved by `composer install` in the deploy script (or the existing ZIP path as a fallback).

### C5. cPanel cron
Document (do not create server state) the scheduler entry:
```cron
* * * * * cd /home/devcente/dcp_core && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Obstacle & Hazard Matrix

| # | Obstacle / Hazard | Impact | Mitigation |
|---|---|---|---|
| H1 | `overflow-x: hidden` masks but does not fix blowouts | Inspect still shows elements past the right edge; content clipped instead of reflowed | Fix the actual offenders (Hero orbs) in addition to porting containment |
| H2 | `.no-scrollbar` missing in `app.css` | Rails show native scrollbars on the deployed site (visual regression vs SPA) | Add the utility to `app.css` |
| H3 | Tailwind v4 `@layer base` ordering | Custom base rules could be overridden by utilities | Keep declarations in `@layer base`; no `!important` needed for `overflow-x` |
| H4 | Silent static fallbacks hide CMS misconfiguration | Client sees stale demo data believing it is their content | Distinguish `undefined` (fallback OK) from `[]` (show empty state) |
| H5 | Empty CMS array crashes section via `[0]` | White section / React error | Guard first-element access; wrap page in ErrorBoundary |
| H6 | Shared hosting may lack `composer`/`node` | Deploy script cannot install deps/build | Best-effort install; assets pre-committed; ZIP artifacts as fallback; script prints actionable notices |
| H7 | Git deploy path assumptions | Tasks run in unexpected cwd | `.cpanel.yml` sets and `cd`s explicitly via exported `REPO` |
| H8 | `storage` symlink cannot be created from Git tasks | Media uploads 404 | Deploy script creates symlink + falls back to `artisan storage:link` |
| H9 | `.env` overwritten on redeploy | Loses DB credentials / APP_KEY | Deploy script explicitly never copies `.env` |
| H10 | Route/config cache serving stale code | Changes not visible after deploy | Deploy script runs `config:clear`/`route:clear` **then** re-caches |
| H11 | `npm run build` on `backend` requires devDeps | Build fails without `node_modules` | `prepare-deploy.ps1` runs `npm ci` when `node_modules` absent |

---

## 7. Execution Order

1. Workstream A (containment + orb clamp) — smallest, unblocks the visible bug.
2. Workstream B1/B2 (ErrorBoundary + SectionState) — shared primitives.
3. Workstream B3/B4 (wire sections + error views).
4. Workstream C1/C2/C3 (.cpanel.yml + scripts).
5. Workstream C4 (track build output) + docs update.
6. Verify: re-run overflow diagnostic; run `tsc --noEmit`; build backend with Vite.

---

## 8. Explicitly Out of Scope

- Migrating `NewsletterSignup` / `ProjectInquiryBuilder` off the Firebase fallback to Laravel-only (tracked separately as BUG-006).
- Redesign of admin CMS tables for mobile (covered by the existing admin-responsiveness plan).
- Publishing the standalone root SPA to a separate subdomain.
