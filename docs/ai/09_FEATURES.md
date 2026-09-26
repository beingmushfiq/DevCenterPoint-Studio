# 09 — Feature Inventory

**Status: [VERIFIED]**

---

## Feature Registry

---

### F-001: Dark / Light Theme Toggle

```
Feature:        Dark / Light Theme Toggle
Purpose:        User-controlled visual theme with instant switch
Status:         IMPLEMENTED
Frontend:       ThemeContext.tsx, ThemeToggle.tsx, ShutterTransitionOverlay.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   soundEngine.ts (shutter + click sounds), localStorage (persistence)
External:       None
Related:        F-002 (Sound Engine)
Known Issues:   None
Technical Debt: None
Tests:          None documented
```

**Notes:** Theme persists in `localStorage` under key `dcp_theme`. Pre-hydration inline script in `index.html` prevents flash of wrong theme. Switching triggers 240ms cinematic shutter overlay (`ShutterTransitionOverlay`). Respects `prefers-reduced-motion`.

---

### F-002: Sound Engine

```
Feature:        Web Audio API Sound Synthesizer
Purpose:        Premium micro-interaction feedback without external audio files
Status:         IMPLEMENTED
Frontend:       src/lib/soundEngine.ts
Backend:        None
Database:       None
API:            Web Audio API (browser native)
Permissions:    None (public)
Dependencies:   ThemeContext (for mute state), localStorage
External:       None (fully synthesized)
Related:        F-001 (theme toggle), F-009 (inquiry form)
Known Issues:   AudioContext must be resumed on first user gesture (browser policy)
Technical Debt: None
Tests:          None documented
```

---

### F-003: Command Palette (⌘K Search)

```
Feature:        Spotlight-style Command Palette
Purpose:        Keyboard-driven navigation and section search
Status:         IMPLEMENTED
Frontend:       components/CommandPalette.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   soundEngine.ts, Navigation.tsx (trigger)
External:       None
Related:        F-004 (Navigation)
Known Issues:   UNKNOWN — fuzzy search index scope not verified
Technical Debt: None
Tests:          None documented
```

---

### F-004: Navigation

```
Feature:        Fixed Top Navigation with Mega-Menu Dropdowns
Purpose:        Primary site navigation and section linking
Status:         IMPLEMENTED
Frontend:       components/Navigation.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   ThemeToggle, DevCenterPointLogo, CommandPalette, soundEngine
External:       None
Related:        F-003 (command palette)
Known Issues:   "Available for Q4" status pill is HARDCODED — not dynamic
Technical Debt: TD-003 (hardcoded availability)
Tests:          None documented
```

**Navigation sections:**
- Services (→ `#capabilities`)
- Work (→ `#work`)
- Methodology (→ `#architecture`)
- FAQ (→ `#faq`)
- Start a Project CTA (→ `#contact`)

---

### F-005: Hero Section

```
Feature:        Hero Section with Digital System Map
Purpose:        Above-fold brand statement and interactive architecture graphic
Status:         IMPLEMENTED
Frontend:       components/Hero.tsx, components/DigitalSystemMap.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   framer-motion
External:       None
Related:        F-006 (capabilities)
Known Issues:   None
Technical Debt: None
Tests:          None documented
```

---

### F-006: Capabilities Section

```
Feature:        8-Capability Service Index with Code Inspector
Purpose:        Showcase all engineering service categories
Status:         IMPLEMENTED
Frontend:       components/CapabilitiesSection.tsx
Backend:        None
Database:       None
API:            None (static data)
Permissions:    None (public)
Dependencies:   src/data/capabilities.ts (CAPABILITIES_DATA — 8 items)
External:       None
Related:        F-007 (portfolio)
Known Issues:   None
Technical Debt: None
Tests:          None documented
```

**Capabilities listed:**
1. Product Engineering
2. AI & Intelligent Systems
3. Experience Design
4. Business Systems
5. Commerce Infrastructure
6. Healthcare Technology
7. Mobile Platforms
8. Cloud & Infrastructure

---

### F-007: Portfolio / Selected Work

```
Feature:        Portfolio Grid with Full Case Study Modal
Purpose:        Showcase past engineering work with deep-dive details
Status:         IMPLEMENTED
Frontend:       components/SelectedWorkSection.tsx, components/CaseStudyModal.tsx,
                components/ProjectScreenshotCarousel.tsx, components/BreadcrumbNavigation.tsx
Backend:        None
Database:       None (static data)
API:            None
Permissions:    None (public)
Dependencies:   src/data/projects.ts (7 projects), src/data/simulatedProjectDb.ts (extended detail)
External:       None
Related:        F-006 (capabilities)
Known Issues:   "Simulated" project DB implies screenshots may be placeholder/mockup
Technical Debt: TD-004 (simulated data naming)
Tests:          None documented
```

**Portfolio projects:**
1. OrderShield (Enterprise OMS) — Logistics
2. Qttenzy (QR Attendance) — Education/Enterprise
3. CommerceCore (E-Commerce Engine) — Retail
4. LeadLayer (CRM) — B2B Sales
5. SHAP Career Predictor (AI/ML) — EdTech
6. Clinic Queue Manager (Healthcare) — Medical
7. Sherazi GPS Tracker (IoT/Telematics) — Automotive

---

### F-008: Engineering Philosophy (5-Layer Architecture)

```
Feature:        5-Layer Interactive Architecture Diagram
Purpose:        Communicate engineering methodology to prospects
Status:         IMPLEMENTED
Frontend:       components/EngineeringPhilosophy.tsx, components/MilestoneDetailModal.tsx,
                components/TableOfContentsDropdown.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   framer-motion
External:       None
Related:        F-010 (process section)
Known Issues:   None
Technical Debt: None
Tests:          None documented
```

---

### F-009: Project Inquiry Form (Lead Capture)

```
Feature:        Multi-Step Project Inquiry Builder
Purpose:        PRIMARY CONVERSION — capture project leads into Firestore
Status:         IMPLEMENTED
Frontend:       components/ProjectInquiryBuilder.tsx
Backend:        None (Firebase SDK direct write)
Database:       Firestore > inquiries collection
API:            None (Firebase SDK)
Permissions:    Anonymous auth required for consistent inquiry tracking
Dependencies:   lib/firebase.ts, soundEngine, canvas-confetti
External:       Firebase Firestore
Related:        F-011 (Firebase integration)
Known Issues:   No email notification when new inquiry submitted (see TD-005)
Technical Debt: TD-005 (no email notifications)
Tests:          None documented
```

**Form steps / fields:** projectType → timeline → name + email + company + description + selectedTech → budgetRange (optional) → submit

**Success UX:** Confetti burst + 4-tone success chime + reference number displayed

---

### F-010: Newsletter Signup

```
Feature:        Email Newsletter Subscription
Purpose:        Build email list for engineering dispatches
Status:         IMPLEMENTED
Frontend:       components/NewsletterSignup.tsx
Backend:        None
Database:       Firestore > newsletter_subscribers
API:            None (Firebase SDK)
Permissions:    Public (no auth required)
Dependencies:   lib/firebase.ts
External:       Firebase Firestore
Related:        F-011 (Firebase integration)
Known Issues:   No duplicate prevention, no unsubscribe flow implemented
Technical Debt: TD-002 (no deduplication), TD-006 (no unsubscribe UI)
Tests:          None documented
```

---

### F-011: Firebase Integration

```
Feature:        Firebase (Firestore + Auth)
Purpose:        Backend persistence for leads and email subscribers
Status:         IMPLEMENTED
Frontend:       src/lib/firebase.ts
Backend:        None (client-side only)
Database:       Firebase Firestore
API:            Firebase SDK v12
Permissions:    Anonymous auth for inquiries; public create for newsletter
Dependencies:   firebase-applet-config.json
External:       Google Firebase
Related:        F-009, F-010
Known Issues:   Config file with API keys committed to source
Technical Debt: TD-001 (config in source)
Tests:          None documented
```

---

### F-012: Scroll-Aware SEO

```
Feature:        Dynamic Per-Section SEO Meta Tags
Purpose:        SEO optimization with section-specific title/description as user scrolls
Status:         IMPLEMENTED
Frontend:       components/SEOHead.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   react-helmet-async
External:       None
Related:        None
Known Issues:   Title changes on scroll may confuse analytics (page view tracking)
Technical Debt: None
Tests:          None documented
```

**Sections tracked:** hero, positioning, capabilities, work, architecture, tech, process, metrics, about, contact

---

### F-013: Technology Ecosystem Matrix

```
Feature:        Interactive Technology Stack Explorer
Purpose:        Showcase technical depth with code snippets and integration patterns
Status:         IMPLEMENTED
Frontend:       components/TechEcosystem.tsx, components/TechIcon.tsx
Backend:        None
Database:       None
API:            devicons CDN (icon images via URL)
Permissions:    None (public)
Dependencies:   src/data/technology.ts
External:       devicons CDN (icon images)
Related:        F-006 (capabilities)
Known Issues:   None
Technical Debt: None (CDN dependency is cosmetic only)
Tests:          None documented
```

---

### F-014: Efficiency Metrics Visualization

```
Feature:        KPI Data Visualization
Purpose:        Quantify engineering quality with interactive charts
Status:         IMPLEMENTED
Frontend:       components/EfficiencyMetricsSection.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   Recharts
External:       None
Related:        None
Known Issues:   Metrics are static/hardcoded, not fetched from real monitoring systems
Technical Debt: TD-007 (hardcoded metrics)
Tests:          None documented
```

---

### F-015: FAQ Section

```
Feature:        Categorized FAQ Accordion
Purpose:        Address prospect objections and explain engagement model
Status:         IMPLEMENTED
Frontend:       components/FAQSection.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None (public)
Dependencies:   src/data/faq.ts
External:       None
Related:        None
Known Issues:   None
Technical Debt: None
Tests:          None documented
```

---

### F-016: Global Loading Screen / Skeleton

```
Feature:        Initial Page Load Screen
Purpose:        Prevent unstyled flash and create premium first impression
Status:         IMPLEMENTED
Frontend:       components/GlobalLoadingScreen.tsx
Backend:        None
Database:       None
API:            None
Permissions:    None
Dependencies:   framer-motion
External:       None
Related:        None
Known Issues:   None
Technical Debt: None
Tests:          None documented
```
