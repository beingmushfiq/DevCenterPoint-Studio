import React, { useState } from 'react';
import { CAPABILITIES_DATA } from '../data/capabilities';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Code, Cpu, Palette, Building2, ShoppingBag, Activity, Smartphone, Server, CheckCircle } from 'lucide-react';
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

  const activeCapability = CAPABILITIES_DATA.find((c) => c.id === selectedId) || CAPABILITIES_DATA[0];
  const ActiveIcon = iconMap[activeCapability.iconName] || Code;

  return (
    <section id="capabilities" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300">
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
              02 — Capabilities & Systems
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Core Capabilities
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mt-4 md:mt-0 font-bold uppercase tracking-wider">
            Interactive System Index: Select any domain to inspect engineering deliverables, tech stacks, and architectural code samples.
          </p>
        </motion.div>

        {/* Layout: Vertical Category Index (Left) + Interactive Inspector Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Vertical Category Index */}
          <div className="lg:col-span-5 space-y-3">
            {CAPABILITIES_DATA.map((item, idx) => {
              const isSelected = item.id === selectedId;
              const IconComp = iconMap[item.iconName] || Code;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedId(item.id);
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.08,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center justify-between group border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 translate-x-1 font-extrabold'
                      : 'bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-300 border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-[#222222] shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black tracking-widest ${isSelected ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`}>
                      {item.number}
                    </span>
                    <IconComp className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <span className="font-extrabold text-base tracking-tight">{item.title}</span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isSelected ? 'translate-x-1 text-white' : 'text-slate-400 dark:text-gray-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Interactive Capability Detail & Code Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-7 bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-slate-200 dark:border-[#2a2a2a] p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-[#2a2a2a]">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                        CAPABILITY {activeCapability.number}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeCapability.title}</h3>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3.5 py-1 rounded-full bg-green-500/10 text-emerald-600 dark:text-green-400 border border-green-500/20 text-[10px] font-black tracking-widest uppercase">
                    PRODUCTION READY
                  </span>
                </div>

                {/* Tagline & Description */}
                <p className="text-sm sm:text-base text-slate-900 dark:text-white font-extrabold leading-relaxed mb-4">
                  {activeCapability.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-6 font-medium">
                  {activeCapability.description}
                </p>

                {/* Grid of Key Outputs & Architecture Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 dark:bg-[#111111] p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a]">
                    <h4 className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
                      Delivered Outputs
                    </h4>
                    <ul className="space-y-2">
                      {activeCapability.keyOutputs.map((output, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-gray-300 font-bold">
                          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#111111] p-5 rounded-2xl border border-slate-200 dark:border-[#2a2a2a]">
                    <h4 className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
                      Architectural Benchmarks
                    </h4>
                    <ul className="space-y-2">
                      {activeCapability.architectureHighlights.map((arch, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-gray-300 font-bold">
                          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5 shadow-[0_0_8px_#22c55e]"></span>
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] mb-3">
                    Core Stack & Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCapability.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#2a2a2a] text-xs font-bold text-slate-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
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
