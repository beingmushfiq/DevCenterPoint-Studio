import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Cpu,
  Palette,
  Building2,
  ShoppingBag,
  Activity,
  Smartphone,
  Server,
  CheckCircle,
} from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsService } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { SectionState } from '../../../Components/SectionState';

const iconMap: Record<string, React.ElementType> = {
  Code2: Code,
  Cpu,
  Palette,
  Building2,
  ShoppingBag,
  Activity,
  Smartphone,
  Server,
};

interface ServicesIndexProps extends CmsData {
  services?: CmsService[];
}

export default function ServicesIndex(props: ServicesIndexProps) {
  const services = props.services ?? [];

  return (
    <PublicPageShell
      cms={props}
      meta={{
        title: 'Software Development Services — Web, ERP, AI & Cloud | DevCenterPoint',
        description:
          'Custom software development services from a Dhaka-based engineering studio: SaaS platforms, enterprise ERP, AI systems, mobile apps and cloud infrastructure.',
        canonicalPath: '/services',
      }}
      extraJsonLd={({ origin, canonicalUrl }) =>
        services.length
          ? [
              {
                '@type': 'ItemList',
                '@id': `${canonicalUrl}#service-list`,
                name: 'Engineering Services',
                itemListElement: services.map((service, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: service.title,
                  url: `${origin}/services/${service.slug}`,
                })),
              },
            ]
          : []
      }
    >
      <PageMasthead
        eyebrow="Services"
        title="Custom Software Development Services"
        description="Each discipline below is a service you can scope and commission directly. Every engagement is delivered by a senior squad with the architecture, testing and handover documentation included."
        crumbs={[{ label: 'Services' }]}
      />

      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <SectionState
              variant="empty"
              title="Services are being published"
              description="Our service catalogue is being updated right now. Please check back shortly, or contact us to discuss your project directly."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, idx) => {
                const Icon = iconMap[service.icon_name || ''] || Code;
                const highlights = Array.isArray(service.features) ? service.features.slice(0, 4) : [];

                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: (idx % 2) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={`/services/${service.slug}`}
                      className="group flex h-full flex-col liquid-glass rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 dark:ring-white/10 hover:ring-blue-500/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-neutral-500">
                          Service {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                        {service.title}
                      </h2>

                      {service.tagline && (
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                          {service.tagline}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-normal mb-5">
                        {service.description}
                      </p>

                      {highlights.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {highlights.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-700 dark:text-neutral-300 font-medium"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>Explore this service</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
