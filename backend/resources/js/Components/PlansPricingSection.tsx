import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export type CurrencyKey = 'USD' | 'EUR' | 'GBP' | 'BDT';

export interface PlanData {
  id: number;
  slug: string;
  name: string;
  badge?: string | null;
  tagline?: string | null;
  description?: string | null;
  pricing_model: string;
  price_usd?: string | null;
  price_eur?: string | null;
  price_gbp?: string | null;
  price_bdt?: string | null;
  billing_period?: string | null;
  timeline_estimate?: string | null;
  squad_composition?: string | null;
  sla_commitment?: string | null;
  recommended_for?: string | null;
  features?: string[] | null;
  cta_text?: string | null;
  cta_action?: string | null;
  cta_url?: string | null;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
}

interface Props {
  plans?: PlanData[];
  isVisible?: boolean;
  heading?: string;
  subheading?: string;
  onSelectPlan?: (plan: PlanData) => void;
}

const CURRENCIES: Record<CurrencyKey, { symbol: string; flag: string; label: string }> = {
  USD: { symbol: '$', flag: '🇺🇸', label: 'USD' },
  EUR: { symbol: '€', flag: '🇪🇺', label: 'EUR' },
  GBP: { symbol: '£', flag: '🇬🇧', label: 'GBP' },
  BDT: { symbol: '৳', flag: '🇧🇩', label: 'BDT' },
};

export const PlansPricingSection: React.FC<Props> = ({
  plans = [],
  isVisible = false,
  heading = 'Transparent Engineering Engagements',
  subheading = 'Predictable milestones, dedicated senior squads, and zero-compromise system architecture.',
  onSelectPlan,
}) => {
  // If explicitly hidden by CMS setting or no published plans, do not render
  if (!isVisible || !plans || plans.length === 0) {
    return null;
  }

  const [activeCurrency, setActiveCurrency] = useState<CurrencyKey>('USD');

  const getPrice = (plan: PlanData): string => {
    switch (activeCurrency) {
      case 'EUR':
        return plan.price_eur || plan.price_usd || 'Custom Scope';
      case 'GBP':
        return plan.price_gbp || plan.price_usd || 'Custom Scope';
      case 'BDT':
        return plan.price_bdt || plan.price_usd || 'Custom Scope';
      case 'USD':
      default:
        return plan.price_usd || 'Custom Scope';
    }
  };

  const handlePlanClick = (plan: PlanData) => {
    soundEngine.playTap();
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white/50 dark:bg-black/30 border-y border-slate-200/60 dark:border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3xl h-96 bg-blue-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>COMMERCIAL FRAMEWORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {heading}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {subheading}
          </p>

          {/* Currency Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-inner">
              {(Object.keys(CURRENCIES) as CurrencyKey[]).map((curr) => {
                const isSelected = activeCurrency === curr;
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setActiveCurrency(curr);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{CURRENCIES[curr].flag}</span>
                    <span>{CURRENCIES[curr].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => {
            const isFeatured = plan.is_featured;
            const price = getPrice(plan);

            return (
              <motion.div
                key={plan.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isFeatured
                    ? 'bg-gradient-to-b from-blue-900/20 via-slate-900/60 to-slate-950 border-2 border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/40 -translate-y-1'
                    : 'bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-white/10 hover:border-blue-500/40 shadow-xl'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Badge & Name */}
                  <div className="space-y-1.5">
                    {plan.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {plan.name}
                    </h3>
                    {plan.tagline && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                        {plan.tagline}
                      </p>
                    )}
                  </div>

                  {/* Price Banner */}
                  <div className="pt-2 pb-1 border-y border-slate-100 dark:border-white/5 space-y-1">
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {price}
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {plan.billing_period || plan.pricing_model}
                    </div>
                  </div>

                  {/* Delivery Specs */}
                  <div className="space-y-2 text-xs">
                    {plan.timeline_estimate && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Timeline: <strong className="text-slate-900 dark:text-white">{plan.timeline_estimate}</strong></span>
                      </div>
                    )}
                    {plan.squad_composition && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">Squad: <strong className="text-slate-900 dark:text-white">{plan.squad_composition}</strong></span>
                      </div>
                    )}
                    {plan.sla_commitment && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">SLA: <strong className="text-slate-900 dark:text-white">{plan.sla_commitment}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Deliverables List */}
                  {Array.isArray(plan.features) && plan.features.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        Deliverables:
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFeatured
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-900 dark:bg-white/10 hover:bg-blue-600 text-white dark:hover:bg-blue-600'
                    }`}
                  >
                    <span>{plan.cta_text || 'Inquire for Scope'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
