# 02 — System Architecture

**Status: [VERIFIED]**

---

## Overview

DevCenterPoint Studio is a **pure frontend SPA** with no dedicated backend server. The application architecture is:

```
Browser
  └── React 19 SPA (Vite build)
        ├── UI Layer (React components + Framer Motion)
        ├── State Layer (React useState/context — no Redux/Zustand)
        ├── Data Layer (Static TS data files — no API calls for content)
        ├── SEO Layer (react-helmet-async, scroll-aware title updates)
        └── Persistence Layer (Firebase SDK → Firestore)
                ├── inquiries collection (project inquiry form submissions)
                └── newsletter_subscribers collection (email subscriptions)
```

There is **no REST API, no Express/Node server processing user data, no database queries from a backend**. The Firebase SDK runs entirely client-side.

---

## Application Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER CLIENT                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  React 19 SPA                        │  │
│  │                                                      │  │
│  │  ┌─────────────┐  ┌────────────────┐                │  │
│  │  │ThemeContext  │  │  SEOProvider   │                │  │
│  │  │ (dark/light) │  │(scroll-aware   │                │  │
│  │  │ + Sound mute │  │ meta updates)  │                │  │
│  │  └─────────────┘  └────────────────┘                │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │              App.tsx                         │   │  │
│  │  │  GlobalLoadingScreen → Navigation            │   │  │
│  │  │  → ScrollRevealSection(s)                    │   │  │
│  │  │    → [All Page Sections]                     │   │  │
│  │  │  → Footer → BackToTop                        │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │  Static Data: src/data/*.ts (compiled into bundle)  │  │
│  │  Sound Engine: Web Audio API (zero external assets) │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│                       Firebase SDK                         │
└─────────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │        Firebase              │
              │  ┌────────────┐             │
              │  │  Firestore  │             │
              │  │ inquiries   │             │
              │  │ newsletter_ │             │
              │  │ subscribers │             │
              │  └────────────┘             │
              │  ┌─────────────┐            │
              │  │ Anonymous   │            │
              │  │    Auth     │            │
              │  └─────────────┘            │
              └──────────────────────────────┘
```

---

## Page Structure (Single Page / Scroll Sections)

The site is a **single HTML page** with all sections stacked vertically and navigated via smooth scroll anchors. There are no routes — React Router is NOT used.

| Section ID | Component | Purpose |
|---|---|---|
| (none / top) | `Hero` | Above-the-fold hero with DigitalSystemMap |
| `#positioning` | `Positioning` | "We build systems, not screens" statement |
| `#capabilities` | `CapabilitiesSection` | 8 service categories with code inspector |
| `#work` | `SelectedWorkSection` | 7 portfolio project cards |
| `#architecture` | `EngineeringPhilosophy` | 5-layer architecture diagram |
| `#tech` | `TechEcosystem` | Technology matrix |
| `#process` | `ProcessSection` | 6-phase engineering process |
| `#metrics` | `EfficiencyMetricsSection` | KPI charts (Recharts) |
| `#about` | `AboutPrinciples` | Brand ethos + 5 principles |
| `#faq` | `FAQSection` | Categorized FAQ accordion |
| `#contact` | `ProjectInquiryBuilder` | Multi-step project inquiry form |
| (none) | `NewsletterSignup` | Email subscription (Firestore) |
| (footer) | `Footer` | Links, copyright |

---

## Provider Hierarchy

```
HelmetProvider (react-helmet-async)
  └── SEOProvider (SEOHead.tsx — scroll-aware meta/title)
        └── ThemeProvider (ThemeContext.tsx — dark/light + sound mute)
              └── GlobalLoadingScreen
              └── [App content tree]
```

---

## State Management

**No global state library is used.** [VERIFIED]

State is managed via:
- `React.useState` — local component state
- `React.createContext` — two contexts: `ThemeContext` and `SEOContext`
- `localStorage` — persists theme preference (`dcp_theme`) and sound mute (`dcp_sound_muted`)

---

## Key Architectural Constraints

1. **No routing library** — All navigation is hash-based scroll (`scrollIntoView`)
2. **No backend** — Firebase SDK is the only external write target
3. **No server-side rendering** — Pure CSR SPA
4. **No Redux / Zustand** — All state is local or React Context
5. **Static content data** — All portfolio, capability, FAQ, tech data is compiled as TypeScript data files, not fetched from any API
6. **Tailwind v4** — Uses CSS-first config, `@import "tailwindcss"` in index.css, NOT tailwind.config.js
7. **framer-motion imported from `motion/react`** — Note the unconventional import path; `motion` and `framer-motion` are both in package.json

---

## Module Dependencies Map

```
App.tsx
 ├── context/ThemeContext.tsx
 │    ├── lib/soundEngine.ts
 │    └── components/ShutterTransitionOverlay.tsx
 ├── components/SEOHead.tsx (SEOProvider)
 ├── components/GlobalLoadingScreen.tsx
 ├── components/Navigation.tsx
 │    ├── components/ThemeToggle.tsx
 │    ├── components/DevCenterPointLogo.tsx
 │    └── components/CommandPalette.tsx
 ├── components/Hero.tsx
 │    └── components/DigitalSystemMap.tsx
 ├── components/Positioning.tsx
 ├── components/CapabilitiesSection.tsx
 ├── components/SelectedWorkSection.tsx
 │    ├── components/CaseStudyModal.tsx
 │    │    └── components/ProjectScreenshotCarousel.tsx
 │    └── components/BreadcrumbNavigation.tsx
 ├── components/EngineeringPhilosophy.tsx
 │    └── components/MilestoneDetailModal.tsx
 ├── components/TechEcosystem.tsx
 │    └── components/TechIcon.tsx
 ├── components/ProcessSection.tsx
 ├── components/EfficiencyMetricsSection.tsx (Recharts)
 ├── components/AboutPrinciples.tsx
 ├── components/FAQSection.tsx
 ├── components/ProjectInquiryBuilder.tsx
 │    └── lib/firebase.ts (submitProjectInquiry)
 ├── components/NewsletterSignup.tsx
 │    └── lib/firebase.ts (subscribeToNewsletter)
 ├── components/Footer.tsx
 ├── components/CustomCursor.tsx
 └── components/BackToTop.tsx
```

---

## Target Architecture Transition: Laravel + Inertia.js Monolith

> **Reference:** See ADR-007 (`23_ARCHITECTURAL_DECISIONS.md`) and full blueprint in `LARAVEL_INERTIA_CMS_BLUEPRINT.md`.

The system is transitioning to:
- **Backend:** Laravel 11/12 (PHP 8.2+) hosting a unified Inertia.js application.
- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 driven by Inertia page props.
- **Persistence:** MySQL / PostgreSQL replacing Firebase Firestore and Anonymous Auth.
- **CMS:** Custom React-based Admin Panel (`/admin`) for full content management (Projects, Capabilities, FAQs, Site Settings) and Lead CRM (Inquiries, Newsletter Subscribers).
- **Email & Routing:** Native Laravel queues, Mailables, and signed one-click unsubscribe URLs replacing Firebase extensions and Cloud Functions.

