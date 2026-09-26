# 24 — AI Agent Guide

> **READ THIS SECOND** (after 00_INDEX.md). This file defines operating rules for all AI agents working in this repository.

---

## Boot Protocol

Every AI agent entering this repository must follow:

```
1. Read /docs/ai/00_INDEX.md
2. Read /docs/ai/24_AI_AGENT_GUIDE.md (this file)
3. Identify the requested feature or module
4. Navigate to the relevant doc (see Quick Navigation in 00_INDEX.md)
5. Inspect only the referenced source files to verify current state
6. Check documentation freshness against current source
7. Perform the requested work
8. Run: npm run lint (tsc --noEmit)
9. Update affected documentation sections
10. Record significant architectural changes as a new ADR
```

---

## Critical Architecture Rules (Read Before Touching Anything)

### 1. This is a Static SPA — There Is No Backend

There is **no Express server, no API routes, no REST endpoints, no backend database queries**. Do not create a backend server or API layer unless explicitly instructed. All writes go through Firebase SDK from the browser.

### 2. Tailwind CSS v4 Syntax

**Do NOT use `tailwind.config.js`** — Tailwind v4 is configured in `index.css` via `@import "tailwindcss"`.

**Dark mode uses class strategy** via:
```css
@variant dark (&:where(.dark, .dark *));
```

- `document.documentElement` gets `.dark` or `.light` class
- Dark mode prefix in JSX: `dark:bg-[#0a0a0a]` etc.
- Do NOT use `@media (prefers-color-scheme: dark)` for dark mode styling

### 3. No Routing Library

Navigation is purely hash-based scroll via `element.scrollIntoView({ behavior: 'smooth' })`. Do **not** add React Router or any other router without explicit instruction.

### 4. Animation Import Paths — Mixed (Verified)

The codebase uses **both** animation import paths. This is intentional (both packages exist in package.json):

```typescript
// These files import from 'framer-motion' (VERIFIED):
// App.tsx, ThemeToggle.tsx, TechEcosystem.tsx,
// ShutterTransitionOverlay.tsx, GlobalLoadingScreen.tsx, BackToTop.tsx
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// These files import from 'motion/react' (VERIFIED):
// ProjectInquiryBuilder.tsx, Navigation.tsx, CaseStudyModal.tsx, ProcessSection.tsx, others
import { motion, AnimatePresence } from 'motion/react';
```

When adding a new component: prefer `motion/react` for new work (it is the newer package).


### 5. Accessibility — Always Respect prefers-reduced-motion

All scroll-reveal and entrance animations use:
```typescript
const shouldReduceMotion = useReducedMotion();
initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
```

**Never** add animations that don't respect `useReducedMotion()`.

### 6. Sound — Always Through soundEngine

All user-interaction sounds must go through `soundEngine` singleton from `src/lib/soundEngine.ts`. Never add audio HTML elements or import audio files.

```typescript
import { soundEngine } from '../lib/soundEngine';
soundEngine.playClick(); // on button press
soundEngine.playModalOpen(); // on modal open
soundEngine.playModalClose(); // on modal close
```

### 7. Theme Context Access

To access or modify the theme:
```typescript
import { useTheme } from '../context/ThemeContext';
const { theme, toggleTheme, isSoundMuted, toggleSound } = useTheme();
```

Do not access `localStorage` directly for theme; use the context.

### 8. Firebase Writes — Always via lib/firebase.ts

Do not initialize Firebase directly in components. Use:
- `submitProjectInquiry(formData: InquiryFormData)` for inquiries
- `subscribeToNewsletter(email: string)` for newsletter
- `ensureAuth()` if anonymous auth is needed

### 9. Data Is Static — Not Fetched

All portfolio projects, capabilities, FAQ, technology, and process data are **compiled TypeScript data files** in `src/data/`. They are NOT fetched from any API. To add/edit data, edit the data file directly.

### 10. SEO Updates on New Sections

If adding a new page section, also add its metadata to `SECTION_METADATA` in `src/components/SEOHead.tsx` and its ID to the `sectionIds` array in `SEOProvider`.

---

## Before Editing: Pre-Flight Checklist

Before making changes to any component or feature, ask:

- [ ] Which data file does this component consume? (check `src/data/`)
- [ ] Is the component consuming ThemeContext? Does it handle dark mode?
- [ ] Does the component have any scroll event listeners that might conflict?
- [ ] Will this change affect the Navigation's active section tracking?
- [ ] Does this component trigger Firebase writes? (check for firebase.ts imports)
- [ ] Are all new animations wrapped with `useReducedMotion()` guard?
- [ ] Does any new button/interaction need a `soundEngine` call?
- [ ] Does any new section need a `SECTION_METADATA` SEO entry?

---

## Where to Find Things

| Need to... | Look in |
|---|---|
| Add/edit portfolio project | `src/data/projects.ts`, `src/data/simulatedProjectDb.ts` |
| Add/edit capability | `src/data/capabilities.ts` |
| Add/edit FAQ | `src/data/faq.ts` |
| Add/edit tech stack item | `src/data/technology.ts` |
| Add/edit process phase | `src/data/process.ts` |
| Edit section SEO metadata | `src/components/SEOHead.tsx` > `SECTION_METADATA` |
| Change navigation links | `src/components/Navigation.tsx` |
| Change footer content | `src/components/Footer.tsx` |
| Add a new sound | `src/lib/soundEngine.ts` > add method to SoundEngine class |
| Change theme behavior | `src/context/ThemeContext.tsx` |
| Change Firebase schema | `src/lib/firebase.ts` + `firestore.rules` + `firebase-blueprint.json` |
| Add a new section | `src/App.tsx` > add `<ScrollRevealSection>` with section ID |

---

## Component Conventions

1. **Section IDs**: Every page section must have a unique `id=""` attribute matching the navigation anchor (e.g., `id="capabilities"`)
2. **Section label style**: Section eyebrows use `text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400`
3. **Max width container**: Use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
4. **Card base**: Light: `bg-white border border-slate-200`, Dark: `bg-[#1a1a1a] border border-[#262626]`
5. **Primary CTA button**: `bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-5 py-2.5 font-black shadow-md shadow-blue-600/25`

---

## Documentation Update Protocol

After **any meaningful change**, update the relevant docs:

| Change made | Update this doc |
|---|---|
| New component | 05_FRONTEND.md (component list) |
| New Firebase collection or field | 06_DATABASE.md |
| New feature | 09_FEATURES.md |
| New integration | 13_INTEGRATIONS.md |
| New data flow | 14_DATA_FLOWS.md |
| New security consideration | 15_SECURITY.md |
| New dependency | 18_DEPLOYMENT.md |
| Resolved technical debt | 21_TECHNICAL_DEBT.md |
| Bug fixed | 22_KNOWN_BUGS.md |
| Significant architecture decision | 23_ARCHITECTURAL_DECISIONS.md |

---

## Anti-Patterns — Never Do These

1. ❌ Do NOT import from `framer-motion` directly — use `motion/react`
2. ❌ Do NOT use `tailwind.config.js` — v4 is CSS-first
3. ❌ Do NOT use `@media (prefers-color-scheme: dark)` for dark theme styling
4. ❌ Do NOT add routing libraries without explicit instruction
5. ❌ Do NOT add a backend server without explicit instruction
6. ❌ Do NOT create Firebase reads/writes outside of `lib/firebase.ts`
7. ❌ Do NOT bypass `soundEngine` with raw `<audio>` elements
8. ❌ Do NOT add animations without `useReducedMotion()` guard
9. ❌ Do NOT use `dangerouslySetInnerHTML` with user-supplied content
10. ❌ Do NOT access `localStorage` directly for theme — use `ThemeContext`

---

## Open Questions

See [27_OPEN_QUESTIONS.md](./27_OPEN_QUESTIONS.md) for unresolved architectural questions.
