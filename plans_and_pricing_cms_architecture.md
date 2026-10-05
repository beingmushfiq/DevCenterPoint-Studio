# Plans & Pricing CMS Architecture & Public Site Scrub Plan

> **Objective:** Completely remove public pricing figures and mentions from the DevCenterPoint Studio website for immediate deployment, while engineering a robust, scalable **Plans & Pricing CMS Module** in the Laravel/Inertia backend that allows administrators to define, manage, and publish/unpublish pricing tiers and packages on demand.

---

## 1. Immediate Public Site Audit & Scrub

### 1.1 Elements to Clean Up Right Now
1. **`src/components/ProjectInquiryBuilder.tsx` & `backend/resources/js/Components/ProjectInquiryBuilder.tsx`:**
   - **Current State:** Displays 4 selectable budget cards with explicit price ranges (`$8,000 – $15,000`, `$15,000 – $35,000`, `$35,000 – $75,000+`, `$4,000 – $8,000`) and a multi-currency switcher (USD, EUR, GBP, BDT).
   - **Target State:** Reframe this card selector into **"Engagement Scope & Scale"** (focusing on Squad Composition, Delivery Velocity, and Deliverables: *Core Launch / MVP*, *Growth & Scale Platform*, *Enterprise Distributed Core*, *Architecture Advisory*) without dollar or currency symbols. The currency switcher is hidden or deactivated until pricing is enabled.
2. **`src/components/Navigation.tsx` & `backend/resources/js/Components/Navigation.tsx`:**
   - **Current State:** FAQ link description states `'Pricing, SLAs, Terms'`. Contact link states `'Scope & Budget Estimator'`.
   - **Target State:** Update FAQ note to `'Engagements, SLAs, Terms'` and Contact link note to `'Scope & Architecture Estimator'`.
3. **`src/data/faq.ts` & `backend/resources/js/data/faq.ts`:**
   - Ensure FAQ questions and answers focus on commercial models (Dedicated Squads, Milestone Sprints, Advisory) without quoting deterministic dollar ranges.
4. **Preserved Metrics (Distinction):**
   - Retain portfolio case study metrics (e.g., `Processing $4.2M+ monthly volume`, `$1.4M saved annually`), as these demonstrate client scale and ROI rather than DevCenterPoint's service fees.

---

## 2. Plans & Pricing CMS Module Architecture

### 2.1 Database Schema (`plans` table)
```sql
CREATE TABLE `plans` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(191) NOT NULL UNIQUE,
    `name` VARCHAR(191) NOT NULL,
    `badge` VARCHAR(100) NULL,               -- e.g. "Most Popular", "Enterprise Grade", "Advisory"
    `tagline` VARCHAR(255) NULL,             -- Sub-headline / positioning
    `description` TEXT NULL,                 -- Detailed breakdown
    `pricing_model` VARCHAR(50) DEFAULT 'custom', -- 'fixed', 'monthly', 'milestone', 'custom'
    `price_usd` VARCHAR(100) NULL,           -- e.g. "$15,000 – $35,000" or "$4,500/mo"
    `price_eur` VARCHAR(100) NULL,
    `price_gbp` VARCHAR(100) NULL,
    `price_bdt` VARCHAR(100) NULL,
    `billing_period` VARCHAR(50) NULL,       -- 'per project', 'per month', 'milestone tranche'
    `timeline_estimate` VARCHAR(100) NULL,   -- e.g. "8 – 12 Weeks"
    `squad_composition` VARCHAR(255) NULL,   -- e.g. "1 Architect + 2 Fullstack Engineers + 1 QA"
    `sla_commitment` VARCHAR(255) NULL,      -- e.g. "Zero-Downtime Guarantee & SOC2 Ready"
    `recommended_for` TEXT NULL,             -- Best fit client profile
    `features` JSON NULL,                    -- Array of feature strings / bullet checkmarks
    `cta_text` VARCHAR(100) DEFAULT 'Inquire About Plan',
    `cta_action` VARCHAR(100) DEFAULT 'contact_modal', -- 'contact_modal', 'external_url', 'direct_email'
    `cta_url` VARCHAR(255) NULL,
    `display_order` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_published` BOOLEAN DEFAULT FALSE,    -- Individual tier publication toggle
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL
);
```

### 2.2 Global Visibility Toggle (`site_settings` or `page_sections`)
- Setting Key: `show_pricing_on_site` (Default: `false`).
- Setting Key: `pricing_section_heading` & `pricing_section_subheading`.
- **Behavior:**
  - If `show_pricing_on_site` is `false`: Public site completely conceals all pricing figures and hides the dedicated pricing section/page.
  - If `show_pricing_on_site` is `true`: Public site renders the active, published plans with rich interactive cards, currency toggle, and feature breakdown.

---

## 3. CMS Admin Control Panel UI (`/admin/plans`)

### 3.1 Views & Capabilities
1. **Plans List / Kanban (`Pages/Admin/Plans/Index.tsx`):**
   - Master toggle: **"Public Pricing Section Status"** (🔴 Offline / Hidden vs 🟢 Live on Site).
   - Draggable / Orderable cards showing each plan's title, badge, pricing model, currency values, publication status badge (`Published` vs `Draft`), and quick actions (`Edit`, `Duplicate`, `Toggle Publish`, `Delete`).
2. **Plan Editor Modal / Drawer (`PlanFormModal.tsx`):**
   - **General Info:** Plan Name, Slug, Badge, Tagline, Target Audience.
   - **Commercials:** Pricing Model dropdown (`Custom / Contact`, `Fixed Project Fee`, `Monthly Retainer`, `Milestone Tranches`), Multi-currency amount inputs (USD, EUR, GBP, BDT), Billing cycle note.
   - **Scope & Delivery:** Estimated Delivery Velocity, Squad Composition, SLA Level.
   - **Feature Deliverables:** Interactive tag/bullet editor to add, reorder, and remove checkmark deliverables.
   - **Publication & Highlighting:** `Is Featured (Highlighted Card)`, `Is Published`, `Display Order`.
3. **Live Preview Mode:**
   - Real-time preview showing exactly how the card will look to prospective clients before switching it live.

---

## 4. Public UI Integration (When Enabled via CMS)

### 4.1 Responsive Component Layout (`PlansPricingSection.tsx`)
- **Theme:** Seamless integration with dark/light neo-brutalist tech aesthetic (glowing borders, crisp typography, tactile hover states).
- **Interactive Currency Switcher:** Toggle between USD ($), EUR (€), GBP (£), and BDT (৳) with localized formatting.
- **Card Differentiation:**
  - Standard plans: Sleek dark surface, subtle cyan/emerald borders.
  - Featured / Recommended plan: Gradient rim glow, "Recommended" floating badge, elevated z-index.
- **Deep Integration with Lead Capture:**
  - Clicking "Select Plan" on any published card smooth-scrolls or opens the Inquiry Builder with that specific plan pre-selected as the baseline scope.
