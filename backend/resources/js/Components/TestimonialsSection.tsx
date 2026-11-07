import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Building2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { useCms } from '../Context/CmsContext';
import { SectionState } from './SectionState';

interface TestimonialItem {
  id?: number;
  client_name: string;
  client_role: string;
  company_name: string;
  company_logo_url?: string | null;
  avatar_url?: string | null;
  quote: string;
  project_reference?: string | null;
  metric_highlight?: string | null;
  is_published?: boolean;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    client_name: 'Distribution Hub Operations',
    client_role: 'Operations Review',
    company_name: 'DevCenterPoint ERP & Storefront',
    avatar_url: null,
    quote: 'Centralized multi-warehouse inventory engine with live SKU tracking, barcode scanner support, and automated dispatching. Eliminates stock desynchronization across sales channels.',
    project_reference: 'Live Demo: demoerp.devcenterpoint.com',
    metric_highlight: 'Multi-Warehouse Sync',
    is_published: true,
  },
  {
    client_name: 'Clinical Pharmacy Staff',
    client_role: 'Healthcare Deployment',
    company_name: 'Feroza Clinic Serial Manager',
    avatar_url: null,
    quote: 'Real-time patient serial management with digital waiting room displays and SMS alerts. Replaced crowded paper queues with an orderly, 1-click patient summon workflow.',
    project_reference: 'Live Platform: serial.ferozamedicinecorner.com',
    metric_highlight: 'Live Queue & SMS Alerts',
    is_published: true,
  },
  {
    client_name: 'Volunteer Network Lead',
    client_role: 'Civic Safety Program',
    company_name: 'Road Safety Movement',
    avatar_url: null,
    quote: 'Mobile-responsive field dispatch platform for coordinated traffic safety campaigns, volunteer check-ins, and emergency road incident reporting.',
    project_reference: 'Live Platform: roadsafetymovement.org',
    metric_highlight: 'National Campaign Dispatch',
    is_published: true,
  },
  {
    client_name: 'Store Management',
    client_role: 'Retail Inventory Deployment',
    company_name: 'Slice Mart Retail FMS',
    avatar_url: null,
    quote: 'Fast web-based retail management system with barcode scanner integration, daily sales reconciliation, and automated low-stock reorder thresholds.',
    project_reference: 'Public Sandbox: slice-mart-fms.vercel.app',
    metric_highlight: 'Instant Barcode SKU Search',
    is_published: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  const cms = useCms();
  const hasCmsTestimonials = Array.isArray(cms.testimonials);

  const rawTestimonials = (hasCmsTestimonials && cms.testimonials!.length > 0)
    ? cms.testimonials!.filter((t) => t.is_published !== false)
    : (hasCmsTestimonials ? [] : DEFAULT_TESTIMONIALS);

  const title = cms.getSetting('testimonials_heading', 'Verified Deployments & Operating Systems');
  const subtitle = cms.getSetting(
    'testimonials_subheading',
    'Active web systems and operational software engineered by DevCenterPoint Studio. Each deployment is live and accessible for demonstration.'
  );

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-[var(--accent-subtle)] text-[var(--accent-primary)] border hairline-border">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>04 — Verified Production Systems & Impact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        {rawTestimonials.length === 0 ? (
          <SectionState
            variant="empty"
            title="Deployments coming soon"
            description="We are publishing verified system case files. New operating deployments will appear here shortly."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {rawTestimonials.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-2xl editorial-card p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[var(--accent-primary)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b hairline-border">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border hairline-border text-[var(--accent-primary)] flex items-center justify-center">
                      <Quote className="w-4 h-4" />
                    </div>
                    {item.metric_highlight && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        <TrendingUp className="w-3 h-3" />
                        <span>{item.metric_highlight}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t hairline-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">
                      {item.client_name}
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {item.client_role} · <span className="text-[var(--accent-primary)] font-semibold">{item.company_name}</span>
                    </p>
                  </div>

                  {item.project_reference && (
                    <div className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-md border hairline-border self-start sm:self-auto">
                      {item.project_reference}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Operating Deployments Banner */}
        <div className="pt-8 border-t hairline-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
          <span>VERIFIED PRODUCTION REPOSITORIES & DEPLOYMENTS:</span>
          <div className="flex flex-wrap items-center gap-6 text-[var(--text-secondary)] font-bold">
            <span>DCP ERP</span>
            <span>CLINIC SERIAL</span>
            <span>ROAD SAFETY MOVEMENT</span>
            <span>SLICE MART</span>
            <span>QTTENZY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
