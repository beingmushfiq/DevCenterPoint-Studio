# 13 — Third-Party Integrations

**Status: [VERIFIED]**

---

## 1. Firebase (Firestore + Anonymous Auth)

```
Provider:       Google Firebase
Purpose:        Client-side persistence for inquiry forms and newsletter subscriptions
Authentication: Firebase Anonymous Auth (auto-created per browser session)
Environment:    firebase-applet-config.json (apiKey, projectId, etc.)
SDK Version:    firebase ^12.19.0
```

**Frontend Usage:**
- `src/lib/firebase.ts` — all Firebase logic centralized here
- `ProjectInquiryBuilder.tsx` → `submitProjectInquiry()`
- `NewsletterSignup.tsx` → `subscribeToNewsletter()`

**Collections:**
- `/inquiries` — project inquiry submissions
- `/newsletter_subscribers` — email subscriptions

**Failure Behavior:**
- If Anonymous Auth fails → logs warning, continues write attempt with `authUid: 'guest'`
- If Firestore write fails → `handleFirestoreError()` re-throws with context info → caught by component → shows error state

**Retry Behavior:** None — single attempt, no retry logic [PARTIAL]

**Rate Limits:** Firebase free tier applies (reads/writes/day) [UNKNOWN — tier not confirmed]

**Security Rules:** `firestore.rules` — validates schema on write, blocks reads for newsletter, scopes inquiry reads to own documents

**Documentation:** https://firebase.google.com/docs

---

## 2. Gemini API (`@google/genai`)

```
Provider:       Google DeepMind / AI Studio
Purpose:        UNKNOWN — package is in dependencies but usage is not found in any component
Authentication: GEMINI_API_KEY (environment variable from .env.example)
Environment:    GEMINI_API_KEY env var (AI Studio auto-injected)
SDK Version:    @google/genai ^2.4.0
```

**Status: [UNKNOWN]**

The `@google/genai` package is listed in `package.json` dependencies, and `GEMINI_API_KEY` is documented in `.env.example`. However, no usage of this package was found in any source file during the audit. This may be:
1. Planned/future feature not yet implemented
2. Removed from components but not from `package.json`
3. Used in a file not yet inspected (unlikely given complete file listing)

**Action required:** Verify whether this integration is used. If not, it is an unused dependency (see Technical Debt TD-008).

---

## 3. Google Fonts

```
Provider:       Google Fonts CDN
Purpose:        Typography — Plus Jakarta Sans + JetBrains Mono
Authentication: None (public CDN)
Environment:    None
```

**Frontend Usage:** `index.html` → `<link>` tags with `rel="preconnect"` to `fonts.googleapis.com` and `fonts.gstatic.com`

**Failure Behavior:** If CDN fails, falls back to system fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)

---

## 4. devicons CDN

```
Provider:       devicons (open source icon library)
Purpose:        Technology stack icons in TechEcosystem component
Authentication: None (public CDN)
Environment:    None
URL pattern:    https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{slug}/{slug}-original.svg
```

**Frontend Usage:** `TechIcon.tsx` — renders icon by `iconSlug` prop

**Failure Behavior:** Broken image (no fallback handling verified) [INFERRED]

---

## 5. Web Audio API (Browser Native)

```
Provider:       Browser native (W3C Web Audio API)
Purpose:        Sound synthesizer for micro-interaction feedback
Authentication: None
Environment:    None (zero external assets)
```

**Frontend Usage:** `src/lib/soundEngine.ts` — singleton `SoundEngine` class

**Failure Behavior:** Graceful fallback — `getContext()` returns `null` if Audio API unavailable; all methods silently no-op if `ctx` is null

**Rate Limits:** None

**Haptic:** Uses `navigator.vibrate()` (mobile only, not all browsers)

---

## 6. canvas-confetti

```
Provider:       npm package (canvas-confetti ^1.9.4)
Purpose:        Confetti burst animation on successful form submission
Authentication: None
Environment:    None
```

**Frontend Usage:** `ProjectInquiryBuilder.tsx` → `import confetti from 'canvas-confetti'` → called on submit success

**Failure Behavior:** Non-critical visual — failure would not affect form submission

---

## 7. Lucide React

```
Provider:       npm package (lucide-react ^0.546.0)
Purpose:        Icon library for all UI icons
Authentication: None (included in bundle)
Environment:    None
```

**Frontend Usage:** Throughout all components; icons imported individually (tree-shakeable)

---

## 8. Recharts

```
Provider:       npm package (recharts ^3.10.1)
Purpose:        KPI data visualization charts
Authentication: None (included in bundle)
Environment:    None
```

**Frontend Usage:** `EfficiencyMetricsSection.tsx`

---

## 9. Framer Motion / motion

```
Provider:       npm packages: framer-motion ^13.4.4, motion ^12.23.24
Purpose:        Animation library for scroll-reveal, modals, dropdowns, theme transitions
Authentication: None (included in bundle)
Environment:    None
```

**Note:** Both `framer-motion` and `motion` are in `package.json`. Imports use `motion/react` path (not `framer-motion`). This is because `motion` package is the renamed/successor version. Having both may cause bundle bloat — see Technical Debt TD-009.

**Frontend Usage:** `App.tsx`, `Navigation.tsx`, `CaseStudyModal.tsx`, `EngineeringPhilosophy.tsx`, and most other interactive components

---

## Integration Risk Summary

| Integration | Risk Level | Reason |
|---|---|---|
| Firebase Firestore | MEDIUM | No retry logic; single write attempt |
| Gemini API | UNKNOWN | Package present, usage not confirmed |
| Google Fonts | LOW | Graceful system font fallback |
| devicons CDN | LOW | Cosmetic only; no error fallback |
| Web Audio API | LOW | Fully graceful silent fallback |
| canvas-confetti | LOW | Non-critical UI feature |
| framer-motion + motion | LOW-MEDIUM | Dual packages may bloat bundle |
