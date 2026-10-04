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
  Globe, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layers,
  Activity,
  Terminal,
  Key
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';
import { useCms } from '../Context/CmsContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const SelectedWorkSection: React.FC = () => {
  const cms = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copiedProtoId, setCopiedProtoId] = useState<string | null>(null);

  const projects: Project[] = (cms.projects && cms.projects.length > 0)
    ? cms.projects.map((p: any, idx: number) => ({
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
        accentColor: p.accent_color || p.accentColor || '#2E4AF9',
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
    : PROJECTS_DATA;

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
    soundEngine.playCopySuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(proto.url);
      setCopiedProtoId(proto.id);
      setTimeout(() => setCopiedProtoId(null), 2000);
    }
  };

  return (
    <section id="work" className="py-20 sm:py-28 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-neutral-100 border-t border-slate-200 dark:border-neutral-800 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-slate-200/80 dark:border-neutral-800/80 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Selected Work & Deployments
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Engineered Products
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-md font-medium leading-relaxed">
            Enterprise platforms, verified operational backends, real-time systems, and deployed live prototypes engineered with high resilience.
          </p>
        </motion.div>

        {/* Mobile Horizontal Snap-Scroll Filter Rail */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Filter:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-md shadow-blue-500/25 font-bold'
                      : 'liquid-glass text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Editorial Projects Archive Grid */}
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
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="col-span-1 md:col-span-2 group rounded-3xl liquid-glass hover:border-blue-500/60 transition-all duration-500 p-6 sm:p-9 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 uppercase tracking-wider">
                          FLAGSHIP 01 // {project.industry}
                        </span>
                        {project.liveUrl && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE PRODUCTION
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                        {project.year} Release
                      </span>
                    </div>

                    {/* Dual-Column Split on Desktop, Breathable on Mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Core Narrative & Actions */}
                      <div className="lg:col-span-7 space-y-4">
                        <h3 
                          onClick={() => {
                            soundEngine.playModalOpen();
                            setActiveProject(project);
                          }}
                          className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          {project.title}
                        </h3>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                          {project.subtitle}
                        </p>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed font-normal">
                          {project.shortDescription}
                        </p>

                        <div className="pt-2">
                          <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            <strong className="text-slate-800 dark:text-neutral-200 font-semibold">Problem:</strong> {project.problem}
                          </p>
                        </div>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-neutral-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playModalOpen();
                              setActiveProject(project);
                            }}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                          >
                            <span>Inspect Case Study</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-neutral-700 transition-all cursor-pointer"
                            >
                              <span>Open Live App</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right: Architectural Proof Card & Verification Benchmarks */}
                      <div className="lg:col-span-5 bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-900">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> System Specs
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            99.98% SLA
                          </span>
                        </div>

                        {/* Benchmarks List */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
                              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Sub-50ms Inventory Checks</div>
                              <p className="text-[11px] text-slate-500 dark:text-neutral-400">Redis cache layer with optimistic concurrency lock</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center shrink-0 mt-0.5">
                              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Real-Time WebSocket Sync</div>
                              <p className="text-[11px] text-slate-500 dark:text-neutral-400">Zero inventory drift across distributed warehouses</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 flex items-center justify-center shrink-0 mt-0.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">Audit Trail Logging</div>
                              <p className="text-[11px] text-slate-500 dark:text-neutral-400">Strict transactional ledger on every order event</p>
                            </div>
                          </div>
                        </div>

                        {/* Demo Access Pill */}
                        {project.demoCredentials && (
                          <div className="pt-3 border-t border-slate-100 dark:border-neutral-900">
                            <div className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-neutral-900 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-neutral-800">
                              <span className="font-mono text-slate-600 dark:text-neutral-400 flex items-center gap-1.5">
                                <Key className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                Demo: <code className="font-bold text-slate-800 dark:text-neutral-200">{project.demoCredentials.username}</code> / <code className="font-bold text-slate-800 dark:text-neutral-200">{project.demoCredentials.password}</code>
                              </span>
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">1-Click Test</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Standard Editorial Project Card (Projects 02–09)
              return (
                <motion.div
                  key={project.id}
                  layout
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.96 }}
                  onClick={() => {
                    soundEngine.playModalOpen();
                    setActiveProject(project);
                  }}
                  className="group cursor-pointer rounded-3xl liquid-glass hover:border-blue-500/50 transition-all duration-500 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 relative overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
                >
                  {/* Card Top Meta */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/70 dark:border-neutral-800/70 text-xs">
                      <span className="font-mono font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                        PROJECT {project.number}
                      </span>
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 text-[9px] font-mono font-bold">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-neutral-400 text-[10px] font-mono uppercase">
                          {project.industry}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-slate-600 dark:text-neutral-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 shrink-0">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3">
                      {project.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-normal mb-5 line-clamp-3">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Card Bottom: Tech Pills & View CTA */}
                  <div className="pt-4 border-t border-slate-200/70 dark:border-neutral-800/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 text-[11px] font-medium border border-slate-200 dark:border-neutral-700"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 text-[10px] font-mono">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Live Concept Demos & Rapid Prototypes Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="mt-20 pt-16 border-t border-slate-200/80 dark:border-neutral-800/80"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/60 mb-3">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Live Environments • Fast Turnaround
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Live Concept Demos & Sandbox
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-md font-medium leading-relaxed">
              Explore functional environments demonstrating fast interface velocity, clean responsive mechanics, and zero-compromise frontend craft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROTOTYPES_DATA.map((proto) => {
              const isCopied = copiedProtoId === proto.id;
              return (
                <div
                  key={proto.id}
                  className="group rounded-2xl liquid-glass hover:border-blue-500/50 p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/50">
                        {proto.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active demo online" />
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {proto.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {proto.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proto.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-white dark:bg-neutral-800 text-[10px] font-mono text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrototypeUrl(proto, e)}
                      className="p-2.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 transition-colors cursor-pointer text-xs font-medium"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={proto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Launch Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
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
