# 14 — Data Flows

**Status: [VERIFIED]**

All data flows in this application. There is no backend server; data either comes from static bundles or flows to/from Firebase.

---

## Flow 1: Project Inquiry Submission (Primary Conversion)

```
USER
  ↓ Fills ProjectInquiryBuilder form (multi-step)
  
FRONTEND STATE (ProjectInquiryBuilder.tsx)
  - formData: InquiryFormData (useState)
  - projectType, timeline, name, email, company,
    description, selectedTech, budgetRange
  ↓ User clicks "Submit" button
  ↓ setIsSubmitting(true)
  
VALIDATION (client-side in component)
  - name: required, non-empty
  - email: required, non-empty
  - description: optional
  
FIREBASE AUTH (lib/firebase.ts > ensureAuth())
  ↓ onAuthStateChanged check
  ↓ If no session → signInAnonymously(auth)
  → auth.currentUser.uid obtained
  
REFERENCE GENERATION
  → referenceNumber = `DCP-${year}-${Math.floor(1000+random*9000)}`
  
FIRESTORE WRITE (lib/firebase.ts > submitProjectInquiry())
  → addDoc(collection(db, 'inquiries'), {
      name, email, company, projectType,
      budgetRange, timeline, description,
      selectedTech, referenceNumber,
      status: 'pending',
      authUid: uid,
      submittedAt: ISO string,
      createdAt: serverTimestamp()
    })
  
FIRESTORE SECURITY RULES
  → isValidId(inquiryId) check
  → isValidInquiry(data) schema validation
  → Document written ✓
  
RESPONSE (lib/firebase.ts)
  → { id: docRef.id, referenceNumber }
  
UI UPDATE (ProjectInquiryBuilder.tsx)
  ↓ setSubmitted(true)
  ↓ setReferenceNumber(referenceNumber)
  → confetti() burst
  → soundEngine.playSuccessChime()
  → Success view shown with referenceNumber
```

---

## Flow 2: Newsletter Subscription

```
USER
  ↓ Enters email in NewsletterSignup component
  ↓ Clicks subscribe button
  
VALIDATION (lib/firebase.ts > subscribeToNewsletter())
  - Trim + lowercase normalize email
  - Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  - Max 150 chars
  → Throws Error if invalid (caught by component)
  
FIREBASE AUTH
  ↓ ensureAuth() (non-blocking — failure does not stop write)
  
FIRESTORE WRITE
  → addDoc(collection(db, 'newsletter_subscribers'), {
      email: normalized,
      source: 'newsletter_component' (max 50 chars),
      status: 'active',
      subscribedAt: ISO string,
      createdAt: serverTimestamp()
    })
  
FIRESTORE RULES
  → isValidNewsletterSubscriber(data) check
  → Document written ✓
  
UI UPDATE
  → Success feedback shown
```

---

## Flow 3: Page Content Rendering (Static Data)

```
BUILD TIME (Vite)
  ↓ Compiles TypeScript data files into JS bundle
  → capabilities.ts, projects.ts, technology.ts,
     faq.ts, process.ts, about.ts,
     simulatedProjectDb.ts
  
RUNTIME (Browser load)
  ↓ Bundle downloaded
  ↓ React mounts
  ↓ GlobalLoadingScreen shows
  ↓ onMountComplete() fires → isSiteLoaded = true
  ↓ App fades in
  
USER INTERACTION
  ↓ Scroll triggers ScrollRevealSection animations
  ↓ Scroll triggers SEOProvider scroll listener
    → setActiveSection(id) → updates <head> meta via react-helmet-async
  ↓ Scroll triggers Navigation scroll listener
    → setScrolled(true/false) → nav glassmorphic style
    → setActiveSection(sectionMapId) → nav highlight
```

---

## Flow 4: Dark/Light Theme Toggle

```
USER
  ↓ Clicks ThemeToggle button
  
ThemeContext.tsx > toggleTheme()
  - Guard: if isShutterActive, return (debounce)
  - Calculate nextTheme
  - Check prefers-reduced-motion
  ↓ soundEngine.playShutterDownSequence()
  ↓ haptic(8)
  ↓ setIsShutterActive(true)
  ↓ setShutterTargetTheme(nextTheme)
  
ANIMATION (ShutterTransitionOverlay.tsx)
  → Overlay slides down over viewport
  
setTimeout(240ms)
  → setThemeState(nextTheme)
  → document.documentElement.classList toggle dark/light
  → localStorage.setItem('dcp_theme', nextTheme)
  
setTimeout(620ms) [fallback]
  → handleShutterComplete()
  → setIsShutterActive(false)
  → soundEngine.playShutterCompleteClick()
  → haptic(10)
  
ANIMATION (ShutterTransitionOverlay.tsx)
  → onComplete callback fires → overlay slides away
```

---

## Flow 5: Command Palette (⌘K)

```
USER
  ↓ Presses Ctrl+K / ⌘K or clicks Search button
  
Navigation.tsx
  → setIsCommandOpen(true)
  
CommandPalette.tsx renders (AnimatePresence)
  ↓ User types search query
  → Filters section titles/links (static in-memory search)
  ↓ User selects result
  → handleNavClick('#sectionId')
  → scrollIntoView({ behavior: 'smooth' })
  → setIsCommandOpen(false)
```

---

## Flow 6: Case Study Modal

```
USER
  ↓ Clicks project card in SelectedWorkSection
  
SelectedWorkSection.tsx
  → setSelectedProject(project)
  → Opens CaseStudyModal

CaseStudyModal.tsx
  - Receives project: Project from projects.ts
  - Also loads extended detail from simulatedProjectDb.ts (matched by project.id)
  → soundEngine.playModalOpen()
  → Modal renders full-screen case study content
  → ProjectScreenshotCarousel for images
  → BreadcrumbNavigation

USER
  ↓ Closes modal (ESC key or backdrop click or X button)
  → soundEngine.playModalClose()
  → AnimatePresence exit animation
  → selectedProject = null
```

---

## Flow 7: Initial SEO Meta Update on Scroll

```
Browser scroll event
  → SEOProvider scroll listener (requestAnimationFrame throttled)
  → Scans section IDs top-to-bottom
  → Finds which section top < scrollPos
  → setActiveSection(id)
  
SEOProvider
  → baseMeta = SECTION_METADATA[activeSection]
  → currentMeta computed (merged with customSEO override if any)
  
SEOHead (react-helmet-async)
  → Updates <title>, <meta description>, <meta keywords>,
     <link canonical>, OG tags, Twitter tags, JSON-LD script
  
Browser tab title updates in real-time as user scrolls
```
