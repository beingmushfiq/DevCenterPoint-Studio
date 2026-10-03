<?php

namespace Database\Seeders;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\Milestone;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Initial Super Admin User
        User::updateOrCreate(
            ['email' => 'admin@devcenterpoint.com'],
            [
                'name' => 'Studio Super Admin',
                'password' => Hash::make('admin12345'),
                'role' => 'superadmin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Capabilities / Services
        $capabilities = [
            [
                'slug' => 'product-engineering',
                'title' => 'Product Engineering',
                'tagline' => 'Full-stack SaaS, web applications, and mission-critical software systems.',
                'description' => 'We turn complex product requirements into resilient, performant, and maintainable software systems designed to scale gracefully with your business.',
                'icon_name' => 'Code2',
                'features' => [
                    'SaaS Web Applications & Portals',
                    'High-Performance REST & GraphQL APIs',
                    'Microservices & Distributed Systems',
                    'Legacy System Modernization',
                ],
                'technologies' => ['React', 'Next.js', 'TypeScript', 'Node.js', 'Laravel', 'PostgreSQL', 'Redis'],
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'slug' => 'ai-intelligent-systems',
                'title' => 'AI & Intelligent Systems',
                'tagline' => 'Practical machine learning, predictive pipelines, and explainable AI models.',
                'description' => 'We embed predictive analytics, automated workflows, and explainable machine learning models directly into production applications to solve real business problems.',
                'icon_name' => 'Cpu',
                'features' => [
                    'Predictive Classification & Forecasting',
                    'SHAP / LIME Model Explainability',
                    'LLM API Integration & RAG Workflows',
                    'Automated Data Ingestion Pipelines',
                ],
                'technologies' => ['Python', 'XGBoost', 'SHAP', 'PyTorch', 'FastAPI', 'Gemini API', 'PostgreSQL / pgvector'],
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'slug' => 'experience-design',
                'title' => 'Experience Design',
                'tagline' => 'Human-centered product design, design systems, and interaction design.',
                'description' => 'Design at DevCenterPoint is structural. We create coherent, accessible, high-density interfaces engineered for speed, clarity, and delight.',
                'icon_name' => 'Palette',
                'features' => [
                    'Product UI/UX Design Systems',
                    'High-Fidelity Interactive Prototypes',
                    'Information Architecture & Flow Mapping',
                    'Accessibility Audits (WCAG 2.1 AA)',
                ],
                'technologies' => ['Figma', 'Tailwind CSS', 'Framer Motion', 'Radix UI', 'CSS Architecture'],
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'slug' => 'business-systems',
                'title' => 'Business Systems',
                'tagline' => 'Custom ERP, POS, CRM, and operational automation platforms.',
                'description' => 'Generic off-the-shelf software rarely fits specialized business workflows. We build tailored operational software that mirrors your exact organizational logic.',
                'icon_name' => 'Building2',
                'features' => [
                    'Enterprise Resource Planning (ERP)',
                    'Custom Point of Sale (POS) Systems',
                    'B2B Customer Relationship Management (CRM)',
                    'Inventory & Warehouse Management (WMS)',
                ],
                'technologies' => ['Laravel', 'React', 'MySQL', 'PostgreSQL', 'Redis', 'WebSockets'],
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'slug' => 'commerce-infrastructure',
                'title' => 'Commerce Infrastructure',
                'tagline' => 'Headless e-commerce, multi-vendor marketplaces, and payment gateways.',
                'description' => 'Fast, secure, and flexible commerce architectures built to handle catalog volume, complex pricing rules, and seamless international payment checkouts.',
                'icon_name' => 'ShoppingBag',
                'features' => [
                    'Headless E-Commerce Backends',
                    'Multi-Vendor Marketplace Infrastructure',
                    'Custom Payment Gateway Integrations',
                    'Automated Invoicing & Subscription Billing',
                ],
                'technologies' => ['Next.js', 'Node.js', 'GraphQL', 'Stripe API', 'PostgreSQL', 'Redis'],
                'display_order' => 5,
                'is_active' => true,
            ],
            [
                'slug' => 'healthcare-technology',
                'title' => 'Healthcare Technology',
                'tagline' => 'Queue management, clinic systems, and digital health workflows.',
                'description' => 'Digital solutions designed for medical environments prioritizing data privacy, real-time patient flow, clear displays, and high system reliability.',
                'icon_name' => 'Activity',
                'features' => [
                    'Clinic & OPD Queue Management Platforms',
                    'Patient Registration & Serial Issuance Kiosks',
                    'Doctor Consultation Console Software',
                    'Automated SMS & Remote Queue Trackers',
                ],
                'technologies' => ['Laravel', 'React', 'WebSockets', 'MySQL', 'Twilio API', 'Pusher'],
                'display_order' => 6,
                'is_active' => true,
            ],
            [
                'slug' => 'mobile-platforms',
                'title' => 'Mobile Platforms',
                'tagline' => 'Native performance, cross-platform apps, and IoT device integrations.',
                'description' => 'Fluid mobile applications engineered for iOS and Android, focusing on offline resilience, responsive touch UI, and hardware API connectivity.',
                'icon_name' => 'Smartphone',
                'features' => [
                    'Cross-Platform iOS & Android Apps',
                    'Offline-First Progressive Web Apps (PWA)',
                    'GPS & Bluetooth IoT Telematics Apps',
                    'Mobile Push Notification Infrastructure',
                ],
                'technologies' => ['React Native', 'TypeScript', 'PWA', 'Mapbox GL', 'Firebase Cloud Messaging'],
                'display_order' => 7,
                'is_active' => true,
            ],
            [
                'slug' => 'cloud-infrastructure',
                'title' => 'Cloud & Infrastructure',
                'tagline' => 'DevOps automation, Docker containerization, and zero-downtime deployments.',
                'description' => 'Stable cloud foundations that ensure high availability, automatic scaling, strict firewall security, and continuous delivery pipelines.',
                'icon_name' => 'Server',
                'features' => [
                    'Docker Containerization & Orchestration',
                    'CI/CD Pipeline Setup (GitHub Actions / GitLab)',
                    'Cloud Architecture (AWS / DigitalOcean / Vercel)',
                    'Database Backup & Recovery Strategies',
                ],
                'technologies' => ['Docker', 'Nginx', 'Linux', 'GitHub Actions', 'AWS / Cloudflare', 'PostgreSQL'],
                'display_order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($capabilities as $cap) {
            Capability::updateOrCreate(['slug' => $cap['slug']], $cap);
        }

        // 3. Projects & Case Studies
        $projects = [
            [
                'slug' => 'ordershield',
                'title' => 'DevCenterPoint ERP & Storefront',
                'tagline' => 'Omnichannel E-Commerce & Enterprise ERP Core',
                'category' => 'Business Systems',
                'client' => 'Omnichannel Enterprise Systems',
                'year' => '2026',
                'duration' => '14 Weeks',
                'overview' => 'Full-stack enterprise ERP integrated with an omnichannel storefront, inventory workflows, and sales management.',
                'problem' => 'Existing legacy systems produced frequent double-allocation errors during peak load, with latency in stock updates exceeding 15 minutes across distributed inventory locations.',
                'solution' => 'Engineered an event-driven architecture with strict transactional locks and atomic inventory updates, paired with a high-density, low-latency operational dashboard.',
                'metrics' => [
                    ['label' => 'Order Processing Latency', 'value' => '-72%'],
                    ['label' => 'Allocation Errors', 'value' => '0%'],
                    ['label' => 'Throughput Surge Capacity', 'value' => '10x'],
                ],
                'tech_stack' => ['Laravel', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://demoerp.devcenterpoint.com',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'slug' => 'qttenzy',
                'title' => 'Qttenzy',
                'tagline' => 'Smart QR Geofenced Attendance Platform',
                'category' => 'Healthcare & Enterprise',
                'client' => 'Apex EduTech & Enterprise Campuses',
                'year' => '2026',
                'duration' => '10 Weeks',
                'overview' => 'QR-based automated geofenced attendance system that verifies check-ins within precise physical boundaries.',
                'problem' => 'Static QR codes were easily copied or shared remotely via messaging apps, bypassing attendance validity and skewing compliance logs.',
                'solution' => 'Developed a time-sensitive dynamic QR code generation engine with encrypted device signatures, anti-spoofing geolocation bounds, and real-time verification.',
                'metrics' => [
                    ['label' => 'Proxy Fraud Rate', 'value' => '0%'],
                    ['label' => 'Check-in Speed', 'value' => '< 1.2s'],
                    ['label' => 'Monthly Active Users', 'value' => '45,000+'],
                ],
                'tech_stack' => ['React Native', 'Node.js', 'TypeScript', 'MongoDB', 'PWA', 'Tailwind CSS'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://qttenzy.vercel.app',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'slug' => 'commercecore',
                'title' => 'CommerceCore',
                'tagline' => 'Modular Headless E-Commerce Engine',
                'category' => 'Commerce Infrastructure',
                'client' => 'Verve Retailers International',
                'year' => '2026',
                'duration' => '16 Weeks',
                'overview' => 'Headless commerce backend, multi-currency checkout, and customizable product catalog architecture.',
                'problem' => 'Slow page render speeds directly impacted conversion rates, while rigid database schemas made complex variant management painful.',
                'solution' => 'Architected a headless, API-first commerce engine decoupling storefront presentation from transaction logic, backed by a flexible JSON schema for dynamic product attributes.',
                'metrics' => [
                    ['label' => 'Storefront Load Time', 'value' => '420ms'],
                    ['label' => 'Checkout Conversion', 'value' => '+28%'],
                    ['label' => 'Catalog SKUs Handled', 'value' => '250,000+'],
                ],
                'tech_stack' => ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe API', 'GraphQL', 'Docker'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://commercecore.devcenterpoint.com',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'slug' => 'shap-career',
                'title' => 'SHAP Career Predictor',
                'tagline' => 'Explainable AI Career Forecasting Engine',
                'category' => 'AI & Intelligent Systems',
                'client' => 'Workforce Intelligence Institute',
                'year' => '2026',
                'duration' => '12 Weeks',
                'overview' => 'Machine learning skill analysis and career path prediction model backed by SHAP feature explainability.',
                'problem' => 'Traditional predictive models acted as unexplainable black boxes, leading to low trust from career counselors who required clear rationale behind recommendations.',
                'solution' => 'Implemented an XGBoost classification pipeline paired with SHAP (SHapley Additive exPlanations) values to render transparent, human-interpretable feature importance charts.',
                'metrics' => [
                    ['label' => 'Prediction Accuracy', 'value' => '94.2%'],
                    ['label' => 'Explainability Latency', 'value' => '< 180ms'],
                    ['label' => 'User Trust Score', 'value' => '4.9 / 5.0'],
                ],
                'tech_stack' => ['Python', 'XGBoost', 'SHAP', 'FastAPI', 'React', 'Tailwind CSS'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://shap.devcenterpoint.com',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'slug' => 'clinic-queue',
                'title' => 'Feroza Medicine Corner Serial Manager',
                'tagline' => 'Real-Time Healthcare Counter & Queue Management Portal',
                'category' => 'Healthcare Tech',
                'client' => 'Feroza Medicine Corner & Clinic Desks',
                'year' => '2026',
                'duration' => '8 Weeks',
                'overview' => 'Real-time counter, patient queue, and appointment serial management portal built for healthcare and pharmacy desks.',
                'problem' => 'Manual paper token systems caused chaotic queue skipping, lack of SMS waiting status updates, and inaccurate consultation duration statistics.',
                'solution' => 'Designed a real-time queue management network connecting patient registration kiosks, live display boards, and doctor consultation portals via WebSockets.',
                'metrics' => [
                    ['label' => 'Wait Room Congestion', 'value' => '-54%'],
                    ['label' => 'Counter Turnaround', 'value' => '+32%'],
                    ['label' => 'Display Sync Lag', 'value' => '< 50ms'],
                ],
                'tech_stack' => ['Laravel', 'WebSockets', 'React', 'MySQL', 'Twilio SMS API'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://serial.ferozamedicinecorner.com',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'slug' => 'sherazi-gps',
                'title' => 'Traccar GPS Telematics Deployment',
                'tagline' => 'Containerized Open-Source Fleet Telemetry Stack',
                'category' => 'Mobile & Infrastructure',
                'client' => 'Fleet Logistics Network',
                'year' => '2026',
                'duration' => '18 Weeks',
                'overview' => 'Containerized open-source GPS tracking stack built with Docker for automated fleet telemetry and real-time geofence alerts.',
                'problem' => 'Raw IoT GPS tracker feeds sent millions of unstructured data packets per minute, overwhelming traditional web server setups and slowing map renders.',
                'solution' => 'Built a specialized telemetry ingestion pipeline parsing raw TCP/UDP hardware packets, storing geospatial coordinates in time-series database structures, and rendering vector maps.',
                'metrics' => [
                    ['label' => 'Telematics Ingestion Rate', 'value' => '100k/sec'],
                    ['label' => 'Geofence Alert Speed', 'value' => '< 2s'],
                    ['label' => 'Fleet Fuel Savings', 'value' => '19.4%'],
                ],
                'tech_stack' => ['Node.js', 'PostgreSQL / PostGIS', 'Mapbox GL', 'React', 'WebSockets', 'Docker'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://gps.devcenterpoint.com',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => false,
                'display_order' => 6,
                'is_published' => true,
            ],
            [
                'slug' => 'roadsafety',
                'title' => 'Road Safety Movement',
                'tagline' => 'Org Management OS & Public Safety Platform',
                'category' => 'Business Systems',
                'client' => 'Road Safety Movement Organization',
                'year' => '2026',
                'duration' => '12 Weeks',
                'overview' => 'Central operational platform coordinating community members, organizational logistics, and public safety initiatives.',
                'problem' => 'Disparate communication channels and manual member registration spreadsheets hindered volunteer mobilization during public safety drives.',
                'solution' => 'Architected an integrated Org Management OS providing verified member directories, real-time campaign dispatch, and volunteer coordination logistics.',
                'metrics' => [
                    ['label' => 'Volunteer Mobilization', 'value' => '< 3.5m'],
                    ['label' => 'Directory Search Speed', 'value' => '38ms'],
                    ['label' => 'Campaign Uptime', 'value' => '99.99%'],
                ],
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'MySQL', 'Tailwind CSS'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://roadsafetymovement.org',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => true,
                'display_order' => 7,
                'is_published' => true,
            ],
            [
                'slug' => 'speech-therapy',
                'title' => 'Speech Therapy Assessment Suite',
                'tagline' => 'Clinical Diagnostic & Patient Evaluation Suite',
                'category' => 'Healthcare Tech',
                'client' => 'Pediatric Therapy & Clinical Diagnostics Center',
                'year' => '2026',
                'duration' => '10 Weeks',
                'overview' => 'Clinical assessment UI, interactive developmental screening forms, and patient evaluation tools.',
                'problem' => 'Traditional paper protocols generated heavy administrative burden and delayed diagnostic report turnaround for pediatric patients.',
                'solution' => 'Designed an interactive assessment suite featuring dynamic developmental screening matrices, longitudinal patient tracking, and automated clinical summaries.',
                'metrics' => [
                    ['label' => 'Report Generation', 'value' => 'Instant'],
                    ['label' => 'Scoring Accuracy', 'value' => '100%'],
                    ['label' => 'Time Saved per Patient', 'value' => '45 mins'],
                ],
                'tech_stack' => ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
                'thumbnail_url' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
                'hero_image_url' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
                ],
                'live_url' => 'https://github.com/beingmushfiq',
                'github_url' => 'https://github.com/beingmushfiq',
                'is_featured' => false,
                'display_order' => 8,
                'is_published' => true,
            ],
        ];

        foreach ($projects as $proj) {
            Project::updateOrCreate(['slug' => $proj['slug']], $proj);
        }

        // 4. Engineering Philosophy Milestones
        $milestones = [
            [
                'number' => '01',
                'title' => 'Curiosity',
                'tagline' => 'We investigate before we implement.',
                'description' => 'We do not blindly accept surface-level briefs. We dig deep into user behavior, operational bottlenecks, and underlying data structures to uncover the real problem.',
                'metric_label' => 'Architecture RFC Review Depth',
                'metric_value' => '100%',
                'code_preview' => '// Discovery First RFC Protocol',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'number' => '02',
                'title' => 'Precision',
                'tagline' => 'Details matter because systems compound.',
                'description' => 'A microsecond of query latency or an unhandled edge-case status code compounds exponentially at scale. We insist on architectural rigor from day one.',
                'metric_label' => 'TypeScript Strict Coverage',
                'metric_value' => '100%',
                'code_preview' => '// Zero `any` exemption policy',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'number' => '03',
                'title' => 'Ownership',
                'tagline' => 'We care about what happens after launch.',
                'description' => 'Our commitment extends beyond deployment. We monitor live system metrics, error logs, and user adoption to ensure long-term stability and ROI.',
                'metric_label' => 'Post-Launch SLA Target',
                'metric_value' => '99.98%',
                'code_preview' => '// Real-time telemetry monitoring',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'number' => '04',
                'title' => 'Simplicity',
                'tagline' => 'Complex systems should feel simple to use.',
                'description' => 'Simplicity is not the absence of functionality—it is the mastery of complexity. We build sophisticated engines behind intuitive, uncluttered interfaces.',
                'metric_label' => 'Average CLS Target',
                'metric_value' => '< 0.01',
                'code_preview' => '// Clean layout isolation',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'number' => '05',
                'title' => 'Craft',
                'tagline' => 'Good engineering and good design reinforce each other.',
                'description' => 'We reject the artificial divide between design and engineering. Exceptional digital products require equal mastery of aesthetic emotion and backend mechanics.',
                'metric_label' => 'Design System Tokens',
                'metric_value' => '100%',
                'code_preview' => '// Tokenized CSS Variables & Fluid Motion',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($milestones as $m) {
            Milestone::updateOrCreate(['number' => $m['number']], $m);
        }

        // 5. FAQs
        $faqs = [
            [
                'category' => 'Engineering & Process',
                'question' => 'How does DevCenterPoint structure its end-to-end engineering lifecycle?',
                'answer' => 'We run a battle-tested six-phase lifecycle designed for deterministic execution: Phase 01 Architectural Discovery & System RFC, Phase 02 Data Modeling & Contract Definition, Phase 03 Modular Core Implementation, Phase 04 Automated Verification & Quality Gates, Phase 05 Production Hardening & Security Audit, and Phase 06 Zero-Downtime Deployment & Handover.',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'category' => 'Engagement Models',
                'question' => 'What engagement models do you offer for enterprises and growing ventures?',
                'answer' => 'We support three primary commercial structures tailored to your operational velocity: (1) Dedicated Engineering Squads—an integrated cross-functional team of senior engineers, an architect, and a delivery lead dedicated exclusively to your roadmap; (2) Fixed-Scope Milestone Deliverables—guaranteed-budget execution with deterministic phase sign-offs; and (3) Strategic Architecture Advisory / Fractional CTO.',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'category' => 'Engineering & Process',
                'question' => 'What non-negotiable quality and verification gates govern every release?',
                'answer' => 'Every pull request must pass our automated CI pipeline: strict TypeScript compilation with zero any exemptions, unit test suites, end-to-end integration tests (Playwright), static application security tests (SAST), bundle size budgets, and accessibility audits.',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'category' => 'Engagement Models',
                'question' => 'How quickly can we kick off an engagement, and what does onboarding look like?',
                'answer' => 'Following your initial inquiry, we conduct an executive technical discovery session within 48 to 72 hours. Once commercial terms are finalized, your squad can mobilize in 5 to 7 business days.',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'category' => 'Security & IP',
                'question' => 'Who owns the intellectual property (IP), code repositories, and infrastructure accounts?',
                'answer' => 'You retain 100% unconditional ownership of all source code, architecture specifications, design assets, and database schemas created during the engagement. Work is committed directly into your private GitHub/GitLab repositories.',
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'category' => 'Post-Launch & SLAs',
                'question' => 'What post-launch support, monitoring, and SLA agreements do you provide?',
                'answer' => 'We offer structured 30 to 90-day post-launch warranty tranches covering regression triage and proactive telemetry monitoring. For mission-critical production systems, we provide comprehensive SLA maintenance tiers with guaranteed response times down to under 1 hour.',
                'display_order' => 6,
                'is_published' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(
                ['question' => $faq['question']],
                $faq
            );
        }

        // 6. Studio Team Members
        // 6. Studio Team Members
        $team = [
            [
                'name' => 'Mushfiq',
                'role' => 'Founder & Principal Systems Architect',
                'bio' => 'Founder of DevCenterPoint Studio & AI Studio. Specializes in scalable enterprise architectures, applied AI systems, and high-performance full-stack web platforms.',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'social_links' => [
                    'portfolio' => 'https://buildwithmushfiq.vercel.app',
                    'github' => 'https://github.com/beingmushfiq',
                    'linkedin' => 'https://linkedin.com'
                ],
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Lead Software Architect',
                'role' => 'Principal Engineering Lead',
                'bio' => '12+ years designing distributed backend systems, low-latency APIs, and enterprise cloud infrastructure.',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com', 'github' => 'https://github.com'],
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Head of Design & Product',
                'role' => 'Design Systems Lead',
                'bio' => 'Specializes in high-density SaaS interfaces, accessible typography, and motion design systems.',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'social_links' => ['linkedin' => 'https://linkedin.com', 'github' => 'https://github.com'],
                'display_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($team as $member) {
            TeamMember::updateOrCreate(['name' => $member['name']], $member);
        }

        // 7. Universal Page Sections & Blocks (Enables 100% granular CMS control)
        $blocks = [
            // Hero Block
            [
                'section_key' => 'hero',
                'block_key' => 'badge',
                'content' => json_encode([
                    'status' => 'Available for Q2 2026 Projects',
                    'indicator' => 'emerald',
                ]),
            ],
            [
                'section_key' => 'hero',
                'block_key' => 'headlines',
                'content' => json_encode([
                    'title_line_1' => 'Software Systems Built for',
                    'title_line_2' => 'Scale, Resilience & Speed',
                    'tagline' => 'DevCenterPoint designs and engineers mission-critical web applications, high-throughput APIs, and custom enterprise software for high-growth businesses.',
                ]),
            ],
            [
                'section_key' => 'hero',
                'block_key' => 'cta',
                'content' => json_encode([
                    'primary_text' => 'Initiate Project Inquiry',
                    'primary_target' => '#inquiry',
                    'secondary_text' => 'Explore Capabilities',
                    'secondary_target' => '#capabilities',
                ]),
            ],
            [
                'section_key' => 'hero',
                'block_key' => 'stats',
                'content' => json_encode([
                    ['label' => 'Production SLA', 'value' => '99.98%'],
                    ['label' => 'Sub-100ms APIs', 'value' => '100%'],
                    ['label' => 'Enterprise Systems Built', 'value' => '25+'],
                ]),
            ],
            // Marquee
            [
                'section_key' => 'marquee',
                'block_key' => 'ticker_items',
                'content' => json_encode([
                    'High-Concurrency Architecture',
                    'Full-Stack SaaS Systems',
                    'Clean Hexagonal Code',
                    'Sub-Second Query Optimization',
                    'Deterministic Delivery',
                    'Strict TypeScript Contracts',
                ]),
            ],
            // Footer
            [
                'section_key' => 'footer',
                'block_key' => 'details',
                'content' => json_encode([
                    'company_bio' => 'DevCenterPoint Studio is an elite software engineering and digital systems firm founded by Mushfiq. We design, build, and deploy mission-critical software architectures for ambitious companies worldwide.',
                    'contact_email' => 'studio@devcenterpoint.com',
                    'contact_phone' => '+1 (800) 555-DCP0',
                    'address' => 'Technology Square, Innovation Corridor',
                    'copyright_text' => '© ' . date('Y') . ' DevCenterPoint Studio. All rights reserved.',
                ]),
            ],
        ];

        foreach ($blocks as $block) {
            PageSection::updateOrCreate(
                ['section_key' => $block['section_key'], 'block_key' => $block['block_key']],
                $block
            );
        }

        // 8. Site Settings & SEO
        $settings = [
            ['key' => 'site_name', 'value' => 'DevCenterPoint Studio', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'studio@devcenterpoint.com', 'group' => 'general'],
            ['key' => 'founder_name', 'value' => 'Mushfiq', 'group' => 'general'],
            ['key' => 'founder_portfolio', 'value' => 'https://buildwithmushfiq.vercel.app', 'group' => 'general'],
            ['key' => 'ai_studio_url', 'value' => 'https://devcenterpoint.ai.studio', 'group' => 'general'],
            ['key' => 'demo_erp_url', 'value' => 'https://demoerp.devcenterpoint.com', 'group' => 'general'],
            ['key' => 'serial_manager_url', 'value' => 'https://serial.ferozamedicinecorner.com', 'group' => 'general'],
            ['key' => 'roadsafety_url', 'value' => 'https://roadsafetymovement.org', 'group' => 'general'],
            ['key' => 'sound_enabled_default', 'value' => 'true', 'group' => 'general'],
            ['key' => 'seo_meta_title', 'value' => 'DevCenterPoint Studio | Software Engineering & System Architecture', 'group' => 'seo'],
            ['key' => 'seo_meta_description', 'value' => 'Elite software engineering consultancy founded by Mushfiq specializing in scalable web systems, AI pipelines, and resilient cloud architectures.', 'group' => 'seo'],
            ['key' => 'social_github', 'value' => 'https://github.com/beingmushfiq', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com', 'group' => 'social'],
            ['key' => 'social_x', 'value' => 'https://x.com', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
