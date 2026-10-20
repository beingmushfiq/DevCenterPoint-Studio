import React from 'react';
import { motion } from 'motion/react';

export const Positioning: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Map the Broken Process',
      desc: 'We audit where your organization bleeds time and accuracy: manual data re-entry, unlinked SaaS tools, double-bookings, and spreadsheet chaos.'
    },
    {
      num: '02',
      title: 'Engineer the Custom Fix',
      desc: 'We architect tailored software, customer portals, and internal tooling engineered around how your team actually operates—never generic page templates.'
    },
    {
      num: '03',
      title: 'Automate the Repetition',
      desc: 'We wire up event-driven pipelines, automated database sync, instant alert triggers, and practical AI so operations run without human babysitting.'
    },
    {
      num: '04',
      title: 'Scale Without Headcount',
      desc: 'Your systems handle 10x the transaction volume, inventory complexity, or client inquiries with zero operational drift or linear staffing inflation.'
    }
  ];

  return (
    <section id="positioning" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Positioning Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
              01 — Operational Transformation
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
              From broken manual process <br />
              <span className="text-gradient-signature">
                to automated software engine.
              </span>
            </h2>

            <p className="text-slate-600 dark:text-gray-400 text-base leading-relaxed font-medium">
              Businesses lose thousands of productive hours to spreadsheet drift, unlinked SaaS tools, and fragmented manual handoffs. We dissect operational bottlenecks and engineer custom software that executes your workflows deterministically.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-500 dark:text-gray-500 uppercase">
                <span>ELIMINATE BOTTLENECKS</span>
                <span>•</span>
                <span>ZERO DATA LOSS</span>
                <span>•</span>
                <span>PREDICTABLE SCALE</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Grid Pillars (Outcome-Driven Bento Cards) */}
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
                className="space-y-3 p-8 rounded-[2rem] bg-white dark:bg-[#141824] border border-slate-200 dark:border-white/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-500/20 group-hover:scale-110 transition-transform">
                  {pillar.num}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {pillar.title}
                </h3>
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
