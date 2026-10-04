import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  BellRing,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscribeToNewsletter } from '../lib/firebase';
import { soundEngine } from '../lib/soundEngine';

interface NewsletterSignupProps {
  variant?: 'standalone' | 'embedded';
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'standalone',
  className = '',
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [subscribedEmail, setSubscribedEmail] = useState<string>('');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#60a5fa'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if confetti fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playTap();

    const trimmed = email.trim();
    if (!trimmed) {
      soundEngine.playTap();
      setStatus('error');
      setErrorMessage('Please provide your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      soundEngine.playTap();
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@company.com).');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await subscribeToNewsletter(trimmed, 'web_newsletter_section');
      soundEngine.playSuccessChime();
      soundEngine.playSparkleCelebration();
      setSubscribedEmail(trimmed);
      setStatus('success');
      setEmail('');
      triggerConfetti();
    } catch (err: unknown) {
      soundEngine.playTap();
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Unable to complete subscription. Please try again.';
      // Friendly message if JSON error was thrown by handler
      if (msg.includes('Firestore Error') || msg.startsWith('{')) {
        setErrorMessage('Unable to register subscription at this time. Please check your connection or try again shortly.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setStatus('idle');
    setErrorMessage('');
    setEmail('');
  };

  return (
    <section
      id="newsletter"
      aria-label="Newsletter Subscription"
      className={`relative overflow-hidden ${
        variant === 'standalone'
          ? 'py-20 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] transition-colors duration-300'
          : ''
      } ${className}`}
    >
      {/* Subtle architectural ambient gradient backdrops */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] shadow-xl p-8 sm:p-12 transition-all">
          
          {/* Header Accent Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              <BellRing className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>DevCenterPoint Dispatch</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-500 dark:text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Spam • Unsubscribe Anytime</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Editorial Value Proposition (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Architectural insights & company updates, direct to your inbox.
              </h2>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
                Subscribe for bi-weekly engineering breakdowns: distributed systems architectures, performance benchmarks, production post-mortems, and DevCenterPoint studio updates.
              </p>

              {/* Three Strategic Subscriber Perks */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>Production post-mortems & scaling logs</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>Architecture blueprints & tech benchmarks</span>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>Early access to product case studies</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Subscription Form Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2e2e2e]">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center py-4 space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          You're on the dispatch list!
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">
                          We've recorded <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{subscribedEmail}</span> in Firestore. Expect our next architectural dispatch soon.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#282828] hover:bg-slate-300 dark:hover:bg-[#333333] text-slate-800 dark:text-gray-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Subscribe another email</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form-state"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="newsletter-email"
                          className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5"
                        >
                          Work or Personal Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (status === 'error') {
                                setStatus('idle');
                                setErrorMessage('');
                              }
                            }}
                            placeholder="engineer@company.com"
                            disabled={isSubmitting}
                            autoComplete="email"
                            maxLength={150}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-300 dark:border-[#383838] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-base sm:text-xs font-medium transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Error feedback banner */}
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold leading-snug"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Persisting to Firestore...</span>
                          </>
                        ) : (
                          <>
                            <span>Join Company Dispatch</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-center text-slate-500 dark:text-gray-400 leading-tight">
                        Secured with zero-trust Firestore ABAC rules.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
