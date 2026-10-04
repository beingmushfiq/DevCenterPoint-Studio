import React, { useState } from 'react';
import { CAPABILITIES_DATA } from '../data/capabilities';
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
import { soundEngine } from '../lib/soundEngine';

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
  const [selectedId, setSelectedId] = useState<string>(CAPABILITIES_DATA[0].id);
  const [showCode, setShowCode] = useState<boolean>(false);

  const activeCapability = CAPABILITIES_DATA.find((c) => c.id === selectedId) || CAPABILITIES_DATA[0];
  const ActiveIcon = iconMap[activeCapability.iconName] || Code;

  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-neutral-100 border-t border-slate-200 dark:border-neutral-800 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-slate-200/80 dark:border-neutral-800/80 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              02 — Core Engineering Disciplines
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Studio Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-md font-medium leading-relaxed">
            From zero-defect system architecture and cloud backends to high-velocity mobile platforms and explainable AI pipelines.
          </p>
        </motion.div>

        {/* Mobile Horizontal Snap-Scroll Tabs (<lg) */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {CAPABILITIES_DATA.map((item) => {
              const isSelected = item.id === selectedId;
              const IconComp = iconMap[item.iconName] || Code;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedId(item.id);
                    setShowCode(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-600/30'
                      : 'bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800'
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
          <div className="hidden lg:block lg:col-span-5 space-y-2.5">
            {CAPABILITIES_DATA.map((item) => {
              const isSelected = item.id === selectedId;
              const IconComp = iconMap[item.iconName] || Code;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedId(item.id);
                    setShowCode(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between group border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20 translate-x-1 font-bold'
                      : 'bg-slate-50/70 dark:bg-neutral-900/60 text-slate-800 dark:text-neutral-200 border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-neutral-500'}`}>
                      {item.number}
                    </span>
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <span className="font-bold text-sm tracking-tight">{item.title}</span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? 'translate-x-0.5 text-white' : 'text-slate-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Interactive Capability Detail Inspector Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 bg-slate-50/70 dark:bg-neutral-900/60 rounded-3xl border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                      <ActiveIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        DISCIPLINE {activeCapability.number}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {activeCapability.title}
                      </h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 text-[10px] font-mono font-bold tracking-wider uppercase">
                    PRODUCTION READY
                  </span>
                </div>

                {/* Tagline & Narrative */}
                <div>
                  <p className="text-sm sm:text-base text-slate-900 dark:text-white font-bold leading-relaxed mb-2">
                    {activeCapability.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {activeCapability.description}
                  </p>
                </div>

                {/* Outputs & Architectural Benchmarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-neutral-800">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
                      Delivered Outputs
                    </h4>
                    <ul className="space-y-2">
                      {activeCapability.keyOutputs.map((output, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-neutral-300 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-neutral-800">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
                      Architectural Standards
                    </h4>
                    <ul className="space-y-2">
                      {activeCapability.architectureHighlights.map((arch, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-neutral-300 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Core Stack Pills */}
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">
                    Core Stack & Tooling
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCapability.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs font-medium text-slate-700 dark:text-neutral-300"
                      >
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
                      onClick={() => {
                        soundEngine.playTap();
                        setShowCode((prev) => !prev);
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{showCode ? 'Hide Architectural Code Sample' : 'View Architectural Code Sample'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCode ? 'rotate-180' : ''}`} />
                    </button>

                    {showCode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 bg-neutral-950 text-neutral-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed border border-neutral-800 overflow-x-auto shadow-inner"
                      >
                        <pre><code>{activeCapability.codeSample}</code></pre>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
