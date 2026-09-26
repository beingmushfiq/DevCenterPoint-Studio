import { Project } from '../types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'ordershield',
    number: '01',
    title: 'OrderShield',
    subtitle: 'Enterprise Order Management System (OMS)',
    category: 'Business Systems',
    industry: 'Logistics & Supply Chain',
    year: '2025',
    shortDescription: 'Real-time order lifecycle tracking, automated multi-warehouse inventory sync, and operational rule engine.',
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
    accentColor: '#2E4AF9'
  },
  {
    id: 'qttenzy',
    number: '02',
    title: 'Qttenzy',
    subtitle: 'Smart QR Attendance Platform',
    category: 'Healthcare & Enterprise',
    industry: 'Education & Workplace Tech',
    year: '2025',
    shortDescription: 'Secure time-bound dynamic QR access control, geolocation verification, and real-time attendance analytics.',
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
    accentColor: '#00D084'
  },
  {
    id: 'commercecore',
    number: '03',
    title: 'CommerceCore',
    subtitle: 'Modular E-Commerce Engine',
    category: 'Commerce Infrastructure',
    industry: 'Retail & Multi-Vendor',
    year: '2024',
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
    accentColor: '#3B82F6'
  },
  {
    id: 'leadlayer',
    number: '04',
    title: 'LeadLayer',
    subtitle: 'Intelligent CRM & Lead Pipeline',
    category: 'Business Systems',
    industry: 'B2B Sales & Operations',
    year: '2024',
    shortDescription: 'Kanban pipeline management, automated lead assignment, and communication history tracking.',
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
    accentColor: '#8B5CF6'
  },
  {
    id: 'shap-career',
    number: '05',
    title: 'SHAP Career Predictor',
    subtitle: 'Explainable AI Career Forecasting Engine',
    category: 'AI & Intelligent Systems',
    industry: 'EdTech & Workforce Analytics',
    year: '2025',
    shortDescription: 'Machine learning skill analysis and career path prediction model backed by SHAP feature explainability.',
    context: 'Educational advisors and job seekers needed data-backed guidance on career transitions, but standard black-box AI tools failed to explain *why* specific skills mattered.',
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
    accentColor: '#EC4899'
  },
  {
    id: 'clinic-queue',
    number: '06',
    title: 'Clinic Queue Manager',
    subtitle: 'Healthcare Token & Queue Management Platform',
    category: 'Healthcare Tech',
    industry: 'Medical & Hospital Systems',
    year: '2025',
    shortDescription: 'Real-time patient registration, digital serial allocation, and live doctor counter display feeds.',
    context: 'Busy outpatient clinics experienced severe waiting room congestion, unpredictable doctor consultation schedules, and frustrated patients.',
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
    accentColor: '#10B981'
  },
  {
    id: 'sherazi-gps',
    number: '07',
    title: 'Sherazi GPS Tracker',
    subtitle: 'IoT Telematics & Fleet Monitoring Platform',
    category: 'Mobile & Infrastructure',
    industry: 'Automotive & Logistics',
    year: '2024',
    shortDescription: 'Live vehicle GPS telemetry, geofence boundary alerts, and historical route playback platform.',
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
    techStack: ['Node.js', 'PostgreSQL / PostGIS', 'Mapbox GL', 'React', 'WebSockets'],
    architectureOverview: 'Hardware GPS Tracker -> TCP Packet Listener -> PostGIS Telematics Storage -> WebSocket Broadcast -> Mapbox Vector Canvas.',
    accentColor: '#F59E0B'
  }
];
