import { Principle, ArchitectureLayer } from '../types';

export const PRINCIPLES_DATA: Principle[] = [
  {
    number: '01',
    title: 'Curiosity',
    tagline: 'We investigate before we implement.',
    description: 'We do not blindly accept surface-level briefs. We dig deep into user behavior, operational bottlenecks, and underlying data structures to uncover the real problem.',
    quote: 'Solving the right problem cleanly is far more valuable than rushing to write code for the wrong assumptions.'
  },
  {
    number: '02',
    title: 'Precision',
    tagline: 'Details matter because systems compound.',
    description: 'A microsecond of query latency or an unhandled edge-case status code compounds exponentially at scale. We insist on architectural rigor from day one.',
    quote: 'In software engineering, small inconsistencies in database schema or UI design compound into massive technical debt.'
  },
  {
    number: '03',
    title: 'Ownership',
    tagline: 'We care about what happens after launch.',
    description: 'Our commitment extends beyond deployment. We monitor live system metrics, error logs, and user adoption to ensure long-term stability and ROI.',
    quote: 'True engineering craftsmanship is measured by how smoothly a system operates two years after launch.'
  },
  {
    number: '04',
    title: 'Simplicity',
    tagline: 'Complex systems should feel simple to use.',
    description: 'Simplicity is not the absence of functionality—it is the mastery of complexity. We build sophisticated engines behind intuitive, uncluttered interfaces.',
    quote: 'Complexity is easy. Simplicity requires deliberate reduction, refined hierarchy, and intense focus.'
  },
  {
    number: '05',
    title: 'Craft',
    tagline: 'Good engineering and good design reinforce each other.',
    description: 'We reject the artificial divide between design and engineering. Exceptional digital products require equal mastery of aesthetic emotion and backend mechanics.',
    quote: 'A beautiful interface backed by a slow API fails. A fast database behind an unnavigable UI fails. Great products require both.'
  }
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'layer-experience',
    level: 1,
    name: 'Experience Layer',
    subtitle: 'High-density client UI, accessible design systems, and responsive views.',
    focus: 'User interaction speed, zero layout shift, accessibility, and high contrast.',
    deepDive: {
      summary: 'We treat interfaces as high-density command centers rather than static marketing pages. Client architecture prioritizes deterministic state synchronization, zero cumulative layout shifts (CLS < 0.01), sub-100ms first input delay, and strict WCAG 2.1 AA keyboard accessibility.',
      designRationale: 'By separating presentation logic from business domain models via strict custom React hooks and edge-rendered server components, we eliminate re-render thrashing and ensure seamless offline capabilities through Progressive Web App service workers.',
      failureModesMitigated: [
        'Network disconnect state thrashing via optimistic UI updates & client offline caches',
        'Layout shift during image/font hydration using font-display: swap & explicit aspect ratios',
        'DOM bloat in dense data tables via virtualized windowing (React Window)',
        'Accessibility isolation via full ARIA role mapping and keyboard focus traps'
      ],
      contractSLA: '< 100ms First Contentful Paint globally via Edge CDN'
    },
    components: ['React 19 / Next.js Storefront', 'Tailwind Token System', 'Keyboard Navigation Shortcuts', 'PWA Offline Workers'],
    securityProtocol: 'Content Security Policy (CSP), HTTPS Enforced, Strict SameSite Cookies',
    observability: 'Core Web Vitals Telemetry, Client Error Catchers (Sentry)',
    scalabilityMetric: '< 100ms First Contentful Paint globally via Edge CDN'
  },
  {
    id: 'layer-application',
    level: 2,
    name: 'Application Layer',
    subtitle: 'REST & GraphQL API Gateways, request routing, and authentication guards.',
    focus: 'Request routing, input validation, rate limiting, and RBAC security.',
    deepDive: {
      summary: 'The application layer operates as an unyielding security and translation perimeter between public clients and private services. All inbound requests are cryptographically verified, sanitised against strict OpenAPI/JSON schemas, and rate-limited before reaching domain logic.',
      designRationale: 'We adopt a defense-in-depth security posture with token-bucket rate limiting at the edge, HMAC signatures for inter-service communication, and short-lived stateless JWT tokens backed by Redis revocation blacklists.',
      failureModesMitigated: [
        'API Denial of Service (DoS) attacks via per-IP & per-user sliding window rate limiters',
        'Silent schema corruption via runtime Zod/OpenAPI payload sanitization',
        'Token replay and hijacking via cryptographic nonce matching and strict SameSite cookies',
        'Cascading gateway timeouts via circuit breaker thresholds and aggressive 5s upstream deadlines'
      ],
      contractSLA: '10,000+ Req/sec sustained with sub-50ms gateway serialization overhead'
    },
    components: ['Express / Laravel API Gateway', 'JWT & OAuth2 Auth Engine', 'OpenAPI Input Sanitizers', 'Rate Limiter Middleware'],
    securityProtocol: 'HMAC Signature Verification, CORS Whitelisting, OWASP Top 10 Guards',
    observability: 'APM Request Tracing, HTTP Response Status Heatmaps',
    scalabilityMetric: '10,000+ Requests / Sec throughput with sub-50ms API overhead'
  },
  {
    id: 'layer-services',
    level: 3,
    name: 'Services & Intelligence Layer',
    subtitle: 'Event-driven job workers, queue consumers, ML model inference engines.',
    focus: 'Asynchronous background processing, ML predictions, and real-time sockets.',
    deepDive: {
      summary: 'Our services layer isolates long-running asynchronous transactions, external webhook integrations, and machine learning inference from synchronous HTTP request/response loops. Event queues process jobs in parallel with dead-letter-queue (DLQ) automated replay guarantees.',
      designRationale: 'Synchronous HTTP endpoints should never wait on remote webhooks, third-party payment gateways, or CPU-heavy ML scoring models. Decoupling with Redis-backed BullMQ/Laravel queues guarantees resilient retry strategies without tying up web server worker pools.',
      failureModesMitigated: [
        'Third-party API outages stalling customer requests via asynchronous queue isolation',
        'Poison pill jobs crashing workers via exponential backoff retries and Dead Letter Queues (DLQ)',
        'Machine learning inference cold starts via persistent GPU memory model weight warmers',
        'Real-time state drift via WebSocket heartbeat keepalives and automatic resync protocols'
      ],
      contractSLA: '99.99% background job execution guarantee with sub-20ms WebSocket broadcasts'
    },
    components: ['XGBoost / SHAP ML Service', 'Laravel Reverb / Socket Server', 'Redis Queue Worker Clusters', 'Third-Party Webhook Handlers'],
    securityProtocol: 'Isolated Private VPC Subnets, TLS Internal Encrypted Channels',
    observability: 'Queue Backlog Monitoring, Worker Memory Health Metrics',
    scalabilityMetric: 'Auto-scaling worker nodes dynamically scaling with queue depth'
  },
  {
    id: 'layer-data',
    level: 4,
    name: 'Data & Persistence Layer',
    subtitle: 'Relational databases, in-memory caching, vector indices, and Audit logs.',
    focus: 'ACID transaction guarantees, high-concurrency locks, and data integrity.',
    deepDive: {
      summary: 'Data persistence is built around ACID guarantees, immutable audit trails, and strict transaction isolation. Relational tables utilize normalized schemas with composite indexes, while high-velocity reads are accelerated via sub-millisecond in-memory Redis caching.',
      designRationale: 'We treat database schemas as irrevocable contracts. High-throughput write operations are isolated to primary master clusters, while analytics and read-heavy reporting queries route to read replicas with pgBouncer transaction pooling.',
      failureModesMitigated: [
        'Concurrent reservation double-booking via SELECT ... FOR UPDATE atomic row locks',
        'Slow query cascade exhaustion via pgBouncer connection pooling and strict query timeouts',
        'Unrecoverable data corruption via point-in-time recovery (PITR) and automated off-site backups',
        'Cache stampedes and avalanche failures via probabilistic early expiration (XFetch algorithm)'
      ],
      contractSLA: 'Zero data loss with < 5ms p95 OLTP query response time'
    },
    components: ['PostgreSQL Master / Replica Clusters', 'Redis Cache Layer', 'PostGIS Telematics Extensions', 'Immutable System Audit Ledger'],
    securityProtocol: 'AES-256 Storage Encryption, Encrypted Automatic Daily Backups',
    observability: 'Slow Query Log Auditing, Buffer Pool Hit Ratios',
    scalabilityMetric: '99.99% Cache Hit Ratio for hot product/catalog queries'
  },
  {
    id: 'layer-infrastructure',
    level: 5,
    name: 'Infrastructure & Cloud Layer',
    subtitle: 'Docker containerization, reverse proxying, CI/CD, and server OS runtime.',
    focus: 'System availability, zero-downtime rolling updates, and DDoS mitigation.',
    deepDive: {
      summary: 'Every deployment runs inside immutable, minimal Distroless Docker containers orchestrated across private VPC networks. Edge routing terminates TLS 1.3 and HTTP/3 with automated Cloudflare DDoS scrubbing and sub-30s blue/green zero-downtime cutovers.',
      designRationale: 'Infrastructure as Code (IaC) ensures environmental parity between local development, staging, and production clusters. Container images are strictly read-only at runtime, preventing in-memory injection attacks and unauthorized filesystem modifications.',
      failureModesMitigated: [
        'Deployment downtime via automated blue/green canary routing with instant DNS rollback',
        'Host compromise via rootless Distroless containers and non-root Linux service daemons',
        'DDoS saturation via edge rate-limiting and Cloudflare Web Application Firewall (WAF) rules',
        'Single-zone cloud outages via multi-availability zone automated replica failover'
      ],
      contractSLA: '99.995% ingress availability with < 30 second cold container scaling'
    },
    components: ['Docker Container Runtime', 'Nginx Reverse Proxy', 'GitHub Actions CI/CD Pipeline', 'Cloudflare DDoS Protection'],
    securityProtocol: 'Strict UFW Firewall Rules, SSH Key Access Only, Isolated VPCs',
    observability: 'CPU / RAM System Metrics, Uptime Health Checks (99.99% SLA)',
    scalabilityMetric: 'Zero-Downtime Blue/Green deployments in < 30 seconds'
  }
];
