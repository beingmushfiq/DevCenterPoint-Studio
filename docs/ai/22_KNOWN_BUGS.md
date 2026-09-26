# 22 — Known Bug Register

**Status: [VERIFIED/INFERRED from code patterns]**

---

## BUG-001: Duplicate Newsletter Subscriptions Silently Accepted

```
BUG-ID:       BUG-001
Title:        Same email address can be subscribed multiple times
Reproduction: Subscribe with email A. Subscribe again with same email A.
              Both succeed with no error.
Expected:     Second subscription should be rejected or merged silently.
Actual:       Two Firestore documents created with identical email.
Affected Area: NewsletterSignup.tsx, subscribeToNewsletter() in firebase.ts
Severity:     LOW
Root Cause:   addDoc() always creates new documents. No uniqueness constraint
              in Firestore. Firestore rules only validate schema, not uniqueness.
Workaround:   None for end users.
Status:       OPEN
Fix:          Use email hash as document ID (setDoc with merge) or Cloud Function
Verification: Not verified against live Firestore
```

---

## BUG-002: Theme Flash Risk on Hard Refresh (Firefox)

```
BUG-ID:       BUG-002
Title:        Brief flash of unstyled/wrong theme on hard refresh in some browsers
Reproduction: Set dark mode. Hard refresh page in Firefox private window.
Expected:     Dark mode applied immediately, no flash.
Actual:       Potential brief flash of light-mode content before inline script runs.
Affected Area: index.html (pre-hydration script), ThemeContext.tsx
Severity:     LOW (cosmetic)
Root Cause:   Inline script in <head> reads localStorage before body paint.
              Firefox may handle script execution timing slightly differently.
Workaround:   Pre-hydration script already in place; may be minimal/unnoticeable.
Status:       OPEN (unverified — may not be reproducible)
Fix:          Add CSS media query fallback for prefers-color-scheme as secondary guard
Verification: NOT verified against live browser
```

---

## BUG-003: AudioContext Blocked on First Page Load (Browser Policy)

```
BUG-ID:       BUG-003
Title:        Web Audio API context suspended until first user gesture
Reproduction: Load page fresh. Theme toggle or navigation sounds may not play
              on the very first interaction in some browsers.
Expected:     Sounds play on first interaction.
Actual:       AudioContext starts in 'suspended' state (browser policy). First
              call attempts ctx.resume() but it may be async and the first sound
              may be silent.
Affected Area: src/lib/soundEngine.ts > getContext()
Severity:     LOW (UX cosmetic)
Root Cause:   Browser Autoplay Policy requires user gesture before AudioContext
              can run. resume() is called but may not complete synchronously.
Workaround:   SoundEngine already calls ctx.resume() in getContext(). Most browsers
              resume correctly by second interaction.
Status:       OPEN (low severity)
Fix:          Add user-gesture event listener to initialize AudioContext proactively
Verification: Not verified across all browsers
```

---

## BUG-004: Navigation Active Section Tracking Drift

```
BUG-ID:       BUG-004
Title:        Nav active section highlight may not update correctly during fast scroll
Reproduction: Rapidly scroll through all sections.
Expected:     Active section in navigation updates smoothly and accurately.
Actual:       Due to two separate scroll listeners (Navigation.tsx and SEOProvider),
              both computing section positions differently (scrollY + 220 vs + 240),
              there may be brief inconsistency between navigation highlight and
              SEO meta title.
Affected Area: Navigation.tsx (scrollY + 220 offset), SEOHead.tsx (scrollY + 240 offset)
Severity:     LOW (cosmetic)
Root Cause:   Two independent scroll listeners with different position offsets.
Workaround:   Both resolve quickly — minor visual desync only.
Status:       OPEN (cosmetic, non-critical)
Fix:          Unify scroll handling into a single listener or shared context
Verification: Not verified against live site
```

---

## BUG-005: Shutter Timeout Fallback May Double-Fire

```
BUG-ID:       BUG-005
Title:        Theme shutter transition may call handleShutterComplete twice
Reproduction: Toggle theme rapidly during active transition.
Expected:     Transition completes cleanly once.
Actual:       Both the animation onComplete callback and the 620ms setTimeout
              fallback in ThemeContext call handleShutterComplete. The guard
              uses functional state update (prev => false) to prevent double-set,
              but playShutterCompleteClick() may still fire twice if both callbacks
              arrive before state update propagates.
Affected Area: ThemeContext.tsx > handleShutterComplete()
Severity:     LOW (cosmetic audio flicker)
Root Cause:   Dual completion paths (animation callback + setTimeout fallback).
Workaround:   Guard is partial — setState function update prevents double state,
              but sound may still double-play.
Status:       OPEN
Fix:          Use a ref flag (shutterCompletedRef) cleared before transition starts
              and checked in both paths.
Verification: Not verified
```

---

## BUG-006: No Error State for Failed Firebase Writes

```
BUG-ID:       BUG-006
Title:        Unclear whether error states are shown to user on Firestore write failure
Reproduction: Simulate Firebase write failure (e.g., disconnect network before submit).
Expected:     User sees clear error message with retry option.
Actual:       handleFirestoreError() re-throws. Whether the catching component
              (ProjectInquiryBuilder.tsx, NewsletterSignup.tsx) shows user-friendly
              error UI has not been verified.
Affected Area: ProjectInquiryBuilder.tsx, NewsletterSignup.tsx, firebase.ts
Severity:     MEDIUM (UX — user may not know if submission failed)
Root Cause:   Error handling delegation — firebase.ts throws, component must catch.
Workaround:   Unknown
Status:       OPEN (requires component-level verification)
Fix:          Verify both components have try/catch with user-facing error state
Verification: NOT verified
```
