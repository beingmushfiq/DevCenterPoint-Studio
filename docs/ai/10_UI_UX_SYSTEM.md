# 10 — UI/UX Design System

**Status: [VERIFIED]**

---

## Design Philosophy

DevCenterPoint Studio implements a **high-density, editorial-grade design system** with clear surface hierarchy, precision typography, and cinematic micro-interactions. The aesthetic deliberately reflects engineering precision — monospace accents, grid overlays, and mechanical sound feedback.

---

## Typography

**Primary font:** `Plus Jakarta Sans` (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Used for: Body text, UI labels, headings, CTAs
- CSS variable: `--font-sans`

**Monospace font:** `JetBrains Mono` (Google Fonts)
- Weights: 400, 500, 600
- Used for: Code samples, reference numbers, system labels, keyboard shortcuts, numeric indicators
- CSS variable: `--font-mono`

---

## Color System

### Light Mode Surface Hierarchy

| Token | Value | Usage |
|---|---|---|
| Page background | `#f8fafc` (slate-50) | Body background |
| Card/surface | white | Cards, modals |
| Border | `slate-200` / `#e2e8f0` | Dividers, card edges |
| Text primary | `slate-900` | Body text |
| Text secondary | `slate-500`/`slate-600` | Muted labels |
| Blue accent | `#2563eb` (blue-600) | CTAs, active states, links |

### Dark Mode Surface Hierarchy

| Token | Value | Usage |
|---|---|---|
| Page background | `#0a0a0a` | Body background (very dark, near-black) |
| Card/surface | `#141414` / `#1a1a1a` | Primary card surfaces |
| Elevated card | `#121212` | Modal/dropdown backgrounds |
| Border | `#222222`/`#282828`/`#2a2a2a` | Dividers, card edges |
| Text primary | white | Body text |
| Text secondary | `gray-300`/`gray-400` | Muted labels |
| Blue accent | `#2563eb` (blue-600) | CTAs (same in both modes) |

### Semantic Colors

| Purpose | Light | Dark |
|---|---|---|
| Success/Available | `emerald-500` / `emerald-600` | `emerald-400` |
| Warning | `amber-600` | `amber-400` |
| AI/ML accent | `emerald-600` | `emerald-400` |
| Commerce accent | `blue-600` | `blue-400` |
| Healthcare accent | `emerald-500` | |
| Mobile accent | `purple-600` | `purple-400` |
| Architecture accent | `amber-600` | `amber-400` |
| AI systems accent | Varies | |

### Brand Accent Colors (per portfolio project)

| Project | Color |
|---|---|
| OrderShield | `#2E4AF9` (indigo-blue) |
| Qttenzy | `#00D084` (emerald-green) |
| CommerceCore | `#3B82F6` (blue) |
| LeadLayer | `#8B5CF6` (violet) |
| SHAP Career | `#EC4899` (pink) |
| Clinic Queue | `#10B981` (emerald) |
| Sherazi GPS | `#F59E0B` (amber) |

---

## Spacing & Layout

- **Max content width:** `max-w-7xl` (1280px) with `px-4 sm:px-6 lg:px-8` gutters
- **Grid system:** Tailwind CSS grid utilities
- **Spacing scale:** Tailwind default (4px base unit)

---

## Border Radius

| Usage | Value |
|---|---|
| Buttons | `rounded-2xl` (16px) |
| Cards | `rounded-2xl` / `rounded-3xl` |
| Chips/badges | `rounded-full` |
| Navigation capsule | `rounded-2xl` |
| Input fields | `rounded-2xl` |
| Dropdown megas | `rounded-3xl` |
| Icons | `rounded-xl` |
| Scrollbar thumb | `border-radius: 4px` |

---

## Shadows

| Usage | Class |
|---|---|
| Navigation (scrolled) | `shadow-lg` |
| CTA button (blue) | `shadow-md shadow-blue-600/25` |
| Dropdown menus | `shadow-2xl` |
| Cards | Light mode: subtle; Dark: border-only |

---

## Glassmorphism

Used in the navigation header when scrolled:
- Light: `bg-white/90 backdrop-blur-xl border-b border-slate-200/80`
- Dark: `bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#222222]`

Navigation pill (center):
- Light: `bg-white/80 backdrop-blur-xl border border-slate-200/90`
- Dark: `bg-[#141414]/90 backdrop-blur-xl border border-[#282828]`

---

## Background Textures & Patterns

| Pattern | CSS Class | Description |
|---|---|---|
| Grid overlay | `.bg-grid-pattern` | Subtle 32px grid lines on dark/light |
| Radial gradient | `.bg-radial-gradient` | Blue radial glow at top-center |
| Noise texture | `.bg-noise` | Micro-noise via SVG data URL |

---

## Scrollbar

Custom scrollbar via global CSS:
- Dark: `#2a2a2a` thumb on `#0a0a0a` track
- Light: `#cbd5e1` thumb on `#f1f5f9` track
- Hover: `#2563eb` (blue-600)
- Custom scrollbar class `.custom-scrollbar` for modals/containers

---

## Animation Principles

### Core Easing
```css
cubic-bezier(0.22, 1, 0.36, 1)  /* Smooth deceleration — editorial feel */
cubic-bezier(0.16, 1, 0.3, 1)   /* "transition-editorial" utility class */
```

### Scroll Reveal
- **All sections** use `ScrollRevealSection` wrapper in `App.tsx`
- Fades in + slides up 36px (configurable `yOffset`)
- Duration: 0.75s with configurable delay stagger
- `viewport={{ once: true, amount: 0.05 }}` — triggers early for long sections
- Accessibility: `useReducedMotion()` disables all motion globally

### Hover Micro-interactions
- Button: `hover:scale-105` (icon containers), `active:scale-95` (buttons)
- Cards: `hover:border-blue-300 dark:hover:border-blue-900/50`
- Nav links: background fill on hover
- Back to top: arrow icon hover animation

### Modal Animations
- Open: scale from 0.95 + fade in
- Close: `AnimatePresence` with matching exit
- Sound: `soundEngine.playModalOpen()` / `playModalClose()`

### Theme Switch Animation
- `ShutterTransitionOverlay` slides down over full screen
- Lasts ~620ms total (theme switches at 240ms midpoint)
- Sound: pneumatic sweep + complete click

### Loading Screen
- `GlobalLoadingScreen` animates skeleton loader on mount
- `isSiteLoaded` state in `App.tsx` controls `opacity-0 → opacity-100` transition

---

## Component Patterns

### Buttons

| Variant | Styling |
|---|---|
| Primary CTA | `bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-5 py-2.5 font-black shadow-md shadow-blue-600/25` |
| Secondary | `border border-slate-200 dark:border-[#2a2a2a] rounded-2xl` |
| Nav item | `px-3.5 py-2 text-xs font-bold rounded-xl` |
| Active nav | `bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black` |
| Ghost | `text-slate-700 hover:bg-slate-100 dark:hover:bg-white/5` |

### Cards

Light mode: `bg-white border border-slate-200/60`
Dark mode: `bg-[#1a1a1a]/80 border border-[#262626]`
Hover: `hover:border-blue-300 dark:hover:border-blue-900/50`

### Badges / Pills

- Status pill: `rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`
- Section badge: `text-[10px] font-mono font-bold uppercase tracking-[0.2em]`
- Work count badge: `bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400`

### Labels / Eyebrow Text

- Section labels: `text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400`
- Subtext: `text-[10px]/[11px] text-slate-500 dark:text-gray-400`

### Code Inspector (CapabilitiesSection)

- Monospace code samples displayed in `<pre>` blocks
- Dark terminal-style background
- Syntax not highlighted (plain text display)

---

## Selection Color

```css
::selection { background: #2563eb; color: white; }
```

Applied globally in `index.html` body class and `App.tsx` container.

---

## Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `< md` (768px) | Desktop nav hidden → mobile hamburger; most layouts stack vertically |
| `md` | Desktop nav capsule appears |
| `lg` | Additional content unlocked ("Available for Q4" pill, kbd shortcuts) |
| `max-w-7xl` | Max content width cap |

Navigation breakpoints:
- `md:hidden` — hamburger shows
- `hidden md:flex` — desktop nav shows
- `hidden lg:inline-flex` — availability pill shows
- `hidden lg:inline-flex` — keyboard shortcut kbd shows

---

## Icon System

**Library:** Lucide React (lucide-react ^0.546.0)

Common icons used:
- Navigation: `Menu`, `X`, `ChevronDown`, `Search`, `Command`, `ArrowUpRight`, `ArrowRight`
- Services: `Globe`, `Smartphone`, `Cpu`, `Layers`, `Zap`, `BarChart3`
- Form: `Send`, `CheckCircle2`, `AlertCircle`, `Copy`, `Check`, `Lock`, `MessageSquare`, `Users`, `Calendar`
- Status: `ShieldCheck`, `Briefcase`, `Sparkles`, `HelpCircle`

Tech icons: `TechIcon.tsx` renders devicons CDN images via `iconSlug`.
