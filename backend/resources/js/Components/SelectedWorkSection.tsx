import React, { useState } from 'react';
import { PROJECTS_DATA, PROTOTYPES_DATA } from '../data/projects';
import { Project, PrototypeDemo } from '../types';
import { CaseStudyModal } from './CaseStudyModal';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { 
  ArrowUpRight, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Layers,
  Activity,
  Terminal,
  Key,
  ShieldCheck,
  Zap,
  Database
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';
import { SectionState } from './SectionState';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function getTaxonomyTier(project: Project): { label: string; badgeClass: string } {
  const id = project.id.toLowerCase();
  if (id.includes('ordershield') || id.includes('qttenzy') || id.includes('aiml-studio') || id.includes('erp')) {
    return {
      label: 'Production Core',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-[var(--accent-primary)] dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
    };
  }
  if (id.includes('feroza') || id.includes('roadsafety') || id.includes('dcp-studio')) {
    return {
      label: 'Verified Live Deployment',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50',
    };
  }
  return {
    label: 'Open Architecture',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
  };
}

export const SelectedWorkSection: React.FC = () => {
  const cms = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copiedProtoId, setCopiedProtoId] = useState<string | null>(null);

  const hasCmsProjects = Array.isArray(cms.projects);

  const projects: Project[] = (hasCmsProjects && cms.projects!.length > 0)
    ? cms.projects!.map((p: any, idx: number) => ({
        id: p.slug || String(p.id),
        number: String(idx + 1).padStart(2, '0'),
        title: p.title,
        subtitle: p.subtitle || '',
        category: p.category || 'Business Systems',
        industry: p.industry || 'Technology',
        year: p.year || '2026',
        shortDescription: p.summary || p.shortDescription || '',
        context: p.overview || p.context || '',
        problem: p.problem || '',
        strategy: p.solution || p.strategy || '',
        designHighlights: Array.isArray(p.design_highlights) ? p.design_highlights : (p.designHighlights || []),
        engineeringHighlights: Array.isArray(p.engineering_highlights) ? p.engineering_highlights : (p.engineeringHighlights || []),
        deliveredFunctionality: Array.isArray(p.deliverables) ? p.deliverables : (p.deliveredFunctionality || []),
        techStack: Array.isArray(p.stack) ? p.stack : (p.techStack || []),
        architectureOverview: p.architecture || p.architectureOverview || '',
        badgeText: p.badge_text || p.badgeText || 'Enterprise Production',
        accentColor: p.accent_color || p.accentColor || '#0047FF',
        liveUrl: p.live_url || p.liveUrl,
        adminUrl: p.admin_url || p.adminUrl,
        demoCredentials: (p.credentials_username || p.demoCredentials) ? {
          username: p.credentials_username || p.demoCredentials?.username,
          password: p.credentials_password || p.demoCredentials?.password,
          role: Array.isArray(p.credentials_roles) ? p.credentials_roles[0] : (p.demoCredentials?.role || 'Admin'),
          notes: p.demoCredentials?.notes,
        } : undefined,
        githubUrl: p.github_url || p.githubUrl,
        isRealWorldApp: p.is_real_world !== undefined ? Boolean(p.is_real_world) : (p.isRealWorldApp ?? true),
      }))
    : (hasCmsProjects ? [] : PROJECTS_DATA);

  const categories = [
    'All',
    'Business Systems',
    'Commerce Infrastructure',
    'Healthcare & Enterprise',
    'AI & Intelligent Systems',
    'Mobile & Infrastructure'
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Business Systems') return p.category === 'Business Systems';
    if (selectedCategory === 'Commerce Infrastructure') return p.category === 'Commerce Infrastructure';
    if (selectedCategory === 'Healthcare & Enterprise') return p.category === 'Healthcare & Enterprise' || p.category === 'Healthcare Tech';
    if (selectedCategory === 'AI & Intelligent Systems') return p.category === 'AI & Intelligent Systems';
    if (selectedCategory === 'Mobile & Infrastructure') return p.category === 'Mobile & Infrastructure' || p.category === 'Mobile Platforms';
    return true;
  });

  const handleCopyPrototypeUrl = (proto: PrototypeDemo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(proto.url);
      setCopiedProtoId(proto.id);
      setTimeout(() => setCopiedProtoId(null), 2000);
    }
  };

  return (
    <section id="work" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>02 — Case Studies & Production Systems</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Engineered Deployments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            Enterprise platforms, verified operational backends, real-time queues, and live production portals built for permanent business reliability.
          </p>
        </div>

        {/* Filter Rail */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-touch-x no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border hairline-border cursor-pointer ${
                  isSelected
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Projects Archive Grid */}
        {filteredProjects.length === 0 ? (
          <SectionState
            variant="empty"
            title={projects.length === 0 ? 'Selected work is being published' : 'No projects in this category yet'}
            description={
              projects.length === 0
                ? 'Case studies are being prepared for publication. Please check back shortly.'
                : 'We have not published a project under this category yet. Explore the full archive instead.'
            }
            actionLabel={projects.length === 0 ? undefined : 'Show All Projects'}
            onAction={projects.length === 0 ? undefined : () => setSelectedCategory('All')}
          />
        ) : (
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const isFlagship = selectedCategory === 'All' && index === 0;

                if (isFlagship) {
                  // Flagship Project 01: High-impact editorial hero card
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      variants={cardVariants}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="col-span-1 md:col-span-2 group rounded-2xl editorial-card hover:border-[var(--accent-primary)] transition-all duration-300 p-6 sm:p-8 relative overflow-hidden"
                    >
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b hairline-border">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${getTaxonomyTier(project).badgeClass}`}>
                            {getTaxonomyTier(project).label}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-2.5 py-0.5 rounded-md border hairline-border uppercase tracking-wider">
                            FLAGSHIP 01 // {project.industry}
                          </span>
                          {project.liveUrl && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-[10px] font-mono font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              LIVE PRODUCTION
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {project.year} Architecture
                        </span>
                      </div>

                      {/* Dual-Column Split on Desktop */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Narrative & Actions */}
                        <div className="lg:col-span-7 space-y-4">
                          <h3 
                            onClick={() => setActiveProject(project)}
                            className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] cursor-pointer group-hover:text-[var(--accent-primary)] transition-colors"
                          >
                            {project.title}
                          </h3>
                          <p className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
                            {project.subtitle}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {project.shortDescription}
                          </p>

                          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-1">
                            <span className="text-xs font-bold text-[var(--text-primary)] block">Operational Friction Solved:</span>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                              {project.problem}
                            </p>
                          </div>

                          {/* Tech Stack Chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.techStack.map((tech, idx) => (
                              <span
                                key={idx}
                                className="tech-tag"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 pt-3">
                            <button
                              type="button"
                              onClick={() => setActiveProject(project)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
                            >
                              <span>Inspect Case Study</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border hairline-border bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold text-xs transition-all cursor-pointer"
                              >
                                <span>Open Live Instance</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Right: Architectural Proof & Credentials */}
                        <div className="lg:col-span-5 bg-[var(--bg-subtle)] rounded-xl border hairline-border p-5 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b hairline-border">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> System Architecture
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                              Verified
                            </span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border hairline-border flex items-center justify-center shrink-0 mt-0.5 text-[var(--accent-primary)]">
                                <Zap className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[var(--text-primary)]">Sub-50ms Stock Verification</div>
                                <p className="text-[11px] text-[var(--text-secondary)]">Redis cache with optimistic concurrency locks</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border hairline-border flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                                <Activity className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[var(--text-primary)]">Real-Time WebSocket Sync</div>
                                <p className="text-[11px] text-[var(--text-secondary)]">Zero inventory drift across 3 warehouse depots</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface)] border hairline-border flex items-center justify-center shrink-0 mt-0.5 text-purple-600">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[var(--text-primary)]">Strict Transactional Ledger</div>
                                <p className="text-[11px] text-[var(--text-secondary)]">Complete audit trail on every status transition</p>
                              </div>
                            </div>
                          </div>

                          {project.demoCredentials && (
                            <div className="pt-3 border-t hairline-border">
                              <div className="flex items-center justify-between text-xs bg-[var(--bg-surface)] px-3 py-2 rounded-lg border hairline-border font-mono">
                                <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                                  <Key className="w-3 h-3 text-[var(--accent-primary)]" />
                                  Demo: <b>{project.demoCredentials.username}</b> / <b>{project.demoCredentials.password}</b>
                                </span>
                                <span className="text-[10px] text-[var(--accent-primary)] font-bold">1-Click Test</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                // Standard Project Cards
                return (
                  <motion.div
                    key={project.id}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0, scale: 0.97 }}
                    onClick={() => setActiveProject(project)}
                    className="group cursor-pointer rounded-2xl editorial-card hover:border-[var(--accent-primary)] transition-all duration-300 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b hairline-border text-xs">
                        <span className="font-mono font-bold text-[10px] text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                          PROJECT {project.number}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getTaxonomyTier(project).badgeClass}`}>
                            {getTaxonomyTier(project).label}
                          </span>
                          {project.liveUrl && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 text-[9px] font-mono font-bold">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                          {project.title}
                        </h3>
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border hairline-border flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[#0047FF] group-hover:text-white transition-all shrink-0">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wide mb-2">
                        {project.subtitle}
                      </p>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                        {project.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t hairline-border flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[10px] font-mono text-[var(--text-muted)] self-center">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] group-hover:underline">
                        <span>Case File</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Live Rapid Prototypes Gallery */}
        <div className="pt-14 border-t hairline-border space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/60 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Live Interactive Sandbox Prototypes</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Live Functional Sandboxes
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
              Explore functional prototypes demonstrating fast interface response, clean responsive layout, and deterministic backend pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROTOTYPES_DATA.map((proto) => {
              const isCopied = copiedProtoId === proto.id;
              return (
                <div
                  key={proto.id}
                  className="rounded-2xl editorial-card hover:border-[var(--accent-primary)] p-5 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded border hairline-border">
                        {proto.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active demo online" />
                    </div>

                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      {proto.title}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {proto.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proto.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="tech-tag text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t hairline-border flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrototypeUrl(proto, e)}
                      className="p-2 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] border hairline-border transition-colors cursor-pointer text-xs"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={proto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      <span>Launch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectProject={setActiveProject}
      />
    </section>
  );
};
