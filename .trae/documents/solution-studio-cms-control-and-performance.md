# Solution Studio CMS Control + Website Performance/Theme Smoothing

## Summary

Two related workstreams, both targeting the **live Laravel app in `backend/`** (the deployed site):

1. **Solution Studio becomes CMS-managed.** Today the "Solution Studio" (rendered by `DigitalSystemMap.tsx`) is 100% hardcoded and has zero CMS wiring. We add:
   - a **master toggle** to show/hide the whole Solution Studio section on the public site, and
   - a **per-solution toggle** to show/hide each of the 8 individual products,
   - plus full CRUD so admins can edit product content from a new **Admin → Solution Studio** page.

2. **The site feels crisper and lighter.** We:
   - replace the clunky full-screen "shutter" theme transition with a smooth global color crossfade,
   - speed up the forced preloader,
   - split the ~1.33 MB `Home` bundle and lazy-load below-the-fold sections,
   - throttle the unthrottled scroll listeners.

Then we **build, package (`public_html.zip`), commit, and push** so the server can deploy.

Decisions confirmed by the user:
- CMS scope: **Full management + toggles** (dedicated `solution_products` table).
- Perf depth: **Balanced safe wins** (no hero-canvas rewrite, no library consolidation).
- Theme feel: **Smooth crossfade, no curtain**.
- Deploy prep: **Build, ZIP, commit + push**.

---

## Current State Analysis

| Area | File | Fact |
|---|---|---|
| Solution Studio data | [DigitalSystemMap.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/DigitalSystemMap.tsx#L64) | Module-level `const SOLUTIONS: SolutionProduct[]` (line 64), 8 items: `erp, roadsafety, traccar, slicemart, leadlayer, ngodemo, aistudio, kothalipi`. Component `export const DigitalSystemMap: React.FC = () => {` (line 408) takes **no props**, never calls `useCms()`. |
| Render site | [Hero.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Hero.tsx#L205) | `<DigitalSystemMap />` at line 205 inside a `motion.div` (198–206). `Hero` **already** uses `useCms()` (line 10). |
| Master-toggle precedent | [AdminPlanController.php](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminPlanController.php#L124-L149) | `toggleSitePricing()` writes `SiteSetting` key `show_pricing_on_site` = `'true'`/`'false'`; gate in [Home.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Public/Home.tsx#L158) via `=== 'true'`. |
| Per-item-toggle precedent | [AdminSandboxController.php](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminSandboxController.php) + [HomeController.php](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/HomeController.php#L49-L51) | `SandboxApp::where('is_active', true)` — inactive rows are filtered server-side. |
| CRUD precedent | [AdminProjectController.php](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminProjectController.php) | `index/store/update/destroy`, auto-slug via `Str::slug`, `back()->with('success', …)`. |
| Admin nav | [AdminLayout.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Layouts/AdminLayout.tsx#L34-L48) | `navigation` array, 13 entries `{ name, href, icon }`. |
| Icon-from-string precedent | [ClientDemoSandboxModal.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ClientDemoSandboxModal.tsx#L185-L212) | `iconMap: Record<string, React.ElementType>` resolves `dbApp.icon_name`. |
| CMS prop bag | [CmsContext.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Context/CmsContext.tsx#L3-L14) | `CmsData` has `sandboxApps?, plans?, pageSections?, siteSettings?` — **no** solution field yet. |
| Theme toggle | [ThemeContext.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Context/ThemeContext.tsx#L54-L86) | `toggleTheme()`: 240 ms class swap, 620 ms cleanup, 580 ms [ShutterTransitionOverlay](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ShutterTransitionOverlay.tsx) curtain + Web Audio. |
| Preloader | [GlobalLoadingScreen.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/GlobalLoadingScreen.tsx#L36) | `minDuration = 1100` ms + 180 ms settle; opaque overlay with `blur-[140px]` and 3 infinite animations. |
| Home bundle | [Home.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Public/Home.tsx#L1-L27) | 21 sections all **static** imports → single `Home-*.js` ≈ 1.33 MB (pulls ~161k lines of data, all of recharts, both `framer-motion` and `motion`). |
| Vite config | [vite.config.js](file:///d:/DevCenterPoint-Studio/backend/vite.config.js) | No `manualChunks`, no `rollupOptions`. |
| Scroll listeners | [useHeaderBehavior.ts](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/useHeaderBehavior.ts#L12-L36), [BackToTop.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/BackToTop.tsx#L12-L27), [CustomCursor.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/CustomCursor.tsx#L20-L23) | Unthrottled scroll → React state per event; cursor sets state per mousemove. |
| Deploy seeding guard | [cpanel-deploy.sh](file:///d:/DevCenterPoint-Studio/deploy/cpanel-deploy.sh#L462-L481) | `db:seed` runs **only when the DB is empty** (`USER_COUNT = 0`). A new table therefore needs its own seeding path on production. |
| SPA mirror | `d:\DevCenterPoint-Studio\src\...` | Standalone React SPA with **no `CmsProvider`**; not the deployed site. |

---

## Proposed Changes

### A. Solution Studio — CMS data layer

**A1. New migration — `backend/database/migrations/2026_10_07_000001_create_solution_products_table.php`**
Create `solution_products` mirroring the `SolutionProduct` interface. Columns:

```
id, slug (100, unique), category (100), badge (100), title (255), tagline (text),
icon_name (50, default 'Globe'), mockup_title (255),
live_url (500, nullable), admin_url (500, nullable),
demo_username (100, nullable), demo_password (100, nullable), demo_role (100, nullable),
stats (json, nullable), activity_logs (json, nullable), business_outcomes (json, nullable),
client_benefits (json, nullable), deliverables (json, nullable),
sample_action_label (100, nullable), sample_action_toast (text, nullable),
display_order (integer, default 0), is_active (boolean, default true), timestamps
```

**A2. New model — `backend/app/Models/SolutionProduct.php`**
- `$fillable` = every column above except `id`.
- `$casts`: `stats`, `activity_logs`, `business_outcomes`, `client_benefits`, `deliverables` → `array`; `is_active` → `boolean`; `display_order` → `integer`.

**A3. New seeder — `backend/database/seeders/SolutionProductSeeder.php`**
- Holds the 8 defaults currently in `DigitalSystemMap.tsx` (`erp, roadsafety, traccar, slicemart, leadlayer, ngodemo, aistudio, kothalipi`), converted from the TS shape to the DB columns (e.g. `icon: Globe` → `icon_name: 'Globe'`, `demoCredentials` → `demo_*`, `stats/activityLogs/…` stored as JSON).
- Upserts with `SolutionProduct::updateOrCreate(['slug' => $row['slug']], $row)` — **idempotent**.
- Register it in `DatabaseSeeder::run()` (fresh installs).

**A4. Production seeding path (deploy-safe).**
Because [`cpanel-deploy.sh`](file:///d:/DevCenterPoint-Studio/deploy/cpanel-deploy.sh#L462-L481) only seeds when the DB is empty, add an idempotent step right after `migrate --force`:
```
run_artisan db:seed --class=SolutionProductSeeder --force
```
This guarantees the 8 products exist on the already-populated production DB without a reseed. Safe to run every deploy (updateOrCreate).

**A5. `HomeController` — pass solution data.**
In [HomeController.php](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/HomeController.php):
- `$solutionStudioEnabled = ($settings['show_solution_studio_on_site'] ?? 'false') === 'true';`
- `$solutions = $solutionStudioEnabled ? SolutionProduct::where('is_active', true)->orderBy('display_order')->get() : [];`
- Add `'solutionProducts' => $solutions` to the `Inertia::render('Public/Home', [...])` props.

### B. Solution Studio — frontend wiring

**B1. `CmsContext.tsx`** — add `solutionProducts?: any[];` to `CmsData`.

**B2. `DigitalSystemMap.tsx`** (backend + `src/` mirror):
- Keep `SOLUTIONS` as the built-in **fallback** (site must never render empty). Rename usage to `DEFAULT_SOLUTIONS` for clarity (no behavioural change).
- Add `const cms = useCms();` and an `iconMap: Record<string, React.ElementType>` (copy the pattern from [ClientDemoSandboxModal.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ClientDemoSandboxModal.tsx#L185-L212)) covering the icons used by the solutions (`Globe, ShieldAlert, Radio, ShoppingCart, Layers, Heart, Sparkles, Languages, …`).
- Compute products: map `cms.solutionProducts` (if non-empty) → `SolutionProduct[]`, resolving `icon` via `iconMap[icon_name] || Globe` and `demoCredentials` from `demo_*`. Fall back to `DEFAULT_SOLUTIONS` when the CMS array is empty.
- Guard `activeSolutionId`: default to the first product's id; when the product list changes, `useEffect` resets `activeSolutionId` if the current id is no longer present (prevents a blank panel).
- `src/` mirror: same refactor; since `src/` has no `CmsProvider`, `useCms()` returns the default context whose `getSetting`/data are empty → it renders `DEFAULT_SOLUTIONS`. No CMS wiring needed there.

**B3. `Hero.tsx`** (backend + `src/` mirror) — wrap the Solution Studio block:
```tsx
{studioEnabled && (
  <motion.div …>
    <DigitalSystemMap />
  </motion.div>
)}
```
where `studioEnabled = cms.getSetting('show_solution_studio_on_site', 'false') === 'true'`.
Note: default **`false`** means the section is hidden until an admin flips it on (matches the `show_pricing_on_site` convention). The seeder will set it to `'true'` so current behaviour is preserved out of the box (see D1).

### C. Solution Studio — Admin CMS

**C1. New controller — `backend/app/Http/Controllers/Admin/AdminSolutionController.php`**
Mirror [AdminPlanController](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminPlanController.php) + [AdminSandboxController](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminSandboxController.php):
- `index()`: `SolutionProduct::orderBy('display_order')->get()`, plus `SiteSetting` `show_solution_studio_on_site` → Inertia `Admin/Solutions/Index`.
- `store(Request)`: validate (`slug` auto from `title` via `Str::slug` when blank, `unique:solution_products,slug`), `create`, `back()->with('success', …)`.
- `update(Request, SolutionProduct)`: same validation with `unique:…,' . $solutionProduct->id`.
- `destroy(SolutionProduct)`: delete.
- `toggleActive(SolutionProduct)`: flip `is_active`.
- `toggleSiteStudio(Request)`: `SiteSetting::updateOrCreate(['key' => 'show_solution_studio_on_site'], ['value' => $request->boolean('show_solution_studio') ? 'true' : 'false', 'group' => 'commercial'])`.

**C2. Routes — `backend/routes/web.php`** (inside the `['auth','verified']` admin group, after the Demo Sandbox block ~line 82):
```php
// Solution Studio CMS
Route::get('/solutions', [AdminSolutionController::class, 'index'])->name('solutions.index');
Route::post('/solutions', [AdminSolutionController::class, 'store'])->name('solutions.store');
Route::put('/solutions/{solutionProduct}', [AdminSolutionController::class, 'update'])->name('solutions.update');
Route::delete('/solutions/{solutionProduct}', [AdminSolutionController::class, 'destroy'])->name('solutions.destroy');
Route::patch('/solutions/{solutionProduct}/active', [AdminSolutionController::class, 'toggleActive'])->name('solutions.active');
Route::post('/solutions/site-studio', [AdminSolutionController::class, 'toggleSiteStudio'])->name('solutions.site_studio');
```

**C3. New admin page — `backend/resources/js/Pages/Admin/Solutions/Index.tsx`**
Model on [Admin/Sandbox/Index.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Admin/Sandbox/Index.tsx) (card grid + create/edit form drawer) with:
- A **master switch** at the top ("Show Solution Studio on public site") → `router.post('/admin/solutions/site-studio', { show_solution_studio })`.
- Per-card **Active/Visible** `is_active` toggle (checkbox in the form + a status pill on the card) → `router.patch('/admin/solutions/{id}/active')`.
- Inactive cards dimmed (`opacity-60`), like the sandbox page.
- Fields for all editable content (title, category, badge, tagline, icon_name, mockup_title, live_url, admin_url, demo_*, stats/activityLogs/businessOutcomes/clientBenefits/deliverables as JSON textareas or comma/newline inputs, sample_action_*, display_order, is_active).

**C4. Admin nav — `AdminLayout.tsx`**
Insert into the `navigation` array (~line 42, after "Demo Sandbox"):
```tsx
{ name: 'Solution Studio', href: '/admin/solutions', icon: Layers },
```
(`Layers` is already imported for "Page Blocks"; reuse it, or import `Boxes`.)

### D. Seed the new settings

**D1. `DatabaseSeeder.php`** — add to the `siteSettings` array (near `show_pricing_on_site`, ~L892):
```php
['key' => 'show_solution_studio_on_site', 'value' => 'true', 'group' => 'commercial'],
```
Value `'true'` preserves today's always-visible behaviour on fresh installs and on the production DB after the C4/A4 seeding step. Also call `(new SolutionProductSeeder())->run();` in `DatabaseSeeder::run()`.

### E. Theme transition — smooth crossfade (no curtain)

**E1. `ThemeContext.tsx`**
- Replace the shutter flow in `toggleTheme()` with: add a temporary `theme-transition` class on `<html>`, flip the theme class immediately, remove the temp class after ~320 ms. Keep `prefers-reduced-motion` short-circuit (flip with no transition).
- Remove `isShutterActive`/`shutterTargetTheme` state and the `ShutterTransitionOverlay` render; keep the exported fields as no-ops only if other files import them (verify with grep; `ThemeToggle` reads `isShutterActive`).
- Drop the Web Audio `playShutterDownSequence`/`playShutterCompleteClick` calls from the toggle (keep the tap/click sounds elsewhere).

**E2. `ThemeToggle.tsx`** — remove the `disabled={isShutterActive}` dependency (use a local `isTransitioning` guard or none).

**E3. `app.css`** (backend `resources/css/app.css`; mirror `src/index.css`)
Add a scoped crossfade so it only runs during a switch (not during scroll):
```css
html.theme-transition,
html.theme-transition *,
html.theme-transition *::before,
html.theme-transition *::after {
  transition: background-color 300ms ease, border-color 300ms ease,
              color 300ms ease, fill 300ms ease, stroke 300ms ease !important;
}
```

**E4. `ShutterTransitionOverlay.tsx`** — no longer rendered; delete the file in both trees (it has no other importers — verify with grep before deleting).

### F. Faster preloader

**F1. `GlobalLoadingScreen.tsx`** — change default `minDuration` from `1100` → `500`, and the completion settle from `180 ms` → `80 ms`. Reduce the loader's heavy visuals while visible: drop one of the two large `blur-[140px]` glows and stop the infinite breathing animation on the overlay (keep the progress bar + spinner). Keep `prefers-reduced-motion` behaviour.

**F2. `Home.tsx`** — no API change (`<GlobalLoadingScreen onMountComplete={…} />` keeps the new default). Optionally pass `minDuration={450}` explicitly for clarity.

### G. Bundle splitting + lazy sections

**G1. `backend/vite.config.js`** — add:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom'],
        'vendor-motion': ['framer-motion', 'motion'],
        'vendor-charts': ['recharts'],
        'vendor-ui': ['lucide-react', '@headlessui/react', 'react-helmet-async'],
      },
    },
  },
},
```
This creates separate cacheable chunks so the initial homepage download is no longer one 1.33 MB file.

**G2. `Home.tsx`** — lazy-load the **below-the-fold** sections only, keeping `SiteHeader`, `Hero`, `SiteFooter`, `GlobalLoadingScreen`, `CustomCursor`, `BackToTop`, `MobileBottomActionBar` eager:
- Convert `Positioning`, `CapabilitiesSection`, `SelectedWorkSection`, `TestimonialsSection`, `EngineeringPhilosophy`, `TechEcosystem`, `ProcessSection`, `EfficiencyMetricsSection`, `AboutPrinciples`, `FAQSection`, `ProjectInquiryBuilder`, `NewsletterSignup`, `PlansPricingSection`, `ClientDemoSandboxModal` to `React.lazy(() => import(...))`.
- Since `ScrollRevealSection` already gates on `whileInView`, wrap the lazy set in a small `<DeferredSection>` helper that renders a fixed-height placeholder until the wrapper scrolls near the viewport (so layout/`useScroll` stay stable), OR simpler: `<React.Suspense fallback={<div className="min-h-[40vh]" />}>` around each `ScrollRevealSection`. Use the simplest that avoids layout shift.
- Ensure named exports are handled: `const X = React.lazy(() => import('...').then(m => ({ default: m.X })))`.
- Mirror the same change in `src/App.tsx` (no CMS there).

### H. Throttle scroll listeners

**H1. `useHeaderBehavior.ts`** — wrap the `scroll` handler body in a `requestAnimationFrame` tick guard (skip if a frame is already queued).

**H2. `BackToTop.tsx`** — same rAF throttle for `setIsVisible` / `setScrollProgress`; only call `setState` when the value actually changed.

**H3. `CustomCursor.tsx`** — move pointer position to a ref + rAF, and update the element via direct `style.transform` instead of `setState` per `mousemove`. (Small, contained; removes a per-frame React render.)

### I. Mirrors in `src/`

Apply the shared **presentational** edits (B2/B3, E1–E4, F1, G2, H) to the matching `src/` files so both trees stay buildable and visually consistent. The `src/` tree has no CMS provider, so `DigitalSystemMap` there renders `DEFAULT_SOLUTIONS` and the Section-D/B3 gate uses the default context (which returns the fallback → `studioEnabled` will be evaluated against the fallback; set the mirror's default to `true` so the standalone SPA keeps showing the studio).

---

## Assumptions & Decisions

- **Primary target is `backend/`** (the deployed Laravel app). `src/` is a non-deployed SPA mirror; we keep its presentational files in sync but do not wire CMS there.
- **Master default = `'true'`** (seeded), so nothing disappears from the live site when this ships; admins can turn it off.
- **New dedicated `solution_products` table** (not reusing `sandbox_apps`) per the user's "Full management" choice.
- **`kothalipi`** (added earlier) is included in the seeded defaults, making the Solution Studio and the sandbox list intentionally different.
- Perf work stops at the agreed "balanced" scope: **no** hero-canvas rewrite, **no** consolidation of `framer-motion` + `motion`, **no** redesign of blur orbs.
- The deploy seed step (`db:seed --class=SolutionProductSeeder --force`) is safe because the seeder is `updateOrCreate`-based.

---

## Verification

1. **Typecheck/build (backend):** `cd backend; npx tsc --noEmit -p tsconfig.json; npm run build` → no errors; confirm the build emits separate `vendor-*.js` chunks and that `Home-*.js` shrinks substantially (check `backend/public/build/manifest.json`).
2. **PHP syntax:** `php -l` on the new controller, model, migration, and seeders.
3. **Migrate + seed locally:** `php artisan migrate --force; php artisan db:seed --class=SolutionProductSeeder --force` → 8 rows in `solution_products`; re-run to confirm idempotency (still 8).
4. **Public site (local):**
   - Studio visible by default; toggling `show_solution_studio_on_site` off in the DB hides the whole block.
   - Setting a product's `is_active = false` removes its tab; the default tab falls back to the first remaining product (never blank).
   - Editing a product's title/copy in Admin reflects on the homepage.
5. **Admin:** `/admin/solutions` loads from the sidebar; master switch and per-card toggles persist (flash success); create/edit/delete work.
6. **Theme:** toggle feels instant (~300 ms crossfade), no full-screen curtain, honoring `prefers-reduced-motion`.
7. **Loader:** first paint unlocked in ≤ ~500 ms + 80 ms.
8. **Mirror:** `cd d:\DevCenterPoint-Studio; npm run build` succeeds for the `src/` SPA.

---

## Deploy (after implementation + verification)

Per the confirmed tiered workflow and "Build, ZIP, commit + push":

1. `git -C d:\DevCenterPoint-Studio status` / `diff` / `log -n 5` (review).
2. Stage the specific changed files (backend resources, controllers, model, migration, seeder, routes, vite config, deploy script, `src/` mirrors) — **do not** `git add -A`.
3. Commit with a message covering both the CMS control and the perf/theme work; include the already-committed-but-unpushed `96738a4` (tiered packager) by pushing it along.
4. `git push origin main`.
5. Run the packager: `powershell -ExecutionPolicy Bypass -File backend/cpanel_deploy/package_cpanel.ps1` (default `-Target Frontend`) → produces `backend/cpanel_dist/public_html.zip`.
6. On the server: upload `public_html.zip` to `~/cpanel_uploads/`, then run `git pull` + `bash deploy/cpanel-deploy.sh` (which will `migrate --force`, run the idempotent `SolutionProductSeeder`, and mirror `build/` → `$CORE/public/build`).
7. Report the upload path, the exact terminal commands, and the commit hash to the user.
