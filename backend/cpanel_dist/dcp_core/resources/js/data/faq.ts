import { FAQItem } from '../types';

export const FAQ_CATEGORIES = [
  'All',
  'Engineering & Process',
  'Engagement Models',
  'Security & IP',
  'Post-Launch & SLAs'
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-process-lifecycle',
    category: 'Engineering & Process',
    question: 'How does DevCenterPoint structure its end-to-end engineering lifecycle?',
    answer:
      'We run a battle-tested six-phase lifecycle designed for deterministic execution: Phase 01 Architectural Discovery & System RFC, Phase 02 Data Modeling & Contract Definition, Phase 03 Modular Core Implementation, Phase 04 Automated Verification & Quality Gates, Phase 05 Production Hardening & Security Audit, and Phase 06 Zero-Downtime Deployment & Handover. Every sprint operates on two-week increments with ephemeral preview environments for every pull request.',
    highlights: [
      'Comprehensive RFC architecture review prior to line 1 of code',
      'Ephemeral PR preview environments for continuous client sign-off',
      'Two-week agile cadence with live staging demonstrations'
    ]
  },
  {
    id: 'faq-engagement-models',
    category: 'Engagement Models',
    question: 'What engagement models do you offer for enterprises and growing ventures?',
    answer:
      'We support three primary commercial structures tailored to your operational velocity: (1) Dedicated Engineering Squads—an integrated cross-functional team of senior engineers, an architect, and a delivery lead dedicated exclusively to your roadmap; (2) Fixed-Scope Milestone Deliverables—guaranteed-budget execution with deterministic phase sign-offs; and (3) Strategic Architecture Advisory / Fractional CTO—high-leverage systems audits, technology selection, and technical leadership.',
    highlights: [
      'Dedicated Agile Squads embedded directly into your Slack & Jira',
      'Milestone-bound delivery tranches with deterministic deliverables',
      'Fractional CTO & Systems Advisory for high-scale planning'
    ]
  },
  {
    id: 'faq-process-quality-gates',
    category: 'Engineering & Process',
    question: 'What non-negotiable quality and verification gates govern every release?',
    answer:
      'Every pull request must pass our automated CI pipeline: strict TypeScript compilation with zero `any` exemptions, unit test suites, end-to-end integration tests (Playwright), static application security tests (SAST), bundle size budgets, and accessibility audits. Staging code is only promoted to production when all automated gates and peer architectural reviews report 100% green.',
    highlights: [
      '100% strict TypeScript compilation with zero escape hatches',
      'Automated Playwright integration tests and bundle size budgets',
      'OWASP security compliance scanning and dependency audits'
    ]
  },
  {
    id: 'faq-engagement-kickoff',
    category: 'Engagement Models',
    question: 'How quickly can we kick off an engagement, and what does onboarding look like?',
    answer:
      'Following your initial inquiry, we conduct an executive technical discovery session within 48 to 72 hours. Once commercial terms are finalized, your squad can mobilize in 5 to 7 business days. Week 1 is dedicated to "Sprint 0"—establishing repository baselines, cloud infrastructure pipelines, CI/CD runners, and shared communication channels so development begins with zero friction.',
    highlights: [
      '48-to-72 hour discovery turnaround with executive engineers',
      'Squad mobilization within 5–7 business days',
      'Sprint 0 foundational setup ensures immediate velocity'
    ]
  },
  {
    id: 'faq-process-legacy',
    category: 'Engineering & Process',
    question: 'How do you handle legacy codebase modernizations without disrupting live operations?',
    answer:
      'We utilize the Strangler Fig architectural pattern and event-driven data synchronizers to incrementally replace legacy components with modern services. Traffic is migrated progressively using canary proxy routing and automated rollbacks. Your users experience uninterrupted uptime, while technical debt is systematically retired under comprehensive regression test harnesses.',
    highlights: [
      'Strangler Fig incremental microservice / module migration',
      'Zero-downtime dual-write data routing and proxy synchronization',
      'Instant automated rollback safeguards for zero client disruption'
    ]
  },
  {
    id: 'faq-security-ip-transfer',
    category: 'Security & IP',
    question: 'Who owns the intellectual property, code repositories, and cloud infrastructure?',
    answer:
      'You maintain 100% full, unencumbered ownership of all intellectual property, source code, designs, and data from day one. All code is committed directly to your enterprise GitHub/GitLab repositories, and all cloud environments (AWS, GCP, Azure, or Cloudflare) are deployed inside your own organizational cloud tenants. There is zero vendor lock-in or proprietary runtime dependency.',
    highlights: [
      '100% client intellectual property ownership from inception',
      'Deployed directly to your corporate cloud and Git repositories',
      'Zero proprietary vendor lock-in or licensing fees'
    ]
  },
  {
    id: 'faq-engagement-scope-changes',
    category: 'Engagement Models',
    question: 'How do you manage scope modifications or product pivots during active sprints?',
    answer:
      'We embrace agile adaptability. In our dedicated squad model, you maintain total flexibility to re-prioritize backlog epics during bi-weekly sprint planning. For milestone-based engagements, we handle scope adjustments through rapid, transparent change orders evaluated against point-based velocity. You are always in control of trade-offs between scope, timeline, and budget.',
    highlights: [
      'Bi-weekly backlog re-balancing with zero bureaucratic penalty',
      'Transparent velocity tracking in Linear or Jira',
      'Clear trade-off matrices between feature scope and release date'
    ]
  },
  {
    id: 'faq-security-compliance',
    category: 'Security & IP',
    question: 'What security protocols, NDAs, and confidentiality standards do you observe?',
    answer:
      'We execute mutual Non-Disclosure Agreements (NDAs) prior to examining any proprietary documentation. Our engineering operations adhere to SOC 2 Type II controls, strict Least-Privilege IAM role access, automated secrets management (via AWS KMS, Google Cloud Secret Manager, or HashiCorp Vault), and continuous vulnerability monitoring.',
    highlights: [
      'Mutual NDA executed prior to initial technical deep dives',
      'SOC 2 Type II aligned development and operational hygiene',
      'Zero plain-text secrets; centralized KMS role-based access'
    ]
  },
  {
    id: 'faq-postlaunch-support',
    category: 'Post-Launch & SLAs',
    question: 'What warranty, ongoing maintenance, and SLA support do you provide after launch?',
    answer:
      'Every production deployment includes a complimentary 30-day warranty covering any defect remediation at zero cost. Following launch, clients frequently transition into our Tiered Reliability Support: 99.95% uptime guarantees, 15-minute response times for critical P0 anomalies, continuous security patch management, and synthetic end-user monitoring.',
    highlights: [
      '30-day complimentary post-launch warranty on all deliverables',
      'Sub-15 minute response time SLA for critical production incidents',
      'Continuous dependency audits, security patching, and telemetry'
    ]
  },
  {
    id: 'faq-postlaunch-handover',
    category: 'Post-Launch & SLAs',
    question: 'How does DevCenterPoint hand over the system to our internal engineering team?',
    answer:
      'Our handover is thorough and structured. We produce comprehensive Architecture Decision Records (ADRs), infrastructure-as-code runbooks, API specifications, and recorded video walkthroughs for each subsystem. We then conduct joint pair-programming sprints where your in-house engineers deploy commits alongside our leads, ensuring total operational confidence.',
    highlights: [
      'Living Architecture Decision Records (ADRs) and OpenAPI specs',
      'Recorded video deep dives detailing subsystem architectures',
      'Structured pair-programming handover sprints with your team'
    ]
  }
];
