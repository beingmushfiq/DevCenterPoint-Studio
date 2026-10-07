export interface ProjectDemoCredentials {
  username?: string;
  password?: string;
  role?: string;
  notes?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
};

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  industry: string;
  year: string;
  shortDescription: string;
  context: string;
  problem: string;
  strategy: string;
  designHighlights: string[];
  engineeringHighlights: string[];
  deliveredFunctionality: string[];
  techStack: string[];
  architectureOverview: string;
  badgeText?: string;
  accentColor?: string;
  liveUrl?: string;
  adminUrl?: string;
  demoCredentials?: ProjectDemoCredentials;
  githubUrl?: string;
  openSourceRepoName?: string;
  isRealWorldApp?: boolean;
}

export interface PrototypeDemo {
  id: string;
  title: string;
  url: string;
  tagline: string;
  category: string;
  tags: string[];
}

export interface Capability {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  keyOutputs: string[];
  techStack: string[];
  architectureHighlights: string[];
  codeSample?: string;
  iconName: string;
}

export interface TechIntegrationPattern {
  name: string;
  architectureType: string;
  description: string;
  bestPractice: string;
  productionSLA?: string;
}

export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Data' | 'Infrastructure' | 'Realtime' | 'AI / ML';
  role: string;
  version?: string;
  codeSnippet?: string;
  highlights: string[];
  iconSlug?: string;
  docUrl: string;
  docLabel: string;
  integrationPattern: TechIntegrationPattern;
}

export interface ProcessStep {
  number: string;
  phase: string;
  tagline: string;
  description: string;
  activities: string[];
  deliverables: string[];
  timelineEst: string;
}

export interface ProjectMilestone {
  id: string;
  milestoneCode: string;
  phaseNumber: string;
  phaseName: string;
  title: string;
  cadence: string;
  durationWeeks: string;
  narrativeRole: string;
  narrativeSummary: string;
  engineeringPhilosophy: string;
  engineeringGate: {
    gateName: string;
    criteria: string[];
    verificationMethod: string;
  };
  keyArtifact: {
    title: string;
    filename: string;
    type: string;
    format: string;
    snippet: string;
  };
  impactKPI: {
    label: string;
    value: string;
    context: string;
  };
  squadRoles?: string[];
  toolsAndRuntimes?: string[];
  failureModesPrevented?: string[];
  deepTechnicalSpecs?: {
    architecturalObjective: string;
    concurrencyBenchmark?: string;
    complianceChecks?: string[];
    dataFlowPattern?: string;
  };
}

export interface Principle {
  number: string;
  title: string;
  tagline: string;
  description: string;
  quote: string;
}

export interface ArchitectureLayerDeepDive {
  summary: string;
  designRationale: string;
  failureModesMitigated: string[];
  contractSLA: string;
}

export interface ArchitectureLayer {
  id: string;
  level: number;
  name: string;
  subtitle: string;
  focus: string;
  components: string[];
  securityProtocol: string;
  observability: string;
  scalabilityMetric: string;
  deepDive?: ArchitectureLayerDeepDive;
}

export interface InquiryFormData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  timeline: string;
  description: string;
  selectedTech?: string[];
  targetKickoff?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Engineering & Process' | 'Engagement Models' | 'Security & IP' | 'Post-Launch & SLAs';
  highlights?: string[];
}

/**
 * Raw CMS rows as serialised by the public controllers. These are the literal
 * Eloquent payloads (snake_case, JSON arrays already cast), used by the
 * standalone services / work / blog pages.
 */
export interface CmsService {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  description?: string;
  icon_name?: string;
  features?: string[];
  technologies?: string[];
  architecture_points?: string[];
  code_snippet?: string;
  display_order?: number;
  is_active?: boolean;
  updated_at?: string;
}

export interface CmsMetric {
  label: string;
  value: string;
}

export interface CmsProject {
  id: number;
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  client?: string;
  year?: string;
  duration?: string;
  overview?: string;
  problem?: string;
  solution?: string;
  metrics?: CmsMetric[];
  tech_stack?: string[];
  thumbnail_url?: string;
  hero_image_url?: string;
  gallery?: string[];
  live_url?: string;
  github_url?: string;
  is_featured?: boolean;
  display_order?: number;
  is_published?: boolean;
  updated_at?: string;
}

export interface CmsPost {
  id: number;
  slug: string;
  title: string;
  category?: string;
  author_name?: string;
  excerpt?: string;
  /** Markdown source. Rendered through lib/markdown.ts. */
  body?: string;
  cover_image_url?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  published_at?: string;
  display_order?: number;
  is_published?: boolean;
  updated_at?: string;
}
