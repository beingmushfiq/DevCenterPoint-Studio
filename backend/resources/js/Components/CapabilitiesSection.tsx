import React, { useState } from 'react';
import { CAPABILITIES_DATA } from '../data/capabilities';
import { Capability } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Code, 
  Cpu, 
  Palette, 
  Building2, 
  ShoppingBag, 
  Activity, 
  Smartphone, 
  Server, 
  CheckCircle, 
  Terminal,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';
import { SectionState } from './SectionState';

const iconMap: Record<string, React.ElementType> = {
  Code2: Code,
  Cpu: Cpu,
  Palette: Palette,
  Building2: Building2,
  ShoppingBag: ShoppingBag,
  Activity: Activity,
  Smartphone: Smartphone,
  Server: Server
};

export const CapabilitiesSection: React.FC = () => {
  const cms = useCms();

  const hasCmsCapabilities = Array.isArray(cms.capabilities);

  const capabilities: Capability[] = (hasCmsCapabilities && cms.capabilities!.length > 0)
    ? cms.capabilities!.map((c: any, idx: number) => ({
        id: c.slug || String(c.id),
        number: String(idx + 1).padStart(2, '0'),
        title: c.title || c.name,
        tagline: c.tagline || '',
        description: c.description,
        keyOutputs: Array.isArray(c.features) ? c.features : (c.keyOutputs || []),
        techStack: Array.isArray(c.technologies) ? c.technologies : (c.techStack || []),
        architectureHighlights: Array.isArray(c.architecture_points) ? c.architecture_points : (c.architectureHighlights || []),
        codeSample: c.code_snippet || c.codeSample,
        iconName: c.icon_name || c.iconName || 'Code2',
      }))
    : (hasCmsCapabilities ? [] : CAPABILITIES_DATA);

  const [selectedId, setSelectedId] = useState<string>(capabilities[0]?.id || '01');
  const [showCode, setShowCode] = useState<boolean>(false);

  const activeCapability = capabilities.find((c) => c.id === selectedId) || capabilities[0];

  if (capabilities.length === 0 || !activeCapability) {
    return (
      <section id="capabilities" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionState
            variant="empty"
            title="Capabilities are being curated"
            description="Our engineering disciplines are being published right now. Please check back shortly, or reach out to discuss your project directly."
          />
        </div>
      </section>
    );
  }

  const ActiveIcon = iconMap[activeCapability.iconName] || Code;

  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>03 — Core Engineering Disciplines</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Studio Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            From zero-defect ERP system architecture and high-velocity web portals to real-time clinic queues and IoT telematics.
          </p>
        </div>

        {/* Mobile Horizontal Snap-Scroll Tabs (<lg) */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {capabilities.map((item) => {
              const isSelected = item.id === selectedId;
              const IconComp = iconMap[item.iconName] || Code;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setShowCode(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-all border hairline-border cursor-pointer ${
                    isSelected
                      ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.number} {item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Split Layout (5 cols index + 7 cols inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Vertical Category Index */}
          <div className="hidden lg:block lg:col-span-5 space-y-2">
            {capabilities.map((item) => {
              const isSelected = item.id === selectedId;
              const IconComp = iconMap[item.iconName] || Code;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setShowCode(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl editorial-card transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                      : 'hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                      {item.number}
                    </span>
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{item.title}</span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'translate-x-0.5 text-[var(--accent-primary)]' : 'text-[var(--text-muted)] opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Capability Detail Inspector Panel */}
          <div className="lg:col-span-7 rounded-2xl editorial-card p-6 sm:p-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b hairline-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border text-[var(--accent-primary)]">
                      <ActiveIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        DISCIPLINE {activeCapability.number}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
                        {activeCapability.title}
                      </h3>
                    </div>
                  </div>
                  <span className="tech-tag text-[10px] text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    PRODUCTION READY
                  </span>
                </div>

                {/* Tagline & Narrative */}
                <div className="space-y-1.5">
                  <p className="text-sm sm:text-base text-[var(--text-primary)] font-bold leading-relaxed">
                    {activeCapability.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {activeCapability.description}
                  </p>
                </div>

                {/* Outputs & Architectural Benchmarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-2">
                    <h4 className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Delivered Outputs
                    </h4>
                    <ul className="space-y-1.5">
                      {activeCapability.keyOutputs.map((output, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-2">
                    <h4 className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Architectural Standards
                    </h4>
                    <ul className="space-y-1.5">
                      {activeCapability.architectureHighlights.map((arch, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0 mt-1.5" />
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Core Stack Pills */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                    Core Stack & Tooling
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCapability.techStack.map((tech, idx) => (
                      <span key={idx} className="tech-tag text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Optional Architecture Code Snippet Viewer */}
                {activeCapability.codeSample && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCode((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{showCode ? 'Hide Architectural Snippet' : 'View Architectural Snippet'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCode ? 'rotate-180' : ''}`} />
                    </button>

                    {showCode && (
                      <div className="mt-3 bg-slate-900 text-slate-100 dark:bg-black p-4 rounded-xl font-mono text-[11px] leading-relaxed border border-slate-800 overflow-x-auto">
                        <pre><code>{activeCapability.codeSample}</code></pre>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
