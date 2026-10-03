import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { InquiryFormData } from '../types';
import { submitProjectInquiry } from '../lib/firebase';
import { soundEngine } from '../lib/soundEngine';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Globe,
  Smartphone,
  Cpu,
  Layers,
  Calendar,
  Lock,
  MessageSquare,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  {
    id: 'SaaS / Web Product',
    label: 'Web & SaaS Platform',
    description: 'Modern customer portals, web apps & high-converting platforms',
    icon: Globe,
  },
  {
    id: 'Mobile Application',
    label: 'Mobile Application',
    description: 'Native-feel iOS & Android apps with offline sync & push alerts',
    icon: Smartphone,
  },
  {
    id: 'AI & Machine Learning',
    label: 'AI & Smart Workflows',
    description: 'Intelligent automation, AI copilots & data intelligence',
    icon: Cpu,
  },
  {
    id: 'Enterprise ERP / POS',
    label: 'Enterprise Modernization',
    description: 'Legacy refactoring, performance scaling & dedicated squad',
    icon: Layers,
  },
];

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT';

interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  BDT: { code: 'BDT', symbol: '৳', name: 'BDT', flag: '🇧🇩' },
};

interface BudgetTier {
  id: string;
  label: string;
  prices: Record<CurrencyCode, string>;
  speed: string;
  squad: string;
  sla: string;
  recommendedFor: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'mvp',
    label: 'Core Launch / MVP',
    prices: {
      USD: '$8,000 – $15,000',
      EUR: '€7,500 – €14,000',
      GBP: '£6,200 – £11,700',
      BDT: '৳9,60,000 – ৳18,00,000',
    },
    speed: '4 – 6 Weeks',
    squad: '1 Principal Architect + 1 Senior Engineer',
    sla: '99.9% Uptime Guarantee',
    recommendedFor: 'Early-stage founders validating market fit with production-grade stability'
  },
  {
    id: 'scale',
    label: 'Growth & Scale Platform',
    prices: {
      USD: '$15,000 – $35,000',
      EUR: '€14,000 – €32,500',
      GBP: '£11,700 – £27,300',
      BDT: '৳18,00,000 – ৳42,00,000',
    },
    speed: '8 – 12 Weeks',
    squad: '1 Architect + 2 Fullstack Engineers + 1 QA Specialist',
    sla: 'Zero-Downtime Migration & SOC2 Ready',
    recommendedFor: 'Scaling businesses modernizing legacy workflows or launching multi-tenant apps'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Distributed Core',
    prices: {
      USD: '$35,000 – $75,000+',
      EUR: '€32,500 – €70,000+',
      GBP: '£27,300 – £58,500+',
      BDT: '৳42,00,000 – ৳90,00,000+',
    },
    speed: 'Phased Milestones',
    squad: 'Dedicated Cross-Functional Squad & DevSecOps Lead',
    sla: 'Sub-35ms Global Edge & 24/7 Dedicated On-Call',
    recommendedFor: 'Complex omnichannel ERPs, fintech rails, or high-throughput real-time pipelines'
  },
  {
    id: 'advisory',
    label: 'Architecture RFC & Audit',
    prices: {
      USD: '$4,000 – $8,000',
      EUR: '€3,700 – €7,500',
      GBP: '£3,100 – £6,200',
      BDT: '৳4,80,000 – ৳9,60,000',
    },
    speed: '1 – 2 Weeks',
    squad: 'Principal Cloud & Security Architect',
    sla: 'Comprehensive Blueprint & Threat Model',
    recommendedFor: 'Teams needing external code audit, cloud cost reduction, or architectural RFC'
  }
];

const KICKOFF_PRESETS = [
  { id: 'immediate', label: 'Within 7 Days', note: 'Fast-track onboarding' },
  { id: 'month', label: 'Within 30 Days', note: 'Standard Q4 roadmap' },
  { id: 'quarter', label: 'Next Quarter', note: 'Strategic planned kickoff' },
  { id: 'custom', label: 'Specific Date', note: 'Pick target calendar date' },
];

const TIMELINE_OPTIONS = [
  { id: '1 - 2 Months', label: 'Fast-Track (1–2 Months)', note: 'Rapid MVP or urgent sprint' },
  { id: '2 - 3 Months', label: 'Standard (2–3 Months)', note: 'Recommended production cycle' },
  { id: '3+ Months', label: 'Flexible / Phased Build', note: 'Longer roadmap or enterprise scope' },
];

export const ProjectInquiryBuilder: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedTierId, setSelectedTierId] = useState<string>('scale');
  const [kickoffPreset, setKickoffPreset] = useState<string>('month');
  const [customKickoffDate, setCustomKickoffDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; referenceNumber: string } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const triggerConfettiExplosion = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
      });
    } catch {
      // Graceful fallback if confetti fails
    }
  };

  const handleCopyReference = (refNum: string) => {
    soundEngine.playCopySuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refNum);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Smart default options pre-selected for instant clarity & high conversion
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'SaaS / Web Product',
    budgetRange: `Growth & Scale Platform (${BUDGET_TIERS[1].prices.USD})`,
    timeline: '2 - 3 Months',
    targetKickoff: 'Within 30 Days',
    description: '',
    selectedTech: [],
  });

  const activeTier = BUDGET_TIERS.find((t) => t.id === selectedTierId) || BUDGET_TIERS[1];

  const handleCurrencyChange = (curr: CurrencyCode) => {
    soundEngine.playTap();
    setCurrency(curr);
    setFormData((prev) => ({
      ...prev,
      budgetRange: `${activeTier.label} (${activeTier.prices[curr]})`,
    }));
  };

  const handleTierSelect = (tier: BudgetTier) => {
    soundEngine.playTap();
    setSelectedTierId(tier.id);
    setFormData((prev) => ({
      ...prev,
      budgetRange: `${tier.label} (${tier.prices[currency]})`,
    }));
  };

  const handleKickoffSelect = (presetId: string, label: string) => {
    soundEngine.playTap();
    setKickoffPreset(presetId);
    if (presetId !== 'custom') {
      setFormData((prev) => ({ ...prev, targetKickoff: label }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTap();

    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmissionError('Please provide your name and work email address.');
      soundEngine.playTap();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmissionError('Please provide a valid email address.');
      soundEngine.playTap();
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const finalKickoff = kickoffPreset === 'custom' && customKickoffDate
      ? `Target Date: ${customKickoffDate}`
      : formData.targetKickoff || 'Within 30 Days';

    try {
      const result = await submitProjectInquiry({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company?.trim() || '',
        description: formData.description.trim(),
        budgetRange: formData.budgetRange || `${activeTier.label} (${activeTier.prices[currency]})`,
        targetKickoff: finalKickoff,
      });

      setSubmissionSuccess(result);
      setSubmitted(true);
      soundEngine.playSuccessChime();
      soundEngine.playSparkleCelebration();
      triggerConfettiExplosion();
    } catch (err: unknown) {
      soundEngine.playTap();
      const msg = err instanceof Error ? err.message : 'Unable to submit your inquiry at this moment.';
      if (msg.includes('Firestore Error') || msg.startsWith('{')) {
        setSubmissionError('Unable to transmit inquiry. Please check your connection or email hello@devcenterpoint.com.');
      } else {
        setSubmissionError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    soundEngine.playClick();
    setSubmitted(false);
    setSubmissionSuccess(null);
    setSubmissionError(null);
    setSelectedTierId('scale');
    setKickoffPreset('month');
    setCustomKickoffDate('');
    setFormData({
      name: '',
      email: '',
      company: '',
      projectType: 'SaaS / Web Product',
      budgetRange: 'Growth & Scale Platform ($15,000 – $35,000)',
      timeline: '2 - 3 Months',
      targetKickoff: 'Within 30 Days',
      description: '',
      selectedTech: [],
    });
  };

  return (
    <section
      id="contact"
      aria-label="Project Collaboration & Consultation"
      className="py-24 bg-slate-50 dark:bg-[#0c0c0c] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#222222] relative transition-colors duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/40 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>08 — Project Collaboration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
            Have a product worth building? <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-500">Let's map out the solution.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
            Select your project focus and desired timeline below. Our principal architects will review your goals and deliver a comprehensive roadmap within 24 hours.
          </p>
        </div>

        {/* Submission Error Banner */}
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs font-semibold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>{submissionError}</div>
          </motion.div>
        )}

        {submitted && submissionSuccess ? (
          /* High-Trust Success Card */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#141414] border border-emerald-500/30 shadow-2xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <Check className="w-3.5 h-3.5" />
                <span>Inquiry Transmitted Successfully</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                We've received your project brief
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium leading-relaxed max-w-lg mx-auto">
                Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. A principal engineering lead will review your requirements for{' '}
                <strong className="text-slate-900 dark:text-white">{formData.projectType}</strong> and reach out to{' '}
                <strong className="text-slate-900 dark:text-white">{formData.email}</strong> within 24 hours.
              </p>
            </div>

            {/* Reference ID card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] flex items-center justify-between max-w-md mx-auto">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-gray-500 block">
                  Project Tracking Reference
                </span>
                <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                  #{submissionSuccess.referenceNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyReference(submissionSuccess.referenceNumber)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                {copiedRef ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
              >
                Submit Another Project Scope
              </button>
            </div>
          </motion.div>
        ) : (
          /* Focused, Streamlined Two-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Builder (7 cols) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-white dark:bg-[#141414] rounded-3xl border border-slate-200 dark:border-[#262626] p-6 sm:p-8 space-y-6 shadow-xl"
            >
              {/* Step 1: Project Domain Options */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2.5">
                  1. What kind of product are you looking to build?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROJECT_TYPE_OPTIONS.map((option) => {
                    const isSelected = formData.projectType === option.id;
                    const IconComponent = option.icon;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setFormData({ ...formData, projectType: option.id });
                        }}
                        className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 text-slate-900 dark:text-white ring-1 ring-blue-500/30'
                            : 'bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#282828]'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-[#121212] text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-[#2c2c2c]'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-snug">
                            {option.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-1">
                            {option.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Interactive Scope & Investment Estimator */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-300">
                      2. Project Scope & Investment
                    </label>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                      Deterministic Milestone Pricing
                    </span>
                  </div>

                  {/* Currency Selector Pill Bar */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] self-start sm:self-auto">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((curr) => {
                      const isCurrActive = currency === curr;
                      return (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => handleCurrencyChange(curr)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isCurrActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>{CURRENCIES[curr].flag}</span>
                          <span>{CURRENCIES[curr].symbol} {curr}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BUDGET_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierSelect(tier)}
                        className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white ring-1 ring-blue-500/30'
                            : 'bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#282828]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight">
                              {tier.label}
                            </span>
                            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-[#262626] text-slate-700 dark:text-gray-300'
                            }`}>
                              {tier.prices[currency]}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-snug line-clamp-2">
                            {tier.recommendedFor}
                          </p>
                        </div>

                        <div className="pt-1.5 border-t border-slate-200/60 dark:border-[#2a2a2a] flex items-center justify-between text-[10px] font-mono">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            ⏱ {tier.speed}
                          </span>
                          <span className="text-slate-500 dark:text-gray-400 truncate max-w-32.5">
                            {tier.squad.split('+')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Launch Horizon & Target Kickoff Date */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-300">
                  3. Launch Horizon & Desired Kickoff
                </label>

                {/* Timeline Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIMELINE_OPTIONS.map((timeline) => {
                    const isSelected = formData.timeline === timeline.id;

                    return (
                      <button
                        key={timeline.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setFormData({ ...formData, timeline: timeline.id });
                        }}
                        className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20 font-bold'
                            : 'bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#282828]'
                        }`}
                      >
                        <div className="text-xs font-black truncate">{timeline.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-gray-400'
                          }`}
                        >
                          {timeline.note}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Kickoff Timing & Date Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#262626] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Target Kickoff Schedule:</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {kickoffPreset === 'custom' && customKickoffDate ? customKickoffDate : formData.targetKickoff}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {KICKOFF_PRESETS.map((preset) => {
                      const isSelected = kickoffPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleKickoffSelect(preset.id, preset.label)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'bg-white dark:bg-[#1f1f1f] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#2c2c2c] hover:border-slate-300'
                          }`}
                        >
                          <div>{preset.label}</div>
                          <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {preset.note}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {kickoffPreset === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2 flex items-center gap-3"
                    >
                      <label className="text-xs text-slate-600 dark:text-gray-400 font-medium shrink-0">
                        Choose Date:
                      </label>
                      <input
                        type="date"
                        value={customKickoffDate}
                        onChange={(e) => {
                          setCustomKickoffDate(e.target.value);
                          setFormData((prev) => ({ ...prev, targetKickoff: `Target Date: ${e.target.value}` }));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#333333] text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 4: Contact Info */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-[#222222]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2e2e2e] text-slate-900 dark:text-white text-xs font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2e2e2e] text-slate-900 dark:text-white text-xs font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                    Company or Project Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Corp or Stealth Venture"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2e2e2e] text-slate-900 dark:text-white text-xs font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                    Brief Project Goals or Key Features
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What are the key goals, target users, or workflows you want to implement?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2e2e2e] text-slate-900 dark:text-white text-xs font-medium focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Cloud...</span>
                  </>
                ) : (
                  <>
                    <span>Request Engineering Roadmap & Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-gray-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Confidentiality Guaranteed</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>24-Hour Review Turnaround</span>
                </span>
                <span>•</span>
                <span>Zero Obligation</span>
              </div>
            </form>

            {/* Right Column: Reassurance & Dynamic Scope Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Dynamic Active Selection Summary Card */}
              <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Calculated Scope & Squad</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                    {activeTier.prices[currency]}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Domain Focus:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.projectType}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Package Tier:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{activeTier.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Sprint Velocity:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeTier.speed}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Dedicated Squad:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right truncate max-w-50" title={activeTier.squad}>
                      {activeTier.squad}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">SLA Commitment:</span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-gray-300 text-right truncate max-w-50">
                      {activeTier.sla}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-200/50 dark:border-blue-900/30">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Target Kickoff:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {kickoffPreset === 'custom' && customKickoffDate ? customKickoffDate : formData.targetKickoff}
                    </span>
                  </div>
                </div>
              </div>

              {/* What Happens Next Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#262626] shadow-md space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>What happens after you submit?</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Direct Technical Feasibility Review
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-snug mt-0.5">
                        A senior engineer analyzes your product requirements and drafts an initial architecture sketch.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Confidential 30-Minute Discovery
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-snug mt-0.5">
                        A conversational deep-dive to align on user journeys, edge cases, and delivery milestones.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Deterministic Sprint Roadmap
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-snug mt-0.5">
                        Receive a clear phase-by-phase delivery plan with non-negotiable verification gates.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#262626] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Strict Mutual NDA & IP Protection</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Repository & Infrastructure Handover</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Speak Directly With Principal Engineers</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
