import React, { useEffect } from 'react';
import { ProjectMilestone } from '../types';
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Check,
  AlertTriangle,
  Users,
  Wrench,
  Activity,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

interface MilestoneDetailModalProps {
  milestone: ProjectMilestone | null;
  onClose: () => void;
  onSelectMilestone: (milestone: ProjectMilestone) => void;
  allMilestones: ProjectMilestone[];
  onJumpToPhase?: (phaseNum: string) => void;
}

export const MilestoneDetailModal: React.FC<MilestoneDetailModalProps> = ({
  milestone,
  onClose,
  onSelectMilestone,
  allMilestones,
  onJumpToPhase
}) => {
  const currentIndex = milestone
    ? allMilestones.findIndex((m) => m.id === milestone.id)
    : -1;

  const handleClose = () => {
    soundEngine.playModalClose();
    onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      soundEngine.playClick();
      onSelectMilestone(allMilestones[currentIndex - 1]);
    } else {
      soundEngine.playClick();
      onSelectMilestone(allMilestones[allMilestones.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < allMilestones.length - 1) {
      soundEngine.playClick();
      onSelectMilestone(allMilestones[currentIndex + 1]);
    } else {
      soundEngine.playClick();
      onSelectMilestone(allMilestones[0]);
    }
  };

  useEffect(() => {
    if (milestone) {
      soundEngine.playModalOpen();
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (milestone) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [milestone, currentIndex]);

  if (!milestone) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/75 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-modal-title"
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#151515] border border-slate-200 dark:border-[#2a2a2a] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-[#242424] bg-slate-50 dark:bg-[#121212] gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-mono font-black shadow-sm">
              {milestone.milestoneCode}
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Phase {milestone.phaseNumber} — {milestone.phaseName}
            </span>
            <span className="text-slate-300 dark:text-slate-700 font-bold hidden sm:inline">/</span>
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400 hidden sm:inline">
              Stage {currentIndex + 1} of {allMilestones.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold border border-blue-200 dark:border-blue-900/50">
              {milestone.durationWeeks}
            </span>
          </div>

          {/* Navigation & Close Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-[#1c1c1c] p-1 rounded-xl border border-slate-300 dark:border-[#282828]">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#252525] hover:text-blue-600 transition-colors cursor-pointer"
                title="Previous Milestone (Left Arrow)"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#252525] hover:text-blue-600 transition-colors cursor-pointer"
                title="Next Milestone (Right Arrow)"
                aria-label="Next Milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-[#1c1c1c] hover:bg-slate-300 dark:hover:bg-[#282828] border border-slate-300 dark:border-[#282828] text-slate-700 dark:text-gray-300 transition-colors cursor-pointer"
              title="Close (Escape)"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          
          {/* Milestone Title & Summary */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-1">
              ENGINEERING LIFECYCLE MILESTONE DOSSIER
            </div>
            <h2 id="milestone-modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {milestone.title}
            </h2>
            <div className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Project Cadence: {milestone.cadence}</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>Focus: {milestone.narrativeRole}</span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
              {milestone.narrativeSummary}
            </p>
          </div>

          {/* Impact KPI & Core Principle Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* Engineering Principle (8 cols) */}
            <div className="sm:col-span-8 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Governing Engineering Philosophy
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold italic leading-relaxed">
                  "{milestone.engineeringPhilosophy}"
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-900/40 text-[11px] text-slate-500 dark:text-gray-400 font-medium">
                Mandatory operational standard enforced across all client delivery pipelines.
              </div>
            </div>

            {/* Impact Metric Card (4 cols) */}
            <div className="sm:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#1b1b1b] border border-slate-200 dark:border-[#2b2b2b] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {milestone.impactKPI.label}
                </div>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight">
                  {milestone.impactKPI.value}
                </div>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-gray-400 mt-2 font-medium leading-snug">
                {milestone.impactKPI.context}
              </div>
            </div>
          </div>

          {/* Deep Technical Specifications & Concurrency Bounds */}
          {milestone.deepTechnicalSpecs && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-[#262626]">
                <Activity className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white">
                  Technical Architecture & Concurrency Standards
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 dark:text-gray-400 uppercase text-[10px] tracking-wider block mb-1">
                    Architectural Objective
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {milestone.deepTechnicalSpecs.architecturalObjective}
                  </p>
                </div>

                {milestone.deepTechnicalSpecs.concurrencyBenchmark && (
                  <div>
                    <span className="font-bold text-slate-500 dark:text-gray-400 uppercase text-[10px] tracking-wider block mb-1">
                      Throughput & Latency Bounds
                    </span>
                    <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">
                      {milestone.deepTechnicalSpecs.concurrencyBenchmark}
                    </p>
                  </div>
                )}
              </div>

              {milestone.deepTechnicalSpecs.complianceChecks && (
                <div className="pt-3 border-t border-slate-200/80 dark:border-[#242424]">
                  <span className="font-bold text-slate-500 dark:text-gray-400 uppercase text-[10px] tracking-wider block mb-2">
                    Automated Verification Standards
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {milestone.deepTechnicalSpecs.complianceChecks.map((check, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#333333] text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        {check}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quality Verification Gate */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-[#262626]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {milestone.engineeringGate.gateName}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Non-Negotiable Verification Gate
              </span>
            </div>

            <div className="space-y-2.5 mb-5">
              {milestone.engineeringGate.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-[#262626] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-slate-500 dark:text-gray-400 font-bold">Verification Harness:</span>
              <span className="text-blue-600 dark:text-blue-400 font-black">{milestone.engineeringGate.verificationMethod}</span>
            </div>
          </div>

          {/* Squad Ownership & Critical Failure Modes Mitigated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Squad Ownership */}
            {milestone.squadRoles && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  Accountable Squad Ownership
                </div>
                <div className="space-y-2">
                  {milestone.squadRoles.map((role, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#282828] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Failure Modes Prevented */}
            {milestone.failureModesPrevented && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Production Failure Modes Prevented
                </div>
                <div className="space-y-2">
                  {milestone.failureModesPrevented.map((failure, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#282828] text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                      <span>{failure}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools & Runtimes Used */}
          {milestone.toolsAndRuntimes && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-gray-400 flex items-center gap-1.5 mb-3">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                Verified Tooling & Delivery Runtimes
              </div>
              <div className="flex flex-wrap gap-2">
                {milestone.toolsAndRuntimes.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#2e2e2e] text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-[#242424] bg-slate-50 dark:bg-[#121212] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onJumpToPhase && (
              <button
                onClick={() => {
                  handleClose();
                  onJumpToPhase(milestone.phaseNumber);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Phase {milestone.phaseNumber} Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-[#202020] hover:bg-slate-300 dark:hover:bg-[#282828] text-slate-800 dark:text-gray-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
