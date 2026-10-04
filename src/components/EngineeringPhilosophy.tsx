import React, { useState } from 'react';
import { ARCHITECTURE_LAYERS } from '../data/about';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ShieldCheck,
  Activity,
  Terminal,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export const EngineeringPhilosophy: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(ARCHITECTURE_LAYERS[0].id);
  const [isManifestoExpanded, setIsManifestoExpanded] = useState<boolean>(false);
  
  // Per-layer expanded state map for granular Read More management
  const [expandedLayerDetails, setExpandedLayerDetails] = useState<Record<string, boolean>>({
    [ARCHITECTURE_LAYERS[0].id]: false,
  });

  const activeLayer = ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[0];
  const isCurrentLayerExpanded = !!expandedLayerDetails[activeLayer.id];

  const handleSelectLayer = (layerId: string) => {
    soundEngine.playTap();
    setSelectedLayerId(layerId);
  };

  const handleToggleLayerDetail = (layerId: string) => {
    soundEngine.playTap();
    setExpandedLayerDetails((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const handleToggleAllLayers = (expand: boolean) => {
    soundEngine.playClick();
    const updated: Record<string, boolean> = {};
    ARCHITECTURE_LAYERS.forEach((l) => {
      updated[l.id] = expand;
    });
    setExpandedLayerDetails(updated);
  };

  const allLayersAreExpanded = ARCHITECTURE_LAYERS.every((l) => !!expandedLayerDetails[l.id]);

  return (
    <section id="architecture" className="py-28 bg-white dark:bg-[#07090e] text-slate-900 dark:text-white border-t border-slate-200/70 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      {/* Floating Ambient Light Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-8 border-b border-slate-200/80 dark:border-white/10 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 liquid-glass px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              04 — Engineering Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Built beyond the interface.
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs text-slate-600 dark:text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
              Every software product built by DevCenterPoint is backed by a 5-tier resilient architecture engineered for zero data loss, sub-100ms speeds, and high security.
            </p>

            {/* Expandable Section Manifesto Toggle */}
            <div className="mt-3">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setIsManifestoExpanded((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                aria-expanded={isManifestoExpanded}
                aria-controls="engineering-manifesto-text"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isManifestoExpanded ? 'Read Less (Collapse Thesis)' : 'Read Architectural Manifesto'}</span>
                {isManifestoExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                )}
              </button>

              <AnimatePresence>
                {isManifestoExpanded && (
                  <motion.div
                    id="engineering-manifesto-text"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3.5 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed space-y-2">
                      <p>
                        <strong className="text-slate-900 dark:text-white font-extrabold">Why multi-tier isolation matters:</strong> Most digital products fail not from bad typography, but from unhandled database locks, cascading API timeouts, and unmonitored background worker queue deaths.
                      </p>
                      <p>
                        We architect software in five decoupled tiers: each layer has an immutable contract, its own strict security boundary, dedicated failure isolation, and measurable verification metrics.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Global Controls & Density Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2">
          <div className="text-[10px] text-slate-500 dark:text-gray-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Interactive 5-Layer Stack (Click to select & focus)</span>
          </div>

          {/* Quick Density Management Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => handleToggleAllLayers(!allLayersAreExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161616] text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 font-bold transition-all text-[11px] cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{allLayersAreExpanded ? 'Collapse All Deep Dives' : 'Expand All Deep Dives'}</span>
            </button>
          </div>
        </div>

        {/* Interactive 5-Layer Stack Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Layer Stack Selector (Left - 6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {ARCHITECTURE_LAYERS.map((layer, idx) => {
              const isSelected = layer.id === selectedLayerId;
              const isExpanded = !!expandedLayerDetails[layer.id];

              return (
                <React.Fragment key={layer.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.08,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-xl shadow-blue-500/25 scale-[1.01] ring-1 ring-white/20'
                        : 'liquid-glass text-slate-800 dark:text-gray-200 hover:border-blue-400/40 shadow-xs'
                    }`}
                  >
                    {/* Primary Layer Click Target */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectLayer(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectLayer(layer.id);
                        }
                      }}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between cursor-pointer focus:outline-none"
                      aria-label={`Select Layer ${layer.level}: ${layer.name}`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center font-black text-xs border ${
                            isSelected
                              ? 'bg-white text-blue-600 border-white'
                              : 'bg-slate-100 dark:bg-[#111111] text-blue-600 dark:text-blue-400 border-slate-200 dark:border-[#2a2a2a]'
                          }`}
                        >
                          L{layer.level}
                        </div>
                        <div className="min-w-0 pr-2">
                          <div className="font-extrabold text-base truncate">{layer.name}</div>
                          <div
                            className={`text-xs truncate ${
                              isSelected ? 'text-blue-100 font-medium' : 'text-slate-500 dark:text-gray-500 font-bold'
                            }`}
                          >
                            {layer.focus}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase hidden sm:inline-block ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-green-400 border border-emerald-500/20'
                          }`}
                        >
                          ACTIVE
                        </span>

                        {/* Inline Read More Accordion Trigger */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectLayer(layer.id);
                            handleToggleLayerDetail(layer.id);
                          }}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white/10 hover:bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-[#111111] hover:bg-slate-200 dark:hover:bg-[#252525] text-slate-600 dark:text-gray-400'
                          }`}
                          title={isExpanded ? 'Collapse Layer Details' : 'Read More Layer Details'}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Left Accordion Dropdown Content (When Read More is clicked on card) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className={`border-t px-5 py-4 text-xs ${
                            isSelected
                              ? 'border-blue-400/40 bg-blue-700/50 text-blue-50'
                              : 'border-slate-100 dark:border-[#262626] bg-slate-50/80 dark:bg-[#151515] text-slate-600 dark:text-gray-400'
                          }`}
                        >
                          <div className="font-semibold leading-relaxed mb-2.5">
                            {layer.deepDive?.summary || layer.subtitle}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 dark:border-[#222222]">
                            <span className="font-mono text-[10px] uppercase font-bold opacity-80">
                              Target SLA: {layer.deepDive?.contractSLA || layer.scalabilityMetric}
                            </span>
                            <button
                              onClick={() => {
                                handleSelectLayer(layer.id);
                                const inspector = document.getElementById('layer-deep-inspector');
                                if (inspector) {
                                  inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                              }}
                              className={`text-[11px] font-black underline cursor-pointer ${
                                isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              Inspect Full Specification &rarr;
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <div className="flex justify-center my-1 text-slate-400 dark:text-gray-700">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Layer Inspector Panel (Right - 6 cols) */}
          <motion.div
            id="layer-deep-inspector"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-6 liquid-glass rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans ring-1 ring-black/5 dark:ring-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Layer Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-[#2a2a2a]">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                      LAYER {activeLayer.level} DEEP INSPECTION
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeLayer.name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/20">
                    L{activeLayer.level}
                  </div>
                </div>

                {/* Subtitle / Focus Summary */}
                <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-medium mb-4">
                  {activeLayer.subtitle}
                </p>

                {/* Expandable "Read More Deep Architecture" Section in Inspector */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#2a2a2a]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" />
                      Architectural Philosophy & Bounds
                    </span>

                    <button
                      onClick={() => handleToggleLayerDetail(activeLayer.id)}
                      className="inline-flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                      aria-expanded={isCurrentLayerExpanded}
                    >
                      <span>{isCurrentLayerExpanded ? 'Read Less' : 'Read More'}</span>
                      {isCurrentLayerExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Collapsed Preview Snippet */}
                  {!isCurrentLayerExpanded && activeLayer.deepDive && (
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {activeLayer.deepDive.summary}
                    </p>
                  )}

                  {/* Expanded Full Deep Dive Text */}
                  <AnimatePresence>
                    {isCurrentLayerExpanded && activeLayer.deepDive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#252525] space-y-4">
                          {/* Summary & Rationale */}
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1">
                              // Architectural Rationale
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {activeLayer.deepDive.summary}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2 italic bg-white dark:bg-[#1a1a1a] p-3 rounded-xl border border-slate-200/80 dark:border-[#2a2a2a]">
                              "{activeLayer.deepDive.designRationale}"
                            </p>
                          </div>

                          {/* Failure Modes Mitigated */}
                          <div>
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              Critical Failure Modes Mitigated
                            </div>
                            <ul className="space-y-1.5">
                              {activeLayer.deepDive.failureModesMitigated.map((failure, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-gray-300 font-semibold leading-relaxed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{failure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Contract SLA */}
                          <div className="pt-2 border-t border-slate-200 dark:border-[#252525] flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500 dark:text-gray-400">Strict SLA Objective:</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{activeLayer.deepDive.contractSLA}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Core Layer Components List */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
                    Engineered Components
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeLayer.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-800 dark:text-gray-300 font-bold flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                        <span className="truncate">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Protocol & Observability */}
                <div className="space-y-3 mb-2 text-xs font-medium">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a]">
                    <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-green-400" /> SECURITY & ACCESS PROTOCOL
                    </div>
                    <div className="text-slate-900 dark:text-white font-bold">{activeLayer.securityProtocol}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a]">
                    <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> OBSERVABILITY & TELEMETRY
                    </div>
                    <div className="text-slate-900 dark:text-white font-bold">{activeLayer.observability}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a]">
                    <div className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> TARGET SCALABILITY BENCHMARK
                    </div>
                    <div className="text-emerald-600 dark:text-green-400 font-black">{activeLayer.scalabilityMetric}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

