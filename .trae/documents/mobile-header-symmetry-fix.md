# Mobile Header: Symmetry, Icon Sizing & Booking Overflow Fix

## Summary

Three related mobile header problems on `devcenterpoint.com`:

1. **"Book a Meeting" overflows the header pill** and pushes the hamburger off-screen, so there is **no visible menu option** on mobile.
2. **The right-hand control cluster is not symmetrical** — sound, theme, search and menu controls render at **four different sizes**.
3. **Icon shapes/sizes don't match** across the toggles.

The overflow (problem 1) already has a committed root-cause fix (`d3a5de7`, `twMerge` in `BookingCta`) that is **not yet deployed** — the live site still serves the old bundle. This plan completes the symmetry/sizing work, adds a visible `Menu` label to the hamburger, and deploys everything so the fix is actually live.

---

## Current State Analysis (Audit)

### Where the header lives
- Dispatcher: [SiteHeader.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/SiteHeader.tsx) selects a preset from the CMS setting `header_template`. Default = `glass-pill`.
- Presets: [HeaderGlassPill.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderGlassPill.tsx) (default), [HeaderSolidBar.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderSolidBar.tsx), [HeaderMegaMenu.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderMegaMenu.tsx).
- Mobile navigation drawer: [HeaderMobileDrawer.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderMobileDrawer.tsx) — contains the real nav links (`#work`, `#capabilities`, `#process`, `#faq`, `#contact`).
- Shared controls: [SoundToggle.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/SoundToggle.tsx), [ThemeToggle.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ThemeToggle.tsx), [BookingCta.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/BookingCta.tsx).

### Problem 1 — Booking CTA overflow → hamburger pushed off-screen
- **Root cause (already fixed in code, not deployed):** `BookingCta` hardcoded `inline-flex` in its base classes while callers append responsive visibility classes (`hidden xl:inline-flex` / `hidden sm:inline-flex`). In Tailwind v4's compiled output, `.inline-flex` is emitted *after* `.hidden` at equal specificity, so it wins and the button renders at **all** widths — spilling out of the pill on mobile.
- **Fix already committed** in [BookingCta.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/BookingCta.tsx#L58-L61): final className is wrapped in `twMerge(...)`, which drops the conflicting base `inline-flex` so `hidden` re-asserts.
- **Live-site proof of non-deployment:** `https://devcenterpoint.com/` still references `build/assets/app-BsF5-FTK.js` + `app-CzFt*.css` (the pre-fix bundle). The fixed bundle (`app-2n4MU26x.js` / `app-B23aqaes.css`) exists locally and in the `d3a5de7` commit.
- **Consequence:** the mobile `lg:hidden` hamburger IS rendered, but sits beyond the right edge of the pill (visible in the screenshot as the cut-off "Book a Meeting"), so users cannot open the nav drawer.

### Problem 2 & 3 — Asymmetric cluster, mismatched icon sizes
Measured control sizes in the current code:

| Control | File | Current sizing | Rendered height |
| :--- | :--- | :--- | :--- |
| Sound toggle | [SoundToggle.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/SoundToggle.tsx#L17) | `w-9 h-9 rounded-full`, icon `w-4 h-4` | **36px** |
| Theme toggle | [ThemeToggle.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ThemeToggle.tsx#L14) | `px-3 py-2 rounded-full`, icon `w-4 h-4` **+ `Light`/`Dark` text label** | **~32px, extra wide** |
| Search | header presets (e.g. [HeaderGlassPill.tsx L108](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderGlassPill.tsx#L108)) | `w-9 h-9 rounded-full`, icon `w-4 h-4` | **36px** |
| Hamburger | [HeaderGlassPill.tsx L147](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderGlassPill.tsx#L147) | `p-1.5` + `w-4 h-4` icon | **~28px** |
| Hamburger | [HeaderSolidBar.tsx L107](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderSolidBar.tsx#L107) / [HeaderMegaMenu.tsx L170](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderMegaMenu.tsx#L170) | `p-2` + `w-4 h-4` icon | **~32px** |

Result: **four different heights (36 / 32 / 36 / 28–32)** plus a text label on the theme toggle → the row looks uneven, exactly as reported.

### Mobile visibility of the right cluster (glass-pill)
At `<640px` (mobile), only these render: `SoundToggle` (36px) + `ThemeToggle` (32px + label) + hamburger (28px). Search is `hidden md:flex`, booking is `hidden xl:inline-flex`, "Start a Project" is `hidden sm:inline-flex` — all correctly hidden on mobile.

---

## Proposed Changes

### Decision baseline (from user)
- **All icon controls → uniform icon-only 36×36 (`w-9 h-9 rounded-full`) circles.**
- **Theme toggle loses its `Light`/`Dark` text label** (becomes icon-only).
- **Hamburger becomes `icon + "Menu"` label** for mobile discoverability.
- **Include rebuild + deploy** so the fix is live.

### 1. `backend/resources/js/Components/SoundToggle.tsx`
- **What:** No structural change — already `w-9 h-9 rounded-full` with `w-4 h-4` icon.
- **Why:** It is the reference size for the cluster.
- **How:** Verify only; leave as-is.

### 2. `backend/resources/js/Components/ThemeToggle.tsx`
- **What:** Convert from a variable-width pill with a text label into a uniform icon-only circle.
- **Why:** It is the main source of asymmetry (extra width + a different height).
- **How:**
  - Outer `<button>`: replace `px-3 py-2 rounded-full` with `w-9 h-9 rounded-full` (keep `relative`, `border`, `flex items-center justify-center`, transition/disabled classes).
  - Remove the `<span className="hidden sm:inline ...">Light</span>` and `Dark` spans so only the `Sun`/`Moon` icon renders.
  - Keep the `motion.div` rotate/scale animation wrapper; change its inner classes from `flex items-center gap-2 text-xs font-black tracking-tight` to `flex items-center justify-center` and keep icon `w-4 h-4`.
- **Impact check:** `ThemeToggle` is also used in [HeaderMobileDrawer.tsx L204](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderMobileDrawer.tsx#L204), where it sits next to an `Appearance` label. Icon-only still reads correctly there.

### 3. Hamburger buttons in the three presets
Files: [HeaderGlassPill.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderGlassPill.tsx#L141-L151), [HeaderSolidBar.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderSolidBar.tsx#L101-L111), [HeaderMegaMenu.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeaderTemplates/HeaderMegaMenu.tsx#L164-L174).

- **What:** Add a `Menu` text label beside the icon, and normalize the button to a 36px-tall rounded control matching the rest of the cluster.
- **Why:** User requested the label; also fixes the smallest control in the row.
- **How (per file):**
  - Change `p-1.5` / `p-2` sizing to `inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full` (keep each file's existing background/border/color theme, keep `lg:hidden`).
  - Render `{menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}` followed by `<span className="text-xs font-bold">{menuOpen ? 'Close' : 'Menu'}</span>`.
- **Mobile width guard:** The label adds ~40px. The pill is `w-[95%]`; at 390–412px this fits comfortably. To protect 360px-class screens, gate the label with `hidden min-[380px]:inline` so the button gracefully reverts to icon-only on the narrowest devices while keeping the label on the user's device class.

### 4. Search buttons in the three presets
- **What:** No change — already `w-9 h-9 rounded-full` with `w-4 h-4` icon (matches the new standard).
- **How:** Verify only.

### 5. (No code change) Booking CTA visibility on mobile
- Confirmed correct once deployed: `hidden xl:inline-flex` (glass-pill) / `hidden sm:inline-flex` (solid-bar, mega-menu) mean booking never renders in the mobile top bar; it stays in the drawer + bottom action bar. No edit needed.

### 6. Rebuild + deploy
1. `cd backend && npx tsc --noEmit` → expect exit 0.
2. `cd backend && npm run build` → regenerates hashed assets in `backend/public/build`.
3. Stage the 4 edited component files **and** `backend/public/build`.
4. Commit + `git push origin main`.
5. On the server (manual, cPanel → **Git Version Control** → repository):
   - **Update from Remote** (pulls the new commit).
   - **Deploy HEAD Commit** (runs `.cpanel.yml` → [deploy/cpanel-deploy.sh](file:///d:/DevCenterPoint-Studio/deploy/cpanel-deploy.sh), publishing `build/` into `public_html`).
6. Hard-refresh on mobile; verify the new content-hashed assets load.

---

## Assumptions & Decisions

- **Uniform icon-only 36×36 circles** (user-selected) is the target size token; `SoundToggle`/Search already comply.
- **Theme toggle label removed** (user-selected) — it is duplicated contextually in the drawer's `Appearance` row anyway.
- **Hamburger keeps a text label** (`Menu`/`Close`) per the user's added note, with a narrow-screen fallback (`min-[380px]`) so it cannot itself cause overflow.
- **Booking stays out of the mobile top bar** (prior decision: minimal header; booking lives in drawer + bottom bar).
- The `d3a5de7` twMerge fix ships in the same deploy; no re-rework of that logic.
- Deploy is **Git-driven** via cPanel; the `deploy_to_remote` MCP tool targets Vercel and is **not** applicable here.

---

## Verification

| Step | Command / Check | Expected |
| :--- | :--- | :--- |
| Types | `cd backend; npx tsc --noEmit` | exit 0, no `ThemeToggle`/header errors |
| Build | `cd backend; npm run build` | `✓ built`, new hashed files in `public/build` |
| Manifest | [manifest.json](file:///d:/DevCenterPoint-Studio/backend/public/build/manifest.json) references new `app-*.js` / `app-*.css` | entries updated |
| Toggles | Inspect [ThemeToggle.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ThemeToggle.tsx) | icon-only, `w-9 h-9 rounded-full` |
| Cluster symmetry | Compare rendered heights of sound/theme/search/menu | all controls 36px tall |
| No overflow | Mobile view at 360 / 375 / 390 / 412px | 0px horizontal scroll; hamburger fully visible |
| Menu works | Tap `Menu` on mobile | drawer opens with nav links (`Work`, `Capabilities`, `Process`, `FAQ`, `Start Project`) |
| Live | `https://devcenterpoint.com/` after deploy | loads new hashed bundle; booking CTA absent from mobile pill |
