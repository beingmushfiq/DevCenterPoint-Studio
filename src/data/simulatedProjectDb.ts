export interface DeepChallenge {
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  rootCause: string;
  architecturalResolution: string;
  codeOrPatternReference?: string;
}

export interface DeepStackItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Infrastructure' | 'Security' | 'AI / Analytics';
  role: string;
  configOrVersion: string;
  rationale: string;
}

export interface MeasurableOutcome {
  metric: string;
  value: string;
  baseline: string;
  impactDescription: string;
}

export interface ArchitectureNode {
  step: string;
  title: string;
  description: string;
  protocol: string;
  sla: string;
  payloadType?: string;
  security?: string;
  failover?: string;
}

export interface ProjectScreenshot {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
  category: 'Dashboard' | 'Mobile App' | 'Analytics' | 'Command Center' | 'Kiosk' | 'Core Engine';
}

export interface ProjectDeepInsights {
  projectId: string;
  slug: string;
  clientTestimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  executiveSummary: string;
  sprintDurationWeeks: number;
  teamSquadSize: string;
  challenges: DeepChallenge[];
  deepStack: DeepStackItem[];
  outcomes: MeasurableOutcome[];
  architectureFlow: ArchitectureNode[];
  screenshots?: ProjectScreenshot[];
  productionAuditLog: {
    lastVerified: string;
    auditStatus: string;
    uptimeSLA: string;
  };
}

export const SIMULATED_PROJECT_ARCHIVE_DB: Record<string, ProjectDeepInsights> = {
  ordershield: {
    projectId: 'ordershield',
    slug: 'ordershield-enterprise-oms',
    clientTestimonial: {
      quote: "DevCenterPoint replaced our brittle legacy fulfillment pipeline with an event-driven system that has run with zero inventory discrepancies during our busiest Black Friday ever.",
      author: "Marcus Vance",
      role: "VP of Supply Chain Operations",
      company: "OrderShield Logistics Group"
    },
    executiveSummary:
      "A distributed, high-throughput Order Management System engineered for multi-warehouse routing, sub-50ms stock reconciliation, and automated courier SLA enforcement under peak concurrent traffic.",
    sprintDurationWeeks: 10,
    teamSquadSize: "4 Senior Engineers • 1 Systems Architect • 1 Product Designer",
    challenges: [
      {
        title: "Double-Allocation Race Conditions Under Flash Traffic",
        severity: "Critical",
        rootCause:
          "Disparate sales channels (Shopify, Amazon, B2B wholesale) fired concurrent checkout webhooks against outdated inventory snapshots, causing identical stock units to be sold twice.",
        architecturalResolution:
          "Implemented pessimistic database locks paired with Redis distributed token buckets. Introduced optimistic locking on order line items with automated fallback retry queues.",
        codeOrPatternReference: "Redis Distributed Mutex (Redlock) + PostgreSQL Serializable Transactions"
      },
      {
        title: "Multi-Warehouse Courier Latency Drift",
        severity: "High",
        rootCause:
          "Courier API rate limits and geographic routing rules were calculated sequentially on the main request thread, causing checkout timeouts exceeding 12 seconds.",
        architecturalResolution:
          "Decoupled routing decisions into an asynchronous event queue worker pipeline using Laravel Reverb and Horizon with sub-30ms geographical proximity matrix caching.",
        codeOrPatternReference: "Event-Driven Worker Pool with Pre-computed Proximity Geohashes"
      }
    ],
    deepStack: [
      {
        name: "Laravel 11 & Horizon",
        category: "Backend",
        role: "Core transactional business logic & asynchronous queue processing",
        configOrVersion: "PHP 8.3 / Octane JIT",
        rationale: "High-throughput asynchronous job workers capable of draining 15,000 orders/min."
      },
      {
        name: "PostgreSQL with Partitioning",
        category: "Database",
        role: "Immutable ledger of order states and stock allocations",
        configOrVersion: "PostgreSQL 16 Enterprise",
        rationale: "Range-partitioned order tables by calendar quarter for sub-10ms historical lookups."
      },
      {
        name: "Redis Enterprise Cache",
        category: "Database",
        role: "Real-time stock balance counters and distributed mutex locking",
        configOrVersion: "Redis 7.2 Cluster",
        rationale: "Sub-2ms atomic decrement operations prevent overselling under concurrent load."
      },
      {
        name: "WebSockets / Laravel Reverb",
        category: "Infrastructure",
        role: "Bi-directional live dashboard synchronization for dispatch operators",
        configOrVersion: "Sub-50ms socket latency",
        rationale: "Eliminated server polling across 250 warehouse terminal screens."
      }
    ],
    outcomes: [
      {
        metric: "Inventory Sync Latency",
        value: "38ms",
        baseline: "15 minutes (Legacy)",
        impactDescription: "Real-time global stock synchronization across 14 distribution centers."
      },
      {
        metric: "Peak Fulfillment Throughput",
        value: "+44% volume",
        baseline: "8,500 orders/day cap",
        impactDescription: "Engineered to comfortably handle 30,000+ orders/day without queuing bottlenecks."
      },
      {
        metric: "Over-Allocation Errors",
        value: "0.00%",
        baseline: "3.2% during flash sales",
        impactDescription: "Zero double-selling incidents recorded across 18 consecutive months."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Channel Webhook Ingestion", description: "Edge gateway validates signature and pushes raw payload into ingest queue", protocol: "HTTPS / HMAC", sla: "< 15ms", payloadType: "Signed JSON Webhook (Shopify/Amazon)", security: "HMAC-SHA256 Signature Verification", failover: "Dead-Letter Queue with 5x Exponential Retry" },
      { step: "02", title: "Atomic Inventory Lock", description: "Redis distributed token bucket validates SKU availability across target warehouse", protocol: "Redis TCP", sla: "< 4ms", payloadType: "Binary Redis Mutex Token", security: "TLS-Encrypted Redis Cluster Auth", failover: "Secondary Replica Read with Optimistic Lock" },
      { step: "03", title: "Courier Proximity Routing", description: "Rule engine chooses optimal carrier based on transit time and zone SLA", protocol: "Async Worker", sla: "< 45ms", payloadType: "Spatial Geohash Matrix", security: "Internal VPC Isolation", failover: "Fallback Default Carrier Contract SLA" },
      { step: "04", title: "State Persistence & Ledger", description: "PostgreSQL commits transaction with immutable audit event trail", protocol: "SQL Serializable", sla: "< 12ms", payloadType: "Normalized Relational Tuple", security: "AES-256 Data-at-Rest Encryption", failover: "Automated Multi-AZ Read Replica Failover" },
      { step: "05", title: "Live Operator Dispatch", description: "Warehouse picking terminals update automatically via real-time WebSocket push", protocol: "WSS / Reverb", sla: "< 25ms", payloadType: "Pusher-Compatible JSON Broadcast", security: "WSS TLS 1.3 + Signed Channel Token", failover: "Client Polling Fallback (5s heartbeat)" }
    ],
    productionAuditLog: {
      lastVerified: "September 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.98%"
    }
  },

  qttenzy: {
    projectId: 'qttenzy',
    slug: 'qttenzy-smart-qr-attendance',
    clientTestimonial: {
      quote: "Students and staff scan within half a second with zero proxy attendance fraud. DevCenterPoint solved our verification bottlenecks completely.",
      author: "Dr. Evelyn Reed",
      role: "Dean of Campus Technology",
      company: "Metropolitan Academic Consortium"
    },
    executiveSummary:
      "A zero-trust contactless attendance platform featuring rotating encrypted QR tokens, cryptographic hardware device signatures, and anti-spoofing geofence validation.",
    sprintDurationWeeks: 8,
    teamSquadSize: "3 Engineers • 1 Security Specialist • 1 UI/UX Designer",
    challenges: [
      {
        title: "Proxy Check-Ins via Screenshot Sharing",
        severity: "Critical",
        rootCause:
          "Students were taking screenshots of static check-in QR codes and messaging them to absent peers, falsifying attendance logs.",
        architecturalResolution:
          "Engineered rotating HMAC-SHA256 dynamic QR tokens with 10-second lifespans. Combined with hardware device biometric validation and server-side IP subnet matching.",
        codeOrPatternReference: "Time-based One-Time Token (TOTP-HMAC) with Client Gyroscope Hash"
      },
      {
        title: "Congestion at Morning Campus Gates",
        severity: "High",
        rootCause:
          "Simultaneous check-ins from 4,000 students arriving within a 15-minute window caused server queue backpressure and verification spin.",
        architecturalResolution:
          "Implemented offline-first Progressive Web App scanning with asynchronous bulk signature ingestion and optimistic local confirmation.",
        codeOrPatternReference: "Local IndexedDB Buffering + Background Sync API"
      }
    ],
    deepStack: [
      {
        name: "React Native & Expo PWA",
        category: "Frontend",
        role: "Universal cross-platform scanner application",
        configOrVersion: "React 19 / Expo SDK 52",
        rationale: "Single codebase running seamlessly on Android, iOS, and mobile web browsers."
      },
      {
        name: "Node.js & Fastify API",
        category: "Backend",
        role: "Sub-millisecond cryptographic token verification gateway",
        configOrVersion: "Node.js 22 LTS / Fastify",
        rationale: "4x higher request throughput compared to traditional Express API stacks."
      },
      {
        name: "MongoDB Time-Series",
        category: "Database",
        role: "Append-only check-in verification ledger",
        configOrVersion: "MongoDB 7.0 Cluster",
        rationale: "Native time-series collection optimizes queries across millions of attendance records."
      }
    ],
    outcomes: [
      {
        metric: "Check-In Speed",
        value: "0.45s",
        baseline: "4.2s (Legacy manual)",
        impactDescription: "Near-instantaneous scan and confirmation flow per student."
      },
      {
        metric: "Proxy Fraud Rate",
        value: "0.00%",
        baseline: "14% reported proxy scans",
        impactDescription: "Eliminated fraudulent off-site attendance through rotating cryptographic keys."
      },
      {
        metric: "Peak Throughput",
        value: "3,200 scans/min",
        baseline: "450 scans/min limit",
        impactDescription: "Zero queue backups at turnstiles and lecture entrances."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Rotating QR Projection", description: "Display terminal generates 10-second rotating encrypted HMAC token", protocol: "SHA-256 TOTP", sla: "< 5ms", payloadType: "Base64 Encrypted TOTP Token", security: "HMAC-SHA256 Dynamic Rolling Key", failover: "Offline Cached Token Salt Generator" },
      { step: "02", title: "Camera Frame Optical Decode", description: "Mobile client captures token and gathers local device GPS fence bounds", protocol: "Client PWA", sla: "< 80ms", payloadType: "Camera Buffer + Sensor Geolocation", security: "Gyroscope & Biometric Client Hash", failover: "Manual One-Time Passcode Override" },
      { step: "03", title: "Signature Cryptographic Verification", description: "Fastify gateway validates device signature against campus geofence", protocol: "TLS 1.3 / Fastify", sla: "< 28ms", payloadType: "Encrypted Attendance Attestation", security: "Public Key Hardware Attestation", failover: "Queued Asynchronous Verification Pool" },
      { step: "04", title: "Time-Series Ledger Commit", description: "Attendance timestamp saved into append-only compliance store", protocol: "MongoDB Driver", sla: "< 14ms", payloadType: "BSON Time-Series Document", security: "WiredTiger Encrypted Storage", failover: "Local IndexedDB Buffer Sync" },
      { step: "05", title: "Haptic Confirmation", description: "User receives instant green verification status and haptic pulse", protocol: "Haptic API", sla: "< 10ms", payloadType: "Visual & Haptic Pulse Trigger", security: "Signed Confirmation Receipt", failover: "Static Verification Screen" }
    ],
    productionAuditLog: {
      lastVerified: "August 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.99%"
    }
  },

  commercecore: {
    projectId: 'commercecore',
    slug: 'commercecore-modular-ecommerce',
    clientTestimonial: {
      quote: "Page load dropped from 3.2 seconds to 350 milliseconds globally. Our mobile conversion rate jumped by 38% in the first quarter post-launch.",
      author: "Julian Thorne",
      role: "Chief Commercial Officer",
      company: "Nordic Luxury Goods"
    },
    executiveSummary:
      "A headless, multi-tenant digital commerce engine built for global storefronts, real-time inventory attribute matrices, and multi-currency checkout resilience.",
    sprintDurationWeeks: 12,
    teamSquadSize: "4 Engineers • 1 E-commerce Strategist • 1 QA Automation Lead",
    challenges: [
      {
        title: "Slow Storefront Render Times Crippling Conversion",
        severity: "Critical",
        rootCause:
          "Monolithic database queries joined 18 relational tables on every product page load to resolve multi-size/color variants, dragging TTFB over 2.4 seconds.",
        architecturalResolution:
          "Migrated to an Edge-cached headless catalog architecture with pre-computed denormalized JSON variant matrices stored at Cloudflare Edge nodes.",
        codeOrPatternReference: "Incremental Static Regeneration (ISR) + Edge KV Document Caching"
      },
      {
        title: "International Multi-Currency Exchange Volatility",
        severity: "High",
        rootCause:
          "Fluctuating forex rates caused price drift during multi-step checkout sessions, leading to payment gateway reconciliation discrepancies.",
        architecturalResolution:
          "Implemented a locked-rate checkout session token valid for 20 minutes with automated Stripe FX rate hedging.",
        codeOrPatternReference: "Time-locked Session Tokens with Redis FX TTL"
      }
    ],
    deepStack: [
      {
        name: "Next.js 15 & React 19",
        category: "Frontend",
        role: "Global headless storefront with Server Components & Edge rendering",
        configOrVersion: "Next.js App Router",
        rationale: "Near-instantaneous navigation with zero layout shift (CLS < 0.02)."
      },
      {
        name: "GraphQL & REST Gateway",
        category: "Backend",
        role: "Strictly typed API layer serving mobile apps and web storefronts",
        configOrVersion: "Apollo Server / Node 22",
        rationale: "Prevents over-fetching and delivers minimal JSON payloads to mobile users."
      },
      {
        name: "PostgreSQL & Stripe Payments",
        category: "Database",
        role: "ACID-compliant transaction processing & multi-currency payments",
        configOrVersion: "Postgres 16 / Stripe Elements",
        rationale: "Guarantees zero lost transactions and PCI-DSS Level 1 compliance."
      }
    ],
    outcomes: [
      {
        metric: "Global Page Load (LCP)",
        value: "0.35s",
        baseline: "3.2s (Monolith)",
        impactDescription: "Top 1% web performance score globally across desktop and mobile."
      },
      {
        metric: "Mobile Conversion Rate",
        value: "+38.4%",
        baseline: "1.8% average conversion",
        impactDescription: "Faster checkout drawer reduced cart abandonment by 27%."
      },
      {
        metric: "Infrastructure Cost",
        value: "-45%",
        baseline: "$8,200/mo cloud bill",
        impactDescription: "Serverless edge architecture reduced server provisioning overhead."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Edge Cache Delivery", description: "Cloudflare Edge serves pre-rendered product catalog with zero origin hit", protocol: "HTTP/3", sla: "< 25ms", payloadType: "Pre-rendered HTML / Edge KV", security: "Cloudflare Web Application Firewall", failover: "Origin Shield Stale-While-Revalidate" },
      { step: "02", title: "GraphQL Cart Mutation", description: "Cart actions validate real-time SKU inventory via atomic state service", protocol: "GraphQL / TLS", sla: "< 40ms", payloadType: "Typed GraphQL Operation JSON", security: "JWT Bearer Token + Strict CORS", failover: "Redis In-Memory Session Storage" },
      { step: "03", title: "Time-Locked Checkout Session", description: "Forex rates locked for 20 minutes to prevent checkout price drift", protocol: "Redis KV", sla: "< 10ms", payloadType: "Locked Forex Rate Ledger", security: "Encrypted Session Token", failover: "Central Bank Reference Rate Fallback" },
      { step: "04", title: "Stripe Payment Intent", description: "Customer authenticates payment via native Apple Pay / Google Pay", protocol: "Stripe API", sla: "< 350ms", payloadType: "PCI-DSS Tokenized Payment Payload", security: "Stripe TLS 1.3 / PCI Level 1", failover: "Alternative Regional Card Gateway" },
      { step: "05", title: "Webhook ERP Broadcast", description: "Fulfillment center and ERP receive automated dispatch triggers", protocol: "Signed Webhook", sla: "< 120ms", payloadType: "HMAC Signed Order Schema", security: "HMAC Shared Secret Verification", failover: "Asynchronous Dead-Letter Queue" }
    ],
    productionAuditLog: {
      lastVerified: "July 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.99%"
    }
  },

  leadlayer: {
    projectId: 'leadlayer',
    slug: 'leadlayer-crm-pipeline',
    clientTestimonial: {
      quote: "The real-time collaboration on deal cards transformed our 40-person sales team. No more lost leads or double-dialing customers.",
      author: "Samantha Cruz",
      role: "Head of Revenue Operations",
      company: "Apex Global Software"
    },
    executiveSummary:
      "An intelligent B2B sales pipeline CRM platform featuring optimistic drag-and-drop Kanban reconciliation, automated round-robin lead scoring, and real-time deal movement broadcasts.",
    sprintDurationWeeks: 9,
    teamSquadSize: "3 Senior Engineers • 1 UX Researcher • 1 DevOps Engineer",
    challenges: [
      {
        title: "Kanban State Conflicts During Concurrent Sales Updates",
        severity: "High",
        rootCause:
          "Multiple account executives dragging the same prospective deal card across pipeline stages produced UI stutter and overwritten notes.",
        architecturalResolution:
          "Built an optimistic state reconciliation client with Server-Sent Events (SSE) that smoothly animates remote changes in real time with operational transforms.",
        codeOrPatternReference: "CRDT-Inspired Optimistic State Engine + SSE"
      },
      {
        title: "Slow OAuth Email Thread Aggregation",
        severity: "Medium",
        rootCause:
          "Syncing massive multi-year customer email threads directly from Google Workspace and Outlook was blocking the main contact timeline.",
        architecturalResolution:
          "Implemented background webhook worker queues that incrementally backfill email metadata into indexed search documents without impacting UI interactivity.",
        codeOrPatternReference: "Async OAuth Ingestion Workers + Full-Text Search Indices"
      }
    ],
    deepStack: [
      {
        name: "React 19 with TanStack",
        category: "Frontend",
        role: "Fluid drag-and-drop Kanban workspace with optimistic mutations",
        configOrVersion: "React 19 / TanStack Query",
        rationale: "Instantaneous tactile UI feedback with automatic rollbacks on network failure."
      },
      {
        name: "Node.js & Express API",
        category: "Backend",
        role: "REST and Server-Sent Event gateway for sales teams",
        configOrVersion: "TypeScript 5.6 / Node 22",
        rationale: "Lightweight persistent event connections for real-time team collaboration."
      },
      {
        name: "PostgreSQL & ElasticSearch",
        category: "Database",
        role: "Relational customer schemas and instant multi-field contact search",
        configOrVersion: "PostgreSQL 16",
        rationale: "Sub-50ms full-text search across 500,000+ historical sales emails."
      }
    ],
    outcomes: [
      {
        metric: "Lead Response Time",
        value: "< 3 mins",
        baseline: "45 mins (Legacy email)",
        impactDescription: "Automated routing connected inbound leads to available reps immediately."
      },
      {
        metric: "Pipeline Velocity",
        value: "+29%",
        baseline: "42-day average deal cycle",
        impactDescription: "Reduced average deal closing cycle by nearly two weeks."
      },
      {
        metric: "UI Interaction Latency",
        value: "< 16ms (60fps)",
        baseline: "Stutter on 500+ deal boards",
        impactDescription: "Butter-smooth drag and drop performance even with extensive boards."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Inbound Lead Ingestion", description: "Form capture parses contact data and calculates algorithmic lead score", protocol: "HTTPS / REST", sla: "< 40ms", payloadType: "JSON Form Webhook Payload", security: "HMAC Digest + Cloudflare Turnstile", failover: "Ingest Buffer Queue (Kafka / Redis)" },
      { step: "02", title: "Round-Robin Routing", description: "Assigns deal to optimal sales rep based on territory and current pipeline load", protocol: "Logic Engine", sla: "< 8ms", payloadType: "Scored Opportunity Object", security: "Role Hierarchy Auth Gate", failover: "Fallback Unassigned Pool Route" },
      { step: "03", title: "Optimistic Kanban Update", description: "Browser moves card immediately while async mutation dispatches to server", protocol: "TanStack Mutation", sla: "< 2ms", payloadType: "Local State Cache Mutation", security: "CRDT Client-Side Sequence Lock", failover: "Automatic Rollback on Error" },
      { step: "04", title: "SSE Broadcast to Team", description: "Team members on the same deal board see card move smoothly in real time", protocol: "Server-Sent Events", sla: "< 35ms", payloadType: "EventStream Text Protocol", security: "Signed Event Channel Token", failover: "HTTP Polling Fallback" },
      { step: "05", title: "Activity Timeline Persistence", description: "Email threads, call notes, and status changes written to PostgreSQL search ledger", protocol: "PostgreSQL / Search", sla: "< 18ms", payloadType: "Indexed Activity Log Tuple", security: "AES-256 Storage Encryption", failover: "Asynchronous Bulk Ingest Queue" }
    ],
    productionAuditLog: {
      lastVerified: "August 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.97%"
    }
  },

  'shap-career': {
    projectId: 'shap-career',
    slug: 'shap-explainable-ai-career-predictor',
    clientTestimonial: {
      quote: "Unlike black-box models, SHAP Career Predictor showed our counselors exactly why a skill was recommended. Trust in the platform went through the roof.",
      author: "Dr. Alistair Finch",
      role: "Director of Workforce Development",
      company: "FutureSkills Institute"
    },
    executiveSummary:
      "An explainable machine learning workforce intelligence engine that predicts career trajectories and visualizes skill contribution impacts via mathematical SHAP feature attribution.",
    sprintDurationWeeks: 10,
    teamSquadSize: "2 ML Engineers • 2 Full-Stack Engineers • 1 Data Scientist",
    challenges: [
      {
        title: "Counselor Skepticism Toward Black-Box AI Recommendations",
        severity: "Critical",
        rootCause:
          "Traditional deep learning algorithms produced career fit percentages without explanation, leading human counselors to dismiss the results as untrustworthy.",
        architecturalResolution:
          "Engineered an XGBoost tree classifier paired with SHAP (SHapley Additive exPlanations) values that computes mathematical feature importance for every individual prediction.",
        codeOrPatternReference: "SHAP TreeExplainer Matrix Vector Breakdown"
      },
      {
        title: "Slow Model Inference Dragging Down Survey Experience",
        severity: "High",
        rootCause:
          "Computing SHAP game-theoretic Shapley values dynamically across 200 skill features took 3.8 seconds per user query.",
        architecturalResolution:
          "Implemented C-accelerated TreeExplainer bindings and compiled model weights into memory-mapped NumPy vectors in FastAPI, dropping inference time to under 180ms.",
        codeOrPatternReference: "FastAPI Async Worker + C-Accelerated SHAP Inference"
      }
    ],
    deepStack: [
      {
        name: "Python 3.12 & FastAPI",
        category: "Backend",
        role: "High-performance asynchronous inference API gateway",
        configOrVersion: "FastAPI / Uvicorn",
        rationale: "Sub-200ms latency on compute-heavy explainability matrix vectors."
      },
      {
        name: "XGBoost & SHAP Library",
        category: "AI / Analytics",
        role: "Supervised classification model and cooperative game theory explainer",
        configOrVersion: "XGBoost 2.1 / SHAP 0.46",
        rationale: "State-of-the-art accuracy on tabular workforce data with rigorous interpretability."
      },
      {
        name: "React 19 & D3.js Charts",
        category: "Frontend",
        role: "Interactive waterfall and radar charts visualizing skill contribution scores",
        configOrVersion: "React 19 / D3 Vector Graphics",
        rationale: "Enables counselors and students to interactively test 'what-if' skill acquisitions."
      }
    ],
    outcomes: [
      {
        metric: "Inference Latency",
        value: "0.18s",
        baseline: "3.8s (Initial prototype)",
        impactDescription: "Instant interactive career forecasting as users toggle skills."
      },
      {
        metric: "Counselor Trust & Adoption",
        value: "94% adoption",
        baseline: "31% with black-box models",
        impactDescription: "Transparent feature attribution convinced educators to integrate it statewide."
      },
      {
        metric: "Model Prediction Accuracy",
        value: "91.8% F1",
        baseline: "78% standard linear models",
        impactDescription: "Trained on over 450,000 verified career trajectory pathways."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Survey Skill Scoring", description: "Assessment answers mapped into standardized 200-dimensional skill vector", protocol: "Client State", sla: "< 5ms", payloadType: "Sparse 200-dim Float Vector", security: "Client In-Memory Memory Isolation", failover: "Default Median Baseline Imputation" },
      { step: "02", title: "FastAPI Inference Gateway", description: "Payload verified and passed to in-memory XGBoost model container", protocol: "HTTPS / REST", sla: "< 25ms", payloadType: "Pydantic Serialized Array", security: "TLS 1.3 / API Token Guard", failover: "Model Replica Load Balancer" },
      { step: "03", title: "SHAP Feature Attribution", description: "TreeExplainer calculates exact mathematical contribution for each skill", protocol: "NumPy / C-Ext", sla: "< 95ms", payloadType: "Shapley Attribution Matrix", security: "Container Sandboxed Runtime", failover: "Pre-computed Feature Importance Lookup" },
      { step: "04", title: "Interactive D3 Visualization", description: "Browser renders clear waterfall chart showing positive vs negative skill impacts", protocol: "D3 Vector Canvas", sla: "< 20ms", payloadType: "SVG Path Coordinate Matrix", security: "Client DOM Sanitization", failover: "Standard Bar Graph Fallback" },
      { step: "05", title: "Personalized Roadmap Export", description: "Counselor attaches notes and compiles downloadable PDF transition plan", protocol: "Async PDF Stream", sla: "< 350ms", payloadType: "Binary PDF Byte Stream", security: "Secure Short-Lived S3 Signed URL", failover: "Direct Browser Print Engine" }
    ],
    productionAuditLog: {
      lastVerified: "September 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.95%"
    }
  },

  'clinic-queue': {
    projectId: 'clinic-queue',
    slug: 'clinic-queue-manager-healthcare',
    clientTestimonial: {
      quote: "Patient waiting room frustration disappeared. Patients grab coffee nearby knowing their phone will buzz when they're three tokens away.",
      author: "Dr. Tariq Hasan",
      role: "Medical Director",
      company: "CarePoint Specialist Clinics"
    },
    executiveSummary:
      "A real-time outpatient token and triage management platform synchronizing self-service kiosks, doctor consultation desks, waiting room TV displays, and mobile patient SMS updates.",
    sprintDurationWeeks: 7,
    teamSquadSize: "3 Engineers • 1 Healthcare Systems Analyst",
    challenges: [
      {
        title: "Waiting Room Congestion & Chaos",
        severity: "Critical",
        rootCause:
          "Outdated paper tokens led to crowded lobbies, patients missing announcements, and anxiety regarding doctor availability.",
        architecturalResolution:
          "Engineered a multi-screen real-time WebSocket state synchronizer allowing remote queue monitoring via SMS links and instant TV display chime updates.",
        codeOrPatternReference: "Pusher / Reverb Live Room Broadcasts"
      },
      {
        title: "Clinic Wi-Fi Dropouts Breaking Queue State",
        severity: "High",
        rootCause:
          "Fluctuating hospital wireless networks caused receptionist kiosks to lose connection and create conflicting token sequences.",
        architecturalResolution:
          "Implemented local token reservation buffers with atomic sequence locks on a local edge server with automatic cloud synchronization upon reconnection.",
        codeOrPatternReference: "Edge Gateway Local SQLite Ledger + Cloud Sync"
      }
    ],
    deepStack: [
      {
        name: "Laravel 11 & WebSockets",
        category: "Backend",
        role: "Real-time queue event dispatcher and doctor console backend",
        configOrVersion: "PHP 8.3 / Laravel Reverb",
        rationale: "Instant broadcast to doctor dashboards and public TV screens."
      },
      {
        name: "React & Tailwind Display Feed",
        category: "Frontend",
        role: "High-contrast, high-legibility waiting room TV display and kiosk",
        configOrVersion: "React 19 / Clean Typography",
        rationale: "Crystal clear readability from 30+ feet away in crowded waiting halls."
      },
      {
        name: "Twilio SMS Gateway",
        category: "Infrastructure",
        role: "Automated SMS alerts when patient is 3 tokens away",
        configOrVersion: "Twilio Programmable Messaging",
        rationale: "99.9% SMS delivery within 3 seconds across major cellular carriers."
      }
    ],
    outcomes: [
      {
        metric: "Waiting Room Density",
        value: "-65%",
        baseline: "Overcrowded 80+ patient lobby",
        impactDescription: "Patients wait comfortably in cafes or outdoors with real-time web tracking."
      },
      {
        metric: "Missed Appointment Rate",
        value: "1.4%",
        baseline: "16.8% with audio calls",
        impactDescription: "SMS alerts virtually eliminated missed doctor calls."
      },
      {
        metric: "Average Patient Satisfaction",
        value: "4.8 / 5.0",
        baseline: "2.9 / 5.0 prior to system",
        impactDescription: "Predictable wait times dramatically reduced patient anxiety."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Kiosk Token Print", description: "Patient touches screen to select department and receives QR tracking slip", protocol: "Local Kiosk Hardware", sla: "< 0.8s", payloadType: "Thermal Print ESC/POS Command", security: "Hardware Bus Lockdown", failover: "Manual Paper Backup Sequence" },
      { step: "02", title: "Queue State Broadcast", description: "WebSocket event updates doctor desk and waiting room TV monitor", protocol: "WSS / Reverb", sla: "< 25ms", payloadType: "Pusher Event JSON Payload", security: "WSS TLS 1.3 Encrypted Socket", failover: "Automatic SSE Long-Polling Fallback" },
      { step: "03", title: "Automated Proximity SMS", description: "When queue moves to token N-3, system sends mobile alert with live link", protocol: "Twilio REST API", sla: "< 2.5s", payloadType: "E.164 SMS Dispatch Request", security: "Twilio Auth Token + Webhook Signature", failover: "WhatsApp Cloud API Backup" },
      { step: "04", title: "Doctor Call & Chime", description: "Doctor clicks 'Next Patient' triggering audio-visual counter chime on TV", protocol: "Web Audio + Socket", sla: "< 15ms", payloadType: "Audio Synthesizer AudioBuffer", security: "Role-Based Token Authentication", failover: "Visual Counter Flash Notice" },
      { step: "05", title: "Pharmacy Register Sync", description: "Prescription token routed to medication counter for fast dispensing", protocol: "REST / SQL", sla: "< 35ms", payloadType: "Encrypted Medical Serial Record", security: "HIPAA Compliant At-Rest AES-256", failover: "Local SQLite Queue Sync" }
    ],
    productionAuditLog: {
      lastVerified: "August 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.98%"
    }
  },

  'sherazi-gps': {
    projectId: 'sherazi-gps',
    slug: 'sherazi-gps-iot-telematics',
    clientTestimonial: {
      quote: "Tracking 600 vehicles in real-time with geofence breach alerts in under a second gave our fleet operations total command.",
      author: "Farhan Sherazi",
      role: "Managing Director",
      company: "Sherazi Logistics Fleet"
    },
    executiveSummary:
      "A high-throughput IoT telematics platform ingesting raw binary TCP packet streams from GPS hardware, indexing spatial routes in PostGIS, and rendering 60fps vector maps.",
    sprintDurationWeeks: 11,
    teamSquadSize: "3 IoT & Backend Engineers • 1 Mapping Specialist",
    challenges: [
      {
        title: "Overwhelming Ingestion of Unstructured TCP Packets",
        severity: "Critical",
        rootCause:
          "600 commercial vehicles broadcasting sensor payloads every 3 seconds inundated HTTP web servers with 12,000 requests/minute, dropping packets.",
        architecturalResolution:
          "Engineered a dedicated Node.js TCP socket listener with binary buffer parsers that decodes hardware protocols directly into streaming time-series queues.",
        codeOrPatternReference: "Low-level Node.js net.Server TCP Socket Buffer Parser"
      },
      {
        title: "Laggy Map Rendering With Hundreds of Moving Markers",
        severity: "High",
        rootCause:
          "Standard DOM-based marker maps suffered from browser memory leaks and low frame rates when updating hundreds of vehicle coordinates.",
        architecturalResolution:
          "Switched to WebGL-accelerated vector canvas rendering using Mapbox GL with clustered geo-sources and client-side interpolation.",
        codeOrPatternReference: "Mapbox GL WebGL Shader Acceleration + GeoJSON Streaming"
      }
    ],
    deepStack: [
      {
        name: "Node.js TCP Socket Server",
        category: "Backend",
        role: "Low-level binary hardware packet listener (GT06, J1939)",
        configOrVersion: "Node.js 22 LTS / TCP stream",
        rationale: "Zero HTTP overhead; parses raw binary byte packets in sub-millisecond cycles."
      },
      {
        name: "PostgreSQL & PostGIS",
        category: "Database",
        role: "Geospatial database for spatial polygon indexing and route logs",
        configOrVersion: "PostGIS 3.4 on PostgreSQL 16",
        rationale: "Blazing fast ST_Contains spatial calculations for geofence alerts."
      },
      {
        name: "Mapbox GL & WebGL",
        category: "Frontend",
        role: "60fps hardware-accelerated vector fleet map rendering",
        configOrVersion: "Mapbox GL JS / WebGL",
        rationale: "Smooth marker movement across thousands of concurrent vehicle assets."
      }
    ],
    outcomes: [
      {
        metric: "Telemetry Ingestion Rate",
        value: "25,000 pkts/sec",
        baseline: "400 pkts/sec (Old HTTP)",
        impactDescription: "Easily scales to 5,000+ active vehicle tracking devices."
      },
      {
        metric: "Geofence Alert Speed",
        value: "< 0.85s",
        baseline: "12 to 15s delay",
        impactDescription: "Immediate security alert when vehicle leaves authorized corridor."
      },
      {
        metric: "Map Frame Rate",
        value: "Solid 60 fps",
        baseline: "14 fps on busy screens",
        impactDescription: "Hardware-accelerated WebGL eliminates browser lag for dispatchers."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Hardware Packet Broadcast", description: "GPS device sends binary telemetry payload over GSM cellular network", protocol: "Raw TCP / UDP", sla: "< 50ms", payloadType: "GT06 Binary Byte Buffer", security: "Cellular APN Private Tunnel", failover: "Device Onboard Flash Memory Log" },
      { step: "02", title: "TCP Socket Parser", description: "Node daemon unpacks binary bytes into lat, long, speed, ignition, and fuel status", protocol: "Binary Buffer", sla: "< 2ms", payloadType: "Structured Telemetry JSON", security: "IP Whitelist Firewall", failover: "Clustered Daemon Replica Pool" },
      { step: "03", title: "PostGIS Spatial Calculation", description: "Database verifies whether vehicle position intersects with customer geofence boundaries", protocol: "PostGIS ST_Contains", sla: "< 8ms", payloadType: "WKT Geometry Polygon Query", security: "Database Network Isolation", failover: "Cached Polygon Bounding Box Check" },
      { step: "04", title: "WebSocket Live Push", description: "Updated coordinates streamed to active browser dispatcher sessions", protocol: "WSS / Socket.IO", sla: "< 20ms", payloadType: "Delta Coordinate JSON", security: "WSS TLS 1.3 / User Session Token", failover: "Client Fallback Poll (3s)" },
      { step: "05", title: "WebGL Vector Map Render", description: "Map canvas moves vehicle marker with smooth mathematical easing", protocol: "Mapbox GL Shader", sla: "< 16ms", payloadType: "GPU Vertex Attribute Array", security: "Client Sandbox WebGL Context", failover: "Standard 2D Canvas Marker Engine" }
    ],
    productionAuditLog: {
      lastVerified: "September 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.98%"
    }
  },
  roadsafety: {
    projectId: 'roadsafety',
    slug: 'roadsafety-movement-os',
    clientTestimonial: {
      quote: "DevCenterPoint created an operational backbone for our movement. Coordinating thousands of active volunteers, public safety campaigns, and community logistics used to be messy—now it runs with absolute clarity.",
      author: "Advocacy Directorate",
      role: "Central Operations & Logistics Lead",
      company: "Road Safety Movement Organization"
    },
    executiveSummary:
      "A centralized organizational operating system built for large-scale civic advocacy, coordinating verified member directories, real-time campaign dispatches, and volunteer field deployment.",
    sprintDurationWeeks: 12,
    teamSquadSize: "3 Senior Engineers • 1 Cloud Architect • 1 Product Designer",
    challenges: [
      {
        title: "Volunteer Coordination Bottlenecks During Safety Drives",
        severity: "Critical",
        rootCause:
          "Fragmented messaging groups and manual volunteer intake led to lost signups and delayed dispatch during urgent civic campaigns.",
        architecturalResolution:
          "Engineered a centralized digital intake and automated credential verification system with real-time push dispatches.",
        codeOrPatternReference: "Role-Based Campaign Dispatch & Queue Engine"
      },
      {
        title: "High-Traffic Surges During Public Awareness Drives",
        severity: "High",
        rootCause:
          "Traffic spikes from social broadcasts overwhelmed un-cached relational database queries, causing slow load times for field volunteers.",
        architecturalResolution:
          "Implemented Redis multi-tier caching and CDN edge routing, ensuring sub-60ms response times under nationwide traffic surges.",
        codeOrPatternReference: "Redis Response Cache + Edge Asset Distribution"
      }
    ],
    deepStack: [
      {
        name: "React & TypeScript",
        category: "Frontend",
        role: "High-contrast responsive client for desktop coordinators and mobile field volunteers",
        configOrVersion: "React 19 / TypeScript Strict",
        rationale: "Ensures type safety across diverse member directories and logistics forms."
      },
      {
        name: "Laravel & REST API Gateway",
        category: "Backend",
        role: "Business logic, granular RBAC, and event dispatch queues",
        configOrVersion: "Laravel 11 / PHP 8.3",
        rationale: "Battle-tested authorization gates and reliable asynchronous job workers."
      },
      {
        name: "PostgreSQL & Redis",
        category: "Database",
        role: "Relational persistence with in-memory caching",
        configOrVersion: "PostgreSQL 16 / Redis 7",
        rationale: "Ensures ACID transactions for verified member records and sub-millisecond query caches."
      }
    ],
    outcomes: [
      {
        metric: "Volunteer Mobilization Speed",
        value: "< 3.5 mins",
        baseline: "45 mins (Phone & Chat)",
        impactDescription: "Field volunteers mobilized in minutes during critical awareness campaigns."
      },
      {
        metric: "Member Directory Query Latency",
        value: "38ms",
        baseline: "420ms (Spreadsheets/Old DB)",
        impactDescription: "Sub-50ms search across entire verified membership base."
      },
      {
        metric: "Public System Uptime",
        value: "99.99%",
        baseline: "Frequent outages on drives",
        impactDescription: "Zero downtime during viral public safety awareness events."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Member Intake & Verification", description: "Volunteers submit credentials via encrypted web application", protocol: "HTTPS / TLS 1.3", sla: "< 120ms", payloadType: "Encrypted Volunteer Intake Form", security: "TLS 1.3 + CSRF Guard", failover: "Client Offline LocalStorage Queue" },
      { step: "02", title: "API Gateway & RBAC Guard", description: "Token verification and permission validation against role hierarchy", protocol: "JWT Middleware", sla: "< 5ms", payloadType: "Signed JWT Authorization Token", security: "RS256 Public Key Verification", failover: "Stateless In-Memory Token Cache" },
      { step: "03", title: "Campaign Dispatch Queue", description: "Automated event alerts pushed into Redis asynchronous worker queue", protocol: "Redis Queue", sla: "< 15ms", payloadType: "Serialized Campaign Event Job", security: "Isolated Redis Subnet Auth", failover: "Database Emergency Failover Queue" },
      { step: "04", title: "Volunteer Notification Broadcast", description: "Targeted alerts sent to field coordinators based on district and role", protocol: "WebSockets / Push", sla: "< 1.5s", payloadType: "WebPush VAPID Notification", security: "VAPID Public Key Encryption", failover: "Bulk SMS Broadcast Fallback" },
      { step: "05", title: "Operational Impact Ledger", description: "Field hours, safety checkpoints, and incident data logged immutably", protocol: "SQL Serializable", sla: "< 25ms", payloadType: "Audit Log Relational Entity", security: "Write-Once Audit Trail AES-256", failover: "Continuous WAL Replication" }
    ],
    productionAuditLog: {
      lastVerified: "October 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.99%"
    }
  },
  'speech-therapy': {
    projectId: 'speech-therapy',
    slug: 'speech-therapy-assessment-suite',
    clientTestimonial: {
      quote: "DevCenterPoint replaced our cumbersome manual paper assessments with an intuitive, standardized digital suite. Our therapists can now focus 100% on pediatric patients while diagnostic summaries are generated automatically.",
      author: "Clinical Director",
      role: "Lead Speech-Language Pathologist",
      company: "Pediatric Therapy & Clinical Diagnostics Center"
    },
    executiveSummary:
      "A clinical assessment UI and diagnostic screening platform designed for pediatric speech therapists, streamlining articulation tests, phonological milestone tracking, and automated reporting.",
    sprintDurationWeeks: 10,
    teamSquadSize: "3 Senior Engineers • 1 Clinical Domain Specialist • 1 UX Designer",
    challenges: [
      {
        title: "Cognitive Overload During Live Bedside Evaluations",
        severity: "Critical",
        rootCause:
          "Complex paper scoring matrices distracted therapists from observing child behavioral cues during brief assessment windows.",
        architecturalResolution:
          "Engineered a distraction-free, one-touch interactive evaluation card UI with instant visual confirmation and automated percentile tabulation.",
        codeOrPatternReference: "Low-Distraction Tablet UI with Reactive State Machine"
      },
      {
        title: "Clinical Data Integrity & Connectivity Dropouts",
        severity: "High",
        rootCause:
          "Therapy rooms with thick acoustic insulation suffered frequent Wi-Fi dropouts, risking loss of in-progress assessment records.",
        architecturalResolution:
          "Implemented offline IndexedDB client-side persistence with automated cryptographic sync upon network reconnection.",
        codeOrPatternReference: "Offline IndexedDB + Service Worker Background Sync"
      }
    ],
    deepStack: [
      {
        name: "React & TypeScript",
        category: "Frontend",
        role: "Interactive clinical assessment cards and responsive charts",
        configOrVersion: "React 19 / TypeScript",
        rationale: "Strict typing for clinical milestone rubrics and immediate reactivity."
      },
      {
        name: "Node.js & Express",
        category: "Backend",
        role: "HIPAA-conscious encrypted diagnostic API and report generation engine",
        configOrVersion: "Node.js 20 LTS",
        rationale: "Fast, stateless scoring micro-services with streaming PDF compilation."
      },
      {
        name: "PostgreSQL Encrypted Storage",
        category: "Database",
        role: "Patient assessment history and normative percentile datasets",
        configOrVersion: "PostgreSQL 16 with AES-256 at rest",
        rationale: "Ensures maximum clinical data confidentiality and auditability."
      }
    ],
    outcomes: [
      {
        metric: "Diagnostic Report Turnaround",
        value: "Instant (1-click)",
        baseline: "3 to 5 business days",
        impactDescription: "Standardized PDF assessment reports generated immediately after session."
      },
      {
        metric: "Scoring Accuracy",
        value: "100%",
        baseline: "8% manual calculation errors",
        impactDescription: "Automated percentile mapping eliminated human calculation mistakes."
      },
      {
        metric: "Therapist Time Saved",
        value: "45 mins/patient",
        baseline: "60 mins manual paperwork",
        impactDescription: "Therapists gain back hours each week for direct patient care."
      }
    ],
    architectureFlow: [
      { step: "01", title: "Touch Evaluation Input", description: "Therapist inputs observation scores on interactive test cards", protocol: "Local State", sla: "< 5ms", payloadType: "Touch Vector & Score Rubric", security: "Local Memory Sandboxing", failover: "Local Session Cache" },
      { step: "02", title: "Offline Storage Lock", description: "Scores encrypted and written to local IndexedDB to survive connection drops", protocol: "IndexedDB", sla: "< 2ms", payloadType: "Encrypted IndexedDB Record", security: "Client-Side Web Crypto API", failover: "ServiceWorker Persistent Cache" },
      { step: "03", title: "Normative Percentile Engine", description: "Standardized scores benchmarked against pediatric normative distributions", protocol: "WASM / JS Math Engine", sla: "< 10ms", payloadType: "Statistical Z-Score & Percentile", security: "Client Deterministic Algorithmic Bounds", failover: "Standard Fallback Lookup Matrix" },
      { step: "04", title: "Encrypted Cloud Sync", description: "Completed evaluation uploaded to secure PostgreSQL patient registry", protocol: "TLS 1.3 / AES-256", sla: "< 150ms", payloadType: "HIPAA Compliant Patient Bundle", security: "mTLS + AES-256 Envelope Encryption", failover: "Queued Retry Worker" },
      { step: "05", title: "Automated Clinical PDF Export", description: "Structured report compiled with progress charts and diagnostic advice", protocol: "PDF Stream", sla: "< 500ms", payloadType: "Compiled Diagnostic PDF Blob", security: "Password-Protected Medical Document", failover: "HTML Printable Summary" }
    ],
    productionAuditLog: {
      lastVerified: "October 2026",
      auditStatus: "Green • 100% Operational",
      uptimeSLA: "99.98%"
    }
  }
};

export const PROJECT_SCREENSHOTS_REGISTRY: Record<string, ProjectScreenshot[]> = {
  ordershield: [
    {
      id: 'os-1',
      title: 'Real-Time Multi-Warehouse Inventory & Dispatch Matrix',
      description: 'Sub-50ms stock balancing across 14 distribution centers with automated FIFO allocation and zero race conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'OMS Dashboard',
      category: 'Command Center',
    },
    {
      id: 'os-2',
      title: 'Multi-Courier Zone Routing & SLA Optimization Engine',
      description: 'Real-time carrier rate-shopping and sub-30ms geographic proximity calculations for high-volume fulfillment.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85',
      badge: 'Routing Rules',
      category: 'Analytics',
    },
    {
      id: 'os-3',
      title: 'Black Friday High-Throughput Ingestion & Exception Ledger',
      description: 'Asynchronous event stream processing 30,000+ orders/day without dropouts or double-allocation anomalies.',
      imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1800&q=85',
      badge: 'Real-Time Ledger',
      category: 'Dashboard',
    },
  ],
  qttenzy: [
    {
      id: 'qt-1',
      title: '10-Second Rotating Encrypted QR Dynamic Projection UI',
      description: 'Rotating TOTP HMAC-SHA256 tokens projected on display terminals to prevent attendance screenshot fraud.',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1800&q=85',
      badge: 'Projection Display',
      category: 'Command Center',
    },
    {
      id: 'qt-2',
      title: 'Mobile PWA Camera Scanner & Biometric Validation',
      description: 'Instant 0.45-second optical decode with client-side gyroscope fingerprinting and offline sync.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=85',
      badge: 'PWA Scanner',
      category: 'Mobile App',
    },
    {
      id: 'qt-3',
      title: 'Campus Geofence Occupancy & Compliance Analytics',
      description: 'Administrative overview displaying lecture hall entrance throughput and real-time attendance density.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Compliance Console',
      category: 'Analytics',
    },
  ],
  commercecore: [
    {
      id: 'cc-1',
      title: 'Headless Global Storefront & Dynamic Variant Matrix',
      description: 'Sub-350ms global TTFB powered by Next.js 15 App Router, Edge ISR, and Tailwind CSS.',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1800&q=85',
      badge: 'Next.js 15 Storefront',
      category: 'Dashboard',
    },
    {
      id: 'cc-2',
      title: 'Multi-Currency Real-Time Locked Checkout Drawer',
      description: '20-minute locked-rate session tokens protecting consumers against foreign currency volatility.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Stripe Gateway',
      category: 'Command Center',
    },
    {
      id: 'cc-3',
      title: 'Denormalized Catalog Schema & Edge Caching Ledger',
      description: 'Pre-computed JSON attribute matrices distributed to Cloudflare Edge nodes for sub-25ms origin responses.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85',
      badge: 'Edge Architecture',
      category: 'Core Engine',
    },
  ],
  leadlayer: [
    {
      id: 'll-1',
      title: 'Optimistic Real-Time Drag-and-Drop Deal Kanban Pipeline',
      description: 'Zero UI stutter with SSE sync across 40+ sales reps and automatic transactional conflict resolution.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Kanban Workspace',
      category: 'Dashboard',
    },
    {
      id: 'll-2',
      title: 'Algorithmic Lead Scoring & Territory Round-Robin Router',
      description: 'Connects inbound high-value enterprise prospects with available account executives in under 3 minutes.',
      imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1800&q=85',
      badge: 'Routing Engine',
      category: 'Analytics',
    },
    {
      id: 'll-3',
      title: 'Unified Customer Email Thread & Activity Timeline',
      description: 'ElasticSearch full-text search indexing across 500,000+ past client emails with sub-50ms query response.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=85',
      badge: 'Timeline Audit',
      category: 'Core Engine',
    },
  ],
  'shap-career': [
    {
      id: 'sc-1',
      title: 'Mathematical SHAP Feature Attribution Waterfall Studio',
      description: 'Cooperative game theory Shapley decomposition revealing the exact impact of each acquired skill.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85',
      badge: 'Explainable AI',
      category: 'Analytics',
    },
    {
      id: 'sc-2',
      title: 'Multi-Dimensional Trajectory Radar & Skill Vector Matrix',
      description: 'Predictive career pathways trained on 450,000 verified trajectory datasets with 91.8% F1 accuracy.',
      imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1800&q=85',
      badge: 'Skill Vectors',
      category: 'Command Center',
    },
    {
      id: 'sc-3',
      title: 'FastAPI Interactive Workforce Counseling Simulator',
      description: 'Sub-180ms C-accelerated inference engine allowing advisors to simulate hypothetical credential paths.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Inference Console',
      category: 'Dashboard',
    },
  ],
  'clinic-queue': [
    {
      id: 'cq-1',
      title: 'High-Contrast Waiting Room TV Display with Audio Chimes',
      description: 'High-legibility typography readable from 30+ feet with synchronized Web Audio calling cues.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Public TV Feed',
      category: 'Dashboard',
    },
    {
      id: 'cq-2',
      title: 'Doctor Consultation Console & Rapid Patient Summons',
      description: 'Single-click patient summons triggering proximity SMS alerts and automated triage room updates.',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1800&q=85',
      badge: 'Doctor Desk',
      category: 'Command Center',
    },
    {
      id: 'cq-3',
      title: 'Self-Service Touchscreen Kiosk & Department Ticketing',
      description: 'Patient arrival check-in with printed QR tracking slips and local SQLite edge redundancy.',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1800&q=85',
      badge: 'Kiosk Terminal',
      category: 'Kiosk',
    },
  ],
  'sherazi-gps': [
    {
      id: 'sg-1',
      title: 'WebGL 60fps Clustered Sensor Fleet Vector Map',
      description: 'Mapbox GL hardware-accelerated mapping rendering 600+ active vehicle trajectories in real time.',
      imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1800&q=85',
      badge: 'WebGL Mapbox GL',
      category: 'Command Center',
    },
    {
      id: 'sg-2',
      title: 'Low-Level Binary TCP Hardware Packet Parser Feed',
      description: 'Node.js socket daemon ingesting 25,000 pkts/sec of raw GT06 telematics sensor streams.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85',
      badge: 'TCP Stream Parser',
      category: 'Core Engine',
    },
    {
      id: 'sg-3',
      title: 'PostGIS Sub-Second Geofence Breach Alert Dispatcher',
      description: 'Spatial ST_Contains polygon verification triggering sub-second SMS and email security dispatches.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=85',
      badge: 'PostGIS Engine',
      category: 'Analytics',
    },
  ],
  roadsafety: [
    {
      id: 'rs-1',
      title: 'Nationwide Civic Campaign Dispatch & Volunteer Mobilization Console',
      description: 'Real-time volunteer district assignment and broadcast alerts coordinating civic safety drives across 12 regional divisions.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1800&q=85',
      badge: 'Campaign OS',
      category: 'Command Center',
    },
    {
      id: 'rs-2',
      title: 'Granular RBAC Member Directory & Encrypted Security Badges',
      description: 'Verified volunteer directory with sub-50ms fuzzy search and digital verification credentials.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85',
      badge: 'Directory & RBAC',
      category: 'Dashboard',
    },
    {
      id: 'rs-3',
      title: 'Public Safety Initiative Impact & Field Metrics Telemetry',
      description: 'Automated civic impact analytics dashboard aggregating volunteer hours, incident reports, and road awareness reach.',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85',
      badge: 'Civic Analytics',
      category: 'Analytics',
    },
  ],
  'speech-therapy': [
    {
      id: 'st-1',
      title: 'Interactive Pediatric Articulation Matrix & Diagnostic Screening Cards',
      description: 'Low-distraction touch interface designed for child evaluations with dynamic phonological scoring rubrics.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=85',
      badge: 'Diagnostic Matrix',
      category: 'Kiosk',
    },
    {
      id: 'st-2',
      title: 'Longitudinal Patient Developmental Progress & Milestone Timeline',
      description: 'Session-over-session developmental curves benchmarked against standardized normative pediatric percentiles.',
      imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1800&q=85',
      badge: 'Clinical Timeline',
      category: 'Analytics',
    },
    {
      id: 'st-3',
      title: '1-Click Automated Diagnostic Summary & Encrypted PDF Export',
      description: 'Compliant clinical report compiler streaming formatted diagnosis summaries directly to parents and physicians.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=85',
      badge: 'HIPAA Export',
      category: 'Dashboard',
    },
  ],
};

export function getDefaultScreenshotsForProject(projectId: string, title?: string): ProjectScreenshot[] {
  const normalized = projectId.toLowerCase().trim();
  if (PROJECT_SCREENSHOTS_REGISTRY[normalized]) {
    return PROJECT_SCREENSHOTS_REGISTRY[normalized];
  }
  return [
    {
      id: `${normalized}-1`,
      title: `${title || 'System'} — Mission Control Dashboard`,
      description: 'Central operational control workspace with real-time throughput metrics and live event monitoring.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=85',
      badge: 'Production Console',
      category: 'Command Center',
    },
    {
      id: `${normalized}-2`,
      title: `${title || 'System'} — Real-Time Telemetry & Ledger`,
      description: 'Zero-latency ledger indexing immutable operational event logs with automated verification gates.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85',
      badge: 'Telemetry Feed',
      category: 'Analytics',
    },
    {
      id: `${normalized}-3`,
      title: `${title || 'System'} — High-Performance Mobile & Edge Feed`,
      description: 'Optimized touch interface designed for field personnel and sub-second data capture.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=85',
      badge: 'Edge Mobile',
      category: 'Mobile App',
    },
  ];
}

/**
 * Simulated Asynchronous Database Service for Case Study Deep Insights
 * Emulates authentic database latency and caching
 */
export async function queryProjectDeepInsights(
  projectId: string,
  simulatedDelayMs = 280
): Promise<{
  data: ProjectDeepInsights | null;
  latencyMs: number;
  dataSource: string;
}> {
  const startTime = performance.now();

  // Emulate realistic database lookup latency
  await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));

  const normalizedId = projectId.toLowerCase().trim();
  const rawRecord = SIMULATED_PROJECT_ARCHIVE_DB[normalizedId] || null;
  const elapsed = Math.round(performance.now() - startTime);

  let record: ProjectDeepInsights | null = null;
  if (rawRecord) {
    const screenshots = PROJECT_SCREENSHOTS_REGISTRY[normalizedId] || getDefaultScreenshotsForProject(normalizedId);
    record = {
      ...rawRecord,
      screenshots,
    };
  }

  return {
    data: record,
    latencyMs: elapsed,
    dataSource: 'dcp-archive-db.production.cluster-east'
  };
}
