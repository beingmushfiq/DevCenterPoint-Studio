import React, { useState, useEffect, useRef } from 'react';
import { PROCESS_DATA, PROJECT_MILESTONES } from '../data/process';
import { ProjectMilestone } from '../types';
import { MilestoneDetailModal } from './MilestoneDetailModal';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  Maximize2,
  Users,
  Wrench
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

type ProcessViewMode = 'timeline' | 'phases';

export const ProcessSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<ProcessViewMode>('timeline');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m0-discovery');
  const [activeModalMilestone, setActiveModalMilestone] = useState<ProjectMilestone | null>(null);
  const [activePhaseNumber, setActivePhaseNumber] = useState<string>('01');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLButtonElement>(null);

  const activeMilestoneIndex = PROJECT_MILESTONES.findIndex((m) => m.id === activeMilestoneId);
  const activeMilestone = PROJECT_MILESTONES[activeMilestoneIndex] || PROJECT_MILESTONES[0];
  const activePhase = PROCESS_DATA.find((p) => p.number === activePhaseNumber) || PROCESS_DATA[0];

  // Auto-play timeline progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveMilestoneId((prevId) => {
        const currentIndex = PROJECT_MILESTONES.findIndex((m) => m.id === prevId);
        const nextIndex = (currentIndex + 1) % PROJECT_MILESTONES.length;
        soundEngine.playTap();
        return PROJECT_MILESTONES[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Scroll active milestone into view horizontally on rail
  useEffect(() => {
    if (activeNodeRef.current && timelineRailRef.current) {
      const container = timelineRailRef.current;
      const node = activeNodeRef.current;
      const nodeLeft = node.offsetLeft;
      const nodeWidth = node.offsetWidth;
      const containerWidth = container.offsetWidth;
      
      const scrollTarget = nodeLeft - containerWidth / 2 + nodeWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }
  }, [activeMilestoneId]);

  const handleSelectMilestone = (milestone: ProjectMilestone, openModal = false) => {
    soundEngine.playTap();
    setActiveMilestoneId(milestone.id);
    if (openModal) {
      setActiveModalMilestone(milestone);
    }
  };

  const handlePrevMilestone = () => {
    soundEngine.playClick();
    const prevIndex = (activeMilestoneIndex - 1 + PROJECT_MILESTONES.length) % PROJECT_MILESTONES.length;
    setActiveMilestoneId(PROJECT_MILESTONES[prevIndex].id);
  };

  const handleNextMilestone = () => {
    soundEngine.playClick();
    const nextIndex = (activeMilestoneIndex + 1) % PROJECT_MILESTONES.length;
    setActiveMilestoneId(PROJECT_MILESTONES[nextIndex].id);
  };

  const toggleAutoPlay = () => {
    soundEngine.playClick();
    setIsAutoPlaying((prev) => !prev);
  };

  const handleJumpToPhase = (phaseNum: string) => {
    soundEngine.playClick();
    setActivePhaseNumber(phaseNum);
    setViewMode('phases');
    const phaseTarget = document.getElementById('phase-matrix-view');
    if (phaseTarget) {
      phaseTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate percentage along the rail for the progress line
  const progressPercent = (activeMilestoneIndex / (PROJECT_MILESTONES.length - 1)) * 100;

  return (
    <section id="process" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-8 border-b border-slate-200 dark:border-[#2a2a2a] gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
              06 — Lifecycle & Delivery Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              The Engineering Process
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-xs text-slate-600 dark:text-gray-400 max-w-sm font-bold uppercase tracking-wider leading-relaxed">
              Standardized milestone timeline and verification gates powering zero-regression product delivery.
            </p>

            {/* View Mode Segmented Controls */}
            <div className="flex items-center p-1 bg-slate-200/80 dark:bg-[#161616] rounded-2xl border border-slate-300 dark:border-[#2a2a2a] self-start sm:self-auto">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setViewMode('timeline');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-[#222222] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-[#333333]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-label="Milestone Timeline View"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setViewMode('phases');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'phases'
                    ? 'bg-white dark:bg-[#222222] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-[#333333]'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-label="Phases Matrix View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Phases Matrix</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* View Mode: Interactive Horizontal Milestone Timeline */}
        {viewMode === 'timeline' && (
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Horizontal Timeline Track Container */}
            <div className="bg-white dark:bg-[#141414] rounded-3xl border border-slate-200 dark:border-[#252525] p-5 sm:p-7 shadow-xl relative overflow-hidden">
              
              {/* Timeline Header & Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100 dark:border-[#222222]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Chronological Project Milestones ({activeMilestoneIndex + 1} of {PROJECT_MILESTONES.length})
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                    {activeMilestone.durationWeeks}
                  </span>
                </div>

                {/* Control Actions: Prev, Auto-Tour, Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAutoPlay}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isAutoPlaying
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-slate-100 dark:bg-[#1e1e1e] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#333333] hover:border-blue-400'
                    }`}
                    title={isAutoPlaying ? 'Pause Automated Walkthrough' : 'Play Automated Walkthrough'}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause Tour</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Auto-Tour</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a1a1a] p-1 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
                    <button
                      onClick={handlePrevMilestone}
                      className="p-1.5 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#252525] hover:text-blue-600 transition-colors cursor-pointer"
                      aria-label="Previous Milestone"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMilestone}
                      className="p-1.5 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#252525] hover:text-blue-600 transition-colors cursor-pointer"
                      aria-label="Next Milestone"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Horizontal Rail */}
              <div
                ref={timelineRailRef}
                className="overflow-x-auto pb-4 pt-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 -mx-2 px-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                <div className="relative min-w-[760px] lg:min-w-full">
                  {/* Background Progress Rail */}
                  <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 dark:bg-[#242424] rounded-full z-0">
                    {/* Active Progress Fill */}
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 rounded-full"
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  {/* Milestone Nodes */}
                  <div className="relative z-10 flex items-start justify-between">
                    {PROJECT_MILESTONES.map((milestone, idx) => {
                      const isActive = milestone.id === activeMilestoneId;
                      const isPast = idx < activeMilestoneIndex;

                      return (
                        <button
                          key={milestone.id}
                          ref={isActive ? activeNodeRef : null}
                          onClick={() => handleSelectMilestone(milestone, true)}
                          className="flex flex-col items-center text-center group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl p-1 transition-transform"
                          style={{ width: `${100 / PROJECT_MILESTONES.length}%` }}
                          title={`Click to open full technical dossier for ${milestone.milestoneCode}: ${milestone.title}`}
                          aria-label={`Milestone ${milestone.milestoneCode}: ${milestone.title}. Click to reveal deep technical modal.`}
                        >
                          {/* Node Circle */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all duration-300 relative ${
                              isActive
                                ? 'bg-blue-600 text-white ring-4 ring-blue-500/25 shadow-lg shadow-blue-500/30 scale-110'
                                : isPast
                                ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-2 border-blue-500 group-hover:scale-105'
                                : 'bg-white dark:bg-[#1a1a1a] text-slate-500 dark:text-gray-500 border-2 border-slate-300 dark:border-[#333333] group-hover:border-blue-400'
                            }`}
                          >
                            {isPast && !isActive ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              milestone.milestoneCode
                            )}

                            {/* Hover modal indicator badge */}
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] shadow-sm">
                              <Maximize2 className="w-2 h-2" />
                            </span>
                          </div>

                          {/* Node Cadence Label */}
                          <span
                            className={`mt-2.5 text-[10px] font-black uppercase tracking-wider truncate max-w-[95px] transition-colors ${
                              isActive
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 dark:text-gray-500 group-hover:text-slate-800 dark:group-hover:text-slate-300'
                            }`}
                          >
                            {milestone.durationWeeks}
                          </span>

                          {/* Node Title */}
                          <span
                            className={`text-xs font-bold leading-tight mt-0.5 max-w-[105px] line-clamp-2 transition-colors ${
                              isActive
                                ? 'text-slate-900 dark:text-white font-extrabold'
                                : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Jump Info Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#222222] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Phase Association:</span>
                  <button
                    onClick={() => handleJumpToPhase(activeMilestone.phaseNumber)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-extrabold transition-colors cursor-pointer"
                  >
                    <span>Phase {activeMilestone.phaseNumber} — {activeMilestone.phaseName}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      soundEngine.playModalOpen();
                      setActiveModalMilestone(activeMilestone);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Click any milestone to open technical modal</span>
                  </button>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Cadence: {activeMilestone.cadence}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Milestone Deep-Dive Narrative Inspector */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
                className="bg-white dark:bg-[#141414] rounded-[2.5rem] border border-slate-200 dark:border-[#252525] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
              >
                {/* Milestone Detail Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 mb-8 border-b border-slate-200 dark:border-[#262626]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono text-xs font-black">
                        {activeMilestone.milestoneCode}
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                        PHASE {activeMilestone.phaseNumber} · {activeMilestone.phaseName.toUpperCase()}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 font-bold">/</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                        {activeMilestone.narrativeRole}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {activeMilestone.title}
                    </h3>

                    <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed font-medium max-w-3xl">
                      {activeMilestone.narrativeSummary}
                    </p>

                    {/* Modal Deep Technical Dossier Trigger Button */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => {
                          soundEngine.playModalOpen();
                          setActiveModalMilestone(activeMilestone);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect Deep Technical Dossier (Modal)</span>
                      </button>
                    </div>
                  </div>

                  {/* Impact KPI Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#2e2e2e] shrink-0 min-w-[240px]">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-gray-500 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      {activeMilestone.impactKPI.label}
                    </div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                      {activeMilestone.impactKPI.value}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-1 leading-snug">
                      {activeMilestone.impactKPI.context}
                    </div>
                  </div>
                </div>

                {/* Balanced Engineering Governance & Verification Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Philosophy, Squads & Delivery Runtimes (5 cols) */}
                  <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
                    <div className="space-y-5">
                      {/* Engineering Philosophy Callout */}
                      <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-2">
                          <Cpu className="w-3.5 h-3.5" />
                          Engineering Principle
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold italic leading-relaxed">
                          "{activeMilestone.engineeringPhilosophy}"
                        </p>
                      </div>

                      {/* Accountable Squad Ownership */}
                      {activeMilestone.squadRoles && (
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#262626]">
                          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            Accountable Squad Sign-Off
                          </div>
                          <div className="space-y-2">
                            {activeMilestone.squadRoles.map((role, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-2.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200/80 dark:border-[#282828] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verified Tooling & Runtimes */}
                    {activeMilestone.toolsAndRuntimes && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#262626]">
                        <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-2">
                          <Wrench className="w-3.5 h-3.5 text-blue-500" />
                          Deployment Runtimes
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeMilestone.toolsAndRuntimes.map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#282828] text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Verification Quality Gate (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#262626]">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-[#262626]">
                        <h4 className="text-xs font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{activeMilestone.engineeringGate.gateName}</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Non-Negotiable Gate
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {activeMilestone.engineeringGate.criteria.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-gray-300 font-semibold leading-relaxed p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200/80 dark:border-[#242424]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-[#262626] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 dark:text-gray-400 font-bold">Verification: </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{activeMilestone.engineeringGate.verificationMethod}</span>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playModalOpen();
                          setActiveModalMilestone(activeMilestone);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Open Technical Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* View Mode: Phase Deep-Dive Matrix */}
        {viewMode === 'phases' && (
          <motion.div
            key="phases-view"
            id="phase-matrix-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Horizontal Phase Steps Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PROCESS_DATA.map((step, idx) => {
                const isActive = step.number === activePhaseNumber;
                return (
                  <motion.button
                    key={step.number}
                    onClick={() => {
                      soundEngine.playTap();
                      setActivePhaseNumber(step.number);
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.08,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between h-28 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 scale-[1.02]'
                        : 'bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-300 border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={`font-black ${isActive ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`}>
                        {step.number}
                      </span>
                      <span className={`text-[10px] font-bold ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-gray-500'}`}>
                        {step.timelineEst}
                      </span>
                    </div>
                    <div className="font-extrabold text-sm">{step.phase}</div>
                  </motion.button>
                );
              })}
            </div>

            {/* Phase Inspector Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
              className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-slate-200 dark:border-[#2a2a2a] p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase.number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-[#2a2a2a]">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        PHASE {activePhase.number} — {activePhase.phase.toUpperCase()}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activePhase.tagline}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] text-xs font-bold text-slate-700 dark:text-gray-300 self-start sm:self-auto">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>EST. TIMELINE: {activePhase.timelineEst}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                    {activePhase.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Activities */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Engineering Activities
                      </h4>
                      <ul className="space-y-3">
                        {activePhase.activities.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-gray-300 font-bold">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-[0_0_8px_#3b82f6]"></span>
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Deliverables */}
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a]">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-green-400" />
                        Phase Deliverables
                      </h4>
                      <ul className="space-y-3">
                        {activePhase.deliverables.map((del, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-gray-300 font-bold p-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-green-400 shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* Milestone Deep Technical Dossier Modal */}
        <MilestoneDetailModal
          milestone={activeModalMilestone}
          onClose={() => setActiveModalMilestone(null)}
          onSelectMilestone={(m) => {
            setActiveMilestoneId(m.id);
            setActiveModalMilestone(m);
          }}
          allMilestones={PROJECT_MILESTONES}
          onJumpToPhase={handleJumpToPhase}
        />
      </div>
    </section>
  );
};
