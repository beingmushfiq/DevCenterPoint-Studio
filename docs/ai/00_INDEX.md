# DevCenterPoint Studio — AI Knowledge Base Index

> **BOOT PROTOCOL**: Every AI agent entering this repository MUST read this file first, then `24_AI_AGENT_GUIDE.md`, then navigate to the relevant subsystem document.

---

## What is this project?

**DevCenterPoint Studio** is the official marketing and lead-generation website for **DevCenterPoint**, a software engineering firm. It is a single-page application (SPA) built in React 19 + TypeScript + Vite. There is **no backend server** — all persistence is handled through Firebase (Firestore + Anonymous Auth). The site showcases the company's capabilities, selected portfolio projects, engineering methodology, and contains an interactive project inquiry/contact form.

**Production URL (inferred):** `https://devcenterpoint.com` [INFERRED — see SEOHead.tsx fallback]

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Framework | React 19 (SPA, single page) |
| Language | TypeScript 5.8 |
| Build tool | Vite 6.2 + @vitejs/plugin-react |
| Styling | Tailwind CSS v4 (via @tailwindcss/vite plugin) |
| Animation | Framer Motion / motion 12+ |
| Icons | Lucide React |
| Charts | Recharts |
| Database | Firebase Firestore (NoSQL) |
| Auth | Firebase Anonymous Auth |
| SEO | react-helmet-async |
| Sound | Web Audio API (custom synthesizer) |
| Confetti | canvas-confetti |
| Fonts | Plus Jakarta Sans + JetBrains Mono (Google Fonts) |

---

## Quick Navigation

| Question | Go To |
|---|---|
| Overall architecture | 02_ARCHITECTURE.md |
| Repository file map | 03_REPOSITORY_MAP.md |
| Frontend components | 05_FRONTEND.md |
| Database & Firestore | 06_DATABASE.md |
| Data flows | 14_DATA_FLOWS.md |
| UI/UX design system | 10_UI_UX_SYSTEM.md |
| Integrations (Firebase, Gemini) | 13_INTEGRATIONS.md |
| Security model | 15_SECURITY.md |
| Feature inventory | 09_FEATURES.md |
| Deployment & infrastructure | 18_DEPLOYMENT.md |
| Known bugs | 22_KNOWN_BUGS.md |
| Technical debt | 21_TECHNICAL_DEBT.md |
| ADRs | 23_ARCHITECTURAL_DECISIONS.md |
| AI agent guide | 24_AI_AGENT_GUIDE.md |

---

## Documentation Files in this Knowledge Base

```
docs/ai/
├── 00_INDEX.md                   ← YOU ARE HERE
├── 02_ARCHITECTURE.md            ← System architecture overview
├── 03_REPOSITORY_MAP.md          ← Every file and directory explained
├── 05_FRONTEND.md                ← All components, pages, hooks, context
├── 06_DATABASE.md                ← Firestore schema, collections, rules
├── 09_FEATURES.md                ← Feature inventory with status
├── 10_UI_UX_SYSTEM.md            ← Design system, tokens, patterns
├── 13_INTEGRATIONS.md            ← Firebase, Gemini API, sound engine
├── 14_DATA_FLOWS.md              ← How data moves through the system
├── 15_SECURITY.md                ← Auth, Firestore rules, input validation
├── 18_DEPLOYMENT.md              ← Build, env vars, hosting
├── 21_TECHNICAL_DEBT.md          ← Tracked debt items
├── 22_KNOWN_BUGS.md              ← Bug registry
├── 23_ARCHITECTURAL_DECISIONS.md ← ADRs (including ADR-007 for Laravel CMS)
├── 24_AI_AGENT_GUIDE.md          ← Operating rules for AI agents
├── IMPLEMENTATION_PLAN_PRIORITY_ITEMS.md ← Priority action items
└── LARAVEL_INERTIA_CMS_BLUEPRINT.md      ← Full Laravel + Inertia + React CMS Blueprint
```

---

## Audit Metadata

```
AUDIT DATE: 2026-09-26
AUDITOR: Antigravity (AI Agent)
REPOSITORY: d:\DevCenterPoint-Studio
GIT: .git present (branch/commit not inspected)
VERIFICATION: Based on source code inspection
```
