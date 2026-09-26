# 05 — Frontend Architecture

**Status: [VERIFIED]**

---

## Framework

- **React 19** — Concurrent features, StrictMode
- **TypeScript 5.8** — Strict compilation
- **Vite 6.2** — Build tool, HMR
- **No routing library** — Hash-based scroll anchors only

---

## Entry Points

| File | Role |
|---|---|
| `index.html` | HTML shell, Google Fonts, pre-hydration theme script, favicon |
| `src/main.tsx` | `createRoot().render(<StrictMode><App /></StrictMode>)` |
| `src/App.tsx` | Provider wrappers + all section composition |

---

## Provider Hierarchy (Outermost → Innermost)

```
HelmetProvider          (react-helmet-async)
  SEOProvider           (src/components/SEOHead.tsx)
    ThemeProvider       (src/context/ThemeContext.tsx)
      GlobalLoadingScreen
      [App content]
```

---

## Animation System

**Library:** `framer-motion` / `motion` (both in package.json; imports are SPLIT across both paths — see below)

**Import path split [VERIFIED by grep]:**
- `import { motion } from 'framer-motion'` — used in: `App.tsx`, `ThemeToggle.tsx`, `TechEcosystem.tsx`, `ShutterTransitionOverlay.tsx`, `GlobalLoadingScreen.tsx`, `BackToTop.tsx`
- `import { motion, AnimatePresence } from 'motion/react'` — used in: `ProjectInquiryBuilder.tsx`, `Navigation.tsx`, `CaseStudyModal.tsx`, `ProcessSection.tsx`, and others

Both packages are in package.json and both are actively used.

Key patterns:
- **`ScrollRevealSection`** (defined in `App.tsx`): Wraps each page section with `motion.div` that fades/slides in on viewport entry. Uses `whileInView`, `viewport={{ once: true, amount: 0.05 }}`. Delay is configurable. Respects `useReducedMotion`.
- **`HeroReveal`** (defined in `App.tsx`): Immediate mount animation for hero, uses `animate` (not `whileInView`).
- **`AnimatePresence`**: Used for modals, dropdowns, mobile menu (exit animations).
- **`ShutterTransitionOverlay`**: Full-viewport cinematic overlay for dark/light toggle.
- Easing: `[0.22, 1, 0.36, 1]` (custom cubic-bezier, editorial deceleration)

---

## Context / State

### ThemeContext (`src/context/ThemeContext.tsx`)

| Exported | Type | Description |
|---|---|---|
| `ThemeProvider` | Component | Wraps app; manages theme + sound state |
| `useTheme` | Hook | Consumer hook |
| `theme` | `'dark' \| 'light'` | Current theme |
| `toggleTheme()` | Function | Triggers shutter animation, sets theme, plays sound |
| `setTheme(theme)` | Function | Direct setter (no animation) |
| `isShutterActive` | boolean | Shutter animation in progress guard |
| `shutterTargetTheme` | Theme\|null | Target for shutter |
| `isSoundMuted` | boolean | Global sound mute state |
| `toggleSound()` | Function | Toggle sound + persist to localStorage |

**LocalStorage keys:**
- `dcp_theme` → `'dark'` or `'light'`
- `dcp_sound_muted` → `'true'` or `'false'`

**Pre-hydration**: `index.html` has inline script to read `dcp_theme` from localStorage and apply `dark`/`light` class to `<html>` before React hydrates (prevents flash).

### SEOContext (`src/components/SEOHead.tsx`)

| Exported | Type | Description |
|---|---|---|
| `SEOProvider` | Component | Wraps app; manages scroll-aware section tracking |
| `useSEO` | Hook | Consumer hook |
| `activeSection` | string | Current section in viewport |
| `setActiveSection` | Function | Override active section |
| `setCustomSEO` | Function | Override meta for custom states |
| `currentMeta` | SectionSEOMetadata | Merged/resolved metadata |

---

## Components Reference

### Navigation (`Navigation.tsx`)

**Purpose:** Fixed top navigation bar.

**Features:**
- Scroll detection → changes from transparent to glassmorphic (backdrop-blur) at `scrollY > 40`
- Active section detection via `getBoundingClientRect` on scroll
- "Services" mega-menu dropdown (hover, 480px wide, 4 service cards)
- "Methodology" mega-menu dropdown (hover, 440px wide, 3 items)
- Direct links: Work, FAQ
- Right CTA: "Start a Project" → scrolls to `#contact`
- Theme toggle + sound control
- ⌘K Command Palette trigger
- Mobile full-screen drawer (AnimatePresence, complete takeover)
- "Available for Q4" live status indicator (hardcoded)
- Sound: `soundEngine.playClick()`, `playMenuToggle()`

**State:**
- `scrolled` — for glassmorphic header
- `mobileMenuOpen` — mobile drawer
- `activeSection` — nav item highlight
- `openDropdown` — 'services' | 'methodology' | null
- `isCommandOpen` — ⌘K palette

---

### GlobalLoadingScreen (`GlobalLoadingScreen.tsx`)

**Purpose:** Initial page load skeleton/animation to prevent unstyled flash.

**Behavior:** Renders a branded loading screen on mount. Calls `onMountComplete()` prop callback when done, triggering the App to fade in (`isSiteLoaded` state). 24KB file — likely contains elaborate skeleton UI.

---

### Hero (`Hero.tsx`)

**Purpose:** Above-the-fold landing section.

**Contains:** Headline, subheadline, primary CTAs ("Start a Project" → `#contact`, secondary CTA), animated `DigitalSystemMap` graphic.

---

### CapabilitiesSection (`CapabilitiesSection.tsx`)

**Purpose:** Interactive display of the company's 8 service capabilities.

**Data source:** `src/data/capabilities.ts` → `CAPABILITIES_DATA` (8 items)

**Features:** Category tabs/filter, code sample inspector panel per capability.

---

### SelectedWorkSection (`SelectedWorkSection.tsx`)

**Purpose:** Portfolio grid displaying 7 project case studies.

**Data source:** `src/data/projects.ts` → `PROJECTS_DATA` (7 items)

**Opens:** `CaseStudyModal` — full-screen case study detail with `BreadcrumbNavigation`, `ProjectScreenshotCarousel`.

**Extended detail data:** `src/data/simulatedProjectDb.ts` (45KB) — deep case study content.

---

### EngineeringPhilosophy (`EngineeringPhilosophy.tsx`)

**Purpose:** Interactive 5-layer system architecture diagram.

**Features:** Clickable layers → opens `MilestoneDetailModal` with deep technical specs per layer. `TableOfContentsDropdown` for navigation.

---

### TechEcosystem (`TechEcosystem.tsx`)

**Purpose:** Technology matrix organized by categories.

**Data source:** `src/data/technology.ts` → `TECH_STACK_DATA`

**Categories (from types.ts):** `'Frontend' | 'Backend' | 'Data' | 'Infrastructure' | 'Realtime' | 'AI / ML'`

**Sub-component:** `TechIcon` renders tech icons from devicons CDN via `iconSlug`.

---

### ProcessSection (`ProcessSection.tsx`)

**Purpose:** 6-phase engineering process timeline.

**Data source:** `src/data/process.ts`

**Features:** Phase timeline, milestone cards, deep-dive with `TableOfContentsDropdown`. 36KB — complex component.

---

### EfficiencyMetricsSection (`EfficiencyMetricsSection.tsx`)

**Purpose:** Animated KPI data visualization.

**Library:** Recharts

**Shows:** Metrics like uptime (99.98%), API latency (<50ms), feature velocity (+65%), code quality metrics.

---

### FAQSection (`FAQSection.tsx`)

**Purpose:** FAQ accordion.

**Data source:** `src/data/faq.ts` → `FAQ_DATA`

**Categories:** `'Engineering & Process' | 'Engagement Models' | 'Security & IP' | 'Post-Launch & SLAs'`

**Features:** Category filter tabs, accordion expand/collapse, highlight keywords.

---

### ProjectInquiryBuilder (`ProjectInquiryBuilder.tsx`)

**Purpose:** Multi-step project inquiry/contact form. This is the **primary conversion action** on the site.

**Writes to:** Firebase Firestore `inquiries` collection via `submitProjectInquiry()`

**Form fields:**
- `projectType` — selected from 4 options (default: 'SaaS / Web Product')
- `timeline` — 3 options (default: '2 - 3 Months')
- `name` — required string
- `email` — required string
- `company` — optional
- `description` — optional free text
- `selectedTech` — optional multi-select array
- `budgetRange` — optional

**Success behavior:** confetti (canvas-confetti), `soundEngine.playSuccessChime()`, shows reference number (e.g., `DCP-2026-8942`).

---

### NewsletterSignup (`NewsletterSignup.tsx`)

**Purpose:** Email subscription form.

**Writes to:** Firebase Firestore `newsletter_subscribers` via `subscribeToNewsletter()`

**Validation:** Client-side email regex + max 150 chars. Also enforced in Firestore rules.

---

### CommandPalette (`CommandPalette.tsx`)

**Purpose:** ⌘K spotlight-style search across all site sections and links.

**Trigger:** Keyboard shortcut `Ctrl+K` / `⌘K` or search button in Navigation.

**Behavior:** Fuzzy match against indexed section titles and content.

---

### SEOHead (`SEOHead.tsx`)

**Purpose:** Dynamic `<head>` management with per-section SEO metadata.

**Sections tracked:** `hero`, `positioning`, `capabilities`, `work`, `architecture`, `tech`, `process`, `metrics`, `about`, `contact`

**Manages:** title, description, keywords, canonical URL, Open Graph, Twitter Card, Schema.org JSON-LD (Organization + WebSite + WebPage)

**Twitter handle:** `@devcenterpoint` [INFERRED — from source]

**Organization domain:** `https://devcenterpoint.com` [INFERRED — fallback in source]

---

### DevCenterPointLogo (`DevCenterPointLogo.tsx`)

**Purpose:** Brand logo SVG component.

**Props:** `variant: 'horizontal' | 'compact'`, `size: 'sm' | 'md' | 'lg'`, `showTagline: boolean`

---

### CustomCursor (`CustomCursor.tsx`)

**Purpose:** Desktop-only custom cursor dot that follows mouse. CSS pointer-events: none.

---

### BackToTop (`BackToTop.tsx`)

**Purpose:** Floating button visible after scroll, clicks → `window.scrollTo({ top: 0 })` + `soundEngine.playScrollTop()`.

---

### ShutterTransitionOverlay (`ShutterTransitionOverlay.tsx`)

**Purpose:** Full-screen cinematic overlay that slides down over the page during dark/light theme switching.

**Props:** `isActive`, `targetTheme`, `onComplete`

---

### ThemeToggle (`ThemeToggle.tsx`)

**Purpose:** Button that calls `toggleTheme()` from `useTheme()`. Triggers `ShutterTransitionOverlay`.

---

## Data Files (src/data/)

All data is **static TypeScript**. No API calls. Data is bundled at build time.

| File | Export | Records | Description |
|---|---|---|---|
| `projects.ts` | `PROJECTS_DATA: Project[]` | 7 | Portfolio projects |
| `capabilities.ts` | `CAPABILITIES_DATA: Capability[]` | 8 | Service capabilities |
| `technology.ts` | `TECH_STACK_DATA: TechItem[]` | Multiple | Tech stack items |
| `faq.ts` | `FAQ_DATA: FAQItem[]`, `FAQ_CATEGORIES` | Multiple | FAQ entries |
| `process.ts` | Process + milestone data | 6 phases | Engineering lifecycle |
| `about.ts` | Principles + engagement models | 5 + 3 | About content |
| `simulatedProjectDb.ts` | Extended project data | 7 extended | Deep case study content |

---

## Sound Engine (`src/lib/soundEngine.ts`)

**Class:** `SoundEngine` — singleton exported as `soundEngine`

**Backend:** Web Audio API (zero external assets, fully synthesized)

**Persistence:** `dcp_sound_muted` in localStorage

| Method | Trigger |
|---|---|
| `playShutterDownSequence()` | Theme toggle initiated |
| `playShutterCompleteClick()` | Theme transition complete |
| `playClick()` | Nav links, buttons |
| `playTap()` | Filter chips, toggle pills |
| `playModalOpen()` | Modal/drawer open |
| `playModalClose()` | Modal/drawer close |
| `playCopySuccess()` | Clipboard copy |
| `playSuccessChime()` | Form submission success |
| `playSparkleCelebration()` | Repeat celebration trigger |
| `playMenuToggle(open)` | Mobile menu toggle |
| `playScrollTop()` | Back-to-top click |
| `haptic(pattern)` | Device vibration (mobile) |

---

## Types (`src/types.ts`)

| Interface | Used By |
|---|---|
| `Project` | `projects.ts`, `SelectedWorkSection`, `CaseStudyModal` |
| `Capability` | `capabilities.ts`, `CapabilitiesSection` |
| `TechItem` | `technology.ts`, `TechEcosystem` |
| `TechIntegrationPattern` | Nested in `TechItem` |
| `ProcessStep` | `process.ts`, `ProcessSection` |
| `ProjectMilestone` | `process.ts`, `ProcessSection` |
| `Principle` | `about.ts`, `AboutPrinciples` |
| `ArchitectureLayer` | `EngineeringPhilosophy` |
| `ArchitectureLayerDeepDive` | Nested in `ArchitectureLayer` |
| `InquiryFormData` | `ProjectInquiryBuilder`, `firebase.ts` |
| `FAQItem` | `faq.ts`, `FAQSection` |
