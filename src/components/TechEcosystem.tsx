import React, { useState, useRef } from 'react';
import { TECH_STACK_DATA } from '../data/technology';
import { TechItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TechIcon } from './TechIcon';
import { soundEngine } from '../lib/soundEngine';

export const TechEcosystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTech, setActiveTech] = useState<TechItem>(TECH_STACK_DATA[0]);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ['All', 'Frontend', 'Backend', 'Data', 'Infrastructure', 'Realtime', 'AI / ML'];

  const filteredTech = TECH_STACK_DATA.filter((t) => {
    if (selectedCategory === 'All') return true;
    return t.category === selectedCategory;
  });

  const handleCardMouseEnter = (item: TechItem) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredTech(item);
    setActiveTech(item);
  };

  const handleCardMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredTech(null);
    }, 220);
  };

  const handleHoverCardMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  return (
    <section
      id="tech"
      className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300"
    >
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
              05 — Technology Ecosystem
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Engineering Stack
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mt-4 md:mt-0 font-bold uppercase tracking-wider">
            Hover over any technology icon to reveal integration architecture patterns and official documentation.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
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

        {/* Layout: Interactive Tech Grid (Left) + Code & Integration Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tech Grid with Hover Expansion Cards */}
          <motion.div layout className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 relative">
            <AnimatePresence mode="popLayout">
              {filteredTech.map((item, idx) => {
                const isSelected = activeTech.name === item.name;
                const isHovered = hoveredTech?.name === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => handleCardMouseEnter(item)}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.92, y: 16 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.35,
                        delay: idx * 0.03,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      onClick={() => {
                        soundEngine.playTap();
                        setActiveTech(item);
                      }}
                      onFocus={() => {
                        setActiveTech(item);
                        setHoveredTech(item);
                      }}
                      onBlur={() => setHoveredTech(null)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex flex-col justify-between h-34 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 translate-y-[-2px]'
                          : 'bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-300 border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      {/* Top Bar: Icon + Category + Version */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl p-1.5 flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected
                                ? 'bg-white/20 border-white/30 text-white'
                                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60'
                            }`}
                          >
                            <TechIcon name={item.name} size={18} />
                          </div>
                          <span
                            className={`text-[10px] font-black tracking-wider uppercase ${
                              isSelected ? 'text-white/80' : 'text-slate-400 dark:text-gray-500'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>

                        {item.version && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-[#111111] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2a2a2a]'
                            }`}
                          >
                            {item.version.startsWith('v') || item.version.startsWith('RFC') ? item.version : `v${item.version}`}
                          </span>
                        )}
                      </div>

                      {/* Middle: Title & Role */}
                      <div className="mt-2">
                        <div className="font-extrabold text-sm tracking-tight flex items-center justify-between">
                          <span>{item.name}</span>
                          <span
                            className={`text-[10px] font-bold transition-opacity ${
                              isSelected
                                ? 'text-white/90'
                                : 'text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            Pattern &bull; Docs &rarr;
                          </span>
                        </div>
                        <div
                          className={`text-[11px] font-medium truncate mt-0.5 ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-gray-500'
                          }`}
                        >
                          {item.role}
                        </div>
                      </div>
                    </motion.button>

                    {/* EXPANDING HOVER-STATE CARD WITH INTEGRATION PATTERNS & DOCS */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={handleHoverCardMouseEnter}
                          onMouseLeave={handleCardMouseLeave}
                          className="absolute left-0 right-0 sm:left-auto sm:right-auto sm:-left-3 sm:w-96 p-5 rounded-2xl border shadow-2xl z-50 transition-colors backdrop-blur-xl pointer-events-auto top-full mt-2.5 bg-white/98 dark:bg-[#121622]/98 border-blue-500/40 text-slate-900 dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                          role="tooltip"
                        >
                          {/* Top: Icon + Heading + SLA Tag */}
                          <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/90 p-2 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                                <TechIcon name={item.name} size={24} />
                              </div>
                              <div>
                                <div className="font-black text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  {item.version && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                      v{item.version}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  {item.category} &bull; {item.role}
                                </div>
                              </div>
                            </div>

                            {item.integrationPattern.productionSLA && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                {item.integrationPattern.productionSLA}
                              </span>
                            )}
                          </div>

                          {/* Integration Pattern Details */}
                          <div className="space-y-2.5 mb-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                  Integration Pattern
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {item.integrationPattern.architectureType}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {item.integrationPattern.name}
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {item.integrationPattern.description}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/60">
                              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-blue-500" /> Production Best Practice
                              </div>
                              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                {item.integrationPattern.bestPractice}
                              </p>
                            </div>
                          </div>

                          {/* Documentation Link Button */}
                          <a
                            href={item.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-blue-600/20 group/link cursor-pointer"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                              <span className="truncate">{item.docLabel}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Deep Architectural Inspector Box (Right Column) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-slate-200 dark:border-[#2a2a2a] p-6 md:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-colors"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTech.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header with Tech Icon & Badges */}
                <div className="flex items-start justify-between pb-5 mb-5 border-b border-slate-200 dark:border-[#2a2a2a]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/90 p-2.5 flex items-center justify-center border border-slate-200 dark:border-slate-700/60 shadow-sm">
                      <TechIcon name={activeTech.name} size={30} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        {activeTech.category} SPECIFICATION
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{activeTech.name}</span>
                        {activeTech.version && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#111111] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2a2a2a]">
                            {activeTech.version.startsWith('v') || activeTech.version.startsWith('RFC') ? activeTech.version : `v${activeTech.version}`}
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-green-400 font-black text-[10px] uppercase tracking-wider border border-emerald-500/20 shrink-0">
                    VERIFIED STACK
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-700 dark:text-gray-300 mb-4">
                  Primary Role: <strong className="text-slate-900 dark:text-white font-extrabold">{activeTech.role}</strong>
                </div>

                {/* Integration Pattern Card */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      Integration Architecture
                    </div>
                    {activeTech.integrationPattern.productionSLA && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                        {activeTech.integrationPattern.productionSLA}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {activeTech.integrationPattern.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeTech.integrationPattern.description}
                  </div>

                  <div className="mt-3 pt-3 border-t border-blue-200/60 dark:border-blue-900/40 flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Best Practice:</strong> {activeTech.integrationPattern.bestPractice}
                    </span>
                  </div>
                </div>

                {/* Architectural Highlights */}
                <div className="mb-6">
                  <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2.5">
                    Architectural Highlights
                  </div>
                  <ul className="space-y-2">
                    {activeTech.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-gray-300 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Documentation Link Button */}
                <div className="pt-2">
                  <a
                    href={activeTech.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wide transition-all shadow-lg shadow-blue-600/20 group/btn cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-200" />
                      <span>Explore Official {activeTech.name} Documentation</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Audit Footer */}
            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-[#2a2a2a] text-[11px] font-bold text-slate-500 dark:text-gray-500 flex items-center justify-between">
              <span>DEVCENTERPOINT STACK AUDIT</span>
              <span className="text-emerald-600 dark:text-green-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                Passes Production Checklist
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
