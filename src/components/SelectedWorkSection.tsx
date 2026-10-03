import React, { useState } from 'react';
import { PROJECTS_DATA, PROTOTYPES_DATA } from '../data/projects';
import { Project, PrototypeDemo } from '../types';
import { CaseStudyModal } from './CaseStudyModal';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { ArrowUpRight, Filter, Eye, ExternalLink, Copy, Check, Sparkles, Globe, Layers } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const SelectedWorkSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [copiedProtoId, setCopiedProtoId] = useState<string | null>(null);

  const categories = [
    'All',
    'Business Systems',
    'Commerce Infrastructure',
    'Healthcare & Enterprise',
    'AI & Intelligent Systems',
    'Mobile & Infrastructure'
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
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
    <section id="work" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-slate-200 dark:border-[#2a2a2a]"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
              03 — Selected Work & Archives
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Engineered Products
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mt-4 md:mt-0 font-bold uppercase tracking-wider">
            Verified software systems, enterprise platforms, open-source engines, and live prototypes delivered for real-world operations.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-wrap items-center gap-2 mb-12"
        >
          <span className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playTap();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 font-black'
                  : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-400 border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Editorial Archive Grid with Staggered Entrance */}
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                whileHover={{
                  y: -6,
                  scale: 1.018,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                }}
                onMouseEnter={() => soundEngine.playTap()}
                onClick={() => {
                  soundEngine.playModalOpen();
                  setActiveProject(project);
                }}
                className="group cursor-pointer rounded-[2.5rem] bg-white dark:bg-[#161616] border border-slate-200/90 dark:border-[#262626] hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-colors duration-300 p-7 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-950/30 relative overflow-hidden"
              >
                {/* Ambient Top-Right Spotlight Glow on Hover */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-linear-to-br from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Meta Bar */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-[#262626] text-xs font-bold">
                    <span className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-[10px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping" />
                      PROJECT {project.number}
                    </span>
                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold tracking-tight">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE SYSTEM
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">
                        {project.industry} ({project.year})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2e2e2e] flex items-center justify-center text-slate-700 dark:text-gray-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-600/30">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                    {project.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Bottom Tech Pills & Revealed 'View Case Study' CTA Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-[#262626] flex flex-wrap items-center justify-between gap-3 relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 text-[11px] font-bold border border-slate-200/80 dark:border-[#2a2a2a] group-hover:border-slate-300 dark:group-hover:border-[#333333] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Sophisticated Revealed Call-To-Action Button */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white font-black text-xs uppercase tracking-wider border border-blue-200 dark:border-blue-900/50 group-hover:border-blue-600 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all duration-300 transform group-hover:translate-x-0.5">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Live Concept Demos & Rapid Prototypes Showcase Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-20 pt-16 border-t border-slate-200 dark:border-[#262626]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 mb-3">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Live Deployments • Fast Turnaround
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Live Concept Demos & Prototypes
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md font-bold uppercase tracking-wider">
              Functional concept environments and deployed web applications demonstrating our rapid prototyping and frontend execution velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROTOTYPES_DATA.map((proto) => {
              const isCopied = copiedProtoId === proto.id;
              return (
                <div
                  key={proto.id}
                  className="group rounded-3xl bg-white dark:bg-[#141414] border border-slate-200/90 dark:border-[#242424] hover:border-blue-500/50 dark:hover:border-blue-500/50 p-5 flex flex-col justify-between space-y-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        {proto.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live online" />
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {proto.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                      {proto.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proto.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1e1e1e] text-[10px] font-mono text-slate-600 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#222222] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopyPrototypeUrl(proto, e)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#252525] text-slate-600 dark:text-gray-300 transition-colors cursor-pointer text-xs font-medium"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={proto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold transition-all shadow-md shadow-blue-600/25 group-hover:scale-105"
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

      {/* Drill-down Modal with Simulated Database Deep Insights */}
      <CaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectProject={setActiveProject}
      />
    </section>
  );
};
