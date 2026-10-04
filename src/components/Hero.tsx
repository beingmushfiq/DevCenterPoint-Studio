import React from 'react';
import { ArrowDownRight, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { DigitalSystemMap } from './DigitalSystemMap';
import { HeroInteractiveCanvas } from './HeroInteractiveCanvas';
import { soundEngine } from '../lib/soundEngine';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    soundEngine.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const proofPillars = [
    {
      title: 'Full-Stack SaaS & ERP',
      detail: 'Multi-tenant PostgreSQL backends'
    },
    {
      title: 'Applied AI & Workflows',
      detail: 'Inference pipelines & fraud scoring'
    },
    {
      title: 'Realtime Edge Architecture',
      detail: 'WebSockets & TOTP QR attendance'
    },
    {
      title: 'Zero-Downtime Deployment',
      detail: 'Docker, CI/CD & cloud infrastructure'
    }
  ];

  return (
    <section id="hero" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Interactive Neural Canvas */}
      <HeroInteractiveCanvas />

      {/* Subtle Ambient Light Wash */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-160 h-80 bg-blue-600/6 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          
          {/* Editorial Eyebrow Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#181818] border border-slate-200/80 dark:border-[#262626] text-slate-600 dark:text-slate-300 text-xs font-semibold mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="font-mono text-[11px] tracking-wide uppercase">
              Engineering Studio • Custom Systems & AI
            </span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-slate-950 dark:text-white"
          >
            Digital products, <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-500">engineered properly.</span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal mb-8"
          >
            DevCenterPoint designs and builds scalable web platforms, cloud architecture, and intelligent systems tailored for businesses that cannot afford technical debt.
          </motion.p>

          {/* Primary Action Group */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold tracking-tight transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('work')}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all border border-slate-200/80 dark:border-[#2a2a2a] flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Explore Selected Work</span>
              <ArrowDownRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            <a
              href="https://wa.me/8801988383323?text=Hi%20DevCenterPoint,%20I'd%20like%20to%20discuss%20a%20project"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="w-full sm:w-auto px-4 py-3 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Direct</span>
            </a>
          </motion.div>
        </div>

        {/* Digital System Map Interactive Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-6"
        >
          <DigitalSystemMap />
        </motion.div>

        {/* Architecture & Engineering Standards (Clean 4-column strip) */}
        <div className="mt-12 pt-10 border-t border-slate-200/70 dark:border-[#1f1f1f] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {proofPillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{p.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {p.detail}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
