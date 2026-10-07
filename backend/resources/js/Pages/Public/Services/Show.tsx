import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Code,
  Cpu,
  Palette,
  Building2,
  ShoppingBag,
  Activity,
  Smartphone,
  Server,
  Terminal,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsService } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { soundEngine } from '../../../lib/soundEngine';
import { truncate } from '../../../lib/markdown';

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

interface ServiceShowProps extends CmsData {
  service: CmsService;
  related?: CmsService[];
}

export default function ServiceShow({ service, related = [], ...cms }: ServiceShowProps) {
  const [showCode, setShowCode] = useState(false);

  const Icon = iconMap[service.icon_name || ''] || Code;
  const features = Array.isArray(service.features) ? service.features : [];
  const technologies = Array.isArray(service.technologies) ? service.technologies : [];
  const architecturePoints = Array.isArray(service.architecture_points) ? service.architecture_points : [];

  const description = truncate(
    service.tagline || service.description || `${service.title} services from DevCenterPoint.`,
    158
  );

  return (
    <PublicPageShell
      cms={cms}
      meta={{
        title: `${service.title} Services | DevCenterPoint`,
        description,
        canonicalPath: `/services/${service.slug}`,
      }}
      extraJsonLd={({ origin, canonicalUrl }) => [
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#service`,
          name: service.title,
          serviceType: service.title,
          description: service.description || service.tagline || '',
          url: canonicalUrl,
          provider: { '@id': `${origin}/#organization` },
          areaServed: ['Worldwide', 'United States', 'Europe', 'Asia-Pacific'],
          ...(technologies.length ? { availableChannel: { '@type': 'ServiceChannel', serviceUrl: canonicalUrl } } : {}),
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service.title} Deliverables`,
            itemListElement: features.map((feature) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: feature },
            })),
          },
        },
      ]}
    >
      <PageMasthead
        eyebrow="Service"
        title={service.title}
        description={service.tagline || undefined}
        crumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All services</span>
          </Link>
          <Link
            href="/#contact"
            onClick={() => soundEngine.playTap()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-colors"
          >
            <span>Start a project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </PageMasthead>

      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Primary narrative column */}
          <div className="lg:col-span-8 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="liquid-glass rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200/80 dark:border-white/10">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  What this engagement delivers
                </h2>
              </div>

              {service.description && (
                <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed mb-8">
                  {service.description}
                </p>
              )}

              {features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-neutral-300 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {architecturePoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="liquid-glass rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 dark:ring-white/10"
              >
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200/80 dark:border-white/10">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Architectural standards
                  </h2>
                </div>

                <ul className="space-y-3">
                  {architecturePoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-neutral-300 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {service.code_snippet && (
              <div className="liquid-glass rounded-3xl p-6 sm:p-8 ring-1 ring-black/5 dark:ring-white/10">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setShowCode((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showCode ? 'Hide implementation sample' : 'View implementation sample'}</span>
                </button>

                {showCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-neutral-950 text-neutral-200 p-4 sm:p-5 rounded-2xl font-mono text-[11px] leading-relaxed border border-neutral-800 overflow-x-auto shadow-inner"
                  >
                    <pre>
                      <code>{service.code_snippet}</code>
                    </pre>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: stack, related services, CTA */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
            {technologies.length > 0 && (
              <div className="liquid-glass rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400">
                    Core stack & tooling
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs font-medium text-slate-700 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div className="liquid-glass rounded-3xl p-6 ring-1 ring-black/5 dark:ring-white/10">
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400 mb-4">
                  Related services
                </h2>
                <ul className="space-y-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/services/${item.slug}`}
                        className="group flex items-center justify-between gap-3 py-2 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{item.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-3xl p-6 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-blue-600/20">
              <h2 className="text-lg font-black tracking-tight mb-2">Scope this service</h2>
              <p className="text-xs text-blue-50/90 leading-relaxed mb-4 font-medium">
                Tell us the workflow you need and we will respond with an architecture direction and a realistic
                timeline.
              </p>
              <Link
                href="/#contact"
                onClick={() => soundEngine.playTap()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors"
              >
                <span>Start a project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </PublicPageShell>
  );
}
