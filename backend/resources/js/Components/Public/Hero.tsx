import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { DigitalSystemMap } from './DigitalSystemMap';
import { DevCenterPointLogo } from './DevCenterPointLogo';
import { soundEngine } from '../lib/soundEngine';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    soundEngine.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const metrics = [
    {
      label: 'Engineered Domain',
      title: 'Full-Stack SaaS',
      subtitle: 'Multi-Tenant Backends'
    },
    {
      label: 'AI Systems',
      title: 'XGBoost & SHAP',
      subtitle: 'Explainable Predictions'
    },
    {
      label: 'Realtime Architecture',
      title: 'WebSockets & IoT',
      subtitle: 'Sub-50ms Event Sync'
    },
    {
      label: 'Deployment Target',
      title: 'Zero Downtime',
      subtitle: 'Docker & CI/CD Pipelines',
      badge: true
    }
  ];

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Subtle Accent Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          {/* Eyebrow badge with official DevCenterPoint branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-xs font-bold text-slate-700 dark:text-gray-300 mb-6 shadow-md"
          >
            <DevCenterPointLogo variant="mark-only" size="xs" />
            <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              DevCenterPoint
            </span>
            <span className="text-slate-300 dark:text-gray-700">•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px]">
              CODE . BUILD . DEPLOY . SCALE .
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.08] mb-6 text-slate-900 dark:text-white"
          >
            Digital products, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 dark:from-white dark:via-blue-100 dark:to-blue-500">
              engineered properly.
            </span>
          </motion.h1>

          {/* Supporting positioning statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium mb-8"
          >
            DevCenterPoint designs and engineers software products, intelligent systems, and digital experiences built for real-world impact and business scale.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollToSection('work')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold tracking-wide transition-all duration-300 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 border border-blue-400/30 active:scale-95 cursor-pointer"
            >
              <span>Explore Our Work</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-slate-900 dark:text-white text-sm font-extrabold tracking-wide transition-all duration-300 border border-slate-300 dark:border-[#2a2a2a] flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </motion.div>
        </div>

        {/* Digital System Map Interactive Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          className="mt-8"
        >
          <DigitalSystemMap />
        </motion.div>

        {/* Key Metrics / Verification Ticker - Bento Grid Format */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.215, 0.61, 0.355, 1]
              }}
              className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] p-6 rounded-[2rem] hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              <div className="text-[10px] text-slate-500 dark:text-gray-500 font-black uppercase tracking-[0.2em] mb-2">
                {m.label}
              </div>
              <div className={`text-xl font-extrabold ${m.badge ? 'text-emerald-600 dark:text-green-400 flex items-center gap-1.5' : 'text-slate-900 dark:text-white'}`}>
                {m.badge && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>}
                {m.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">{m.subtitle}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

