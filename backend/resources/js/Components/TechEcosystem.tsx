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
import { useCms } from '../Context/CmsContext';

interface TechEcosystemHeader {
  badge?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_TECH_HEADER: TechEcosystemHeader = {
  badge: '05 — Technology Ecosystem',
  headline: 'Engineering Stack & Local Rails',
  subtitle:
    'Battle-tested technologies selected for long-term operational stability, high-velocity maintenance, and native local payment/courier integration.',
};

export const TechEcosystem: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<TechEcosystemHeader>('tech_ecosystem', 'header', DEFAULT_TECH_HEADER);
  const techStack = cms.getSectionBlock<TechItem[]>('tech_ecosystem', 'stack_items', TECH_STACK_DATA);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTech, setActiveTech] = useState<TechItem>(techStack[0] || TECH_STACK_DATA[0]);
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(techStack.map((t) => t.category)));
    return ['All', ...cats];
  }, [techStack]);

  const filteredTech = techStack.filter((t) => {
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
    }, 200);
  };

  return (
    <section
      id="tech"
      className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>{headerContent.badge || DEFAULT_TECH_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {headerContent.headline || DEFAULT_TECH_HEADER.headline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            {headerContent.subtitle || DEFAULT_TECH_HEADER.subtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border hairline-border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout: Interactive Tech Grid (Left) + Code & Integration Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tech Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 relative">
            {filteredTech.map((item) => {
              const isSelected = activeTech.name === item.name;

              return (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => handleCardMouseEnter(item)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTech(item)}
                    className={`w-full text-left p-4 rounded-xl editorial-card transition-all flex flex-col justify-between h-32 cursor-pointer focus:outline-none ${
                      isSelected
                        ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                        : 'hover:border-[var(--border-strong)]'
                    }`}
                  >
                    {/* Top Bar: Icon + Category + Version */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-subtle)] border hairline-border p-1 flex items-center justify-center shrink-0">
                          <TechIcon name={item.name} size={16} />
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      {item.version && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] border hairline-border text-[var(--text-secondary)]">
                          {item.version.startsWith('v') ? item.version : `v${item.version}`}
                        </span>
                      )}
                    </div>

                    {/* Middle: Title & Role */}
                    <div className="mt-2">
                      <div className="font-bold text-sm text-[var(--text-primary)] flex items-center justify-between">
                        <span>{item.name}</span>
                        <ArrowUpRight className={`w-3.5 h-3.5 text-[var(--accent-primary)] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                        {item.role}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Deep Architectural Inspector Box (Right Column 5 cols) */}
          <div className="lg:col-span-5 rounded-2xl editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b hairline-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border hairline-border p-2 flex items-center justify-center shrink-0">
                  <TechIcon name={activeTech.name} size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                    {activeTech.category} SPECIFICATION
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span>{activeTech.name}</span>
                    {activeTech.version && (
                      <span className="text-xs font-mono font-normal text-[var(--text-muted)]">
                        v{activeTech.version}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <span className="tech-tag text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                VERIFIED STACK
              </span>
            </div>

            <div className="text-xs font-semibold text-[var(--text-secondary)]">
              Operational Role: <span className="text-[var(--text-primary)] font-bold">{activeTech.role}</span>
            </div>

            {/* Integration Pattern Card */}
            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--accent-primary)] font-bold flex items-center gap-1.5 uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  Integration Architecture
                </span>
                {activeTech.integrationPattern.productionSLA && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {activeTech.integrationPattern.productionSLA}
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-[var(--text-primary)]">
                {activeTech.integrationPattern.name}
              </div>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {activeTech.integrationPattern.description}
              </div>

              <div className="pt-2 border-t hairline-border text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <b>Production Pattern:</b> {activeTech.integrationPattern.bestPractice}
                </span>
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                Engineering Highlights:
              </span>
              <ul className="space-y-1.5">
                {activeTech.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Documentation Link */}
            <div className="pt-2 border-t hairline-border flex items-center justify-between text-xs">
              <a
                href={activeTech.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-semibold hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Official {activeTech.name} Docs</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Production Tested
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
