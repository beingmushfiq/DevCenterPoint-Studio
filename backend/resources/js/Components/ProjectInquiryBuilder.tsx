import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { InquiryFormData } from '../types';
import { submitProjectInquiry } from '../lib/firebase';
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
  ExternalLink,
  Database,
  Terminal
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCms } from '../Context/CmsContext';

interface ProjectTypeOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  {
    id: 'Custom Software & Tools',
    label: 'Custom Software & Tools',
    description: 'Bespoke web portals, internal tools & legacy workflow replacements',
    icon: Layers,
  },
  {
    id: 'Business Automation',
    label: 'Multi-Warehouse ERP',
    description: 'Inventory synchronization, POS registers, and dispatch tracking',
    icon: Database,
  },
  {
    id: 'E-Commerce Systems',
    label: 'Omnichannel Storefront',
    description: 'High-speed headless commerce, bKash/Nagad checkout, courier APIs',
    icon: Globe,
  },
  {
    id: 'Healthcare & Queue Systems',
    label: 'Healthcare & Queue Portals',
    description: 'Serial counters, patient displays, SMS alerts, doctor dashboards',
    icon: Users,
  },
  {
    id: 'AI & Intelligent Systems',
    label: 'AI & Predictive Engines',
    description: 'Machine learning pipelines, SHAP explainability, automated OCR',
    icon: Cpu,
  },
  {
    id: 'Mobile & Cross-Platform',
    label: 'IoT & Telematics Platforms',
    description: 'GPS fleet tracking, geofence triggers, sensor telemetry pipelines',
    icon: Smartphone,
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
    label: 'Tactical Launch / Sprint',
    badge: 'Fast Turnaround',
    speed: '2 – 4 Weeks',
    squad: '1 Lead Systems Architect + 1 Fullstack Engineer',
    sla: 'Complete Git Repo & Docker Deployment',
    recommendedFor: 'Businesses needing a functional operational tool or clinic queue without delay'
  },
  {
    id: 'scale',
    label: 'Full Operational Core / ERP',
    badge: 'Recommended',
    speed: '4 – 8 Weeks',
    squad: 'Lead Architect + 2 Fullstack Engineers + DB Specialist',
    sla: 'PostgreSQL ACID Locks & Automated Courier Rails',
    recommendedFor: 'Growing companies replacing fragmented spreadsheets with a permanent ERP asset'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Infrastructure Core',
    badge: 'High Throughput',
    speed: 'Phased Milestones',
    squad: 'Dedicated Systems Squad & Infrastructure Lead',
    sla: 'Sub-second Multi-Warehouse & High-Concurrency',
    recommendedFor: 'Omnichannel operations with multiple retail branches and thousands of daily orders'
  },
  {
    id: 'audit',
    label: 'Architecture Audit & Rescue',
    badge: 'Technical RFC',
    speed: '1 – 2 Weeks',
    squad: 'Principal Cloud & Security Architect',
    sla: 'Full Database & Security Vulnerability Report',
    recommendedFor: 'Teams struggling with slow legacy queries, data corruption, or crashing servers'
  }
];

const TIMELINE_OPTIONS = [
  { id: '2 - 4 Weeks', label: 'Fast-Track (2–4 Weeks)', note: 'Tactical sprint' },
  { id: '1 - 2 Months', label: 'Standard (1–2 Months)', note: 'Recommended build' },
  { id: '3+ Months', label: 'Phased Enterprise (3+ Mo)', note: 'Multi-module rollout' },
];

const DRAFT_STORAGE_KEY = 'dcp_inquiry_draft_v3';

export const ProjectInquiryBuilder: React.FC = () => {
  const cms = useCms();
  const [selectedTierId, setSelectedTierId] = useState<string>('scale');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; referenceNumber: string } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const activeTier = SCOPE_TIERS.find((t) => t.id === selectedTierId) || SCOPE_TIERS[1];

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
      projectType: 'Business Automation',
      budgetRange: `${SCOPE_TIERS[1].label} (${SCOPE_TIERS[1].badge})`,
      timeline: '1 - 2 Months',
      targetKickoff: 'Within 30 Days',
      description: '',
      selectedTech: ['Laravel', 'React', 'PostgreSQL'],
    };
  });

  useEffect(() => {
    if (!submitted) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } catch {
        // Ignored
      }
    }
  }, [formData, submitted]);

  const handleCopyReference = (refNum: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refNum);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleTierSelect = (tier: ScopeTier) => {
    setSelectedTierId(tier.id);
    setFormData((prev) => ({
      ...prev,
      budgetRange: `${tier.label} (${tier.badge})`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmissionError('Please provide your name and work email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmissionError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company?.trim() || '',
      description: formData.description.trim(),
      budgetRange: formData.budgetRange || `${activeTier.label} (${activeTier.badge})`,
    };

    try {
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
            details: payload.description || `Inquiry for ${payload.projectType}`,
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
        // Fallback
      }

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

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0047FF', '#10B981', '#121316'],
        });
      } catch {
        // Ignored
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to transmit inquiry.';
      setSubmissionError(
        msg.includes('Firestore')
          ? 'Unable to submit via form. Please message directly on WhatsApp (+8801988383323) or email contact@devcenterpoint.com.'
          : msg
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmissionSuccess(null);
    setSubmissionError(null);
    setSelectedTierId('scale');
    setFormData({
      name: '',
      email: '',
      company: '',
      projectType: 'Business Automation',
      budgetRange: `${SCOPE_TIERS[1].label} (${SCOPE_TIERS[1].badge})`,
      timeline: '1 - 2 Months',
      targetKickoff: 'Within 30 Days',
      description: '',
      selectedTech: ['Laravel', 'React', 'PostgreSQL'],
    });
  };

  const whatsappChatUrl = `https://wa.me/8801988383323?text=${encodeURIComponent(
    `Hi DevCenterPoint, I'd like to estimate an engineering project:
- System: ${formData.projectType}
- Scope: ${activeTier.label} (${activeTier.speed})
- Timeline: ${formData.timeline}
- Name: ${formData.name || 'Prospective Client'}`
  )}`;

  return (
    <section
      id="contact"
      aria-label="Project Scope Configurator & Consultation"
      className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
            <span>03 — Project Scope & Engagement Configurator</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Configure Your System Architecture
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Select your operational focus, engagement depth, and timeline. We review every brief personally and provide an architectural blueprint within 24 hours.
          </p>
        </div>

        {/* Error Banner */}
        {submissionError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div>{submissionError}</div>
          </div>
        )}

        {submitted && submissionSuccess ? (
          /* High-Trust Success Card */
          <div className="p-8 sm:p-12 rounded-2xl editorial-card text-center max-w-xl mx-auto space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                Inquiry Logged & Assigned
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Thank you, <b>{formData.name}</b>. A lead software architect is reviewing your brief for{' '}
                <b>{formData.projectType}</b> and will respond to <b>{formData.email}</b> within 24 hours.
              </p>
            </div>

            {/* Reference Tracking Token */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--text-secondary)]">Reference: #{submissionSuccess.referenceNumber}</span>
              <button
                type="button"
                onClick={() => handleCopyReference(submissionSuccess.referenceNumber)}
                className="inline-flex items-center gap-1 text-[var(--accent-primary)] font-bold cursor-pointer"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={whatsappChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Update</span>
              </a>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border hairline-border bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs font-semibold hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                Configure Another Scope
              </button>
            </div>
          </div>
        ) : (
          /* Main Configurator Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Builder (7 cols) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 rounded-2xl editorial-card p-6 sm:p-8 space-y-6"
            >
              {/* Step 1: System Focus */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    1. System Domain
                  </label>
                  <span className="text-[var(--text-muted)]">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROJECT_TYPE_OPTIONS.map((option) => {
                    const isSelected = formData.projectType === option.id;
                    const IconComponent = option.icon;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, projectType: option.id })}
                        className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] border-[#121316] dark:border-white shadow-xs'
                            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-white/20 text-white dark:bg-black/20 dark:text-[#121316]'
                              : 'bg-[var(--bg-subtle)] text-[var(--accent-primary)]'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight">
                            {option.label}
                          </div>
                          <div className={`text-[11px] leading-tight mt-1 line-clamp-2 ${
                            isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-[var(--text-secondary)]'
                          }`}>
                            {option.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Scope Tier */}
              <div className="space-y-3 pt-3 border-t hairline-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    2. Engagement Depth
                  </label>
                  <span className="text-[var(--text-muted)]">Step 2 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCOPE_TIERS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => handleTierSelect(tier)}
                        className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-[var(--accent-subtle)] border-[var(--accent-primary)] text-[var(--text-primary)] ring-1 ring-[var(--accent-primary)]'
                            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold">
                              {tier.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] border hairline-border font-semibold text-[var(--accent-primary)]">
                              {tier.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            {tier.recommendedFor}
                          </p>
                        </div>

                        <div className="pt-2 border-t hairline-border flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                          <span className="font-bold text-[var(--accent-primary)]">⏱ {tier.speed}</span>
                          <span>100% Code Handover</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Target Timeline */}
              <div className="space-y-3 pt-3 border-t hairline-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    3. Target Delivery Window
                  </label>
                  <span className="text-[var(--text-muted)]">Step 3 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {TIMELINE_OPTIONS.map((timeline) => {
                    const isSelected = formData.timeline === timeline.id;

                    return (
                      <button
                        key={timeline.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeline: timeline.id })}
                        className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] border-[#121316] dark:border-white font-bold shadow-xs'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                        }`}
                      >
                        <div className="text-xs font-bold">{timeline.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-[var(--text-muted)]'}`}>
                          {timeline.note}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Contact Fields */}
              <div className="space-y-3 pt-3 border-t hairline-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    4. Contact Details
                  </label>
                  <span className="text-[var(--text-muted)]">Step 4 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tariq@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-primary)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Company or Project Context (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Dhaka Logistics Desk or Healthcare Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-primary)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Operational Requirements / Core Problem
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What manual spreadsheets, WhatsApp orders, or inventory bottlenecks are you trying to solve?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-primary)] outline-none resize-y"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white disabled:opacity-50 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                {isSubmitting ? (
                  <span>Transmitting Brief...</span>
                ) : (
                  <>
                    <span>Submit Project Scope For Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1">
                <span>✓ 100% Full Source Code Ownership</span>
                <span>✓ 24-Hour Review Turnaround</span>
              </div>
            </form>

            {/* Right Column: Architectural Recommendation Box (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-6 rounded-2xl editorial-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b hairline-border">
                  <span className="text-xs font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>Calculated Architecture</span>
                  </span>
                  <span className="tech-tag text-[10px]">
                    {activeTier.badge}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Target System:</span>
                    <span className="font-bold text-[var(--text-primary)]">{formData.projectType}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Recommended Stack:</span>
                    <span className="font-bold text-[var(--accent-primary)] font-mono">Laravel 11 + React + PostgreSQL</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Estimated Timeline:</span>
                    <span className="font-bold text-[var(--text-primary)]">{activeTier.speed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">Delivery Squad:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                      {activeTier.squad}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)]">IP & Licensing:</span>
                    <span className="font-bold text-[var(--text-primary)]">100% Full Source Handover</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border space-y-1 text-xs">
                  <span className="font-bold text-[var(--text-primary)] block">Production Deliverables Included:</span>
                  <ul className="text-[11px] text-[var(--text-secondary)] space-y-1 font-mono">
                    <li>• Complete Git Repository with History</li>
                    <li>• PostgreSQL Migrations & Database Seeds</li>
                    <li>• Docker Containerization & Deployment Scripts</li>
                    <li>• Local Payment Gateway Rails (bKash/Nagad)</li>
                  </ul>
                </div>

                {/* Instant WhatsApp Shortcut */}
                <div className="pt-2">
                  <a
                    href={whatsappChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prefer WhatsApp? Send Spec Directly</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
