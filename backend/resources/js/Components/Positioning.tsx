import React from 'react';
import { motion } from 'motion/react';

export const Positioning: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Product Strategy & Discovery',
      desc: 'We interrogate requirements before writing code, mapping entity relationships, API boundaries, and operational logic to eliminate downstream friction.'
    },
    {
      num: '02',
      title: 'High-Density UX/UI',
      desc: 'Interfaces engineered for speed, high contrast, and minimal cognitive load, prioritizing fast workflows and keyboard-navigable controls over visual noise.'
    },
    {
      num: '03',
      title: 'Resilient Full-Stack Core',
      desc: 'Clean, typed architectures using React, Next.js, Laravel, Node.js, and PostgreSQL built with atomic transactions and sub-100ms response targets.'
    },
    {
      num: '04',
      title: 'AI & Automation Workflows',
      desc: 'Embedding explainable machine learning models (XGBoost / SHAP), real-time WebSockets, and intelligent automation into everyday business systems.'
    }
  ];

  return (
    <section id="positioning" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
              01 — Product Philosophy
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
              We build systems, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-800 dark:from-white dark:via-gray-300 dark:to-gray-600">
                not just screens.
              </span>
            </h2>

            <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed font-medium">
              Software is rarely limited by visual mockups. Real product success depends on how gracefully your backend scales under load, how safely your database stores transactions, and how intuitively your interface serves user intent.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-500 dark:text-gray-500 uppercase">
                <span>ARCHITECTURAL INTEGRITY</span>
                <span>•</span>
                <span>LONG-TERM MAINTAINABILITY</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Grid Pillars (Bento Cards) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                className="space-y-3 p-8 rounded-[2rem] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/20">
                  {pillar.num}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

