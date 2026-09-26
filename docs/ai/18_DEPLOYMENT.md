# 18 — Deployment & Infrastructure

**Status: [PARTIAL — inferred from config files, not verified against live environment]**

---

## Build System

**Tool:** Vite 6.2

**Build command:** `npm run build` → `vite build`

**Output:** `dist/` directory (standard Vite output)

**Dev server:** `npm run dev` → `vite --port=3000 --host=0.0.0.0`

**Preview:** `npm run preview` → `vite preview`

**Lint:** `npm run lint` → `tsc --noEmit` (TypeScript type checking only, no ESLint configured)

**Clean:** `npm run clean` → `rm -rf dist server.js`

---

## Runtime / Platform

**Package manager:** Bun (bun.lock present) or npm (compatible)

**Node:** Required for Vite build [INFERRED] — version not pinned in package.json

**TypeScript:** `~5.8.2`

**React:** `^19.0.1`

---

## Hosting & Production Target

### Target: cPanel Shared / VPS Hosting (Laravel + Inertia.js Stack)
**Status: [CONFIRMED by user]**

The production environment for the new full-stack Laravel + Inertia CMS is **cPanel Hosting** (Apache + PHP 8.2/8.3 + MySQL):
- **Directory Layout:** Two-tier split: core Laravel app located in `~/dcp_core/` (outside web root) and public assets in `~/public_html/`.
- **Database:** cPanel MySQL / MariaDB database configured in `.env`.
- **Build Pipeline:** Front-end assets are bundled locally / via CI (`npm run build`) and placed in `public_html/build/`.
- **Scheduled Tasks & Queues:** Single cPanel cron job (`* * * * * cd /home/user/dcp_core && php artisan schedule:run >> /dev/null 2>&1`).
- **Media Uploads:** `dcp_core/storage/app/public` symlinked to `public_html/storage`.

> **Detailed cPanel Deployment Guide:** See Section 5 of [LARAVEL_INERTIA_CMS_BLUEPRINT.md](file:///d:/DevCenterPoint-Studio/docs/ai/LARAVEL_INERTIA_CMS_BLUEPRINT.md).

---

### Historical / Prior Context: Google AI Studio → Google Cloud Run
**Status: [HISTORICAL — Prior to Laravel transition]**

Initially, DevCenterPoint Studio was structured as a Google AI Studio frontend SPA deployed to Cloud Run via generated Express `server.js`. With the adoption of Laravel and the retirement of client-side Firebase (ADR-007), cPanel hosting takes precedence.


---

## Environment Variables

| Variable | Purpose | Source |
|---|---|---|
| `GEMINI_API_KEY` | Gemini AI API authentication | AI Studio secrets panel / .env |
| `APP_URL` | Self-referential URL, OAuth callbacks | AI Studio runtime injection / .env |
| `DISABLE_HMR` | Disable Vite HMR for AI Studio agent stability | AI Studio environment |

**Configuration:** `firebase-applet-config.json` — Firebase project config (NOT env vars)

---

## Firebase Configuration

**File:** `firebase-applet-config.json` (root-level, committed to source)

Supports custom Firestore database ID via `firestoreDatabaseId` field (non-default database instance).

**Firestore rules deployment:** `firestore.rules` — must be deployed via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
[INFERRED — Firebase CLI not confirmed installed]

---

## Build Process

```
npm run build
  → vite build
  → TypeScript compilation + bundle
  → Tailwind CSS purge (v4 built-in)
  → Output: dist/
      ├── index.html
      ├── assets/
      │   ├── index-[hash].js    (main bundle)
      │   └── index-[hash].css   (styles)
      └── [static assets from public/]
```

---

## Performance Considerations

- **Bundle size:** Static data files total ~130KB source. `simulatedProjectDb.ts` alone is 45KB — compiles into bundle. Large case study data is always downloaded even if user never opens a case study modal. [PERFORMANCE RISK]
- **Code splitting:** No route-based code splitting (no router used). All components are eager-loaded.
- **Fonts:** Google Fonts loaded via `<link>` with `preconnect`. May cause render-blocking if CDN is slow.
- **devicons CDN:** External icon images loaded at runtime — not bundled.
- **Recharts:** Adds to bundle for a single section.

---

## Environment Matrix

| Environment | Purpose | URL | Notes |
|---|---|---|---|
| Local | Development | http://localhost:3000 | `npm run dev` |
| AI Studio | Development/Demo | [AI Studio URL] | `DISABLE_HMR=true` |
| Production | Live | https://devcenterpoint.com [INFERRED] | [UNKNOWN hosting] |

---

## CI/CD

**Status: [UNKNOWN]**

No CI/CD configuration files found in repository (no `.github/workflows/`, no `.gitlab-ci.yml`).

[Possibly handled by AI Studio deployment pipeline or manual Firebase/Vercel CLI deploy]

---

## Backups

Firebase Firestore data is backed up by Google infrastructure. No custom backup scripts observed.

---

## Monitoring / Logging

- No application performance monitoring (APM) configured [NONE found]
- No error tracking (Sentry, Datadog, etc.) [NONE found]
- Firebase console provides basic usage statistics

---

## Rollback

No rollback procedure documented. Standard Vite build output; redeploy previous bundle to revert.
