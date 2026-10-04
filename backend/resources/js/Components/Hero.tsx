import React from 'react';
import { ArrowDownRight, ArrowUpRight, MessageCircle, ShieldCheck, Sparkles, Activity, Cpu, Play } from 'lucide-react';
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
      icon: Cpu,
      title: 'Full-Stack SaaS & ERP',
      detail: 'Multi-tenant PostgreSQL backends'
    },
    {
      icon: Sparkles,
      title: 'Applied AI & Workflows',
      detail: 'Inference pipelines & fraud scoring'
    },
    {
      icon: Activity,
      title: 'Realtime Edge Architecture',
      detail: 'WebSockets & TOTP QR attendance'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Downtime Deployment',
      detail: 'Docker, CI/CD & cloud infrastructure'
    }
  ];

  return (
    <section id="hero" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-white dark:bg-[#07090e] text-slate-900 dark:text-white transition-colors duration-500">
      {/* Background Interactive Neural Canvas */}
      <HeroInteractiveCanvas />

      {/* Floating Animated Liquid Gradient Light Orbs (Visual Depth & Glow) */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 blur-[130px] rounded-full pointer-events-none animate-float-orb-1" />
      <div className="absolute top-36 right-1/4 translate-x-1/2 w-[28rem] h-[28rem] bg-purple-500/12 dark:bg-purple-600/18 blur-[150px] rounded-full pointer-events-none animate-float-orb-2" />
      <div className="absolute top-72 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-400/12 dark:bg-cyan-500/14 blur-[120px] rounded-full pointer-events-none animate-float-orb-3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          
          {/* Luminous Frosted Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass text-slate-700 dark:text-slate-200 text-xs font-semibold mb-6 shadow-sm hover:scale-[1.02] transition-transform duration-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
            </span>
            <span className="font-mono text-[11px] tracking-wider uppercase font-bold text-gradient-signature">
              Engineering Studio • Custom Systems & AI
            </span>
          </motion.div>

          {/* Main Hero Headline with Signature Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-slate-950 dark:text-white"
          >
            Digital products, <br className="hidden sm:inline" />
            <span className="text-gradient-signature">engineered properly.</span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal mb-8"
          >
            DevCenterPoint designs and builds scalable web platforms, cloud architecture, and intelligent systems tailored for businesses that cannot afford technical debt.
          </motion.p>

          {/* Primary Action Group with Liquid Polish */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            {/* Start a Project (Signature Gradient Button) */}
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-sm font-bold tracking-tight transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 flex items-center justify-center gap-2 active:scale-98 cursor-pointer ring-1 ring-white/20"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Explore Live Sandboxes (Frosted Glass CTA) */}
            <button
              type="button"
              onClick={() => scrollToSection('work')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full liquid-glass hover:bg-white/80 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" />
              <span>Explore Selected Work</span>
              <ArrowDownRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>

            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/8801988383323?text=Hi%20DevCenterPoint,%20I'd%20like%20to%20discuss%20a%20project"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playClick()}
              className="w-full sm:w-auto px-4 py-3.5 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Direct</span>
            </a>
          </motion.div>

          {/* Floating Operational Telemetry Pills Strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cluster: 7 Nodes Active</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass text-slate-600 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400 font-bold">99.99%</span>
              <span>Uptime SLA</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass text-slate-600 dark:text-slate-300">
              <span className="text-purple-600 dark:text-purple-400 font-bold">12ms</span>
              <span>Avg Latency</span>
            </div>
          </motion.div>
        </div>

        {/* Digital System Map Interactive Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-4"
        >
          <DigitalSystemMap />
        </motion.div>

        {/* Architecture & Engineering Standards (Lush 4-column glass cards) */}
        <div className="mt-14 pt-10 border-t border-slate-200/70 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {proofPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-4 rounded-2xl liquid-glass hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  </div>
                  <span>{p.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug pl-9">
                  {p.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

