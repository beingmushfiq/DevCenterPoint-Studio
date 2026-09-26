# 03 — Repository Map

**Status: [VERIFIED]**

Every file and directory in the repository, with purpose and key notes.

---

## Root Level

```
d:\DevCenterPoint-Studio\
├── .env.example              — Environment variable template (GEMINI_API_KEY, APP_URL)
├── .git/                     — Git repository metadata
├── .gitignore                — Git ignore rules
├── assets/                   — Static assets (logo SVGs, favicon, etc.) [INFERRED — not listed in detail]
├── bun.lock                  — Bun lockfile (dependency lock)
├── docs/ai/                  — THIS KNOWLEDGE BASE (created during audit)
├── firebase-applet-config.json — Firebase project config (apiKey, projectId, etc.) — SENSITIVE
├── firebase-blueprint.json   — Entity schema documentation for Firestore collections
├── firestore.rules           — Firestore security rules (deployed to Firebase)
├── index.html                — Single HTML entry point with pre-hydration theme script + Google Fonts
├── metadata.json             — App metadata (likely AI Studio deployment metadata)
├── package.json              — NPM package manifest
├── public/                   — Static public assets (served as-is by Vite)
├── src/                      — All application source code
├── tsconfig.json             — TypeScript compiler configuration
└── vite.config.ts            — Vite build tool configuration
```

---

## src/ Directory

```
src/
├── App.tsx                   — Root application component. Composes all sections with
│                               ScrollRevealSection wrappers and HeroReveal.
├── index.css                 — Global CSS: Tailwind v4 import, custom scrollbar,
│                               grid patterns, shimmer keyframes, transitions.
├── main.tsx                  — React DOM entry point (StrictMode + createRoot)
├── types.ts                  — All shared TypeScript interfaces and types
│
├── components/               — All React UI components (29 files, no subdirectories)
│   ├── AboutPrinciples.tsx       — Brand ethos section: 5 engineering principles
│   ├── BackToTop.tsx             — Floating back-to-top button (appears on scroll)
│   ├── BreadcrumbNavigation.tsx  — Breadcrumb trail used inside case study modals
│   ├── CapabilitiesSection.tsx   — 8 capability cards with category tabs + code inspector
│   ├── CaseStudyModal.tsx        — Full-screen modal for portfolio case studies (38KB — largest component)
│   ├── CommandPalette.tsx        — ⌘K spotlight search palette (fuzzy search across sections)
│   ├── CustomCursor.tsx          — Desktop-only custom cursor indicator
│   ├── DevCenterPointLogo.tsx    — SVG logo component with variant/size props
│   ├── DigitalSystemMap.tsx      — Animated hero graphic showing system architecture map
│   ├── EfficiencyMetricsSection.tsx — KPI data visualization using Recharts
│   ├── EngineeringPhilosophy.tsx — 5-layer architecture interactive diagram with deep-dive modals
│   ├── FAQSection.tsx            — Categorized FAQ accordion with 4 categories
│   ├── Footer.tsx                — Site footer with links and copyright
│   ├── GlobalLoadingScreen.tsx   — Initial mount skeleton/loading screen (24KB)
│   ├── Hero.tsx                  — Hero section with headline, CTAs, DigitalSystemMap
│   ├── MilestoneDetailModal.tsx  — Deep-dive modal for engineering milestones
│   ├── Navigation.tsx            — Fixed top navigation with mega-menu dropdowns, mobile drawer
│   ├── NewsletterSignup.tsx      — Email subscription form (writes to Firestore)
│   ├── Positioning.tsx           — "We build systems, not screens" positioning statement
│   ├── ProcessSection.tsx        — 6-phase engineering process (36KB — second largest)
│   ├── ProjectInquiryBuilder.tsx — Multi-step project inquiry form (writes to Firestore)
│   ├── ProjectScreenshotCarousel.tsx — Image carousel for case study screenshots
│   ├── SEOHead.tsx               — SEOProvider + SEOHead + useSEO hook + per-section metadata
│   ├── SelectedWorkSection.tsx   — Portfolio grid with 7 project cards
│   ├── ShutterTransitionOverlay.tsx — Cinematic overlay for dark/light theme switching
│   ├── TableOfContentsDropdown.tsx  — TOC dropdown used in ProcessSection/EngineeringPhilosophy
│   ├── TechEcosystem.tsx         — Technology matrix cards with category tabs
│   ├── TechIcon.tsx              — Tech icon renderer (devicons CDN slugs)
│   └── ThemeToggle.tsx           — Dark/light mode toggle button with shutter animation
│
├── context/
│   └── ThemeContext.tsx      — Theme provider: dark/light state, toggle with cinematic shutter,
│                               sound mute state, localStorage persistence
│
├── data/                     — Static TypeScript data files (compiled into JS bundle)
│   ├── about.ts              — 5 brand principles + 3 engagement models
│   ├── capabilities.ts       — 8 capability definitions with code samples
│   ├── faq.ts                — FAQ items organized by 4 categories
│   ├── process.ts            — 6-phase process steps with milestones data
│   ├── projects.ts           — 7 portfolio project definitions (PROJECTS_DATA)
│   ├── simulatedProjectDb.ts — Extended detailed project data for case study modals (45KB — largest data file)
│   └── technology.ts         — Tech ecosystem items (languages, frameworks, infra)
│
└── lib/
    ├── firebase.ts           — Firebase initialization, ensureAuth(), submitProjectInquiry(),
    │                           subscribeToNewsletter(), error handlers
    └── soundEngine.ts        — Web Audio API sound synthesizer class (10 sound methods)
```

---

## Configuration Files

### `vite.config.ts`
- Plugins: `react()` + `tailwindcss()`
- Path alias: `@` → project root
- HMR disabled when `DISABLE_HMR=true` (AI Studio environment flag)

### `tsconfig.json`
- Standard Vite React TypeScript configuration [INFERRED]

### `firebase-applet-config.json`
- Contains Firebase project configuration: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `firestoreDatabaseId`
- **SECRET_EXISTS = YES | LOCATION = firebase-applet-config.json | VALUE = REDACTED**
- This file is committed to source (not in .gitignore) — see Technical Debt TD-001

### `firestore.rules`
- Firestore security rules enforcing write-only for inquiries and newsletter_subscribers
- Anonymous users can create but not read/update/delete newsletter subscribers
- Authenticated users can read their own inquiries only

### `.env.example`
- `GEMINI_API_KEY` — For Gemini AI API calls (AI Studio auto-injects)
- `APP_URL` — Deployment URL (AI Studio auto-injects)

---

## Key Size Notes (Largest files by complexity)

| File | Size | Note |
|---|---|---|
| `data/simulatedProjectDb.ts` | 45KB | Extended case study detail data |
| `components/CaseStudyModal.tsx` | 38KB | Largest component |
| `components/ProcessSection.tsx` | 36KB | Complex multi-phase timeline |
| `components/GlobalLoadingScreen.tsx` | 25KB | Skeleton loader |
| `components/EngineeringPhilosophy.tsx` | 25KB | Interactive architecture diagram |
| `components/Navigation.tsx` | 29KB | Mega-menu + mobile drawer |
