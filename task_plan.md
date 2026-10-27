# Task Plan: Hero Video & Interactive Engineering Sandbox Improvisations

## Goal
Implement a high-performance, visually stunning upgrade to the Hero section of DevCenterPoint Studio featuring:
1. Dynamic Mode Modals ("Cinema Active" interactive engineering sandbox toggle with code drawer)
2. Live Telemetry & Code Stream Overlays (Semantic command center HUD with real-time logs and metric stream)
3. WebGL/Canvas Gravity-Warping Interaction (Background vectors gravitationally accelerating toward the primary CTA)
4. Scroll-Triggered Focus Shifting (Smooth transition from cinematic video into monochromatic blueprint grid)
5. Visual Polishing Matrix (Chroma-key masking, seamless multi-stop bottom gradient, 180% saturation + blur depth contrast)

## Current Phase
Phase 3: Architectural Foundation & Interactive Canvas Refinements

## Phases

### Phase 1: Requirements & Discovery
- [x] Analyze current `Hero.tsx`, `HeroInteractiveCanvas.tsx`, and `Home.tsx` implementations
- [x] Inspect existing video controls (`isPlaying`, `Cinema Active`), canvas modes (`mesh`, `particles`, `vortex`, etc.), and LCP constraints
- [x] Document discoveries, constraints, and architecture in `findings.md`
- [x] Author comprehensive Implementation Plan artifact for user review & approval
- **Status:** complete

### Phase 2: User Plan Alignment & Review Gate
- [x] Present technical design, state flow, and component breakdown to user
- [x] Collect user feedback and design preferences
- [x] Await explicit user approval before modifying application code (User approved with "after implementation, run it locally")
- **Status:** complete

### Phase 3: Architectural Foundation & Interactive Canvas Refinements
- [x] Enhance `HeroInteractiveCanvas.tsx` with gravitational well physics (vector attraction toward CTA button coordinates)
- [x] Add props and state bridges for external mode synchronization (`mesh`, `vortex`, `matrix`, `nebula`, `particles`)
- [x] Implement smooth particle velocity acceleration when hovering "Start a Project" CTA
- **Status:** complete

### Phase 4: Dynamic "Cinema Active" Sandbox & Code Drawer
- [x] Transform "Cinema Active" toggle from a simple pause/play button into a dual-mode trigger (Playback Toggle + Cinema Sandbox Inspector)
- [x] Implement text dimming & 3D perspective shift on video/canvas container during active sandbox mode
- [x] Build floating glassmorphic code drawer with live TypeScript architecture snippet, real-time event ledger, and shader parameter controls
- [x] Implement keyboard accessibility (Escape key to exit sandbox, focus management)
- **Status:** complete

### Phase 5: Telemetry & Real-Time Code Stream HUD
- [x] Create semantic HTML command center overlay docked at the edge of the hero viewport
- [x] Implement auto-scrolling telemetry log stream with realistic high-throughput messages (`[SYS_EVENT]`, `[V8_TS]`, `[SOC2_HASH]`, `[DB_SYNC]`)
- [x] Add live FPS / latency meter and packet counter with pulsing indicators
- **Status:** complete

### Phase 6: Scroll-Triggered Focus Shifting & Visual Polishing Matrix
- [x] Integrate Framer Motion / Lenis scroll listener for scroll-driven transition into Pillar 01
- [x] Implement blueprint grid background overlay with dynamic mix-blend-mode
- [x] Apply visual polishing matrix: multi-stop bottom gradient (`linear-gradient(to bottom, transparent, #000814)`), `backdrop-filter: saturate(180%) blur(8px)`, and crisp depth layers
- **Status:** complete

### Phase 7: Verification & Build Validation
- [x] Run TypeScript check (`npm run build` / `vite build`) to verify zero type or bundle errors (Built in 17s + 13s SSR with exit code 0)
- [x] Validate responsive behavior (mobile, tablet, desktop)
- [x] Launch local servers (`php artisan serve` on port 8000 and `npm run dev` on port 5173)
- [x] Verify local HTTP 200 response on `http://127.0.0.1:8000`
- **Status:** complete

## Key Questions
1. Should "Cinema Active" toggle both video play/pause AND the immersive sandbox, or provide a dedicated "Inspect Sandbox" control alongside play/pause?
   -> Recommended: Clicking "Cinema Active" engages the full immersive sandbox view, while a dedicated play/pause icon allows pure media control.
2. Should the real-time telemetry stream run continuously or only during cinema/sandbox mode?
   -> Recommended: A compact, subtle HUD streams docked at the edge of the hero, expanding with full logs when Cinema Sandbox is active.
3. Will live vector gravity-warping impact CPU/battery?
   -> Recommended: Coordinate checks throttled via `requestAnimationFrame`, with zero allocation in the hot loop and graceful fallback for prefers-reduced-motion.

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Retain lightweight HTML5 Canvas engine instead of heavy Three.js bundle | Preserves sub-second LCP and zero external dependency footprint while achieving 60fps physics, gravity-warping, and particle trails |
| Use Framer Motion (`motion/react`) for Drawer & HUD | Already bundled in project (`motion` & `framer-motion`), provides seamless spring physics and `AnimatePresence` |
| Maintain plain div LCP wrapper in `Home.tsx` | Avoids any delay on hero heading paint; all interactive HUD and canvas enhancements mount progressively without blocking first paint |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| None yet | 1 | N/A |

## Notes
- Planning files created: `task_plan.md`, `findings.md`, `progress.md`
- Implementation Plan artifact must be presented to user for feedback before code modifications.
