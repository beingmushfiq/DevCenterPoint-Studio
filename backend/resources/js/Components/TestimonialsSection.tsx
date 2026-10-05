import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Building2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
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
    client_name: 'David Vance',
    client_role: 'Chief Operating Officer',
    company_name: 'Apex Omnichannel Commerce',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'DevCenterPoint re-engineered our multi-warehouse inventory engine from the ground up. Their architecture eliminated stock desynchronization and drove our warehouse dispatch speeds up by over 400%.',
    project_reference: 'Multi-Tenant ERP & Storefront',
    metric_highlight: '4.2x Faster Fulfillment',
    is_published: true,
  },
  {
    client_name: 'Col. Farhan Ahmed (Retd.)',
    client_role: 'Program Director',
    company_name: 'National Road Safety Movement',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'The real-time nationwide incident dispatch platform built by DevCenterPoint provided absolute operational reliability under extreme concurrent traffic. Their team operates with military-grade precision.',
    project_reference: 'Emergency Telemetry & Incident Ops',
    metric_highlight: '99.99% Uptime During Peaks',
    is_published: true,
  },
  {
    client_name: 'Marcus Sterling',
    client_role: 'VP of Telematics',
    company_name: 'Global Fleet Telemetry Ltd',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    quote: 'Handling millions of GPS sensor pings per hour requires elite backend distributed systems knowledge. DevCenterPoint optimized our database pipelines to sub-millisecond query response times.',
    project_reference: 'Traccar GPS Telematics Pipeline',
    metric_highlight: '2.8M Events/hr Ingestion',
    is_published: true,
  },
  {
    client_name: 'Elena Rostova',
    client_role: 'Managing Partner',
    company_name: 'VentureScale Operations',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'Unlike generalist agencies that deliver fragile prototypes, DevCenterPoint constructs production systems engineered for automated self-healing, deterministic testing, and zero-downtime releases.',
    project_reference: 'Enterprise Core Modernization',
    metric_highlight: '$1.4M Saved Annually',
    is_published: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  const cms = useCms();
  const hasCmsTestimonials = Array.isArray(cms.testimonials);

  const rawTestimonials = (hasCmsTestimonials && cms.testimonials!.length > 0)
    ? cms.testimonials!.filter((t) => t.is_published !== false)
    : (hasCmsTestimonials ? [] : DEFAULT_TESTIMONIALS);

  const title = cms.getSetting('testimonials_heading', 'Verified Enterprise Impact & Leadership Endorsements');
  const subtitle = cms.getSetting(
    'testimonials_subheading',
    'Hear directly from operating executives, engineering directors, and product leaders who scaled critical platforms with DevCenterPoint Studio.'
  );

  return (
    <section id="testimonials" className="py-24 border-t border-slate-200/80 dark:border-white/10 relative overflow-hidden bg-slate-50/50 dark:bg-black/30">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Eyebrow & Title */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Social Proof & Client Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        {rawTestimonials.length === 0 ? (
          <SectionState
            variant="empty"
            title="Client endorsements coming soon"
            description="We are collecting verified feedback from the engineering leaders we work with. New endorsements will appear here shortly."
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rawTestimonials.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-blue-500/40 transition-all group"
            >
              <div>
                {/* Header with Quote Icon & Metric Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 group-hover:scale-105 transition-transform">
                    <Quote className="w-5 h-5" />
                  </div>
                  {item.metric_highlight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.metric_highlight}
                    </div>
                  )}
                </div>

                {/* Quote Content */}
                <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed italic mb-8">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer & Project Reference */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.client_name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {item.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.client_name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.client_role} · <span className="text-blue-600 dark:text-blue-400 font-medium">{item.company_name}</span>
                    </p>
                  </div>
                </div>

                {item.project_reference && (
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/5 self-start sm:self-auto">
                    {item.project_reference}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Enterprise Logos / Trust Banner */}
        <div className="mt-16 pt-12 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Trusted by Engineering Leaders & Founders Across Industries:
          </span>
          <div className="flex flex-wrap items-center gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 font-sans">APEX COMMERCE</span>
            <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 font-sans">ROAD SAFETY MOVEMENT</span>
            <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 font-sans">GLOBAL FLEET GPS</span>
            <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 font-sans">VENTURESCALE</span>
            <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 font-sans">SHAP AI LABS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
