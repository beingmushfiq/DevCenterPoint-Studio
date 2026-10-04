# Full System CMS Sovereignty & Enterprise Corporate Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform DevCenterPoint Studio into a 100% dynamically controllable CMS platform with a full-featured Lead CRM (including manual lead intake), real-time frontend CMS bindings for all sections, and essential corporate portfolio management modules (Testimonials, Team, Demo Sandbox, Media Uploads).

**Architecture:** Implement Eloquent models and migrations for missing corporate entities (Testimonials, Team, Sandbox Apps); wire `HomeController.php` to supply complete structured data to `CmsContext`; dynamically bind every public React component with graceful fallback to default data; build a high-usability Admin CRM with manual lead creation, Kanban pipeline, lead export, and dedicated CMS editors; and verify via automated tests and production builds.

**Tech Stack:** Laravel 11/12, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, Lucide React, MySQL.

---

## Task Matrix & Phased Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PHASED TASKLIST MAP                           │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: LEAD CRM & PIPELINE USABILITY                                 │
│ - Task 1.1: Backend Lead Intake (Manual Add, Validation & CRM Statuses)│
│ - Task 1.2: Admin CRM UI: "Add New Lead" Modal & Pipeline Management   │
│ - Task 1.3: Lead CSV Export, Filtering & Kanban Deal Stages            │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: DYNAMIC FRONTEND BINDING (END-TO-END CMS BRIDGE)              │
│ - Task 2.1: Unified CmsContext & Dynamic Component Consumer Hook       │
│ - Task 2.2: Dynamic Hero, Marquee, Stats & Navigation Binding          │
│ - Task 2.3: Dynamic Capabilities, Selected Work & Case Studies         │
│ - Task 2.4: Dynamic Philosophy, Tech Ecosystem & Process Lifecycles    │
│ - Task 2.5: Dynamic FAQ, Inquiry Estimator & Footer Details            │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: DEMO SANDBOX & SHOWCASE CMS                                   │
│ - Task 3.1: SandboxApp Entity, Database Schema & Seeder                │
│ - Task 3.2: Admin Sandbox Environments Controller & React Manager      │
│ - Task 3.3: Dynamic DigitalSystemMap & ClientDemoSandboxModal Binding  │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: CORPORATE SOCIAL PROOF & LEADERSHIP CMS                       │
│ - Task 4.1: Client Testimonials & Enterprise Logos CMS                 │
│ - Task 4.2: Studio Leadership & Team Members CMS                       │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: USER-FRIENDLY PAGE BLOCKS & SITE SETTINGS                     │
│ - Task 5.1: Structured Visual Page Block Editor (Replacing raw JSON)   │
│ - Task 5.2: Global Scripts, SEO, Analytics & Media Asset Manager       │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: VERIFICATION & ZERO-REGRESSION HANDOVER                       │
│ - Task 6.1: End-to-End Test Suite & Build Verification                 │
│ - Task 6.2: Frontend-Backend Mirror Synchronization                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Lead CRM & Pipeline Usability

#### Task 1.1: Backend Lead Intake (Manual Add, Validation & CRM Statuses)
**Files:**
- Modify: `backend/routes/web.php`
- Modify: `backend/app/Http/Controllers/Admin/AdminInquiryController.php`
- Modify: `backend/app/Models/Inquiry.php`

**Step 1:** Add `store` route to `backend/routes/web.php` under `admin.` prefix:
```php
Route::post('/inquiries', [\App\Http\Controllers\Admin\AdminInquiryController::class, 'store'])->name('inquiries.store');
Route::get('/inquiries/export', [\App\Http\Controllers\Admin\AdminInquiryController::class, 'exportCsv'])->name('inquiries.export');
```

**Step 2:** Implement `store` and `exportCsv` methods in `AdminInquiryController.php`:
```php
public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'company' => 'nullable|string|max:255',
        'project_types' => 'nullable|array',
        'budget_range' => 'required|string|max:100',
        'timeline' => 'required|string|max:100',
        'details' => 'required|string',
        'status' => 'required|string|in:new,reviewed,contacted,qualified,proposal_sent,closed_won,closed_lost',
        'lead_source' => 'nullable|string|max:100',
        'estimated_value' => 'nullable|numeric',
        'internal_notes' => 'nullable|string',
    ]);

    $ref = 'DCP-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

    Inquiry::create(array_merge($validated, [
        'reference_number' => $ref,
        'ip_address' => $request->ip(),
    ]));

    return back()->with('success', "Lead #{$ref} successfully added to CRM.");
}
```

**Step 3:** Update `Inquiry.php` fillable array with `lead_source`, `estimated_value`, and extended status enum.

---

#### Task 1.2: Admin CRM UI: "Add New Lead" Modal & Pipeline Management
**Files:**
- Modify: `backend/resources/js/Pages/Admin/Inquiries/Index.tsx`
- Create: `backend/resources/js/Pages/Admin/Inquiries/CreateLeadModal.tsx`

**Step 1:** Build `CreateLeadModal.tsx` with:
- Client Name & Company Name
- Email Address & Phone Number
- Project Type Multi-Select (SaaS, AI/ML, ERP, Mobile, Commerce)
- Budget Tier ($10k-$25k, $25k-$50k, $50k-$100k, $100k+)
- Timeline (Immediate, 1-2 Months, 3-6 Months)
- Lead Source (Phone Call, LinkedIn, Referral, In-Person Meeting, Website)
- Estimated Contract Value ($)
- Initial Discovery Notes & Status
- Submits via Inertia `router.post('/admin/inquiries')` with sound feedback.

**Step 2:** Add "+ Add New Lead" primary action button to `Inquiries/Index.tsx` header alongside the existing search and filter controls.

---

#### Task 1.3: Lead CSV Export, Filtering & Kanban Deal Stages
**Files:**
- Modify: `backend/resources/js/Pages/Admin/Inquiries/Index.tsx`

**Step 1:** Add Table / Kanban view toggle switch.
**Step 2:** Implement 5-column Kanban pipeline view:
- `New Inbound` $\rightarrow$ `Reviewed / Qualified` $\rightarrow$ `Discovery Contacted` $\rightarrow$ `Proposal Sent` $\rightarrow$ `Won / Closed`.
- Drag-and-drop or 1-click stage transition with optimistic UI updates.
**Step 3:** Add "Export Leads (.CSV)" button with current filter preservation.

---

### Phase 2: Dynamic Frontend Binding (End-to-End CMS Bridge)

#### Task 2.1: Unified CmsContext & Dynamic Component Consumer Hook
**Files:**
- Modify: `backend/resources/js/Context/CmsContext.tsx`
- Create: `src/context/CmsContext.tsx`

**Step 1:** Enhance `useCms()` to provide helper accessor methods:
```typescript
export interface CmsContextValue extends CmsData {
  getSectionBlock: <T = any>(sectionKey: string, blockKey: string, fallback: T) => T;
  getSetting: (key: string, fallback: string) => string;
}
```

**Step 2:** If the application is rendered inside Inertia, it reads from the CMS database payload; if running in standalone Vite mode, it gracefully returns the fallback constants without breaking.

---

#### Task 2.2: Dynamic Hero, Marquee, Stats & Navigation Binding
**Files:**
- Modify: `backend/resources/js/Components/Hero.tsx` and `src/components/Hero.tsx`
- Modify: `backend/resources/js/Components/Positioning.tsx` and `src/components/Positioning.tsx`
- Modify: `backend/resources/js/Components/Navigation.tsx` and `src/components/Navigation.tsx`

**Step 1:** Bind `<Hero>` availability badge, headline lines, subcopy, and SLA stat counters to `pageSections.hero`.
**Step 2:** Bind `<Positioning>` statement and marquee chips to `pageSections.marquee.ticker_items`.
**Step 3:** Bind `<Navigation>` links and header CTA to `siteSettings`.

---

#### Task 2.3: Dynamic Capabilities, Selected Work & Case Studies
**Files:**
- Modify: `backend/resources/js/Components/CapabilitiesSection.tsx` and `src/components/CapabilitiesSection.tsx`
- Modify: `backend/resources/js/Components/SelectedWorkSection.tsx` and `src/components/SelectedWorkSection.tsx`

**Step 1:** In `CapabilitiesSection.tsx`, read from `cms.capabilities` array if available; otherwise use default `CAPABILITIES_DATA`.
**Step 2:** In `SelectedWorkSection.tsx`, read from `cms.projects` array if available; otherwise use default `PROJECTS_DATA`.
**Step 3:** Verify all case study inspector modals render database-backed project fields (tech stack, problem, strategy, results).

---

#### Task 2.4: Dynamic Philosophy, Tech Ecosystem & Process Lifecycles
**Files:**
- Modify: `backend/resources/js/Components/EngineeringPhilosophy.tsx`
- Modify: `backend/resources/js/Components/TechEcosystem.tsx`
- Modify: `backend/resources/js/Components/ProcessSection.tsx`

**Step 1:** Bind Philosophy milestones to `cms.milestones` database records.
**Step 2:** Bind Tech Ecosystem categories and chips to `pageSections.ecosystem`.
**Step 3:** Bind Process lifecycle phases to `pageSections.process.phases`.

---

#### Task 2.5: Dynamic FAQ, Inquiry Estimator & Footer Details
**Files:**
- Modify: `backend/resources/js/Components/FAQSection.tsx`
- Modify: `backend/resources/js/Components/ProjectInquiryBuilder.tsx`
- Modify: `backend/resources/js/Components/Footer.tsx`

**Step 1:** In `FAQSection.tsx`, render `cms.faqs` grouped by category.
**Step 2:** In `Footer.tsx`, render dynamic `siteSettings` (contact email, phone, address, copyright, social URLs).

---

### Phase 3: Demo Sandbox & Showcase CMS

#### Task 3.1: SandboxApp Entity, Database Schema & Seeder
**Files:**
- Create: `backend/database/migrations/2026_10_04_000001_create_sandbox_apps_table.php`
- Create: `backend/app/Models/SandboxApp.php`
- Modify: `backend/database/seeders/DatabaseSeeder.php`

**Step 1:** Create `sandbox_apps` table:
- `id`, `slug`, `name`, `category`, `badge`, `description`, `live_url`, `admin_url`, `accent_color`, `icon_name`
- `credentials_username`, `credentials_password`, `roles` (JSON), `credentials_notes`
- `features` (JSON), `stats` (JSON), `activity_logs` (JSON), `business_outcomes` (JSON)
- `display_order`, `is_active`, `timestamps`

**Step 2:** Seed with the 7 validated demo projects (DevCenterPoint ERP, Road Safety Movement, Traccar GPS, Slice Mart FMS, LeadLayer, NGO Demo, AI Studio).

---

#### Task 3.2: Admin Sandbox Environments Controller & React Manager
**Files:**
- Create: `backend/app/Http/Controllers/Admin/AdminSandboxController.php`
- Create: `backend/resources/js/Pages/Admin/Sandbox/Index.tsx`
- Modify: `backend/routes/web.php`
- Modify: `backend/resources/js/Layouts/AdminLayout.tsx` (Add "Demo Sandbox" sidebar link)

**Step 1:** Provide full CRUD to add, edit, reorder, and toggle demo applications, live URLs, credentials, and feature lists.

---

#### Task 3.3: Dynamic DigitalSystemMap & ClientDemoSandboxModal Binding
**Files:**
- Modify: `backend/resources/js/Components/DigitalSystemMap.tsx` and `src/components/DigitalSystemMap.tsx`
- Modify: `backend/resources/js/Components/ClientDemoSandboxModal.tsx` and `src/components/ClientDemoSandboxModal.tsx`

**Step 1:** Connect both components to read from the dynamic sandbox app registry with instant fallback.

---

### Phase 4: Corporate Social Proof & Leadership CMS

#### Task 4.1: Client Testimonials & Enterprise Logos CMS
**Files:**
- Create: `backend/database/migrations/2026_10_04_000002_create_testimonials_table.php`
- Create: `backend/app/Models/Testimonial.php`
- Create: `backend/app/Http/Controllers/Admin/AdminTestimonialController.php`
- Create: `backend/resources/js/Pages/Admin/Testimonials/Index.tsx`
- Create: `backend/resources/js/Components/TestimonialsSection.tsx`

**Step 1:** Table schema: `id`, `client_name`, `client_role`, `company_name`, `company_logo_url`, `avatar_url`, `quote`, `project_reference`, `metric_highlight`, `display_order`, `is_published`.
**Step 2:** Add Testimonials section to homepage between Selected Work and Engineering Philosophy.

---

#### Task 4.2: Studio Leadership & Team Members CMS
**Files:**
- Create: `backend/app/Http/Controllers/Admin/AdminTeamController.php`
- Create: `backend/resources/js/Pages/Admin/Team/Index.tsx`
- Modify: `backend/resources/js/Components/AboutPrinciples.tsx`

**Step 1:** Build Admin Team management UI to manage leadership bios, roles, headshots, and social links.
**Step 2:** Dynamically render team members in `AboutPrinciples.tsx`.

---

### Phase 5: User-Friendly Page Blocks & Site Settings

#### Task 5.1: Structured Visual Page Block Editor (Replacing raw JSON)
**Files:**
- Modify: `backend/resources/js/Pages/Admin/PageBlocks/Index.tsx`

**Step 1:** Replace raw JSON textarea inputs with tailored visual forms:
- **Hero Tab:** Availability status pill, Title Line 1, Title Line 2, Tagline, Primary CTA, Secondary CTA.
- **Marquee Tab:** Dynamic tag chip adder/remover.
- **Process Tab:** Step-by-step phase editor with deliverables list.
- **Footer Tab:** Company Bio, Email, Phone, Office Address, Copyright text.

---

#### Task 5.2: Global Scripts, SEO, Analytics & Media Asset Manager
**Files:**
- Modify: `backend/resources/js/Pages/Admin/Settings/Index.tsx`
- Create: `backend/app/Http/Controllers/Admin/AdminMediaController.php`

**Step 1:** Add Custom Code Injection tab to Site Settings (`<head>` tracking scripts, Google Analytics GTM, custom CSS).
**Step 2:** Provide local media file upload endpoint (`/admin/media/upload`) storing into `public/uploads` for immediate preview.

---

### Phase 6: Verification & Zero-Regression Handover

#### Task 6.1: End-to-End Test Suite & Build Verification
**Step 1:** Run Laravel syntax & route checks (`php artisan route:list`).
**Step 2:** Run production asset compilation (`npm run build`).
**Step 3:** Verify all forms submit cleanly with CSRF protection and flash toast feedback.

#### Task 6.2: Frontend-Backend Mirror Synchronization
**Step 1:** Ensure all component logic in `src/components/` and `backend/resources/js/Components/` is 100% synchronized.
