import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  ArrowRight,
  Shield,
  Clock,
  Users,
} from 'lucide-react';

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
    <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border hairline-border text-[var(--accent-primary)] text-xs font-mono font-medium">
            <CreditCard className="w-3.5 h-3.5" />
            <span>07 — COMMERCIAL FRAMEWORKS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {heading}
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {subheading}
          </p>

          {/* Currency Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border hairline-border">
              {(Object.keys(CURRENCIES) as CurrencyKey[]).map((curr) => {
                const isSelected = activeCurrency === curr;
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setActiveCurrency(curr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              <div
                key={plan.id || idx}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative editorial-card ${
                  isFeatured
                    ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                    : 'hover:border-[var(--border-strong)]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[var(--accent-primary)] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    Recommended
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    {plan.badge && (
                      <span className="tech-tag text-[10px]">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {plan.name}
                    </h3>
                    {plan.tagline && (
                      <p className="text-xs text-[var(--text-secondary)] leading-snug line-clamp-2">
                        {plan.tagline}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 pb-2 border-y hairline-border space-y-0.5">
                    <div className="text-2xl font-mono font-extrabold text-[var(--text-primary)]">
                      {price}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                      {plan.billing_period || plan.pricing_model}
                    </div>
                  </div>

                  {plan.features && plan.features.length > 0 && (
                    <ul className="space-y-2 text-xs text-[var(--text-secondary)] pt-1">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    className="w-full py-2.5 px-4 rounded-xl editorial-btn-primary text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{plan.cta_text || 'Configure Scope'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
