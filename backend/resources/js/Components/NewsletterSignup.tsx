import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
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
import { useCms } from '../Context/CmsContext';

interface NewsletterContent {
  badge?: string;
  spamNotice?: string;
  headline?: string;
  description?: string;
  perks?: string[];
  buttonLabel?: string;
}

const DEFAULT_NEWSLETTER: NewsletterContent = {
  badge: 'DevCenterPoint Dispatch',
  spamNotice: 'Zero Spam • Unsubscribe Anytime',
  headline: 'Architectural insights & company updates, direct to your inbox.',
  description:
    'Subscribe for bi-weekly engineering breakdowns: distributed systems architectures, performance benchmarks, production post-mortems, and DevCenterPoint studio updates.',
  perks: [
    'Production post-mortems & scaling logs',
    'Architecture blueprints & tech benchmarks',
    'Early access to product case studies',
  ],
  buttonLabel: 'Join Company Dispatch',
};

interface NewsletterSignupProps {
  variant?: 'standalone' | 'embedded';
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'standalone',
  className = '',
}) => {
  const cms = useCms();
  const content = cms.getSectionBlock<NewsletterContent>('newsletter', 'content', DEFAULT_NEWSLETTER);
  const perks = content.perks && content.perks.length > 0 ? content.perks : DEFAULT_NEWSLETTER.perks!;

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
        colors: ['#0047FF', '#3B75FF', '#10B981', '#60A5FA'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if confetti fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Please provide your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@company.com).');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await subscribeToNewsletter(trimmed, 'web_newsletter_section');
      setSubscribedEmail(trimmed);
      setStatus('success');
      setEmail('');
      triggerConfetti();
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Unable to complete subscription. Please try again.';
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
          ? 'py-20 bg-[var(--bg-canvas)] text-[var(--text-ink)] border-t hairline-border transition-colors duration-300'
          : ''
      } ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl editorial-card p-8 sm:p-12 transition-all">
          
          {/* Header Accent Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b hairline-border">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border hairline-border text-[var(--accent-primary)] font-mono text-[11px] font-bold tracking-wider uppercase">
              <BellRing className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
              <span>{content.badge || DEFAULT_NEWSLETTER.badge}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[var(--text-muted)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{content.spamNotice || DEFAULT_NEWSLETTER.spamNotice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Editorial Value Proposition (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--text-ink)] leading-tight">
                {content.headline || DEFAULT_NEWSLETTER.headline}
              </h2>
              
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-normal">
                {content.description || DEFAULT_NEWSLETTER.description}
              </p>

              {/* Three Strategic Subscriber Perks */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {perks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs font-semibold text-[var(--text-ink)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Subscription Form Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
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
                        <h3 className="text-base font-black text-[var(--text-ink)]">
                          You're on the dispatch list!
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] font-normal">
                          We've recorded <span className="font-mono font-bold text-[var(--accent-primary)]">{subscribedEmail}</span>. Expect our next architectural dispatch soon.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] border hairline-border text-[var(--text-ink)] text-xs font-bold transition-colors cursor-pointer"
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
                          className="block text-xs font-mono font-bold text-[var(--text-ink)] mb-1.5 uppercase tracking-wider"
                        >
                          Work or Personal Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-surface)] border hairline-border focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] text-[var(--text-ink)] placeholder-[var(--text-muted)] text-xs font-medium transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Error feedback banner */}
                      {status === 'error' && (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold leading-snug">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="editorial-btn-primary w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Registering...</span>
                          </>
                        ) : (
                          <>
                            <span>{content.buttonLabel || DEFAULT_NEWSLETTER.buttonLabel}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-center text-[var(--text-muted)] leading-tight">
                        Secured with zero-trust Firestore rules.
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
