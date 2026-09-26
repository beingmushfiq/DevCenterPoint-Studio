# Implementation Plan: Priority Action Items

**Created:** 2026-09-26  
**Scope:** TD-001, TD-005, TD-006, TD-010, BUG-006  
**Approach:** Serverless-first (no new backend); Firebase Extensions for email

---

## Executive Summary

| # | Item | Approach | Effort | Risk |
|---|---|---|---|---|
| 1 | BUG-006: Error UI on Firebase failures | Inspect + fix form components | XS (1–2h) | LOW |
| 2 | TD-001: Firebase config in source | Move to .env, gitignore config file | S (1h) | LOW |
| 3 | TD-005: Inquiry notification emails | Firebase Trigger Email Extension + Gmail SMTP | M (3–4h) | LOW |
| 4 | TD-006: Newsletter unsubscribe | Cloud Function + tokenized unsubscribe link | L (1–2 days) | MEDIUM |
| 5 | TD-010: Playwright E2E tests | Critical path tests for both forms | L (1–2 days) | LOW |

**Execution order:** 1 → 2 → 3 → 4 → 5 (each is independent; 1 and 2 first since they're fast and foundational)

---

## Item 1: BUG-006 — Verify & Fix Error States on Firebase Write Failure

### Goal
Ensure users see a clear, actionable error message if Firestore write fails (network down, rules reject, quota exceeded).

### Verification Steps
1. Inspect `ProjectInquiryBuilder.tsx` for a `try/catch` around `submitProjectInquiry()`
2. Inspect `NewsletterSignup.tsx` for a `try/catch` around `subscribeToNewsletter()`
3. Check if caught errors are shown in UI or silently swallowed

### Implementation

**`ProjectInquiryBuilder.tsx`** — wrap the submit handler:
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  setError(null); // ← ensure error state exists

  try {
    const result = await submitProjectInquiry(formData);
    setReferenceNumber(result.referenceNumber);
    setSubmitted(true);
    confetti({ ... });
    soundEngine.playSuccessChime();
  } catch (err) {
    // ← THIS must exist and render visibly
    setError('Something went wrong. Please try again or email us directly.');
    soundEngine.playClick(); // or a soft error tone
  } finally {
    setIsSubmitting(false);
  }
};
```

**Error UI to render (if missing):**
```tsx
{error && (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30
               border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400"
  >
    <AlertCircle className="w-5 h-5 shrink-0" />
    <span className="text-sm font-medium">{error}</span>
  </motion.div>
)}
```

Apply the same pattern to `NewsletterSignup.tsx`.

### Files Changed
- `src/components/ProjectInquiryBuilder.tsx`
- `src/components/NewsletterSignup.tsx`

### Definition of Done
- Network offline → form shows error message, submit button re-enabled
- Error is visible, styled consistently with the design system
- Error clears on next attempt

---

## Item 2: TD-001 — Move Firebase Config to Environment Variables

### Goal
Remove sensitive Firebase config from the committed `firebase-applet-config.json` and source it from environment variables instead.

### Approach
Since there's no Firebase CLI available, and Vite exposes `import.meta.env.VITE_*` vars at build time, this is fully achievable without any backend changes.

### Implementation

**Step 1: Create `.env` file (gitignored, for local dev only)**

```bash
# .env  — local development only (never committed)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_ID=   # leave blank if using default Firestore database
VITE_NOTIFY_EMAIL=team@devcenterpoint.com
```

> ⚠️ **AI Studio / Cloud Run production note:**
> `VITE_*` variables are **baked into the JavaScript bundle at build time** by Vite.
> They are NOT read at runtime like `APP_URL` or `GEMINI_API_KEY`.
> To set them for production:
> 1. Open **AI Studio → Secrets panel**
> 2. Add each `VITE_*` key with its value
> 3. AI Studio injects them as environment variables during `npm run build`
> 4. Vite replaces `import.meta.env.VITE_*` references statically in the compiled bundle

**Step 2: Update `.env.example`**
```bash
# .env.example — committed to source, values redacted
# For local dev: copy to .env and fill in values from Firebase Console
# For production (Cloud Run via AI Studio): set these in AI Studio Secrets panel
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_ID=          # optional — only if non-default Firestore DB
VITE_NOTIFY_EMAIL=                   # team inbox for inquiry notifications
GEMINI_API_KEY=                      # injected by AI Studio automatically
APP_URL=                             # injected by AI Studio automatically (Cloud Run URL)
```

**Step 3: Update `src/lib/firebase.ts`**
```typescript
// BEFORE: reads from firebase-applet-config.json
import firebaseConfig from '../../firebase-applet-config.json';

// AFTER: reads from Vite env vars
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID ?? null;
```

**Step 4: Update `.gitignore`**
```
# Add:
.env
.env.local
firebase-applet-config.json
```

> ⚠️ **NOTE:** Do NOT delete `firebase-applet-config.json` — keep it locally. Only gitignore it going forward. If the file is already in Git history, the keys should be rotated in Firebase Console (Security → API Keys).

### Files Changed
- `src/lib/firebase.ts`
- `.env` (new, gitignored)
- `.env.example` (updated)
- `.gitignore` (updated)
- `firebase-applet-config.json` (remains local, not deleted)

### Definition of Done
- `firebase-applet-config.json` is in `.gitignore`
- Firebase initializes correctly from env vars
- `.env.example` documents all required vars
- `npm run dev` still works with `.env` in place

---

## Item 3: TD-005 — Inquiry Notification Emails

### Goal
Send an email to the team's Gmail inbox every time a new project inquiry is submitted to Firestore.

### Approach: Firebase Trigger Email Extension + Gmail SMTP
Since there's no Firebase CLI, we'll use the **Firebase Console** to install the extension and configure it manually. The extension watches a `mail` Firestore collection; anything written there gets emailed.

### Architecture

```
ProjectInquiryBuilder.tsx
  ↓ submits inquiry
lib/firebase.ts > submitProjectInquiry()
  ↓ writes to /inquiries/{id}   ← existing (no change)
  ↓ ALSO writes to /mail/{id}  ← NEW: triggers the email extension
                                       
Firebase Trigger Email Extension
  ↓ detects new doc in /mail
  ↓ sends email via Gmail SMTP
  ↓ updates doc with delivery status
  ↓
Team Gmail inbox ← notification received
```

### Firebase Console Setup (Manual — no CLI)

1. Go to [Firebase Extensions Hub](https://extensions.dev/extensions/firebase/firestore-send-email)
2. Install **"Trigger Email from Firestore"** on your project
3. Configure the extension:
   - **SMTP connection URI:** `smtps://your.gmail@gmail.com:app_password@smtp.gmail.com:465`
   - **Email documents collection:** `mail`
   - **Default FROM:** `"DevCenterPoint Notifications" <your.gmail@gmail.com>`
   - **Default REPLY-TO:** `(leave blank)`
4. Generate a **Gmail App Password** (Google Account → Security → 2-Step Verification → App Passwords)

### Code Change: `src/lib/firebase.ts`

Add a new function `sendInquiryNotification()` called after successful inquiry write:

```typescript
/**
 * Writes to the /mail collection, triggering Firebase Trigger Email Extension.
 * The extension sends the email via Gmail SMTP.
 */
async function sendInquiryNotification(
  inquiry: InquiryFormData & { referenceNumber: string; docId: string }
): Promise<void> {
  const NOTIFY_EMAIL = import.meta.env.VITE_NOTIFY_EMAIL; // e.g. team@devcenterpoint.com

  if (!NOTIFY_EMAIL) {
    console.warn('[firebase] VITE_NOTIFY_EMAIL not set — skipping notification email');
    return;
  }

  const mailDoc = {
    to: NOTIFY_EMAIL,
    message: {
      subject: `[DevCenterPoint] New Inquiry — ${inquiry.referenceNumber}`,
      html: buildInquiryEmailHtml(inquiry),
      text: buildInquiryEmailText(inquiry),
    },
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'mail'), mailDoc);
}

function buildInquiryEmailHtml(
  inquiry: InquiryFormData & { referenceNumber: string; docId: string }
): string {
  return `
    <h2>New Project Inquiry — ${inquiry.referenceNumber}</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Name</td><td style="padding:8px">${inquiry.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Email</td><td style="padding:8px"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Company</td><td style="padding:8px">${inquiry.company || '—'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Project Type</td><td style="padding:8px">${inquiry.projectType}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Timeline</td><td style="padding:8px">${inquiry.timeline}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Budget</td><td style="padding:8px">${inquiry.budgetRange || 'Flexible'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Technologies</td><td style="padding:8px">${inquiry.selectedTech?.join(', ') || '—'}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;color:#64748b">Description</td><td style="padding:8px;white-space:pre-wrap">${inquiry.description || '—'}</td></tr>
    </table>
    <p style="color:#64748b;font-size:12px;margin-top:24px">
      Reference: ${inquiry.referenceNumber} | Firestore ID: ${inquiry.docId}<br>
      Submitted at ${new Date().toLocaleString()}
    </p>
  `;
}

function buildInquiryEmailText(
  inquiry: InquiryFormData & { referenceNumber: string; docId: string }
): string {
  return [
    `New Project Inquiry — ${inquiry.referenceNumber}`,
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company || '—'}`,
    `Project Type: ${inquiry.projectType}`,
    `Timeline: ${inquiry.timeline}`,
    `Budget: ${inquiry.budgetRange || 'Flexible'}`,
    `Technologies: ${inquiry.selectedTech?.join(', ') || '—'}`,
    `Description: ${inquiry.description || '—'}`,
  ].join('\n');
}
```

**Update `submitProjectInquiry()`** to call notification (non-blocking — failure must not affect the inquiry submission):

```typescript
// After successful addDoc for inquiry:
try {
  await sendInquiryNotification({ ...formData, referenceNumber, docId: docRef.id });
} catch (notifyErr) {
  // Non-critical: log but never surface to user
  console.warn('[firebase] Notification email failed (non-critical):', notifyErr);
}
```

**Add to `.env` (local) and AI Studio Secrets panel (production):**
```
VITE_NOTIFY_EMAIL=team@devcenterpoint.com
```

> ⚠️ **Cloud Run / AI Studio note:** `VITE_NOTIFY_EMAIL` is baked into the bundle at build time.
> Set it in **AI Studio → Secrets** so it's available when AI Studio runs `npm run build`.

**Firestore rules — add `mail` collection (write-only for authenticated users):**
```
match /mail/{mailId} {
  allow create: if request.auth != null;
  allow read, update, delete: if false;
}
```

### Files Changed
- `src/lib/firebase.ts` (add notification logic)
- `firestore.rules` (add mail collection rule)
- `.env` (VITE_NOTIFY_EMAIL)
- `.env.example` (document VITE_NOTIFY_EMAIL)
- Firebase Console (Extension install — manual, one-time)

### Definition of Done
- Submit inquiry → email arrives in team inbox within 60 seconds
- Email shows all form fields + reference number + Firestore doc ID
- If email extension is down, inquiry submission still succeeds
- `mail` collection is protected from reads

---

## Item 4: TD-006 — Newsletter Unsubscribe

### Goal
Let subscribers opt out via a tokenized unsubscribe link, setting their status to `'unsubscribed'` in Firestore.

### Constraint
Firestore rules block all client-side updates to `newsletter_subscribers`. A Cloud Function is required to perform the update server-side.

**Since Firebase CLI is unavailable**, deploy via **GCP Console → Cloud Functions → Create Function** (Gen 2). This deploys a Cloud Run container under the hood and gives you an HTTPS trigger URL.

### Architecture

```
Subscriber receives newsletter email
  ↓ Clicks: https://devcenterpoint.com/unsubscribe?token=abc123

Unsubscribe page (new route or query param handler)
  ↓ Calls HTTPS Cloud Function: /unsubscribeNewsletter?token=abc123
  
Cloud Function (Node.js, Gen 2)
  ↓ Looks up /newsletter_subscribers where unsubToken == token
  ↓ Sets status = 'unsubscribed', unsubscribedAt = now()
  ↓ Returns { success: true }
  
Unsubscribe page
  → Shows confirmation message
```

### Implementation

**Step 1: Add `unsubToken` field when subscribing**

In `subscribeToNewsletter()` in `firebase.ts`:
```typescript
import { v4 as uuidv4 } from 'uuid'; // add uuid to dependencies

const unsubToken = uuidv4(); // e.g. 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

await addDoc(collection(db, 'newsletter_subscribers'), {
  email: normalizedEmail,
  source: source,
  status: 'active',
  unsubToken,                        // ← NEW
  subscribedAt: new Date().toISOString(),
  createdAt: serverTimestamp(),
});
```

**Step 2: Update Firestore schema doc** (newsletter_subscribers — add field):
```
unsubToken  | string | YES | UUID v4, 36 chars
```

**Step 3: Update Firestore rules** — `unsubToken` must be an allowed field:
```
// In isValidNewsletterSubscriber:
// Add 'unsubToken' to hasOnly() list
// Validate: data.unsubToken is string && data.unsubToken.size() == 36
```

**Step 4: Deploy Cloud Function via GCP Console (no CLI needed)**

Go to [console.cloud.google.com](https://console.cloud.google.com) → **Cloud Functions → Create Function**:

| Setting | Value |
|---|---|
| Environment | **2nd gen** (Cloud Run) |
| Function name | `unsubscribeNewsletter` |
| Region | `us-central1` (match your Firebase project region) |
| Trigger type | **HTTPS** |
| Authentication | **Allow unauthenticated invocations** |
| Runtime | Node.js 20 |
| Entry point | `unsubscribeNewsletter` |

After deployment, GCP Console shows the trigger URL:
```
https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/unsubscribeNewsletter
```

Add this to **AI Studio Secrets panel** (runtime env var — this one IS read at runtime via Cloud Run):
```
VITE_UNSUB_FUNCTION_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/unsubscribeNewsletter
```

The Cloud Function source (`functions/unsubscribeNewsletter.ts`):
```typescript
import * as functions from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore();

export const unsubscribeNewsletter = functions.onRequest(
  { cors: ['https://devcenterpoint.com'], region: 'us-central1' },
  async (req, res) => {
    const token = req.query.token as string;

    if (!token || typeof token !== 'string' || token.length !== 36) {
      res.status(400).json({ error: 'Invalid token' });
      return;
    }

    const snapshot = await db
      .collection('newsletter_subscribers')
      .where('unsubToken', '==', token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(404).json({ error: 'Token not found' });
      return;
    }

    const doc = snapshot.docs[0];
    await doc.ref.update({
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  }
);
```

**Step 5: Unsubscribe page / state in app**

Unsubscribe URL pattern (no router needed — query param on the main domain):
```
https://devcenterpoint.com?unsubscribe=<uuid-token>
```

The app reads this on mount in `App.tsx`:

```typescript
// App.tsx — on mount:
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('unsubscribe');
  if (token) setUnsubToken(token); // show unsubscribe UI overlay
}, []);
```

Render an `UnsubscribeOverlay` component when `unsubToken` is set.

**Step 6: Include unsubscribe link in newsletter emails**

When sending newsletters, include a link using the stored `unsubToken`:
```
Unsubscribe: https://devcenterpoint.com?unsubscribe={{unsubToken}}
```

In the app, `UnsubscribeOverlay` calls the Cloud Function URL from `import.meta.env.VITE_UNSUB_FUNCTION_URL`.

> ⚠️ Note: `VITE_UNSUB_FUNCTION_URL` is baked into the bundle at build time — set it in AI Studio Secrets before building.

### New Dependency
```
npm install uuid
npm install --save-dev @types/uuid
```

### Files Changed
- `src/lib/firebase.ts` (add `unsubToken` generation)
- `firestore.rules` (add `unsubToken` to schema + add Cloud Function write permission)
- `functions/unsubscribeNewsletter.ts` (new Cloud Function)
- `src/App.tsx` (query param detection on mount)
- `src/components/UnsubscribeOverlay.tsx` (new component)

### Definition of Done
- Subscribing generates a unique `unsubToken` stored in Firestore
- Visiting `/?unsubscribe=<token>` shows unsubscribe UI
- Confirming calls Cloud Function → sets status to `'unsubscribed'`
- User sees clear confirmation message

---

## Item 5: TD-010 — Playwright E2E Tests (Critical Path)

### Goal
Automated tests for the two most critical user flows: project inquiry submission and newsletter signup.

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install chromium  # install browser
```

**Create `playwright.config.ts`:**
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
```

**Add to `package.json`:**
```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### Test Suite 1: Project Inquiry Form (`tests/e2e/inquiry-form.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Project Inquiry Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
  });

  test('shows form with correct default state', async ({ page }) => {
    const form = page.locator('[data-testid="inquiry-form"]');
    await expect(form).toBeVisible();
    // Default project type should be pre-selected
    await expect(page.locator('[data-testid="project-type-saas"]')).toHaveClass(/selected/);
  });

  test('fills and submits the form successfully', async ({ page }) => {
    // Fill project type (default is SaaS — may already be selected)
    await page.locator('[data-testid="timeline-standard"]').click();

    // Fill contact details
    await page.locator('[data-testid="input-name"]').fill('Jane Smith');
    await page.locator('[data-testid="input-email"]').fill('jane@example.com');
    await page.locator('[data-testid="input-company"]').fill('Acme Corp');
    await page.locator('[data-testid="input-description"]').fill('We need a SaaS platform for inventory management.');

    // Submit
    await page.locator('[data-testid="submit-inquiry"]').click();

    // Success state
    await expect(page.locator('[data-testid="inquiry-success"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('[data-testid="reference-number"]')).toContainText('DCP-');
  });

  test('shows error if name is empty', async ({ page }) => {
    await page.locator('[data-testid="input-email"]').fill('jane@example.com');
    await page.locator('[data-testid="submit-inquiry"]').click();
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible();
  });

  test('shows error on Firebase write failure', async ({ page }) => {
    // Simulate network failure
    await page.route('**/firestore.googleapis.com/**', route => route.abort());

    await page.locator('[data-testid="input-name"]').fill('Jane Smith');
    await page.locator('[data-testid="input-email"]').fill('jane@example.com');
    await page.locator('[data-testid="submit-inquiry"]').click();

    await expect(page.locator('[data-testid="submit-error"]')).toBeVisible({ timeout: 10_000 });
  });
});
```

### Test Suite 2: Newsletter Signup (`tests/e2e/newsletter.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('successfully subscribes with valid email', async ({ page }) => {
    const emailInput = page.locator('[data-testid="newsletter-email"]');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('subscriber@example.com');
    await page.locator('[data-testid="newsletter-submit"]').click();
    await expect(page.locator('[data-testid="newsletter-success"]')).toBeVisible({ timeout: 10_000 });
  });

  test('rejects invalid email format', async ({ page }) => {
    const emailInput = page.locator('[data-testid="newsletter-email"]');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('not-an-email');
    await page.locator('[data-testid="newsletter-submit"]').click();
    await expect(page.locator('[data-testid="newsletter-error"]')).toBeVisible();
  });

  test('shows error on Firebase write failure', async ({ page }) => {
    await page.route('**/firestore.googleapis.com/**', route => route.abort());
    const emailInput = page.locator('[data-testid="newsletter-email"]');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('subscriber@example.com');
    await page.locator('[data-testid="newsletter-submit"]').click();
    await expect(page.locator('[data-testid="newsletter-error"]')).toBeVisible({ timeout: 10_000 });
  });
});
```

### Test Suite 3: Theme Toggle & Navigation (`tests/e2e/navigation.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('theme toggle switches between dark and light', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('class');
    await page.locator('[data-testid="theme-toggle"]').click();
    await page.waitForTimeout(700); // wait for shutter animation
    const newTheme = await html.getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('command palette opens with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.locator('[data-testid="command-palette"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="command-palette"]')).not.toBeVisible();
  });
});
```

### Required: Add data-testid Attributes to Components

Before tests can run, `data-testid` attributes must be added to key elements:

| Component | Element | data-testid |
|---|---|---|
| `ProjectInquiryBuilder` | Form root | `inquiry-form` |
| `ProjectInquiryBuilder` | Name input | `input-name` |
| `ProjectInquiryBuilder` | Email input | `input-email` |
| `ProjectInquiryBuilder` | Company input | `input-company` |
| `ProjectInquiryBuilder` | Description textarea | `input-description` |
| `ProjectInquiryBuilder` | Submit button | `submit-inquiry` |
| `ProjectInquiryBuilder` | Success state | `inquiry-success` |
| `ProjectInquiryBuilder` | Reference number display | `reference-number` |
| `ProjectInquiryBuilder` | Error message | `submit-error` |
| `ProjectInquiryBuilder` | SaaS project type option | `project-type-saas` |
| `ProjectInquiryBuilder` | Standard timeline option | `timeline-standard` |
| `NewsletterSignup` | Email input | `newsletter-email` |
| `NewsletterSignup` | Submit button | `newsletter-submit` |
| `NewsletterSignup` | Success state | `newsletter-success` |
| `NewsletterSignup` | Error message | `newsletter-error` |
| `ThemeToggle` | Toggle button | `theme-toggle` |
| `CommandPalette` | Palette container | `command-palette` |

### Files Changed
- `playwright.config.ts` (new)
- `tests/e2e/inquiry-form.spec.ts` (new)
- `tests/e2e/newsletter.spec.ts` (new)
- `tests/e2e/navigation.spec.ts` (new)
- `package.json` (add scripts + devDependency)
- `src/components/ProjectInquiryBuilder.tsx` (add data-testid attrs)
- `src/components/NewsletterSignup.tsx` (add data-testid attrs)
- `src/components/ThemeToggle.tsx` (add data-testid)
- `src/components/CommandPalette.tsx` (add data-testid)

### Definition of Done
- `npm run test:e2e` runs all tests locally against dev server
- Both form submission flows pass green
- Firebase failure scenario is covered
- All tests pass in under 60 seconds total

---

## Execution Checklist

```
[ ] Item 1: BUG-006 — Verify + fix error states in both forms
[ ] Item 2: TD-001 — Move Firebase config to .env, gitignore config file
[ ] Item 3: TD-005 — Install Firebase Trigger Email Extension (Firebase Console)
            + add sendInquiryNotification() to firebase.ts
            + add VITE_NOTIFY_EMAIL to .env
            + update firestore.rules for /mail collection
[ ] Item 4: TD-006 — Add uuid dep + unsubToken to newsletter signup
            + write Cloud Function + update Firestore rules
            + add App.tsx unsubscribe param detection
            + build UnsubscribeOverlay component
[ ] Item 5: TD-010 — Add Playwright + add data-testid attrs + write 3 test suites
```

---

## Dependencies Summary

| New Dependency | Reason | Type |
|---|---|---|
| `uuid` | Unsubscribe token generation | production |
| `@types/uuid` | TypeScript types for uuid | devDependency |
| `@playwright/test` | E2E test framework | devDependency |

No new production runtime dependencies for items 1, 2, 3, or 5.
