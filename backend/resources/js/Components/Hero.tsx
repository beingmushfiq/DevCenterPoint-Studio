import React, { useRef } from 'react';
import { 
  ArrowUpRight, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Cpu, 
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { LiveAppSimulator } from './LiveAppSimulator';
import { HeroVideoCard } from './HeroVideoCard';
import { useCms } from '../Context/CmsContext';
import { scrollToTarget } from '../lib/lenis';

export const Hero: React.FC = () => {
  const cms = useCms();
  const heroRef = useRef<HTMLElement>(null);

  const badgeText = cms.getSetting('hero_badge_text', 'SOFTWARE STUDIO • WEB SYSTEMS & ERP');
  const headlineLine1 = cms.getSetting('hero_headline_line1', 'Custom software & ERP systems');
  const headlineLine2 = cms.getSetting('hero_headline_line2_gradient', 'engineered for real business operations.');
  const thesis = cms.getSetting(
    'hero_thesis_statement',
    'We replace fragile spreadsheets, manual WhatsApp orders, and disconnected paper workflows with robust web systems tailored to your operations. Built with Laravel, React, and PostgreSQL, delivered with 100% full source code ownership.'
  );
  const ctaPrimary = cms.getSetting('hero_cta_primary_text', 'Estimate Project Scope');
  const ctaSecondary = cms.getSetting('hero_cta_secondary_text', 'Explore Selected Work');

  const tel1Label = cms.getSetting('hero_telemetry_badge1_label', 'Source Code');
  const tel1Val = cms.getSetting('hero_telemetry_badge1_val', '100% Owned');
  const tel2Label = cms.getSetting('hero_telemetry_badge2_label', 'Core Stack');
  const tel2Val = cms.getSetting('hero_telemetry_badge2_val', 'Laravel + React');
  const tel3Label = cms.getSetting('hero_telemetry_badge3_label', 'Live Demos');
  const tel3Val = cms.getSetting('hero_telemetry_badge3_val', '7 Verified Apps');

  const whatsappNumber = cms.getSetting('whatsapp_number', '8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', "Hi DevCenterPoint, I'd like to discuss an engineering project.")
  );
  const bookingUrl = cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');
  const bookingLabel = cms.getSetting('booking_cta_label', 'Book a Consultation');
  const simulatorEnabled = cms.getSetting('simulator_enabled', 'true') !== 'false';

  const handleNavClick = (target: string) => {
    scrollToTarget(target, { offset: -70, duration: 1.0 });
  };

  const proofPillars = [
    {
      icon: Cpu,
      title: 'Workflow Discovery',
      detail: 'We audit your daily manual bottlenecks, spreadsheet drift, and communication lags before writing a single line of code.',
      badge: 'Step 01'
    },
    {
      icon: Layers,
      title: 'Relational Architecture',
      detail: 'Deterministic PostgreSQL schemas, strict transactional locking, and high-velocity Laravel + React APIs.',
      badge: 'Step 02'
    },
    {
      icon: Activity,
      title: 'Automated Operations',
      detail: 'Zero-loss queue workers, automated courier APIs (Steadfast/Paperfly), and native bKash/Nagad payment rails.',
      badge: 'Step 03'
    },
    {
      icon: ShieldCheck,
      title: 'Complete Code Ownership',
      detail: 'You receive the entire Git repository, database migrations, and Docker configs. No proprietary platform lock-in.',
      badge: 'Step 04'
    }
  ];

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative w-full flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300"
    >
      {/* Subtle drafting millimeter grid background overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 editorial-grid" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12 sm:space-y-16">
        
        {/* =========================================================================
            1. TOP EDITORIAL META ROW & HEADLINE + LAUNCH VIDEO (12-COL ASYMMETRIC GRID)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines, Thesis & Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Studio Meta Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border hairline-border bg-[var(--bg-surface)] shadow-xs">
              <span className="status-beacon-live" />
              <span className="text-xs font-mono font-medium tracking-wide text-[var(--text-secondary)]">
                {badgeText}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--accent-primary)] font-semibold border hairline-border">
                EST. 2024
              </span>
            </div>

            {/* Master Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.12]">
              {headlineLine1} <br className="hidden sm:inline" />
              <span className="text-[var(--accent-primary)]">
                {headlineLine2}
              </span>
            </h1>

            {/* Business Grounded Thesis */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {thesis}
            </p>

            {/* Tactical Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="px-6 py-3 rounded-xl bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white text-sm font-semibold flex items-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
              >
                <span>{ctaPrimary}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#work')}
                className="px-5 py-3 rounded-xl border hairline-border bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-sm font-semibold flex items-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <span>{ctaSecondary}</span>
              </button>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border hairline-border bg-[var(--bg-surface)] hover:text-emerald-600 text-[var(--text-secondary)] text-sm font-medium flex items-center gap-2 transition-colors"
                  title="Direct WhatsApp Consultation"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">WhatsApp Lead Engineer</span>
                </a>
              )}

              {bookingUrl && (
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border hairline-border bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="hidden md:inline">{bookingLabel}</span>
                </a>
              )}
            </div>

            {/* Architectural Proof Readouts */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t hairline-border text-xs font-mono text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)]">{tel1Label}:</span>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border hairline-border font-bold text-emerald-600 dark:text-emerald-400">
                  {tel1Val}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)]">{tel2Label}:</span>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border hairline-border font-bold text-[var(--text-primary)]">
                  {tel2Val}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)]">{tel3Label}:</span>
                <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border hairline-border font-bold text-[var(--accent-primary)]">
                  {tel3Val}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Cinema Card (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <HeroVideoCard />
          </div>
        </div>

        {/* =========================================================================
            2. THE CENTERPIECE: LIVE INTERACTIVE APP SIMULATOR
            ========================================================================= */}
        {simulatorEnabled && (
          <div className="w-full">
            <div className="mb-3 flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>[INTERACTIVE WORKBENCH] TEST ACTUAL ARCHITECTURAL MECHANICS</span>
              <span className="hidden sm:inline">CLICK BUTTONS BELOW TO SIMULATE ACTIONS</span>
            </div>

            <LiveAppSimulator />
          </div>
        )}

        {/* =========================================================================
            3. FOUR ARCHITECTURAL PROOF PILLARS
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {proofPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.title}
                className="p-5 rounded-2xl editorial-card flex flex-col justify-between space-y-3 group hover:border-[var(--accent-primary)] transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--accent-primary)] border hairline-border">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                    {pillar.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                    {pillar.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
