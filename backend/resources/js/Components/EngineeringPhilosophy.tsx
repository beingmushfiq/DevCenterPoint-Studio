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
  Layers,
  Database,
  Lock
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';

interface PhilosophyHeader {
  badge?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_PHILOSOPHY_HEADER: PhilosophyHeader = {
  badge: '04 — Systems Architecture',
  headline: 'Engineered beyond the interface.',
  subtitle:
    'Every system built by DevCenterPoint is structured in decoupled operational tiers: deterministic data schemas, resilient queues, and verifiable security boundaries.',
};

export const EngineeringPhilosophy: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<PhilosophyHeader>('philosophy', 'header', DEFAULT_PHILOSOPHY_HEADER);
  const layers = cms.getSectionBlock('philosophy', 'layers', ARCHITECTURE_LAYERS);

  const shouldReduceMotion = useReducedMotion();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(layers[0]?.id || ARCHITECTURE_LAYERS[0].id);
  const [isManifestoExpanded, setIsManifestoExpanded] = useState<boolean>(false);

  const activeLayer = layers.find((l: any) => l.id === selectedLayerId) || layers[0] || ARCHITECTURE_LAYERS[0];

  return (
    <section id="architecture" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>{headerContent.badge || DEFAULT_PHILOSOPHY_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {headerContent.headline || DEFAULT_PHILOSOPHY_HEADER.headline}
            </h2>
          </div>

          <div className="max-w-md space-y-2">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {headerContent.subtitle || DEFAULT_PHILOSOPHY_HEADER.subtitle}
            </p>

            <button
              type="button"
              onClick={() => setIsManifestoExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isManifestoExpanded ? 'Collapse Architecture Manifesto' : 'Read Anti-Hype Engineering Manifesto'}</span>
              {isManifestoExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Architecture Manifesto */}
        <AnimatePresence>
          {isManifestoExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl editorial-card bg-[var(--bg-subtle)] space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                <p>
                  <strong className="text-[var(--text-primary)] font-bold">Why Pragmatic Architecture Out-Delivers Hyped Stacks:</strong> Most custom software projects fail not because they lacked a 15-microservice Kubernetes mesh, but because an unmonitored background worker died silently, or two browser tabs updated inventory simultaneously with no database transaction lock.
                </p>
                <p>
                  At DevCenterPoint, we reject resume-driven development. We engineer with battle-tested PHP 8.3 / Laravel 11, React Inertia.js, and PostgreSQL. It delivers deterministic ACID guarantees, sub-50ms API responses, 10x faster shipping velocity, and trivial maintenance that any competent engineer can run on a standard VPS or container.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5-Layer Stack Interactive Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Layer Selector Column (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Select Architectural Tier:
            </div>

            {layers.map((layer: any, idx: number) => {
              const isSelected = layer.id === selectedLayerId;

              return (
                <div key={layer.id} className="space-y-2">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedLayerId(layer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedLayerId(layer.id);
                      }
                    }}
                    className={`p-4 rounded-xl editorial-card cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                        : 'hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-[#0047FF] text-white'
                            : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border hairline-border'
                        }`}
                      >
                        L{layer.level}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {layer.name}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] truncate">
                          {layer.focus}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] border hairline-border text-[var(--accent-primary)] font-semibold shrink-0">
                      TIER 0{layer.level}
                    </span>
                  </div>

                  {idx < layers.length - 1 && (
                    <div className="flex justify-center text-[var(--text-muted)] my-0.5">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Layer Deep Inspection Box (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b hairline-border">
              <div>
                <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                  TIER {activeLayer.level} DEEP SPECIFICATION
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-0.5">
                  {activeLayer.name}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] border hairline-border flex items-center justify-center font-mono font-bold text-xs text-[var(--accent-primary)]">
                L{activeLayer.level}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {activeLayer.deepDive?.summary || activeLayer.subtitle}
            </p>

            {/* Mitigated Failure Modes */}
            {activeLayer.deepDive?.failureModesMitigated && (
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] block">
                  Failure Modes Mitigated:
                </span>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {activeLayer.deepDive.failureModesMitigated.map((modeText: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{modeText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Component Chips */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Production Building Blocks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeLayer.components?.map((comp: string, cIdx: number) => (
                  <span key={cIdx} className="tech-tag text-xs">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Target SLA */}
            <div className="pt-4 border-t hairline-border flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
              <span>SLA Target:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {activeLayer.deepDive?.contractSLA || activeLayer.scalabilityMetric || 'Production SLA Validated'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
