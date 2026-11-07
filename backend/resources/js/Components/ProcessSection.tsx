import React, { useState, useEffect, useRef } from 'react';
import { PROCESS_DATA, PROJECT_MILESTONES } from '../data/process';
import { ProjectMilestone } from '../types';
import { MilestoneDetailModal } from './MilestoneDetailModal';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  ArrowRight,
  Activity,
  Maximize2,
  Users,
  Wrench
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';

type ProcessViewMode = 'timeline' | 'phases';

interface ProcessHeaderContent {
  badge?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_PROCESS_HEADER: ProcessHeaderContent = {
  badge: '06 — Lifecycle & Delivery Architecture',
  headline: 'The Engineering Process',
  subtitle: 'Standardized milestone timeline and verification gates powering zero-regression product delivery.',
};

export const ProcessSection: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<ProcessHeaderContent>('process', 'header', DEFAULT_PROCESS_HEADER);
  const milestones = cms.getSectionBlock<ProjectMilestone[]>('process', 'milestones', PROJECT_MILESTONES);
  const phases = cms.getSectionBlock('process', 'phases', PROCESS_DATA);

  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<ProcessViewMode>('timeline');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(() => milestones[0]?.id || 'm0-discovery');
  const [activeModalMilestone, setActiveModalMilestone] = useState<ProjectMilestone | null>(null);
  const [activePhaseNumber, setActivePhaseNumber] = useState<string>('01');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLButtonElement>(null);

  const activeMilestoneIndex = Math.max(0, milestones.findIndex((m) => m.id === activeMilestoneId));
  const activeMilestone = milestones[activeMilestoneIndex] || milestones[0] || PROJECT_MILESTONES[0];
  const activePhase = phases.find((p) => p.number === activePhaseNumber) || phases[0] || PROCESS_DATA[0];

  // Auto-play timeline progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveMilestoneId((prevId) => {
        const currentIndex = milestones.findIndex((m) => m.id === prevId);
        const nextIndex = (currentIndex + 1) % milestones.length;
        return milestones[nextIndex]?.id || prevId;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, milestones]);

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
    setActiveMilestoneId(milestone.id);
    if (openModal) {
      setActiveModalMilestone(milestone);
    }
  };

  const handlePrevMilestone = () => {
    const prevIndex = (activeMilestoneIndex - 1 + milestones.length) % milestones.length;
    setActiveMilestoneId(milestones[prevIndex].id);
  };

  const handleNextMilestone = () => {
    const nextIndex = (activeMilestoneIndex + 1) % milestones.length;
    setActiveMilestoneId(milestones[nextIndex].id);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const handleJumpToPhase = (phaseNum: string) => {
    setActivePhaseNumber(phaseNum);
    setViewMode('phases');
    const phaseTarget = document.getElementById('phase-matrix-view');
    if (phaseTarget) {
      phaseTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate percentage along the rail for the progress line
  const progressPercent = milestones.length > 1 ? (activeMilestoneIndex / (milestones.length - 1)) * 100 : 0;

  return (
    <section id="process" className="py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span>{headerContent.badge || DEFAULT_PROCESS_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-ink)]">
              {headerContent.headline || DEFAULT_PROCESS_HEADER.headline}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm font-medium leading-relaxed">
              {headerContent.subtitle || DEFAULT_PROCESS_HEADER.subtitle}
            </p>

            {/* View Mode Segmented Controls */}
            <div className="flex items-center p-1 bg-[var(--bg-subtle)] rounded-xl border hairline-border self-start sm:self-auto">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-xs border hairline-border'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
                aria-label="Milestone Timeline View"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
              <button
                onClick={() => setViewMode('phases')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'phases'
                    ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-xs border hairline-border'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
                aria-label="Phases Matrix View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Phases Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Interactive Horizontal Milestone Timeline */}
        {viewMode === 'timeline' && (
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Horizontal Timeline Track Container */}
            <div className="editorial-card p-5 sm:p-7 relative overflow-hidden">
              
              {/* Timeline Header & Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b hairline-border">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--text-ink)]">
                    Chronological Milestones ({activeMilestoneIndex + 1} of {milestones.length})
                  </span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] border hairline-border">
                    {activeMilestone.durationWeeks}
                  </span>
                </div>

                {/* Control Actions: Prev, Auto-Tour, Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAutoPlay}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border hairline-border cursor-pointer ${
                      isAutoPlaying
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
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

                  <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-lg border hairline-border">
                    <button
                      onClick={handlePrevMilestone}
                      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                      aria-label="Previous Milestone"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMilestone}
                      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
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
                className="overflow-x-auto pb-4 pt-3 scrollbar-thin -mx-2 px-2"
                style={{ scrollbarWidth: 'thin' }}
              >
                <div className="relative min-w-[760px] lg:min-w-full">
                  {/* Background Progress Rail */}
                  <div className="absolute top-5 left-6 right-6 h-0.5 bg-[var(--border-hairline)] z-0">
                    {/* Active Progress Fill */}
                    <motion.div
                      className="h-full bg-[var(--accent-primary)]"
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    />
                  </div>

                  {/* Milestone Nodes */}
                  <div className="relative z-10 flex items-start justify-between">
                    {milestones.map((milestone, idx) => {
                      const isActive = milestone.id === activeMilestoneId;
                      const isPast = idx < activeMilestoneIndex;

                      return (
                        <button
                          key={milestone.id}
                          ref={isActive ? activeNodeRef : null}
                          onClick={() => handleSelectMilestone(milestone, true)}
                          className="flex flex-col items-center text-center group cursor-pointer focus:outline-none p-1 transition-transform"
                          style={{ width: `${100 / milestones.length}%` }}
                          title={`Click to open technical dossier for ${milestone.milestoneCode}: ${milestone.title}`}
                        >
                          {/* Node Circle */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all duration-200 relative ${
                              isActive
                                ? 'bg-[var(--accent-primary)] text-white shadow-md scale-110'
                                : isPast
                                ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] border-2 border-[var(--accent-primary)]'
                                : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border hairline-border group-hover:border-[var(--accent-primary)]'
                            }`}
                          >
                            {isPast && !isActive ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              milestone.milestoneCode
                            )}

                            {/* Hover modal indicator badge */}
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px]">
                              <Maximize2 className="w-2 h-2" />
                            </span>
                          </div>

                          {/* Node Cadence Label */}
                          <span
                            className={`mt-2 text-[10px] font-mono font-bold uppercase tracking-wider truncate max-w-[95px] transition-colors ${
                              isActive
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {milestone.durationWeeks}
                          </span>

                          {/* Node Title */}
                          <span
                            className={`text-xs font-bold leading-tight mt-0.5 max-w-[105px] line-clamp-2 transition-colors ${
                              isActive
                                ? 'text-[var(--text-ink)] font-black'
                                : 'text-[var(--text-muted)] group-hover:text-[var(--text-ink)]'
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
              <div className="mt-4 pt-4 border-t hairline-border flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-ink)]">Phase Association:</span>
                  <button
                    onClick={() => handleJumpToPhase(activeMilestone.phaseNumber)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold transition-colors cursor-pointer"
                  >
                    <span>Phase {activeMilestone.phaseNumber} — {activeMilestone.phaseName}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalMilestone(activeMilestone)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-primary)] hover:underline cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Open technical modal</span>
                  </button>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>Cadence: {activeMilestone.cadence}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Milestone Deep-Dive Narrative Inspector */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="editorial-card p-6 sm:p-8 lg:p-10 relative overflow-hidden"
              >
                {/* Milestone Detail Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 mb-8 border-b hairline-border">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-white font-mono text-xs font-black">
                        {activeMilestone.milestoneCode}
                      </span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        PHASE {activeMilestone.phaseNumber} · {activeMilestone.phaseName.toUpperCase()}
                      </span>
                      <span className="text-[var(--border-hairline)] font-bold">/</span>
                      <span className="text-xs font-semibold text-[var(--text-muted)]">
                        {activeMilestone.narrativeRole}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-ink)] tracking-tight">
                      {activeMilestone.title}
                    </h3>

                    <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal max-w-3xl">
                      {activeMilestone.narrativeSummary}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => setActiveModalMilestone(activeMilestone)}
                        className="editorial-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect Full Technical Dossier</span>
                      </button>
                    </div>
                  </div>

                  {/* Impact KPI Card */}
                  <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border shrink-0 min-w-[220px]">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {activeMilestone.impactKPI.label}
                    </div>
                    <div className="text-2xl font-black text-[var(--accent-primary)] font-mono">
                      {activeMilestone.impactKPI.value}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1 leading-snug">
                      {activeMilestone.impactKPI.context}
                    </div>
                  </div>
                </div>

                {/* Balanced Engineering Governance & Verification Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Philosophy, Squads & Delivery Runtimes (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Engineering Philosophy Callout */}
                      <div className="p-4 rounded-xl bg-[var(--accent-subtle)] border hairline-border">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5 mb-2">
                          <Cpu className="w-3.5 h-3.5" />
                          Engineering Principle
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-ink)] font-medium italic leading-relaxed">
                          "{activeMilestone.engineeringPhilosophy}"
                        </p>
                      </div>

                      {/* Accountable Squad Ownership */}
                      {activeMilestone.squadRoles && (
                        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-3">
                            <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                            Accountable Squad Sign-Off
                          </div>
                          <div className="space-y-1.5">
                            {activeMilestone.squadRoles.map((role, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-xs font-semibold text-[var(--text-ink)] flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                                <span>{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verified Tooling & Runtimes */}
                    {activeMilestone.toolsAndRuntimes && (
                      <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2">
                          <Wrench className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          Deployment Runtimes
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeMilestone.toolsAndRuntimes.map((tool, tIdx) => (
                            <span key={tIdx} className="tech-tag text-[11px]">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Verification Quality Gate (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b hairline-border">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-ink)] flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{activeMilestone.engineeringGate.gateName}</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Non-Negotiable Gate
                        </span>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {activeMilestone.engineeringGate.criteria.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-ink)] font-medium leading-relaxed p-2.5 rounded-lg bg-[var(--bg-surface)] border hairline-border">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t hairline-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div>
                        <span className="text-[var(--text-muted)]">Verification: </span>
                        <span className="text-[var(--accent-primary)] font-bold">{activeMilestone.engineeringGate.verificationMethod}</span>
                      </div>

                      <button
                        onClick={() => setActiveModalMilestone(activeMilestone)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)] hover:underline cursor-pointer"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Horizontal Phase Steps Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PROCESS_DATA.map((step) => {
                const isActive = step.number === activePhaseNumber;
                return (
                  <button
                    key={step.number}
                    onClick={() => setActivePhaseNumber(step.number)}
                    className={`p-4 rounded-xl text-left transition-all border hairline-border flex flex-col justify-between h-28 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                        : 'editorial-card hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className={isActive ? 'text-white' : 'text-[var(--text-muted)]'}>
                        {step.number}
                      </span>
                      <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-[var(--text-muted)]'}`}>
                        {step.timelineEst}
                      </span>
                    </div>
                    <div className="font-bold text-sm leading-tight">{step.phase}</div>
                  </button>
                );
              })}
            </div>

            {/* Phase Inspector Card */}
            <div className="editorial-card p-6 md:p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b hairline-border">
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        PHASE {activePhase.number} — {activePhase.phase.toUpperCase()}
                      </div>
                      <h3 className="text-2xl font-black text-[var(--text-ink)] mt-1">{activePhase.tagline}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border hairline-border text-xs font-mono font-semibold text-[var(--text-muted)] self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>TIMELINE: {activePhase.timelineEst}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8 font-normal">
                    {activePhase.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Core Activities */}
                    <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
                        <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        Engineering Activities
                      </h4>
                      <ul className="space-y-2.5">
                        {activePhase.activities.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-ink)] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Deliverables */}
                    <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Phase Deliverables
                      </h4>
                      <ul className="space-y-2">
                        {activePhase.deliverables.map((del, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--text-ink)] font-semibold p-2.5 rounded-lg bg-[var(--bg-surface)] border hairline-border">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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
          allMilestones={milestones}
          onJumpToPhase={handleJumpToPhase}
        />
      </div>
    </section>
  );
};
