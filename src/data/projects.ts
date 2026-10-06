import { Project, PrototypeDemo } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'ordershield',
    number: '01',
    title: 'DevCenterPoint ERP & Storefront',
    subtitle: 'Omnichannel E-Commerce & Enterprise ERP Core',
    category: 'Business Systems',
    industry: 'Commerce & Logistics Infrastructure',
    year: '2026',
    shortDescription: 'Full-stack enterprise ERP integrated with an omnichannel storefront, inventory workflows, and sales management.',
    context: 'High-volume fulfillment businesses struggle with fragmented stock management across disparate warehouses and sales channels, causing inventory drift and delayed dispatch.',
    problem: 'Existing legacy systems produced frequent double-allocation errors during peak load, with latency in stock updates exceeding 15 minutes across distributed inventory locations.',
    strategy: 'Engineered an event-driven micro-service architecture with strict transactional locks and atomic inventory updates, paired with a high-density, low-latency operational dashboard.',
    designHighlights: [
      'High-density data tables designed for rapid keyboard navigation & zero visual fatigue',
      'Instant color-coded status badges with high WCAG contrast ratios',
      'Contextual inline filter drawer for rapid multi-dimensional order searching',
      'Real-time inventory level indicators with visual safety threshold alerts'
    ],
    engineeringHighlights: [
      'Implemented optimistic concurrency control to prevent inventory over-allocation',
      'Real-time stock updates broadcast via WebSockets / Laravel Reverb',
      'Optimized database queries with Redis caching layers for sub-50ms stock checks',
      'Robust audit logging for every status transition and stock adjustment'
    ],
    deliveredFunctionality: [
      'Multi-warehouse inventory synchronization with safety stock alerts',
      'Automated order routing rules based on proximity, stock level, and courier SLAs',
      'Batch order processing with direct printing of shipping manifests and labels',
      'Comprehensive reporting suite covering order fulfillment speed and return rates'
    ],
    techStack: ['Laravel', 'Vue.js / React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS'],
    architectureOverview: 'Client Frontend -> Express API Gateway -> Event-Driven Order Processing Worker Queue -> PostgreSQL Master (with Redis Cache) -> Multi-Carrier Logistics Webhooks.',
    accentColor: '#2E4AF9',
    liveUrl: 'https://demoerp.devcenterpoint.com',
    adminUrl: 'https://demoerp.devcenterpoint.com/login',
    demoCredentials: {
      username: 'Admin',
      password: '12345678',
      role: 'Enterprise Administrator',
      notes: 'Demo access for evaluating omnichannel inventory, POS, and sales workflows.'
    },
    githubUrl: 'https://github.com/beingmushfiq',
    openSourceRepoName: 'Omnichannel E-Commerce & ERP Core',
    isRealWorldApp: true
  },
  {
    id: 'qttenzy',
    number: '02',
    title: 'Qttenzy',
    subtitle: 'Smart Dynamic QR & Geofenced Attendance Platform',
    category: 'Healthcare & Enterprise',
    industry: 'Education & Workplace Tech',
    year: '2026',
    shortDescription: 'QR-based automated geofenced attendance system that verifies check-ins within precise physical boundaries.',
    context: 'Educational institutions and enterprise campuses required a contactless, fraud-resistant method to log attendance without expensive physical biometrics hardware.',
    problem: 'Static QR codes were easily copied or shared remotely via messaging apps, bypassing attendance validity and skewing compliance logs.',
    strategy: 'Developed a time-sensitive dynamic QR code generation engine with encrypted device signatures, anti-spoofing geolocation bounds, and real-time verification.',
    designHighlights: [
      'High-contrast scan interface optimized for diverse lighting conditions',
      'Instant haptic and visual feedback loop upon successful verification',
      'Clean calendar heatmap visualization of historical attendance records',
      'Role-based dashboard tailored for administrators, supervisors, and end-users'
    ],
    engineeringHighlights: [
      'Dynamic HMAC-SHA256 encrypted QR tokens rotating every 10 seconds',
      'Client-side GPS fence validation combined with server-side IP matching',
      'Asynchronous batch record processing for thousands of concurrent check-ins',
      'Offline-capable PWA client with auto-sync when network connectivity resumes'
    ],
    deliveredFunctionality: [
      'Time-based rotating QR code generator with anti-screenshot security',
      'Automated late arrival and shift calculation engine with custom rules',
      'Automated export of compliance reports in CSV, PDF, and XLS formats',
      'Role-based access hierarchy with granular department permissions'
    ],
    techStack: ['React Native', 'Node.js', 'TypeScript', 'MongoDB', 'PWA', 'Tailwind CSS'],
    architectureOverview: 'Mobile Client (Dynamic Token Generator) -> Encrypted API Endpoint -> Verification Service -> Real-time Attendance Ledger Database.',
    accentColor: '#00D084',
    liveUrl: 'https://qttenzy.vercel.app',
    githubUrl: 'https://github.com/beingmushfiq',
    isRealWorldApp: true
  },
  {
    id: 'commercecore',
    number: '03',
    title: 'CommerceCore',
    subtitle: 'Modular E-Commerce Engine',
    category: 'Commerce Infrastructure',
    industry: 'Retail & Multi-Vendor',
    year: '2026',
    shortDescription: 'Headless commerce backend, multi-currency checkout, and customizable product catalog architecture.',
    context: 'Traditional monolithic e-commerce platforms became slow and inflexible as catalog sizes grew and brand storefronts expanded to multiple international channels.',
    problem: 'Slow page render speeds directly impacted conversion rates, while rigid database schemas made complex variant management painful.',
    strategy: 'Architected a headless, API-first commerce engine decoupling storefront presentation from transaction logic, backed by a flexible JSON schema for dynamic product attributes.',
    designHighlights: [
      'Sub-second page transitions powered by modern React rendering patterns',
      'Minimalist checkout drawer engineered to minimize cart abandonment',
      'Adaptive image pipeline delivering auto-converted WebP formats based on viewport',
      'Fluid product filter panel with real-time dynamic inventory counts'
    ],
    engineeringHighlights: [
      'Edge-cached product catalog delivering sub-100ms global response times',
      'Stripe & local payment gateway fallback handling for high transaction reliability',
      'Scalable database schema supporting dynamic variants, attributes, and tier pricing',
      'Automated webhook triggers for ERP, CRM, and fulfillment system sync'
    ],
    deliveredFunctionality: [
      'Headless REST and GraphQL API for multi-storefront deployments',
      'Flexible matrix product variant manager with inventory tracking per SKU',
      'Integrated coupon, discount, and promotional campaign engine',
      'Multi-currency support with dynamic exchange rate updates'
    ],
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe API', 'GraphQL', 'Docker'],
    architectureOverview: 'Next.js Edge Storefront -> GraphQL / REST API -> Core Transaction & Catalog Engine -> PostgreSQL & Redis -> Stripe & Webhook Integrations.',
    accentColor: '#3B82F6',
    githubUrl: 'https://github.com/beingmushfiq'
  },
  {
    id: 'leadlayer',
    number: '04',
    title: 'LeadLayer System Architecture',
    subtitle: 'Multi-Channel Webhook Ingestion & CRM Pipeline',
    category: 'Business Systems',
    industry: 'B2B Sales & Operations',
    year: '2026',
    shortDescription: 'Multi-channel webhook ingestion pipeline and CRM automation tool designed for outbound lead processing.',
    context: 'Sales teams were losing prospective deals due to untracked email threads, delayed follow-ups, and manual lead distribution bottlenecks.',
    problem: 'Sales managers lacked real-time visibility into deal velocity, pipeline health, and representative activity metrics across teams.',
    strategy: 'Built an intuitive, real-time Kanban pipeline management platform with automated lead scoring, activity timelines, and smart notification triggers.',
    designHighlights: [
      'Smooth drag-and-drop Kanban board with optimistic UI updates',
      'Unified contact timeline consolidating emails, call notes, and task history',
      'Customizable pipeline stages with color-coded deal age indicators',
      'Clean executive summary dashboard featuring key pipeline conversion metrics'
    ],
    engineeringHighlights: [
      'Optimistic state reconciliation for instantaneous drag-and-drop feedback',
      'Automated round-robin and criteria-based lead distribution algorithms',
      'Secure OAuth2 integration with email providers for thread syncing',
      'Server-sent events (SSE) for instant deal movement alerts across team members'
    ],
    deliveredFunctionality: [
      'Drag-and-drop deal stage management with customizable pipeline rules',
      'Automated email notification sequences and task assignment triggers',
      'Integrated activity logging including call notes, attachments, and meetings',
      'Deal velocity analytics and sales forecasting visualizers'
    ],
    techStack: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    architectureOverview: 'React Single-Page Application -> Express API Gateway -> PostgreSQL Database -> OAuth Email Service Sync.',
    accentColor: '#8B5CF6',
    openSourceRepoName: 'LeadLayer System Architecture',
    githubUrl: 'https://github.com/beingmushfiq'
  },
  {
    id: 'shap-career',
    number: '05',
    title: 'SHAP Career Predictor',
    subtitle: 'Explainable AI Career Forecasting Engine',
    category: 'AI & Intelligent Systems',
    industry: 'EdTech & Workforce Analytics',
    year: '2026',
    shortDescription: 'Machine learning skill analysis and career path prediction model backed by SHAP feature explainability.',
    context: 'Educational advisors and job seekers needed data-backed guidance on career transitions, but standard black-box AI tools failed to explain why specific skills mattered.',
    problem: 'Traditional predictive models acted as unexplainable "black boxes", leading to low trust from career counselors who required clear rationale behind recommendations.',
    strategy: 'Implemented an XGBoost classification pipeline paired with SHAP (SHapley Additive exPlanations) values to render transparent, human-interpretable feature importance charts.',
    designHighlights: [
      'Interactive waterfall chart rendering SHAP positive/negative skill impacts',
      'Clean step-by-step assessment interface minimizing cognitive overload',
      'Comparative career trajectory radar charts mapping current vs required competencies',
      'Exportable PDF career transition roadmaps with personalized learning steps'
    ],
    engineeringHighlights: [
      'XGBoost ML pipeline trained on structured workforce skill datasets',
      'SHAP tree explainer generating instant feature contribution breakdown vectors',
      'FastAPI Python micro-service delivering sub-200ms prediction payloads',
      'Containerized deployment ensuring repeatable model inference environments'
    ],
    deliveredFunctionality: [
      'Interactive skill proficiency survey with dynamic contextual questions',
      'Real-time career fit probability score with SHAP contribution visualization',
      'Personalized skill gap identification highlighting highest-impact learning areas',
      'Counselor review panel for adding qualitative notes to automated predictions'
    ],
    techStack: ['Python', 'XGBoost', 'SHAP', 'FastAPI', 'React', 'Tailwind CSS'],
    architectureOverview: 'React Frontend -> FastAPI ML Endpoint -> XGBoost & SHAP Inference Engine -> Recommendation Formatter Response.',
    accentColor: '#EC4899',
    githubUrl: 'https://github.com/beingmushfiq'
  },
  {
    id: 'clinic-queue',
    number: '06',
    title: 'Feroza Medicine Corner Serial Manager',
    subtitle: 'Real-Time Healthcare Counter & Queue Management Portal',
    category: 'Healthcare Tech',
    industry: 'Healthcare & Pharmacy Systems',
    year: '2026',
    shortDescription: 'Real-time counter, patient queue, and appointment serial management portal built for healthcare and pharmacy desks.',
    context: 'Busy outpatient pharmacy desks and clinics experienced severe waiting counter congestion, unpredictable doctor consultation schedules, and frustrated patients.',
    problem: 'Manual paper token systems caused chaotic queue skipping, lack of SMS waiting status updates, and inaccurate consultation duration statistics.',
    strategy: 'Designed a real-time queue management network connecting patient registration kiosks, live display boards, and doctor consultation portals via WebSockets.',
    designHighlights: [
      'High-legibility digital waiting room screen layout visible from long distances',
      'Streamlined doctor desk controller allowing 1-click patient calling and skipping',
      'Mobile web tracking portal allowing patients to monitor queue position remotely',
      'Clear audio-visual chime and counter display triggers'
    ],
    engineeringHighlights: [
      'Sub-second latency token status broadcast powered by Pusher / Reverb',
      'Automated SMS alert dispatch when patient is 3 tokens away from consultation',
      'Fail-safe queue state preservation recovering automatically from network dropouts',
      'Analytical reporting on average patient wait time and consultation duration per doctor'
    ],
    deliveredFunctionality: [
      'Digital token issuance kiosk with printable queue slips and QR links',
      'Live waiting room TV display view showing current tokens per doctor counter',
      'Doctor portal for managing patient flow, emergency overrides, and transfers',
      'Patient SMS & web tracking link for remote waiting outside congested lobbies'
    ],
    techStack: ['Laravel', 'WebSockets', 'React', 'MySQL', 'Twilio SMS API'],
    architectureOverview: 'Kiosk & Mobile App -> Real-time Socket Server -> Doctor Console -> Waiting Room Display TV Feed.',
    accentColor: '#10B981',
    liveUrl: 'https://serial.ferozamedicinecorner.com',
    adminUrl: 'https://serial.ferozamedicinecorner.com',
    demoCredentials: {
      username: 'Super Admin',
      password: '12345678',
      role: 'Clinic Super Admin',
      notes: 'Access counter management, queue calling, and pharmacy serial registers.'
    },
    githubUrl: 'https://github.com/beingmushfiq',
    isRealWorldApp: true
  },
  {
    id: 'sherazi-gps',
    number: '07',
    title: 'Traccar GPS Telematics Deployment',
    subtitle: 'Containerized Open-Source Fleet Telemetry Stack',
    category: 'Mobile & Infrastructure',
    industry: 'Automotive & Logistics',
    year: '2026',
    shortDescription: 'Containerized open-source GPS tracking stack built with Docker for automated fleet telemetry and real-time geofence alerts.',
    context: 'Fleet operators needed continuous visibility over vehicle locations, driver behavior, speed violations, and route compliance.',
    problem: 'Raw IoT GPS tracker feeds sent millions of unstructured data packets per minute, overwhelming traditional web server setups and slowing map renders.',
    strategy: 'Built a specialized telemetry ingestion pipeline parsing raw TCP/UDP hardware packets, storing geospatial coordinates in time-series database structures, and rendering vector maps.',
    designHighlights: [
      'Smooth 60fps vector map rendering with custom vehicle status markers',
      'Interactive route history timeline player with speed graphs and stop markers',
      'Geofence drawing tools for establishing polygonal alert boundaries',
      'Compact vehicle status drawer listing ignition state, speed, and signal strength'
    ],
    engineeringHighlights: [
      'High-throughput TCP server ingesting hardware GPS protocols (J1939, GT06)',
      'Geospatial indexing in PostgreSQL/PostGIS for rapid spatial queries',
      'Real-time WebSocket data stream feeding live marker updates to active browsers',
      'Automated geofence collision detection triggering immediate push notifications'
    ],
    deliveredFunctionality: [
      'Live fleet tracking map with clustered marker rendering for hundreds of assets',
      'Geofence entry/exit boundary creation with real-time email/SMS alert triggers',
      'Historical route replay with playback speed control and trip metrics summary',
      'Driver behavior analytics covering over-speeding, idling, and harsh braking events'
    ],
    techStack: ['Node.js', 'PostgreSQL / PostGIS', 'Mapbox GL', 'React', 'WebSockets', 'Docker'],
    architectureOverview: 'Hardware GPS Tracker -> TCP Packet Listener -> PostGIS Telematics Storage -> WebSocket Broadcast -> Mapbox Vector Canvas.',
    accentColor: '#F59E0B',
    openSourceRepoName: 'Traccar GPS Fleet Platform Deployment',
    githubUrl: 'https://github.com/beingmushfiq'
  },
  {
    id: 'roadsafety',
    number: '08',
    title: 'Road Safety Movement',
    subtitle: 'Org Management OS & Public Safety Coordination Platform',
    category: 'Business Systems',
    industry: 'Civic Operations & Non-Profit',
    year: '2026',
    shortDescription: 'Central operational platform coordinating community members, organizational logistics, and public safety initiatives.',
    context: 'Civic advocacy organizations manage nationwide campaigns, volunteer dispatch, and safety initiatives across fragmented communication channels.',
    problem: 'Manual paper registries and uncoordinated messaging caused severe delays in volunteer deployment and public campaign logistics during critical safety drives.',
    strategy: 'Architected an integrated Org Management OS providing verified member directories, real-time campaign dispatch, and transparent operational logistics.',
    designHighlights: [
      'Verified member directory with digital role credentials and security badges',
      'Campaign dispatch console for real-time community event alerts',
      'High-contrast mobile interface optimized for on-the-ground volunteer coordination',
      'Clean data views for transparent community resource tracking'
    ],
    engineeringHighlights: [
      'Granular Role-Based Access Control (RBAC) with audit logging',
      'High-throughput incident and campaign broadcast notification pipelines',
      'Optimized relational database schema with Redis caching for instant member searches',
      'Automated onboarding verification workflows for new civic advocates'
    ],
    deliveredFunctionality: [
      'Member registration and digital ID verification portal',
      'Campaign logistics dispatch and volunteer coordinator workflow',
      'Public announcement and awareness drive management system',
      'Operational impact analytics reporting for organizational governance'
    ],
    techStack: ['React', 'TypeScript', 'Node.js / Laravel', 'PostgreSQL', 'Tailwind CSS'],
    architectureOverview: 'Client Web Application -> Secure API Gateway -> Relational Database & Redis Cache -> Automated Alert Dispatch Service.',
    accentColor: '#EF4444',
    liveUrl: 'https://roadsafetymovement.org',
    githubUrl: 'https://github.com/beingmushfiq',
    isRealWorldApp: true
  },
  {
    id: 'speech-therapy',
    number: '09',
    title: 'Speech Therapy Assessment Suite',
    subtitle: 'Clinical Diagnostic & Patient Evaluation Suite',
    category: 'Healthcare Tech',
    industry: 'Clinical Diagnostics & Pediatric Therapy',
    year: '2026',
    shortDescription: 'Clinical assessment UI, interactive developmental screening forms, and patient evaluation tools.',
    context: 'Speech-language pathologists and pediatric therapists require structured assessment tools to evaluate communicative milestones without disrupting patient flow.',
    problem: 'Traditional paper scorecards generated administrative overhead, manual percentile calculation errors, and delay in clinical report turnaround.',
    strategy: 'Designed an interactive assessment suite featuring dynamic developmental screening matrices, longitudinal patient tracking, and automated clinical summaries.',
    designHighlights: [
      'Distraction-free clinical interface tailored for bedside and desk observations',
      'Interactive phonology and articulation screening cards with audio prompts',
      'Longitudinal progression timeline mapping developmental milestones over time',
      'One-click PDF clinical report generation for parent and physician reviews'
    ],
    engineeringHighlights: [
      'Reactive scoring engine calculating standardized percentiles in real time',
      'Offline-capable client ensuring zero data loss during clinical sessions',
      'Encrypted diagnostic data persistence adhering to strict healthcare data boundaries',
      'Component-driven architecture for rapid customization across clinical protocols'
    ],
    deliveredFunctionality: [
      'Interactive developmental milestone screening checklists and evaluation matrices',
      'Automated standardized diagnostic scoring with real-time percentile computation',
      'Longitudinal patient progress charts comparing session-over-session improvements',
      'Automated clinical assessment summary export in formatted PDF format'
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    architectureOverview: 'Interactive React Client -> Clinical Protocol Validation Engine -> Encrypted Diagnostic Storage -> Automated PDF Generator.',
    accentColor: '#06B6D4',
    githubUrl: 'https://github.com/beingmushfiq',
    openSourceRepoName: 'Speech Therapy Assessment Suite'
  },
  {
    id: 'kothalipi',
    number: '10',
    title: 'KothaLipi AI Engine',
    subtitle: 'Bengali Voice, Vision & Writing Intelligence Workspace',
    category: 'AI & Intelligent Systems',
    industry: 'Language AI & Document Digitization',
    year: '2026',
    shortDescription: 'Production-grade multimodal Bengali intelligence workspace unifying regional voice transcription, historical manuscript OCR, and Bangla Academy-standard writing.',
    context: 'Bengali content — regional speech, archival manuscripts, and institutional documents — is largely locked in formats that generic AI tools handle poorly, forcing slow manual transcription and proofreading.',
    problem: 'Off-the-shelf speech and OCR models mishandle Bengali regional dialects and frequently drop or split complex conjunct ligatures (যুক্তবর্ণ) such as ক্ষ, জ্ঞ, and হ্ম, while producing text that violates Bangla Academy orthography.',
    strategy: 'Engineered a multimodal workspace pairing React 19 with a Gemini-powered Express pipeline, isolating four specialized modules — Voice to Text, Vision OCR, Writing Studio, and Cloud Archive — behind a bilingual context engine.',
    designHighlights: [
      'Clean four-workspace shell with bilingual (English / বাংলা) navigation and animated typewriter streaming',
      'Grapheme-aware streaming output using Intl.Segmenter for Bengali with pulsing active carets',
      'Thumb-friendly mobile bottom dock with safe-area padding and tactile active indicators',
      'Bundled virtual Avro keyboard for in-browser phonetic Bengali typing'
    ],
    engineeringHighlights: [
      'Express services wrapping @google/genai for OCR, transcription, proofreading, summarization, and TTS',
      'Regional dialect normalization across Sylhet, Chittagong, Noakhali, and Standard Dhaka Bengali',
      'Speaker diarization with turn-level timestamps and automated executive takeaways',
      'Workbox-precached PWA shell with offline asset caching and installable mobile experience'
    ],
    deliveredFunctionality: [
      'Voice to Text with dialect parsing, diarization, and audio executive briefings',
      'Vision OCR preserving conjuncts with tabular and key-value field extraction',
      'Writing Studio enforcing Bangla Academy Promito with Sadhu ⇄ Cholit and nine tonal rewrites',
      'Multi-format export (PDF, DOCX, Markdown, TXT) with Firebase Firestore history sync'
    ],
    techStack: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS v4', 'Express', 'Firebase', 'Google GenAI'],
    architectureOverview: 'React 19 + Vite PWA Client -> /api/* Reverse Proxy -> Express + @google/genai Pipeline -> Firebase Firestore & Google Auth Archive.',
    accentColor: '#0F766E',
    liveUrl: 'https://kothalipi.devcenterpoint.com',
    githubUrl: 'https://github.com/beingmushfiq/KothaLipi-AI',
    openSourceRepoName: 'KothaLipi-AI',
    isRealWorldApp: true
  }
];

export const PROTOTYPES_DATA: PrototypeDemo[] = [
  {
    id: 'ngo-demo',
    title: 'NGO Demo (DCP)',
    url: 'https://ngodemo-dcp.vercel.app',
    tagline: 'Donation drives, transparent fund tracking, and campaign dashboard.',
    category: 'Social Impact',
    tags: ['Donation Drives', 'Fund Tracking', 'Campaigns']
  },
  {
    id: 'slice-mart-fms',
    title: 'Slice Mart FMS',
    url: 'https://slice-mart-fms.vercel.app',
    tagline: 'Grocery and retail floor/inventory management demo.',
    category: 'Retail & Inventory',
    tags: ['Floor Management', 'Retail Inventory', 'POS']
  },
  {
    id: 'shikkha-platform',
    title: 'Shikkha Platform',
    url: 'https://shikkha-school-donation-platform.vercel.app',
    tagline: 'Crowdfunding and educational aid portal for students and community schools.',
    category: 'EdTech & Aid',
    tags: ['School Aid', 'Student Crowdfunding', 'Education']
  },
  {
    id: 'being-the-man',
    title: 'Being The Man',
    url: 'https://being-the-man.vercel.app',
    tagline: 'Minimalist lifestyle branding and personal blog layout.',
    category: 'Editorial & Brand',
    tags: ['Minimalist Lifestyle', 'Publication', 'Branding']
  },
  {
    id: 'byte-build-it',
    title: 'Byte Build IT',
    url: 'https://byte-build-it.vercel.app',
    tagline: 'Tech services and IT infrastructure consultancy site.',
    category: 'Services & IT',
    tags: ['IT Consultancy', 'Cloud Infrastructure', 'Services']
  },
  {
    id: 'startamark',
    title: 'Startamark',
    url: 'https://startamark.vercel.app',
    tagline: 'Lightweight marketing agency maintenance portfolio and client intake landing page.',
    category: 'Marketing Tech',
    tags: ['Client Intake', 'Agency Portfolio', 'Conversion']
  },
  {
    id: 'smmp-ui',
    title: 'SMMP UI',
    url: 'https://smmp-ui.vercel.app',
    tagline: 'Youth Society Organization website and management dashboard interface.',
    category: 'Community OS',
    tags: ['Youth Society', 'Admin Dashboard', 'Member Portal']
  },
  {
    id: 'qttenzy-proto',
    title: 'Qttenzy Attendance',
    url: 'https://qttenzy.vercel.app',
    tagline: 'QR-based automated geofenced attendance system that verifies check-ins within precise physical boundaries.',
    category: 'Access Control',
    tags: ['Dynamic QR', 'Geofencing', 'Attendance Verification']
  }
];
