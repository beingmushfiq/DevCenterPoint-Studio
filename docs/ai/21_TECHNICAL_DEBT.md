# 21 — Technical Debt Register

**Status: [VERIFIED — from source code audit]**

---

## TD-001: Firebase Config File Committed to Source

```
ID:           TD-001
Title:        Firebase API config file committed to repository root
Severity:     MEDIUM
Category:     Security
Location:     firebase-applet-config.json
Problem:      Firebase project configuration including API keys is checked into
              source control. While Firebase API keys are considered "semi-public"
              (protected by Firestore security rules), this is not best practice.
Why it matters: Any developer with repo access can see project credentials.
               If Firestore rules are ever misconfigured, the API key exposure
               increases attack surface.
Current workaround: Firestore security rules enforce schema validation and
                    access control.
Suggested resolution: Move Firebase config to environment variables or a
                      gitignored config file. Use .gitignore to exclude.
Dependencies: None
Risk:         MEDIUM — mitigated by robust Firestore rules
Status:       OPEN
```

---

## TD-002: No Email Deduplication for Newsletter

```
ID:           TD-002
Title:        Duplicate newsletter subscriptions not prevented
Severity:     LOW
Category:     Data Quality
Location:     src/lib/firebase.ts > subscribeToNewsletter()
              firestore.rules
Problem:      A user can subscribe with the same email address multiple times.
              Firestore rules do not check for existing documents.
              addDoc() always creates a new document.
Why it matters: Data integrity issue; duplicate emails in subscriber list;
                incorrect subscriber count metrics.
Current workaround: None
Suggested resolution: Use setDoc() with email hash as document ID (natural
                      deduplication), or use a Cloud Function to check before insert.
Dependencies: Would require Cloud Functions (adds backend complexity) or
              rethinking document ID strategy.
Risk:         LOW — cosmetic/data quality issue only
Status:       OPEN
```

---

## TD-003: Hardcoded "Available for Q4" Status in Navigation

```
ID:           TD-003
Title:        Availability status is hardcoded in Navigation.tsx
Severity:     LOW
Category:     Maintainability
Location:     src/components/Navigation.tsx (line ~138)
Problem:      The "Available for Q4" availability indicator is a hardcoded string
              in JSX. Must be manually edited each quarter.
Why it matters: Outdated availability status damages brand credibility. Easy to forget.
Current workaround: Manual update when status changes.
Suggested resolution: Move to a data constant in a config file, or fetch from
                      a simple Firestore document for real-time control.
Dependencies: None (if data file approach)
Risk:         LOW — purely cosmetic
Status:       OPEN
```

---

## TD-004: "simulatedProjectDb" Naming Implies Non-Production Data

```
ID:           TD-004
Title:        Portfolio extended data file named "simulatedProjectDb.ts"
Severity:     LOW
Category:     Documentation / Clarity
Location:     src/data/simulatedProjectDb.ts
Problem:      The filename "simulated" may confuse future engineers into thinking
              the data is placeholder/fake rather than intentional static data.
Why it matters: May cause agents or developers to replace it incorrectly.
Current workaround: Context makes it clear it is real design content.
Suggested resolution: Rename to projectsExtendedData.ts or caseStudyDetails.ts.
Dependencies: Update import in CaseStudyModal.tsx and SelectedWorkSection.tsx.
Risk:         LOW — naming only
Status:       OPEN
```

---

## TD-005: No Email Notification When New Inquiry Is Submitted

```
ID:           TD-005
Title:        No notification to team when project inquiry is submitted
Severity:     HIGH
Category:     Business Process
Location:     src/lib/firebase.ts > submitProjectInquiry()
Problem:      When a potential client submits a project inquiry, the data goes
              into Firestore but no one at DevCenterPoint is alerted automatically.
              Team must manually check Firebase console.
Why it matters: Delayed response to leads damages conversion rates and client trust.
Current workaround: Manual Firebase console monitoring.
Suggested resolution: Firebase Cloud Function triggered on Firestore write to
                      send email notification (via SendGrid/Gmail/Firebase Extensions).
                      Alternatively: Firebase email extension.
Dependencies: Requires Firebase Cloud Functions or a Firebase extension.
Risk:         HIGH — directly impacts business revenue
Status:       OPEN
```

---

## TD-006: No Newsletter Unsubscribe Flow

```
ID:           TD-006
Title:        Users cannot unsubscribe from newsletter
Severity:     MEDIUM
Category:     Legal / UX
Location:     src/components/NewsletterSignup.tsx, firestore.rules
Problem:      Once subscribed, there is no unsubscribe mechanism. Firestore rules
              block updates/deletes on newsletter_subscribers. The `status` field
              supports 'unsubscribed' value but no UI or API path sets it.
Why it matters: Potential GDPR/CAN-SPAM compliance issue. Poor UX for subscribers.
Current workaround: None.
Suggested resolution: Create an unsubscribe link/page that updates subscriber
                      status via a Cloud Function (since client can't update docs).
Dependencies: Cloud Functions required (rules block direct client updates).
Risk:         MEDIUM — legal compliance risk
Status:       OPEN
```

---

## TD-007: Efficiency Metrics Are Static/Hardcoded

```
ID:           TD-007
Title:        KPI metrics in EfficiencyMetricsSection are hardcoded
Severity:     LOW
Category:     Maintainability
Location:     src/components/EfficiencyMetricsSection.tsx
Problem:      Metrics like "99.98% uptime", "sub-50ms API latency", "65% faster
              feature velocity" are hardcoded in JSX/data. They are marketing claims,
              not live-fetched operational metrics.
Why it matters: Metrics become stale over time. Manual update required.
Current workaround: Manual update when benchmarks change.
Suggested resolution: Move to a data constant file for easier management.
Dependencies: None
Risk:         LOW — cosmetic/marketing
Status:       OPEN
```

---

## TD-008: @google/genai Package Unused (Potential)

```
ID:           TD-008
Title:        @google/genai listed in dependencies but no usage confirmed in source
Severity:     LOW
Category:     Dead Code / Bundle Size
Location:     package.json
Problem:      The @google/genai package (v2.4.0) is in production dependencies
              but no import of it was found in any source file during audit.
              This adds to bundle size unnecessarily.
Why it matters: Unused dependencies increase bundle size and attack surface.
Current workaround: None — it is silently included.
Suggested resolution: Verify if it is used (grep for 'genai' across src/). If unused,
                      remove from package.json.
Dependencies: None
Risk:         LOW-MEDIUM — bundle size + unused code
Status:       OPEN (requires verification)
```

---

## TD-009: Both framer-motion and motion in Dependencies

```
ID:           TD-009
Title:        Dual animation library packages (framer-motion + motion)
Severity:     LOW
Category:     Bundle Size
Location:     package.json
Problem:      Both framer-motion (^13.4.4) and motion (^12.23.24) are in
              package.json. Components import from 'motion/react' path.
              The 'motion' package is the renamed/rebrand of framer-motion.
              Having both likely causes duplication in the bundle.
Why it matters: Increased JavaScript bundle size; potentially two versions
                of the same animation logic.
Current workaround: Both work — no functional issue.
Suggested resolution: Remove framer-motion from package.json if all imports
                      use 'motion/react'. Verify no direct 'framer-motion' imports exist.
Dependencies: All animation import paths in components.
Risk:         LOW — performance/bundle size
Status:       OPEN (requires grep verification)
```

---

## TD-010: No Testing Infrastructure

```
ID:           TD-010
Title:        Zero automated tests configured
Severity:     HIGH
Category:     Quality / Reliability
Location:     Entire project
Problem:      No test framework (Jest, Vitest, Playwright) is configured. No unit,
              integration, or end-to-end tests exist. The only "lint" is tsc --noEmit.
Why it matters: Changes to any component carry regression risk with no safety net.
              Critical user flows (form submission) have no automated verification.
Current workaround: Manual testing only.
Suggested resolution: Add Vitest for unit/component tests; Playwright for E2E
                      (especially critical path: inquiry submission flow).
Dependencies: None — additive only.
Risk:         HIGH — no automated regression safety
Status:       OPEN
```
