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

const TIMELINE_OPTIONS = [
  { id: '1 - 2 Months', label: 'Fast-Track (1–2 Months)', note: 'Rapid MVP or urgent sprint' },
  { id: '2 - 3 Months', label: 'Standard (2–3 Months)', note: 'Recommended production cycle' },
  { id: '3+ Months', label: 'Flexible / Phased Build', note: 'Longer roadmap or enterprise scope' },
];

export const ProjectInquiryBuilder: React.FC = () => {
  // Smart default options pre-selected for instant clarity & high conversion
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'SaaS / Web Product',
    timeline: '2 - 3 Months',
    description: '',
    selectedTech: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    id: string;
    referenceNumber: string;
  } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyReference = (ref: string) => {
    soundEngine.playCopySuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const triggerConfettiExplosion = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#60a5fa'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback
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

    try {
      const result = await submitProjectInquiry({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company?.trim() || '',
        description: formData.description.trim(),
        budgetRange: 'Flexible',
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
    setFormData({
      name: '',
      email: '',
      company: '',
      projectType: 'SaaS / Web Product',
      timeline: '2 - 3 Months',
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
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

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

              {/* Step 2: Target Timeline */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-2.5">
                  2. Desired launch horizon
                </label>
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
              </div>

              {/* Step 3: Contact Info */}
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

            {/* Right Column: Reassurance & Next Steps (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Active Selection Summary Card */}
              <div className="p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30 space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Scoped Engagement</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Domain:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.projectType}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Timeline:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-gray-400 font-medium">Assigned Lead:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Principal Systems Architect</span>
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
