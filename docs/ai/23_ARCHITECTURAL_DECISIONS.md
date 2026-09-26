# 23 — Architectural Decision Records (ADRs)

---

## ADR-001: Single-Page Application with No Router

```
ADR-ID:         ADR-001
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Build as a single HTML page with no client-side router.
Context:        DevCenterPoint Studio is a marketing/portfolio site.
Problem:        How to structure navigation for a content site with many sections?
Options:
  A. React Router with separate routes per section
  B. Single scrollable page with hash anchors
  C. Multi-page site with Astro or Next.js
Chosen Approach: B — Single scrollable page with hash-based scroll navigation
Reason:         Marketing sites benefit from continuous scroll experience.
                No need for complex routing, deferred loading, or SEO
                concerns for sub-pages. Simpler mental model.
Consequences:   No back/forward navigation history between sections.
                No route-based code splitting possible.
                Command palette (⌘K) compensates for navigation UX.
Affected Systems: Navigation.tsx, SEOHead.tsx (scroll-aware meta)
```

---

## ADR-002: Firebase (Client-Side Only) Instead of Traditional Backend

```
ADR-ID:         ADR-002
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Use Firebase Firestore via client-side SDK for all persistence.
Context:        Need to capture lead inquiries and newsletter subscriptions.
Problem:        How to handle form data without building and hosting a backend?
Options:
  A. Express/Node.js backend API (requires server hosting)
  B. Firebase Firestore (serverless, managed)
  C. Third-party form services (Typeform, Formspree)
  D. Netlify/Vercel serverless functions
Chosen Approach: B — Firebase Firestore with client-side SDK
Reason:         Zero server infrastructure. Firebase handles scaling, auth,
                and security rules. Anonymous auth provides session identity
                for inquiry read-back. Aligns with Google AI Studio deployment.
Consequences:   No server-side business logic.
                Security entirely dependent on Firestore rules.
                No retry logic or queue for failed writes.
                Firebase config committed to source (workaround: rules protection).
Affected Systems: lib/firebase.ts, firestore.rules, ProjectInquiryBuilder, NewsletterSignup
```

---

## ADR-003: Tailwind CSS v4 with CSS-First Configuration

```
ADR-ID:         ADR-003
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Use Tailwind CSS v4 with @tailwindcss/vite plugin (no tailwind.config.js).
Context:        Need a utility CSS framework for a premium design.
Problem:        Which CSS approach to use?
Options:
  A. Tailwind CSS v3 with tailwind.config.js
  B. Tailwind CSS v4 with CSS-first @import approach
  C. Vanilla CSS / CSS Modules
  D. CSS-in-JS (Emotion, styled-components)
Chosen Approach: B — Tailwind v4 with @tailwindcss/vite plugin
Reason:         Tailwind v4 eliminates the need for a separate config file.
                Better performance integration with Vite.
                Newer API aligns with AI Studio/Google tooling preferences.
Consequences:   @variant dark requires explicit .dark class selector approach.
                Cannot use standard dark: utility without the @variant config.
                Custom variant defined in index.css: @variant dark (&:where(.dark, .dark *));
                AI agents must know: dark mode uses class strategy, NOT media query strategy.
Affected Systems: index.css, all components using dark: variant classes, ThemeContext
```

---

## ADR-004: Web Audio API for Sound Instead of Audio Files

```
ADR-ID:         ADR-004
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Synthesize all sounds programmatically using the Web Audio API.
Context:        Premium micro-interaction feedback without audio assets.
Problem:        How to add high-quality micro-interaction sounds?
Options:
  A. Audio files (MP3/WAV) loaded from CDN or bundled
  B. Web Audio API synthesizer (zero external assets)
  C. Third-party sound library
Chosen Approach: B — Custom Web Audio API synthesizer
Reason:         Zero HTTP requests for audio. No copyright issues.
                Complete control over sound character.
                Mutable/configurable at runtime.
                No bundle size impact (audio files can be MB in size).
Consequences:   Complex sound synthesis code (463 lines).
                AudioContext policy means first interaction may be silent.
                Sounds are approximate hardware analogs, not true recordings.
Affected Systems: lib/soundEngine.ts, ThemeContext.tsx, Navigation.tsx, all interactive components
```

---

## ADR-005: Anonymous Firebase Auth for Inquiry Tracking

```
ADR-ID:         ADR-005
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Use Firebase Anonymous Auth to assign UIDs to inquiry submitters.
Context:        Inquiries should be readable by their submitter, not anyone.
Problem:        How to scope read access to own inquiries without user accounts?
Options:
  A. Full Firebase Auth (email/Google login)
  B. Anonymous Auth (auto-generated UID)
  C. No auth — all inquiries public (bad)
  D. No auth — all inquiries private/admin-only (lose self-service)
Chosen Approach: B — Anonymous Auth
Reason:         No friction for prospects (no account required).
                Provides stable UID for session-scoped read access.
                Satisfies Firestore rule: resource.data.authUid == request.auth.uid.
Consequences:   UID is ephemeral — clears in private browsing.
                Users cannot retrieve inquiry from different device.
                If auth fails, falls back to authUid: 'guest' (loses read-back).
Affected Systems: lib/firebase.ts, firestore.rules
```

---

## ADR-006: Scroll-Aware SEO Meta Updates

```
ADR-ID:         ADR-006
Date:           [Pre-audit — historical decision]
Status:         ACCEPTED
Decision:       Update page title and meta description dynamically as user scrolls
                between sections.
Context:        Single-page site needs SEO optimization across all content sections.
Problem:        How to optimize SEO for a single-page site with many content sections?
Options:
  A. Static meta tags — one title/description for whole page
  B. Dynamic scroll-aware meta updates via react-helmet-async
  C. Multi-page routing for each section
Chosen Approach: B — Dynamic scroll-aware meta
Reason:         Allows different SEO metadata per section without routing.
                Section-specific JSON-LD structured data.
                Better organic search representation for deep sections.
Consequences:   Title changes on scroll may confuse analytics tab tracking.
                Google may or may not use the mid-session meta for indexing.
                Two scroll listeners with slightly different offsets (see BUG-004).
Affected Systems: components/SEOHead.tsx, Navigation.tsx
```

---

## ADR-007: Migration to Laravel + Inertia.js Monolith with React CMS

```
ADR-ID:         ADR-007
Date:           2026-09-26
Status:         ACCEPTED (SUPERSEDES ADR-002)
Decision:       Adopt Laravel 11/12 with Inertia.js v2 and React 19 as a unified full-stack monolith,
                retire Firebase, and implement a custom React-based Admin CMS.
Context:        The studio needs dynamic CMS management for all website content (projects, capabilities,
                FAQs, SEO metadata) and an internal CRM for client inquiries and newsletter subscribers.
Problem:        The static TypeScript data files (src/data/*.ts) require code redeployment for content updates.
                Firebase Firestore client-only architecture has security rule complexity, lack of relational
                querying, config exposure in client bundles, and requires external cloud functions for emails.
Options:
  A. Headless Laravel REST API + Separate React SPA + Filament Admin
  B. Unified Laravel + Inertia.js + React Monolith with custom React Admin CMS
  C. Traditional Firebase + Retool or custom React dashboard
  D. Next.js / Supabase
Chosen Approach: B — Unified Laravel + Inertia.js + React Monolith
Reason:         1. Keeps existing React 19 UI, animations (Framer Motion / Motion), sound engine, and Tailwind v4.
                2. Eliminates client-side Firebase leaks and security rule edge cases.
                3. Single deployment unit (Laravel serves Inertia root Blade view).
                4. Native transactional emails (Mailables) and signed one-click unsubscribe routes.
                5. Custom React CMS provides seamless design consistency with public site.
Consequences:   Requires PHP 8.2+ and Composer runtime environment in deployment container.
                Data migrations and seeders must be run on initial deploy.
                Static files in src/data/ are transitioned to database seeders.
Affected Systems: All components in src/, lib/firebase.ts (deprecated), firestore.rules (deprecated),
                  backend/ (new Laravel application), database/
```
