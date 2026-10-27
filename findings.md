# Findings & Architectural Discoveries

## Requirements Captured
From user request:
1. **Dynamic Mode Modals (The "Cinema Active" Toggle)**:
   - Make the hero video act as a live environment sandbox.
   - Clicking "Cinema Active" dims main text, shifts camera/perspective angle of the video loop, and displays a floating code drawer beside it.
   - Turns video into a real-time, interactive engineering sandbox validating frontend velocity claims.
2. **Telemetry & Code Stream Overlays (The Command Center)**:
   - Dynamic, semantic HTML elements directly on top of the video container using CSS grid / absolute positioning.
   - Real-time system log stream or live TypeScript compile ledger filtering across a localized edge of the video box.
   - Anchors abstract visuals to "Digital products, engineered properly" and visualizes high-throughput architectures running live.
3. **WebGL Canvas Interaction Refinements**:
   - Live canvas coordinate mesh nodes mapped to cursor movements.
   - When cursor approaches "Start a Project" CTA, background vectors gravity-warp or accelerate rotation toward that coordinate point.
   - Extremely lightweight, interactive experience design.
4. **Scroll-Triggered Focus Shifting**:
   - Utilize CSS mix-blend-mode layout layer with scroll progress.
   - As user scrolls toward Pillar 01 matrix, smoothly transition video background from bright/sharp into deep monochromatic blueprint grid, dynamically adapting typography contrast.
5. **Visual Polishing Matrix**:
   - Chroma-Key Masking: Geometric patterns / subtle mask so background stays clean.
   - Eliminate Harsh Handoffs: Multi-stop gradient `linear-gradient(to bottom, transparent, #09090b)`.
   - High Depth Contrast: `backdrop-filter: saturate(180%) blur(8px)`.

## Research Findings
- **Current Hero Architecture (`Hero.tsx`)**:
  - Located at `backend/resources/js/Components/Hero.tsx`.
  - Layer 1: Background video (`heroVideoUrl` or `heroVideoMobileUrl`) with multi-layered scrims and `HeroInteractiveCanvas`.
  - Layer 2: Floating video control chip with Play/Pause button labeled "Cinema Active" or "Paused", and audio mute toggle.
  - Layer 3: Main Cockpit: Eyebrow badge, LCP Heading, Thesis, 4 CTAs (`Start a Project`, `Book a Consultation`, `Explore Selected Work`, `Direct WhatsApp Dispatch`), and 3 static telemetry chips (`Status: Operational`, `Reliability: 99.9%`, `Speed: Ultra-Fast`).
  - Layer 4: Overlapping Proof Pillars (Pillars 01-04) and scroll expedition cue.
- **Current Interactive Canvas (`HeroInteractiveCanvas.tsx`)**:
  - Implements 5 distinct particle physics modes (`mesh`, `particles` / swarm, `vortex`, `matrix`, `nebula`).
  - Supports ripple sonar pings, mouse aura, touch events, and web audio synthesizer tones.
  - Currently contains a collapsed/expandable Studio FX pill that was CMS-gated behind `show_hero_canvas_controls`.
  - Has zero external 3D engine dependencies (built on high-efficiency standard 2D canvas API with 3D projection math `focalLength / (focalLength + z)`).
- **Page Performance & LCP Constraint (`Home.tsx`)**:
  - In `Home.tsx`, `HeroReveal` is deliberately a plain `<div>` rather than an animated `motion.div` with `initial={{ opacity: 0 }}` because the hero heading is the LCP element. Any delayed hydration or invisible initial state would harm Core Web Vitals.
  - Any new interactive drawers or canvas enhancements must mount without blocking the critical rendering path.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Dual-action Cinema Pill | Allows single-click instant access to the "Cinema Sandbox" without confusing users who just want to pause video. A dedicated sandbox button with sparkling status dot + play/pause toggle. |
| Vector Gravitational Well in `HeroInteractiveCanvas` | Tracking the bounding rectangle of the primary CTA (`Start a Project`) and calculating a gravitational pull vector `gForce = G / dist` when mouse enters the CTA orbit (within 240px). Creates stunning magnetic attraction toward the CTA. |
| Self-driving Code Stream HUD | Local state running a timed event queue generator simulating realistic V8 JIT compile events, message queue drain rates, and cryptographic verification hashes with pause/resume controls. |
| Blueprint Grid Scroll Mask | Absolute layer using CSS `mix-blend-mode: screen` or `overlay` with opacity driven by scroll position via `motion` `useScroll`, transitioning the cinematic video into technical millimeter grid lines. |
| Tailwind v4 + Backdrop Filter Utility | Using `backdrop-filter: saturate(180%) blur(8px)` with subtle border highlights (`border-white/15`) for maximum text legibility over moving video. |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| None | Baseline code audited cleanly |

## Resources
- [Hero.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/Hero.tsx)
- [HeroInteractiveCanvas.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Components/HeroInteractiveCanvas.tsx)
- [Home.tsx](file:///d:/DevCenterPoint-Studio/backend/resources/js/Pages/Public/Home.tsx)
- [app.css](file:///d:/DevCenterPoint-Studio/backend/resources/css/app.css)
