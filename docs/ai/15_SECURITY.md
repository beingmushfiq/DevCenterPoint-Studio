# 15 — Security Model

**Status: [VERIFIED]**

---

## Authentication

**Mechanism:** Firebase Anonymous Authentication
- No user registration, login, or password management
- Browsers automatically get an anonymous Firebase session on first write attempt
- Session is browser-scoped (not persistent across devices or incognito sessions)
- `auth.currentUser.uid` stored in inquiry docs for read scoping

**Failure mode:** If Anonymous Auth fails → write attempted with `authUid: 'guest'` (graceful degradation)

---

## Authorization

**Enforcement layer:** Firebase Firestore Security Rules (`firestore.rules`)

No RBAC or permission system exists in the application — it is a public marketing site.

| Collection | Create | Read | Update | Delete |
|---|---|---|---|---|
| `inquiries` | Public (schema-validated) | Own docs only (auth required) | Blocked | Blocked |
| `newsletter_subscribers` | Public (schema-validated) | Blocked | Blocked | Blocked |

---

## Firestore Rules — Validation Details

### Inquiry Validation (`isValidInquiry`)
- Required fields: `name, email, projectType, timeline, referenceNumber, status, submittedAt`
- Allowed fields only (whitelist enforcement prevents injection of unknown fields)
- String length bounds: name (1–100), email (3–150), company (≤100), projectType (1–100), budgetRange (≤50), timeline (1–50), description (≤5000), selectedTech (≤20 items), referenceNumber (4–50), authUid (≤128), submittedAt (≤50)
- Status must be in: `['pending', 'reviewed', 'contacted']`

### Newsletter Validation (`isValidNewsletterSubscriber`)
- Required fields: `email, status, subscribedAt`
- Allowed fields only
- email: 5–150 chars
- source: ≤50 chars
- status: `['active', 'unsubscribed']`
- subscribedAt: ≤50 chars

---

## Input Validation

**Client-side (firebase.ts):**
- `subscribeToNewsletter()`: email regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 150 chars, trimmed + lowercased
- `submitProjectInquiry()`: name trimmed, email trimmed + lowercased, company trimmed, description trimmed, source sliced to 50 chars

**Server-side (Firestore rules):** Schema validation on all writes (redundant double-check)

**Penetration surface:** Minimal — only two write paths, both schema-validated

---

## Sensitive Data

```
SECRET_EXISTS: YES
LOCATION: firebase-applet-config.json (committed to repository root)
VALUE: REDACTED
CONTENT: Firebase API key, Auth domain, Project ID, Storage bucket,
         Messaging sender ID, App ID, Firestore database ID
```

```
SECRET_EXISTS: YES (documented, not confirmed active)
LOCATION: .env (environment variable, not committed)
NAME: GEMINI_API_KEY
VALUE: REDACTED
```

```
SECRET_EXISTS: YES (documented, not confirmed active)
LOCATION: .env (environment variable, not committed)
NAME: APP_URL
VALUE: REDACTED
```

---

## XSS Protection

- React's JSX escapes all user-rendered content by default [VERIFIED by architecture]
- No `dangerouslySetInnerHTML` usage found [INFERRED — not confirmed by exhaustive scan]
- User form inputs are trimmed but not sanitized beyond Firestore schema validation
- No rich text editor — inputs are plain text fields

---

## CSRF Protection

- No traditional CSRF attack surface — no session cookies, no browser-authed forms
- Firebase SDK uses HTTPS + token-based calls, not cookie-based sessions

---

## SQL Injection

- No SQL database used — Firebase Firestore is document-based
- No risk of SQL injection [VERIFIED]

---

## Content Security Policy (CSP)

- No CSP headers observed in configuration [UNKNOWN — may be set at hosting layer]
- External resources loaded: Google Fonts CDN, devicons CDN (jsDelivr), Firebase APIs

---

## HTTPS

- Vite dev server: HTTP on `localhost:3000`
- Production: HTTPS expected (INFERRED — Firebase Hosting/Vercel/Cloud Run enforces HTTPS)

---

## Rate Limiting

- No application-level rate limiting [NONE]
- Firebase Firestore free tier has daily quotas (reads/writes/deletes)
- No abuse prevention for bulk newsletter subscriptions or inquiry spam [RISK]

---

## PII Protection

- Newsletter subscriber emails: Firestore rules block all reads/updates/deletes — only create is allowed. No one can enumerate emails via client SDK.
- Inquiry data: Only the submitting anonymous session can read its own inquiry (by matching UID)
- Email stored in Firestore: at rest in Google's infrastructure (Google handles encryption at rest)

---

## Logging Risks

- `handleFirestoreError()` logs auth user details (UID, email, isAnonymous, providerData) to `console.error`
- In production this is browser console only (not server-side logging)
- No sensitive data appears to be logged at server level (no server exists)

---

## Security Risk Register

| ID | Risk | Severity | Notes |
|---|---|---|---|
| SEC-001 | Firebase config (API key) committed to source repo | MEDIUM | Firebase API keys are "public by design" but still security surface; protected by Firestore rules |
| SEC-002 | No rate limiting on form submissions | MEDIUM | Potential for spam inquiries or newsletter abuse |
| SEC-003 | No email deduplication for newsletter | LOW | Functional issue, minor data hygiene risk |
| SEC-004 | Anonymous sessions are ephemeral | LOW | Users cannot retrieve inquiry history cross-device |
| SEC-005 | No CSP headers confirmed | LOW | External CDNs (Fonts, devicons) are trusted sources |
| SEC-006 | `dangerouslySetInnerHTML` usage not confirmed absent | RESOLVED | Grep scan confirmed: zero instances in entire src/ directory. No XSS risk via this vector. |

