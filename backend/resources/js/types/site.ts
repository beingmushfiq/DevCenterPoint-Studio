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
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Engineering & Process' | 'Engagement Models' | 'Security & IP' | 'Post-Launch & SLAs';
  highlights?: string[];
}
