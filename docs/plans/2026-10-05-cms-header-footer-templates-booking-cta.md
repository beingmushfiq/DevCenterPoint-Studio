# CMS-Driven Header & Footer Templates + Booking CTA

**Date:** 2026-10-05
**Target:** `devcenterpoint.com` — Laravel 12 + Inertia v2 + React 19 + Tailwind v4 (`backend/`)
**Goal:** Header & footer fully CMS-customizable with selectable design templates, raw HTML/CSS/JS override, and a "Book a Meeting" CTA wired to `https://cal.com/devcenterpoint`.

---

## 0. Locked Decisions (from clarification round)

| Question | Decision |
|---|---|
| Template engine | **Hybrid** — code-defined React presets + optional per-region HTML/CSS/JS override |
| Template set | **3 headers + 3 footers** |
| Booking CTA placement | Header nav CTA · Mobile sticky bar · Hero · Contact/footer/success card |
| Code safety | **Trusted admin + preview/staging before publish** |

---

## 1. Evidence — Current State

| Area | Finding | File |
|---|---|---|
| Header | **100% hardcoded.** 5 fixed nav buttons, inline WhatsApp/email/GitHub links. No CMS read at all. | [Navigation.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Navigation.tsx) |
| Footer | **100% hardcoded.** 8 fixed nav anchors, 6 fixed ecosystem links. Never reads `footer/details`. | [Footer.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Footer.tsx) |
| Booking URL | `booking_url: 'https://cal.com/devcenterpoint'` exists in admin defaults + has an input field, but is **never consumed** on the public site. | [Settings/Index.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Admin/Settings/Index.tsx#L47) |
| `getSectionBlock()` | Defined in context but **never called anywhere** (dead API). | [CmsContext.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Context/CmsContext.tsx#L29-L34) |
| `custom_head_scripts` / `custom_body_scripts` | Settings exist with textareas, but `app.blade.php` **never renders them**. | [app.blade.php](file:///d:/DevCenterPoint-Studio/backend/resources/views/app.blade.php) |
| `footer/details` block | Seeded in DB (`company_bio`, `contact_email`, …) but **unused**. | [DatabaseSeeder.php](file:///d:/DevCenterPoint-Studio/backend/database/seeders/DatabaseSeeder.php#L615-L625) |
| Storage model | `SiteSetting` = flat key/value (works). `PageSection` = `section_key`+`block_key`+JSON (works). No template tables. | [migration](file:///d:/DevCenterPoint-Studio/backend/database/migrations/2026_09_27_000001_create_cms_and_crm_tables.php) |
| Admin routes | `/admin/sections`, `/admin/settings` exist. **No** header/footer template route. | [web.php](file:///d:/DevCenterPoint-Studio/backend/routes/web.php#L85-L91) |

**Conclusion:** this is an *extension* of an existing (partly dormant) CMS backbone, not a greenfield build. `SiteSetting` + `PageSection` can carry all new state — **no new table is strictly required**, though one is recommended for code-override isolation (§4).

---

## 2. Objectives

| # | Objective | Success Criteria |
|---|---|---|
| O1 | Header becomes CMS-driven with **3 selectable presets** | Switching template in admin changes the live header after save; no code edit needed |
| O2 | Footer becomes CMS-driven with **3 selectable presets** | Same as O1 for footer |
| O3 | Structured content is editable (brand, nav links, social, columns) | Admin can add/remove/reorder nav links & footer columns without code |
| O4 | Per-region **raw HTML/CSS/JS override** with preview-before-publish | Admin toggles override → live preview iframe shows result → "Publish" applies it to the public site |
| O5 | Booking CTA at 4 placements, single source of truth | All 4 read `booking_url`; changing the setting updates all 4 |
| O6 | Existing dead code activated | `custom_head_scripts` / `custom_body_scripts` actually render; footer presets consume `footer/details` |

---

## 3. Architecture

### 3.1 Data flow

```
Admin UI (HeaderFooter/Index.tsx)
        │  POST /admin/appearance
        ▼
SiteSetting (flat, group='appearance')
  header_template      = 'glass-pill' | 'solid-bar' | 'mega-menu'
  footer_template      = 'four-column' | 'compact-row' | 'mega-sitemap'
  header_override_mode = 'off' | 'preview' | 'live'
  header_override_html / _css / _js
  footer_override_html / _css / _js
  header_nav_links     = JSON  (label, href, is_cta)
  footer_columns       = JSON  (title, links[])
        │
        ▼
HomeController → siteSettings → CmsProvider
        │
        ▼
SiteHeader.tsx  ──switch(header_template)──▶  presets/HeaderGlassPill.tsx
SiteFooter.tsx  ──switch(footer_template)──▶  presets/FooterFourColumn.tsx
        │
        └─ if override_mode === 'live' → <RegionOverride html css js /> (sandboxed iframe)
```

### 3.2 File layout (new)

```
backend/resources/js/Components/
├── SiteHeader.tsx                 # dispatcher: template switch + override gate
├── SiteFooter.tsx                 # dispatcher
├── HeaderTemplates/
│   ├── HeaderGlassPill.tsx        # = current Navigation.tsx, CMS-ified
│   ├── HeaderSolidBar.tsx         # NEW: minimal solid bar
│   └── HeaderMegaMenu.tsx         # NEW: mega-menu with columned dropdowns
├── FooterTemplates/
│   ├── FooterFourColumn.tsx       # = current Footer.tsx, CMS-ified
│   ├── FooterCompactRow.tsx       # NEW: single-row compact
│   └── FooterMegaSitemap.tsx      # NEW: full sitemap grid
├── RegionOverride.tsx             # sandboxed iframe renderer for raw HTML/CSS/JS
├── BookingCta.tsx                 # shared booking button (reads booking_url)
└── shared/
    ├── useHeaderData.ts           # nav links, brand, social, booking from CMS
    └── useFooterData.ts           # columns, bio, contact, copyright from CMS
```

> `Navigation.tsx` / `Footer.tsx` are kept temporarily as thin re-exports during migration, then deleted (no backwards-compat shim).

### 3.3 Booking CTA — single source of truth

A `BookingCta.tsx` component reads `cms.getSetting('booking_url', 'https://cal.com/devcenterpoint')` and renders a consistently styled button. Placements:

| Placement | Component | Change |
|---|---|---|
| Header nav CTA | all 3 header presets | New secondary button next to "Start a Project" (desktop + mobile drawer) |
| Mobile sticky bar | [MobileBottomActionBar.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/MobileBottomActionBar.tsx) | Add 4th action (compress to icon-only to keep bar balanced) |
| Hero | [Hero.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Hero.tsx#L19-L20) | Add tertiary "Book a Meeting" ghost button beside existing 2 CTAs |
| Contact / footer / success card | [ProjectInquiryBuilder.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ProjectInquiryBuilder.tsx#L436-L456), [Footer.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Footer.tsx) | Add booking button to success card action row; add booking link in every footer preset |

All four use `target="_blank" rel="noopener noreferrer"` and the `Calendar` lucide icon.

---

## 4. Storage Decision

**Recommended: reuse `SiteSetting` for config + add one `PageSection` block for code overrides.**

- **Why not a new table:** `SiteSetting` is already a generic flat KV store with a `group` column (unused by the controller but present). All template/override keys fit there. Adding a migration is avoidable complexity.
- **Code override storage:** store in `PageSection` as `section_key='appearance'`, `block_key='header_override'` / `'footer_override'` with `content` = `{"html":"…","css":"…","js":"…","mode":"off|preview|live"}`. This keeps large code blobs out of the flat settings table and gives `is_visible` for free.
- **Required controller fix:** [AdminSettingController::update()](file:///d:/DevCenterPoint-Studio/backend/app/Http/Controllers/Admin/AdminSettingController.php#L29-L41) currently does no validation and writes no `group`. It must be tightened (see §6).

> If the user prefers strict separation, the alternative is a `appearance_templates` table. **This plan assumes `SiteSetting` + `PageSection`** unless the user objects.

---

## 5. Workstreams

### Workstream A — Header & Footer Presets (React)

1. Create `useHeaderData()` / `useFooterData()` hooks reading CMS with sensible fallbacks (current hardcoded values become the fallbacks — zero visual regression on day one).
2. **Header presets:**
   - `HeaderGlassPill` — port `Navigation.tsx` verbatim, replace hardcoded arrays with hook data + `BookingCta`.
   - `HeaderSolidBar` — NEW: flat opaque bar, no blur, thin border, left brand / center links / right CTA.
   - `HeaderMegaMenu` — NEW: links with hover dropdown panels driven by `header_nav_links[].children`.
3. **Footer presets:**
   - `FooterFourColumn` — port `Footer.tsx` verbatim, replace hardcoded lists with `footer_columns`, consume seeded `footer/details` for bio/contact/copyright.
   - `FooterCompactRow` — NEW: one row, brand + inline links + social icons + booking.
   - `FooterMegaSitemap` — NEW: multi-column sitemap + newsletter slot + booking CTA.
4. `SiteHeader.tsx` / `SiteFooter.tsx` dispatchers with `switch` on the template key; wired into [Home.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Public/Home.tsx).

### Workstream B — Raw HTML/CSS/JS Override + Preview

1. `RegionOverride.tsx`:
   - Renders a **sandboxed `<iframe>`** (`sandbox="allow-scripts"`, no `allow-same-origin`) with a composed document:
     `<!doctype html><html><head><style>{css}</style></head><body>{html}<script>{js}</script></body></html>`.
   - Scoped inside the header/footer slot; height auto-measured via `postMessage` from inside the frame.
   - Only rendered when `mode === 'live'` on the public site.
2. **Preview flow:** admin selects `mode='preview'` → public site is untouched → admin sees a live iframe inside the admin panel rendering the composed document → "Publish" sets `mode='live'`.
3. **Safety gating:** the route is already behind `auth` + `verified`. Optionally restrict to `role === 'superadmin'` (seeder creates `superadmin`). All override writes are validated + length-capped (§6).
4. Activate `custom_head_scripts` / `custom_body_scripts` in `app.blade.php` (raw `{!! !!}` after CMS settings are available). *Note: these are global, not header/footer-scoped — keep them separate.*

### Workstream C — Admin UI

1. New admin page `Pages/Admin/Appearance/Index.tsx` with tabs:
   - **Header** — preset radio cards (visual thumbnails), nav-link repeater, override editor (HTML/CSS/JS tabs) + preview pane + Publish.
   - **Footer** — preset radio cards, column repeater, override editor + preview + Publish.
   - **Booking** — `booking_url` input + per-placement toggles.
2. New route group in [web.php](file:///d:/DevCenterPoint-Studio/backend/routes/web.php#L85-L91):
   ```
   GET  /admin/appearance            → AdminAppearanceController@index
   POST /admin/appearance            → AdminAppearanceController@update   (templates + JSON lists)
   POST /admin/appearance/override   → AdminAppearanceController@saveOverride
   POST /admin/appearance/override/publish → AdminAppearanceController@publishOverride
   ```
3. Extend `AdminSettingController::update()` validation (whitelist appearance keys; cap override length; store `group`).
4. Add `{ name: 'Appearance', href: '/admin/appearance', icon: Palette }` to [AdminLayout.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Layouts/AdminLayout.tsx#L33-L46) navigation.
5. `HomeController` — no change needed; `siteSettings` is already passed. `PageSection` overrides already flow through `pageSections`.

### Workstream D — Seeder

Seed new keys so the feature works immediately after `migrate --seed`:
- `header_template = 'glass-pill'`, `footer_template = 'four-column'`
- `header_nav_links` = current 5 links + booking CTA entry
- `footer_columns` = current Navigation + Studio Ecosystem lists
- `booking_url = 'https://cal.com/devcenterpoint'` (currently only in UI defaults — promote to DB)
- `appearance/header_override` + `appearance/footer_override` blocks with `mode='off'`

---

## 6. Validation & Safety Rules

| Rule | Implementation |
|---|---|
| Only trusted admins edit raw code | Route middleware `auth` + `verified` + `role:superadmin` |
| No raw code on public site until published | `mode` must be `live`; `preview` renders only inside admin |
| JS cannot escape the override frame | `sandbox="allow-scripts"` (no `allow-same-origin`, no `allow-forms`, no `allow-top-navigation`) |
| Payload size cap | Validate `html ≤ 100 KB`, `css ≤ 50 KB`, `js ≤ 50 KB` |
| Appearance keys whitelisted | `AdminAppearanceController` validates an explicit key list; `AdminSettingController` rejects unknown `appearance_*` keys |
| Template key must be a known preset | `in:glass-pill,solid-bar,mega-menu` / `in:four-column,compact-row,mega-sitemap` |
| No visual regression on upgrade | Every preset falls back to today's exact hardcoded content when CMS keys are absent |

---

## 7. Razor-Thin Scope Guard

Explicitly **in scope**: the 3+3 presets, CMS binding, override layer, preview/publish, 4 booking placements, admin UI, seeder keys.

Explicitly **out of scope** (do not build unless asked):
- Drag-and-drop page builder
- Per-page (non-home) headers/footers
- Visual code editor (Monaco/CodeMirror) — plain `<textarea>` with monospace font is sufficient for v1
- Template marketplace / user-uploaded templates
- A/B testing of templates

---

## 8. Execution Order (after approval)

| Step | Workstream | Deliverable | Verify |
|---|---|---|---|
| 1 | A.1 | `useHeaderData` / `useFooterData` hooks | `tsc --noEmit` clean on touched files |
| 2 | A.2 | 3 header presets + `SiteHeader` dispatcher | Renders identically to today with default template |
| 3 | A.3 | 3 footer presets + `SiteFooter` dispatcher | Same |
| 4 | D | Seeder keys + `booking_url` in DB | `migrate:fresh --seed` succeeds |
| 5 | 3.3 | `BookingCta` in all 4 placements | All 4 open `cal.com/devcenterpoint` |
| 6 | B | `RegionOverride` + preview/publish flow | Preview iframe isolates JS; live only after publish |
| 7 | C | Admin Appearance page + routes + nav | Admin can switch template and see live change |
| 8 | B.4 | Render `custom_head_scripts` / `custom_body_scripts` | Script present in page source |
| 9 | — | Delete `Navigation.tsx` / `Footer.tsx` shims | `npm run build` succeeds |

---

## 9. Hazards

| Hazard | Mitigation |
|---|---|
| Raw JS in override frame could phone home / exfiltrate | Sandbox has no `allow-same-origin`, so no access to parent cookies/storage. Document that only trusted admins get access. |
| Iframe height jitter causing layout shift | Measure via `postMessage` + `ResizeObserver` inside frame; set a min-height. |
| Mega Menu preset complexity bloating scope | Cap dropdowns at 2 levels; reuse `header_nav_links[].children`. |
| CMS keys absent on an existing production DB | All hooks fall back to today's hardcoded defaults → no breakage; seeder is idempotent (`updateOrCreate`). |
| `AdminSettingController` writing unvalidated keys | Tighten in step 5 of execution order before new keys ship. |
| Overriding header/footer breaks `#contact` scroll behavior | Presets reuse `handleNavClick`; override regions are inert by design (documented). |

---

## 10. Open Question for the User

Only one remains before implementation:

**Should the raw-code override be restricted to `superadmin` role only, or available to any authenticated admin?**
The plan currently assumes `superadmin` (safest). If all admins are equally trusted, this can be relaxed to plain `auth` + `verified`.
