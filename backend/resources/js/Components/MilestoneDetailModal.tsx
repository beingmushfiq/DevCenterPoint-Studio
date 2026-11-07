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
    onClose();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectMilestone(allMilestones[currentIndex - 1]);
    } else {
      onSelectMilestone(allMilestones[allMilestones.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < allMilestones.length - 1) {
      onSelectMilestone(allMilestones[currentIndex + 1]);
    } else {
      onSelectMilestone(allMilestones[0]);
    }
  };

  useEffect(() => {
    if (milestone) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-modal-title"
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[var(--bg-surface)] border hairline-border rounded-2xl shadow-xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-[var(--text-ink)] font-sans transition-colors duration-200">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-b hairline-border bg-[var(--bg-subtle)] gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-primary)] text-white text-xs font-mono font-bold">
              {milestone.milestoneCode}
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Phase {milestone.phaseNumber} — {milestone.phaseName}
            </span>
            <span className="text-[var(--border-hairline)] font-bold hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:inline">
              Stage {currentIndex + 1} of {allMilestones.length}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-mono text-[11px] font-bold border hairline-border">
              {milestone.durationWeeks}
            </span>
          </div>

          {/* Navigation & Close Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-[var(--bg-canvas)] p-1 rounded-lg border hairline-border">
              <button
                onClick={handlePrev}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                title="Previous Milestone (Left Arrow)"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                title="Next Milestone (Right Arrow)"
                aria-label="Next Milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-[var(--bg-canvas)] hover:bg-[var(--bg-subtle)] border hairline-border text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors cursor-pointer"
              title="Close (Escape)"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* Milestone Title & Summary */}
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              ENGINEERING LIFECYCLE MILESTONE DOSSIER
            </div>
            <h2 id="milestone-modal-title" className="text-2xl sm:text-3xl font-black text-[var(--text-ink)] tracking-tight">
              {milestone.title}
            </h2>
            <div className="mt-2 text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Project Cadence: {milestone.cadence}</span>
              <span className="text-[var(--border-hairline)]">•</span>
              <span>Focus: {milestone.narrativeRole}</span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
              {milestone.narrativeSummary}
            </p>
          </div>

          {/* Impact KPI & Core Principle Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* Engineering Principle (8 cols) */}
            <div className="sm:col-span-8 p-4 rounded-xl bg-[var(--accent-subtle)] border hairline-border flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5 mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Governing Engineering Philosophy
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-ink)] font-medium italic leading-relaxed">
                  "{milestone.engineeringPhilosophy}"
                </p>
              </div>
              <div className="mt-3 pt-3 border-t hairline-border text-[11px] text-[var(--text-muted)] font-normal">
                Standard operational discipline enforced across all client delivery pipelines.
              </div>
            </div>

            {/* Impact Metric Card (4 cols) */}
            <div className="sm:col-span-4 p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  {milestone.impactKPI.label}
                </div>
                <div className="text-2xl font-black text-[var(--accent-primary)] font-mono tracking-tight">
                  {milestone.impactKPI.value}
                </div>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-2 font-normal leading-snug">
                {milestone.impactKPI.context}
              </div>
            </div>
          </div>

          {/* Deep Technical Specifications & Concurrency Bounds */}
          {milestone.deepTechnicalSpecs && (
            <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-3">
              <div className="flex items-center gap-2 pb-2.5 border-b hairline-border">
                <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-ink)]">
                  Technical Architecture & Concurrency Standards
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-[var(--text-muted)] uppercase text-[10px] tracking-wider block mb-1">
                    Architectural Objective
                  </span>
                  <p className="font-medium text-[var(--text-ink)] leading-relaxed">
                    {milestone.deepTechnicalSpecs.architecturalObjective}
                  </p>
                </div>

                {milestone.deepTechnicalSpecs.concurrencyBenchmark && (
                  <div>
                    <span className="font-mono font-bold text-[var(--text-muted)] uppercase text-[10px] tracking-wider block mb-1">
                      Throughput & Latency Bounds
                    </span>
                    <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold leading-relaxed">
                      {milestone.deepTechnicalSpecs.concurrencyBenchmark}
                    </p>
                  </div>
                )}
              </div>

              {milestone.deepTechnicalSpecs.complianceChecks && (
                <div className="pt-3 border-t hairline-border">
                  <span className="font-mono font-bold text-[var(--text-muted)] uppercase text-[10px] tracking-wider block mb-2">
                    Automated Verification Standards
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {milestone.deepTechnicalSpecs.complianceChecks.map((check, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] border hairline-border text-[11px] font-mono font-medium text-[var(--text-ink)] flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {check}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quality Verification Gate */}
          <div className="p-5 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b hairline-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-ink)]">
                  {milestone.engineeringGate.gateName}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Non-Negotiable Verification Gate
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {milestone.engineeringGate.criteria.map((crit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--bg-surface)] border hairline-border text-xs text-[var(--text-ink)] font-medium leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t hairline-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[var(--text-muted)]">Verification Harness:</span>
              <span className="text-[var(--accent-primary)] font-bold">{milestone.engineeringGate.verificationMethod}</span>
            </div>
          </div>

          {/* Squad Ownership & Critical Failure Modes Mitigated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Squad Ownership */}
            {milestone.squadRoles && (
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
                  <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  Accountable Squad Ownership
                </div>
                <div className="space-y-1.5">
                  {milestone.squadRoles.map((role, rIdx) => (
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

            {/* Critical Failure Modes Prevented */}
            {milestone.failureModesPrevented && (
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Failure Modes Prevented
                </div>
                <div className="space-y-1.5">
                  {milestone.failureModesPrevented.map((failure, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-xs text-[var(--text-muted)] flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{failure}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tools & Runtimes Used */}
          {milestone.toolsAndRuntimes && (
            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
                <Wrench className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Verified Tooling & Delivery Runtimes
              </div>
              <div className="flex flex-wrap gap-1.5">
                {milestone.toolsAndRuntimes.map((tool, tIdx) => (
                  <span key={tIdx} className="tech-tag text-xs">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:p-6 border-t hairline-border bg-[var(--bg-subtle)] flex flex-wrap items-center justify-between gap-3">
          <div>
            {onJumpToPhase && (
              <button
                onClick={() => {
                  handleClose();
                  onJumpToPhase(milestone.phaseNumber);
                }}
                className="editorial-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold cursor-pointer"
              >
                <span>View Phase {milestone.phaseNumber} Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border hairline-border text-[var(--text-ink)] font-bold text-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
