import React, { useState, useEffect } from 'react';
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
  Users,
  PhoneCall,
  ExternalLink
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

interface ScopeTier {
  id: string;
  label: string;
  badge: string;
  speed: string;
  squad: string;
  sla: string;
  recommendedFor: string;
}

const SCOPE_TIERS: ScopeTier[] = [
  {
    id: 'mvp',
    label: 'Core Launch / MVP',
    badge: 'Rapid Validation',
    speed: '4 – 6 Weeks',
    squad: '1 Principal Architect + 1 Senior Engineer',
    sla: '99.9% Uptime Guarantee',
    recommendedFor: 'Early-stage founders validating market fit with production-grade stability'
  },
  {
    id: 'scale',
    label: 'Growth & Scale Platform',
    badge: 'Dedicated Squad',
    speed: '8 – 12 Weeks',
    squad: '1 Architect + 2 Fullstack Engineers + 1 QA Specialist',
    sla: 'Zero-Downtime Migration & SOC2 Ready',
    recommendedFor: 'Scaling businesses modernizing legacy workflows or launching multi-tenant apps'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Distributed Core',
    badge: 'Mission Critical',
    speed: 'Phased Milestones',
    squad: 'Dedicated Cross-Functional Squad & DevSecOps Lead',
    sla: 'Sub-35ms Global Edge & 24/7 Dedicated On-Call',
    recommendedFor: 'Complex omnichannel ERPs, fintech rails, or high-throughput real-time pipelines'
  },
  {
    id: 'advisory',
    label: 'Architecture RFC & Audit',
    badge: 'Executive Advisory',
    speed: '1 – 2 Weeks',
    squad: 'Principal Cloud & Security Architect',
    sla: 'Comprehensive Blueprint & Threat Model',
    recommendedFor: 'Teams needing external code audit, cloud cost reduction, or architectural RFC'
  }
];

const KICKOFF_PRESETS = [
  { id: 'immediate', label: 'Within 7 Days', note: 'Fast-track onboarding' },
  { id: 'month', label: 'Within 30 Days', note: 'Standard roadmap' },
  { id: 'quarter', label: 'Next Quarter', note: 'Strategic kickoff' },
  { id: 'custom', label: 'Specific Date', note: 'Pick calendar date' },
];

const TIMELINE_OPTIONS = [
  { id: '1 - 2 Months', label: 'Fast-Track (1–2 Mo)', note: 'Rapid MVP / sprint' },
  { id: '2 - 3 Months', label: 'Standard (2–3 Mo)', note: 'Recommended cycle' },
  { id: '3+ Months', label: 'Phased Build (3+ Mo)', note: 'Enterprise scope' },
];

const DRAFT_STORAGE_KEY = 'dcp_inquiry_draft_v2';

export const ProjectInquiryBuilder: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('scale');
  const [kickoffPreset, setKickoffPreset] = useState<string>('month');
  const [customKickoffDate, setCustomKickoffDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; referenceNumber: string } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const activeTier = SCOPE_TIERS.find((t) => t.id === selectedTierId) || SCOPE_TIERS[1];

  // Smart defaults with LocalStorage restoration
  const [formData, setFormData] = useState<InquiryFormData>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      name: '',
      email: '',
      company: '',
      projectType: 'SaaS / Web Product',
      budgetRange: `${SCOPE_TIERS[1].label} (${SCOPE_TIERS[1].badge})`,
      timeline: '2 - 3 Months',
      targetKickoff: 'Within 30 Days',
      description: '',
      selectedTech: [],
    };
  });

  // Autosave draft on change
  useEffect(() => {
    if (!submitted) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } catch {
        // Ignored
      }
    }
  }, [formData, submitted]);

  const triggerConfettiExplosion = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#6366F1', '#F59E0B'],
      });
    } catch {
      // Graceful fallback
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

  const handleTierSelect = (tier: ScopeTier) => {
    soundEngine.playTap();
    setSelectedTierId(tier.id);
    setFormData((prev) => ({
      ...prev,
      budgetRange: `${tier.label} (${tier.badge})`,
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

    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company?.trim() || '',
      description: formData.description.trim(),
      budgetRange: formData.budgetRange || `${activeTier.label} (${activeTier.badge})`,
      targetKickoff: finalKickoff,
    };

    try {
      // 1. Attempt Laravel backend endpoint first if available
      let result: { id: string; referenceNumber: string } | null = null;
      try {
        const response = await fetch('/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            company: payload.company,
            project_types: [payload.projectType],
            budget_range: payload.budgetRange,
            timeline: payload.timeline,
            details: payload.description || 'Consultation request via Project Inquiry Builder',
            selected_tech: payload.selectedTech || [],
          }),
        });

        if (response.ok) {
          const json = await response.json();
          result = {
            id: String(json.id),
            referenceNumber: json.reference_number || `DCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
      } catch {
        // Fallback to Firebase
      }

      // 2. Fallback to Firebase Firestore if Laravel is not handling the route
      if (!result) {
        result = await submitProjectInquiry(payload);
      }

      setSubmissionSuccess(result);
      setSubmitted(true);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignored
      }

      soundEngine.playSuccessChime();
      soundEngine.playSparkleCelebration();
      triggerConfettiExplosion();
    } catch (err: unknown) {
      soundEngine.playTap();
      const msg = err instanceof Error ? err.message : 'Unable to transmit inquiry.';
      setSubmissionError(
        msg.includes('Firestore') 
          ? 'Unable to transmit inquiry. Please reach out directly on WhatsApp (+8801988383323) or contact@devcenterpoint.com.'
          : msg
      );
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
      budgetRange: `${SCOPE_TIERS[1].label} (${SCOPE_TIERS[1].badge})`,
      timeline: '2 - 3 Months',
      targetKickoff: 'Within 30 Days',
      description: '',
      selectedTech: [],
    });
  };

  const whatsappChatUrl = submissionSuccess
    ? `https://wa.me/8801988383323?text=${encodeURIComponent(
        `Hi DevCenterPoint, I just submitted project inquiry #${submissionSuccess.referenceNumber} for ${formData.projectType}. Would love to discuss next steps!`
      )}`
    : `https://wa.me/8801988383323?text=${encodeURIComponent(
        'Hi DevCenterPoint, I would like to discuss engineering a digital product.'
      )}`;

  return (
    <section
      id="contact"
      aria-label="Project Collaboration & Consultation"
      className="py-24 sm:py-32 bg-white dark:bg-[#07090e] text-slate-900 dark:text-neutral-100 border-t border-slate-200/70 dark:border-white/5 relative overflow-hidden transition-colors duration-500"
    >
      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 liquid-glass px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>08 — Project Collaboration</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3 leading-tight">
            Have a product worth building? <br className="hidden sm:inline" />
            <span className="text-gradient-signature">Let's engineer the roadmap.</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 dark:text-neutral-400 font-normal leading-relaxed">
            Select your product focus, preferred investment tier, and target timeline. We will review your goals and deliver a verified technical roadmap within 24 hours.
          </p>
        </div>

        {/* Submission Error Banner */}
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs font-semibold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>{submissionError}</div>
          </motion.div>
        )}

        {submitted && submissionSuccess ? (
          /* High-Trust Success Card with Direct WhatsApp & Booking */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-10 rounded-3xl bg-slate-50/80 dark:bg-neutral-900/70 border border-emerald-500/30 shadow-xl text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                <Check className="w-3.5 h-3.5" />
                <span>Inquiry Transmitted Successfully</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Brief Received & Assigned
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-normal leading-relaxed max-w-lg mx-auto">
                Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. A lead software architect is reviewing your brief for{' '}
                <strong className="text-slate-900 dark:text-white">{formData.projectType}</strong> and will follow up with{' '}
                <strong className="text-slate-900 dark:text-white">{formData.email}</strong> within 24 hours.
              </p>
            </div>

            {/* Reference ID card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex items-center justify-between max-w-md mx-auto">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-neutral-500 block">
                  Project Tracking Reference
                </span>
                <span className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                  #{submissionSuccess.referenceNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyReference(submissionSuccess.referenceNumber)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 transition-colors cursor-pointer"
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

            {/* Action Buttons: WhatsApp Direct + Call Booking */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Chat</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Inquiry Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Builder (7 cols) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 liquid-glass rounded-3xl p-5 sm:p-8 space-y-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Step 1: Product Focus */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                    1. Product Focus
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Step 1 of 4</span>
                </div>

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
                        className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-start gap-3 min-h-13 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-600/20'
                            : 'bg-white dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-snug">
                            {option.label}
                          </div>
                          <div className={`text-[11px] leading-tight mt-0.5 line-clamp-1 ${
                            isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-neutral-400'
                          }`}>
                            {option.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Scope & Delivery Velocity */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                      2. Engagement Scope & Delivery Velocity
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Step 2 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCOPE_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierSelect(tier)}
                        className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2.5 min-h-20 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white ring-1 ring-blue-500/30'
                            : 'bg-white dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold leading-tight">
                              {tier.label}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300'
                            }`}>
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug line-clamp-2">
                            {tier.recommendedFor}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                            ⏱ {tier.speed}
                          </span>
                          <span className="text-slate-400 truncate max-w-36 font-medium">
                            {tier.squad.split('+')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Launch Horizon */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                    3. Launch Horizon & Kickoff
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Step 3 of 4</span>
                </div>

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
                        className={`p-3 rounded-2xl text-left transition-all border cursor-pointer min-h-12 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-sm font-bold'
                            : 'bg-white dark:bg-neutral-950 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{timeline.label}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${
                          isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                          {timeline.note}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Kickoff Timing & Date Selector */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Kickoff Schedule:</span>
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
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer min-h-11 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-800'
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
                      <label className="text-xs text-slate-600 dark:text-neutral-400 font-medium shrink-0">
                        Choose Date:
                      </label>
                      <input
                        type="date"
                        value={customKickoffDate}
                        onChange={(e) => {
                          setCustomKickoffDate(e.target.value);
                          setFormData((prev) => ({ ...prev, targetKickoff: `Target Date: ${e.target.value}` }));
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-base sm:text-xs text-slate-900 dark:text-white font-mono focus:border-blue-500 outline-none"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 4: Contact Info (16px base font on mobile prevents iOS auto-zoom) */}
              <div className="space-y-4 pt-3 border-t border-slate-200/80 dark:border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-200">
                    4. Contact & Brief
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">Step 4 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      autoCapitalize="words"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-base sm:text-xs font-medium focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-base sm:text-xs font-medium focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Company or Organization (Optional)
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Health or Stealth Venture"
                    className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-base sm:text-xs font-medium focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Brief Project Goals & Context
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What are your core objectives, workflows, or target release window?"
                    className="w-full px-4 py-3 sm:py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white text-base sm:text-xs font-medium focus:border-blue-500 outline-none transition-all resize-y"
                  />
                </div>
              </div>

              {/* Submit CTA Button with Minimum 48px Touch Height */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 flex items-center justify-center gap-2 cursor-pointer min-h-13 ring-1 ring-white/20 active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Brief...</span>
                  </>
                ) : (
                  <>
                    <span>Request Engineering Roadmap & Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-neutral-400 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Strict NDA Protected</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>24-Hour Review Turnaround</span>
                </span>
              </div>
            </form>

            {/* Right Column: Reassurance & Scope Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Dynamic Scope & Squad Summary */}
              <div className="p-5 sm:p-6 rounded-3xl liquid-glass border border-blue-500/30 space-y-3.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Calculated Scope</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold border border-blue-500/20">
                    {activeTier.badge}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">Domain:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.projectType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">Tier:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{activeTier.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">Sprint Speed:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{activeTier.speed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-neutral-400">Squad:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right truncate max-w-44">
                      {activeTier.squad}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                    <span className="text-slate-500 dark:text-neutral-400">Target Kickoff:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {kickoffPreset === 'custom' && customKickoffDate ? customKickoffDate : formData.targetKickoff}
                    </span>
                  </div>
                </div>
              </div>

              {/* What Happens Next Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 space-y-3.5">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Review Process</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Technical Feasibility Check</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug mt-0.5">
                        A senior engineer analyzes your brief and sketches an initial architecture.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">30-Min Discovery Call</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug mt-0.5">
                        Deep-dive into edge cases, third-party integrations, and timeline gates.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Deterministic Sprint Plan</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug mt-0.5">
                        Receive a milestone delivery agreement with fixed deliverables and SLA.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-neutral-300">
                  <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Strict Mutual NDA & IP Ownership Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Repository & Infrastructure Handover</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
