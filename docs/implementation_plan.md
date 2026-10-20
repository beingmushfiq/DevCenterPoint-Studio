# DevCenterPoint Studio — Full Implementation Plan
> Synthesized from: Strategic Plan, Brand Assets, Visual Redesign Plan, Current Codebase

---

## Current State Assessment

### ✅ What's Already Done (Strong Foundation)
- **Inertia.js + Laravel architecture** is solid — all routing, CMS, SSR are in place
- **CmsContext** drives Hero copy from DB `site_settings` — already designed for easy content swaps
- **Liquid glass / gradient design tokens** exist (liquid-glass class, gradient utilities)
- **Framer Motion** animations throughout (`motion/react` + `framer-motion` both installed)
- **HeroInteractiveCanvas** — neural particle canvas exists but is a separate sub-component
- **GlobalLoadingScreen** — polished loading experience already built
- **All major homepage sections exist:** Positioning, Capabilities, Work, Testimonials, EngineeringPhilosophy, TechEcosystem, Process, EfficiencyMetrics, FAQ, ProjectInquiryBuilder, Newsletter
- **Sound engine, command palette, custom cursor** — micro-interactions already wired

### ❌ What's Missing or Misaligned

| Gap | Severity | Location |
|-----|----------|----------|
| **Hero copy mismatch** — current: "Digital products, engineered properly." | 🔴 Critical | `Hero.tsx` CMS defaults |
| **Hero badge mismatch** — current: "Engineering Studio • Custom Systems & AI" instead of "TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI" | 🔴 Critical | `Hero.tsx` CMS defaults |
| **Thesis mismatch** — verbose, doesn't lead with "We turn inefficient business processes into software" | 🔴 Critical | `Hero.tsx` CMS defaults |
| **No video background in Hero** — only the neural canvas + floating orbs | 🔴 Critical | `Hero.tsx` |
| **Lenis smooth scroll not installed** — using native `scrollIntoView` everywhere | 🔴 Critical | `Home.tsx`, `Hero.tsx` |
| **Positioning section copy misaligned** — doesn't reinforce primary brand statement | 🟠 High | `Positioning.tsx` |
| **Positioning pillars don't match the 8-bucket service architecture** | 🟠 High | `Positioning.tsx` |
| **CapabilitiesSection not validated** against 8 canonical buckets (01–08) | 🟠 High | `capabilities.ts` |
| **ProjectInquiryBuilder project types** not aligned with 8 canonical service categories | 🟠 High | `ProjectInquiryBuilder.tsx` |
| **Portfolio taxonomy tags** (Company Delivery / Commercial Product / Founder Foundation) missing from work cards | 🟠 High | `SelectedWorkSection.tsx` |
| **Font stack mismatch** — installed `Plus Jakarta Sans` but brand specifies `Space Grotesk` for display | 🟡 Medium | `package.json` |
| **No `lenis` package** | 🟡 Medium | `package.json` |
| **Secondary CTA "Explore Selected Work"** — strategic plan says "Book a Consultation" | 🟡 Medium | `Hero.tsx` |
| **Admin Settings fields** not updated with new positioning presets | 🟡 Medium | `Admin/Settings/Index.tsx` |
| **Database seeders** not updated with new site_settings | 🟡 Medium | `DatabaseSeeder.php` |
| **No video asset present** in `/public` or `/backend/public` | 🟡 Medium | File system |
| **`Space Grotesk` not installed** (brand typography requirement) | 🟡 Medium | `package.json` |

---

## Implementation Phases

### PHASE 1 — Cinematic Hero Rebuild (Immediate Priority)
> **Goal:** Replace the current flat hero with a full-viewport cinematic video background with Lenis, locked brand copy, and glass overlay content.

#### 1.1 Install Dependencies
```bash
# Inside backend/
npm install lenis @fontsource-variable/space-grotesk
```

#### 1.2 Video Background Implementation
The hero gets a **full-screen video background** with:
- `<video>` element: autoplay, muted, loop, playsinline — covers 100% of the section
- A **multi-layered gradient overlay** on top:
  - Dark navy scrim (`#000F26` at 55–65% opacity) to preserve text legibility
  - Brand blue bottom fade gradient for smooth transition to next section
  - Optional animated noise texture at low opacity for cinematic grain
- The existing `HeroInteractiveCanvas` (neural particles) layered above the video at reduced opacity as a translucent overlay
- Floating orbs removed (video replaces this visual depth function)

#### 1.3 Hero Copy Update (CMS defaults)
| Field | Old Default | New Default |
|-------|-------------|-------------|
| `hero_badge_text` | `Engineering Studio • Custom Systems & AI` | `TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI` |
| `hero_headline_line1` | `Digital products,` | `We turn inefficient` |
| `hero_headline_line2_gradient` | `engineered properly.` | `business processes into software.` |
| `hero_thesis_statement` | Long verbose sentence | `DevCenterPoint builds custom software, business automation systems, SaaS products, and intelligent digital solutions for businesses and organizations.` |
| `hero_cta_secondary_text` | `Explore Selected Work` | `Book a Consultation` |

#### 1.4 Lenis Smooth Scroll Setup
Create `backend/resources/js/lib/lenis.ts`:
```ts
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });
  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
```

Mount in `Home.tsx` via `useEffect` with RAF loop. Replace all `el.scrollIntoView({ behavior: 'smooth' })` calls in Hero and elsewhere with `lenis.scrollTo(target)`.

---

### PHASE 2 — Brand Copy Alignment
> **Goal:** Ensure every word on the site reflects the locked positioning hierarchy.

#### 2.1 Positioning.tsx Rewrite
- Left column headline: `"We build systems,\nnot just screens."` → **`"From manual process\nto automated system."`**
- Lead paragraph: update to reinforce the "inefficient business processes → software" framing
- The 4 pillars should reflect: **Discovery → Engineering → Automation → Scale**

#### 2.2 Capabilities Data (`capabilities.ts`)
Validate and enforce the 8 canonical bucket slugs:
```
01 — Custom Software
02 — Business Automation
03 — E-commerce Systems
04 — SaaS Products
05 — AI & Intelligent Systems
06 — Web & Mobile Applications
07 — UI/UX & Digital Experience
08 — Technology Support
```
Each card must lead with **"Business problem solved"** not just a tech description.

#### 2.3 ProjectInquiryBuilder.tsx
Replace existing project type options with the exact 8 canonical service categories.

---

### PHASE 3 — Portfolio Taxonomy
> **Goal:** Apply the 4-tier classification to all work cards.

In `SelectedWorkSection.tsx`:
- Add taxonomy badge to each project card: `Company Delivery` | `Commercial Product` | `Founder Foundation`
- Ensure each case study card leads with **"Business Inefficiency Solved"** field (not just tech stack)
- Add verifiable metric badge (e.g. "65% queue reduction")

---

### PHASE 4 — Font Stack Alignment
> **Goal:** Use Space Grotesk for display/hero, Inter for body (brand spec).

- Install `@fontsource-variable/space-grotesk`
- Update CSS variables: `--font-display: 'Space Grotesk Variable', sans-serif`
- Apply to hero headline, section headings
- Keep `Inter` / `Plus Jakarta Sans` for body (close enough, but Space Grotesk is spec'd for hero)

---

### PHASE 5 — Admin CMS & Database Seeder
> **Goal:** Admin can control all new positioning copy from the dashboard.

- Add new field presets to `Admin/Settings/Index.tsx` for the updated positioning statements
- Update `DatabaseSeeder.php` with the new `site_settings` defaults
- Ensure Inertia SSR props propagate the new defaults immediately

---

## Critical Decisions Needed From You

> These require your input before I proceed to avoid wasted implementation work.

### Question 1: The Background Video
You said "use this video creatively in the background" — **I don't see a video file** in `/public`, `/backend/public`, or anywhere in the project. 

**What video are you referring to?**
- Path to the video file on your machine?
- Is it a specific stock video you want me to source/specify?
- Should I use a self-hosted `.mp4` or an embedded YouTube/Vimeo?

### Question 2: Hero Layout after Video BG
With a full-screen cinematic video playing behind, the current hero layout (centered text, 3 CTA buttons, telemetry pills, 4 proof pillar cards below) needs to adapt. Which approach do you prefer?

**Option A — Full Viewport Cinematic:**
Hero takes 100vh. All copy (badge, headline, CTAs) centered with glass overlay scrim. The 4 proof pillar cards appear at the bottom edge of the viewport, overlapping into the next section. Pure cinema.

**Option B — Tall But Not Full Viewport:**
Keep current height (~pt-32 pb-20), video fills the section background. Proof pillars stay within the section. Cleaner but less dramatic.

**Option C — Split Layout:**
Left side: copy & CTAs. Right side: video plays in a bordered glass frame/window. More editorial, less cinematic.

### Question 3: Lenis Scope
Should Lenis smooth scrolling apply:
- **A: Only the homepage** (`Home.tsx`)
- **B: All public pages** (wrap in the shared `PublicPageShell.tsx`)

### Question 4: Positioning Section Rewrite
The current `Positioning.tsx` pillars ("Product Strategy & Discovery", "High-Density UX/UI", "Resilient Full-Stack Core", "AI & Automation Workflows") are generic engineering pillars.

The strategic plan's brand voice demands it reinforces **"We turn inefficient business processes into software."**

Should I:
- **A: Rewrite all 4 pillars** to be business-outcome focused (e.g., "Map Your Broken Process", "Engineer the Fix", "Automate the Repetition", "Scale Without Headcount")
- **B: Keep the current engineering pillars** but update the left-column headline/paragraph only

### Question 5: Secondary CTA in Hero
The strategic plan specifies: **"Start a Project" & "Book a Consultation" (Cal.com integration)**.
Currently the hero has **4 CTAs**: Start a Project, Explore Selected Work, Book a Meeting, WhatsApp Direct.

Should I:
- **A: Trim to 2 primary CTAs** as the plan specifies (Start a Project + Book a Consultation), demote WhatsApp/Work scroll to the bottom strip
- **B: Keep all 4** but reorganize prominence hierarchy

---

## Files That Will Be Touched

| File | Change Type | Phase |
|------|-------------|-------|
| [`backend/resources/js/Components/Hero.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Hero.tsx) | Major rewrite — video BG, Lenis, copy | 1 |
| [`backend/resources/js/Pages/Public/Home.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Public/Home.tsx) | Lenis init, scroll wiring | 1 |
| `backend/resources/js/lib/lenis.ts` | New file | 1 |
| [`backend/resources/js/Components/Positioning.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Positioning.tsx) | Copy update | 2 |
| [`backend/resources/js/data/capabilities.ts`](file:///d:/DevCenterPoint-Studio/backend/resources/js/data/capabilities.ts) | 8-bucket enforcement | 2 |
| [`backend/resources/js/Components/ProjectInquiryBuilder.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/ProjectInquiryBuilder.tsx) | Service category alignment | 2 |
| [`backend/resources/js/Components/SelectedWorkSection.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/SelectedWorkSection.tsx) | Taxonomy badges | 3 |
| `backend/package.json` + install | Add lenis, space-grotesk | 1+4 |
| `backend/resources/css/app.css` (or equivalent) | Font stack CSS vars | 4 |
| [`backend/resources/js/Pages/Admin/Settings/Index.tsx`](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Admin/Settings/Index.tsx) | New positioning fields | 5 |
| `backend/database/seeders/DatabaseSeeder.php` | New site_settings defaults | 5 |

