import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Terminal,
  Layers,
  Code,
  Cpu,
  Palette,
  Building2,
  ShoppingBag,
  Activity,
  Smartphone,
  Server,
} from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsService } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-ink)] border hairline-border hover:border-[var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All services</span>
          </Link>
          <Link
            href="/#contact"
            className="editorial-btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold"
          >
            <span>Start a project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </PageMasthead>

      <section className="py-16 sm:py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Primary narrative column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="editorial-card rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 pb-5 mb-6 border-b hairline-border">
                <div className="p-2.5 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)] border hairline-border">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[var(--text-ink)]">
                  What this discipline delivers
                </h2>
              </div>

              {service.description && (
                <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8 font-normal">
                  {service.description}
                </p>
              )}

              {features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--bg-subtle)] border hairline-border"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[var(--text-ink)] font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {architecturePoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3 }}
                className="editorial-card rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 pb-5 mb-6 border-b hairline-border">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[var(--text-ink)]">
                    Architectural standards & quality gates
                  </h2>
                </div>

                <ul className="space-y-3">
                  {architecturePoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-ink)] font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0 mt-2" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {service.code_snippet && (
              <div className="editorial-card rounded-2xl p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setShowCode((prev) => !prev)}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showCode ? 'Hide implementation sample' : 'View implementation sample'}</span>
                </button>

                {showCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-slate-900 dark:bg-black text-slate-100 p-4 sm:p-5 rounded-xl font-mono text-[11px] leading-relaxed border border-slate-800 overflow-x-auto"
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
              <div className="editorial-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
                  <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Core stack & tooling
                  </h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {related.length > 0 && (
              <div className="editorial-card rounded-2xl p-6">
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
                  Related disciplines
                </h2>
                <ul className="space-y-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/services/${item.slug}`}
                        className="group flex items-center justify-between gap-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                      >
                        <span>{item.title}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl p-6 bg-[var(--accent-subtle)] border hairline-border">
              <h2 className="text-base font-black tracking-tight text-[var(--text-ink)] mb-2">Scope this discipline</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 font-normal">
                Tell us the workflow you need and we will respond with an architecture direction and a realistic
                timeline.
              </p>
              <Link
                href="/#contact"
                className="editorial-btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold"
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
