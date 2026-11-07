import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsProject } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { SectionState } from '../../../Components/SectionState';

interface WorkIndexProps extends CmsData {
  works?: CmsProject[];
}

export default function WorkIndex(props: WorkIndexProps) {
  const works = props.works ?? [];

  return (
    <PublicPageShell
      cms={props}
      meta={{
        title: 'Case Studies — Software Projects & Products | DevCenterPoint',
        description:
          'Explore DevCenterPoint case studies across ERP, healthcare, commerce and AI products, with the architecture decisions and measured outcomes behind each build.',
        canonicalPath: '/work',
      }}
      extraJsonLd={({ origin, canonicalUrl }) =>
        works.length
          ? [
              {
                '@type': 'ItemList',
                '@id': `${canonicalUrl}#case-study-list`,
                name: 'DevCenterPoint Case Studies',
                itemListElement: works.map((work, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  name: work.title,
                  url: `${origin}/work/${work.slug}`,
                })),
              },
            ]
          : []
      }
    >
      <PageMasthead
        eyebrow="Selected Work"
        title="Case Studies & Engineered Products"
        description="Systems we designed, built and shipped. Each case study covers the problem, the architecture decision and the measured outcome — not just screenshots."
        crumbs={[{ label: 'Work' }]}
      />

      <section className="py-16 sm:py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {works.length === 0 ? (
            <SectionState
              variant="empty"
              title="Case studies are being published"
              description="Our project archive is being updated right now. Please check back shortly, or contact us to discuss relevant work directly."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {works.map((work, idx) => (
                <motion.div
                  key={work.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: (idx % 2) * 0.05 }}
                >
                  <Link
                    href={`/work/${work.slug}`}
                    className="group flex h-full flex-col editorial-card rounded-2xl overflow-hidden hover:border-[var(--accent-primary)] transition-all duration-200"
                  >
                    {work.thumbnail_url && (
                      <div className="relative aspect-video overflow-hidden bg-[var(--bg-subtle)] border-b hairline-border">
                        <img
                          src={work.thumbnail_url}
                          alt={`${work.title} — case study`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                        {work.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-ink)] border hairline-border shadow-xs">
                            {work.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-[var(--text-ink)] mb-1.5">
                        {work.title}
                      </h2>

                      {work.tagline && (
                        <p className="text-xs sm:text-sm font-bold text-[var(--accent-primary)] mb-3">
                          {work.tagline}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-5 font-normal">
                        {work.overview}
                      </p>

                      {Array.isArray(work.metrics) && work.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-5">
                          {work.metrics.slice(0, 3).map((metric, i) => (
                            <div
                              key={i}
                              className="rounded-xl bg-[var(--bg-subtle)] border hairline-border p-3 text-center"
                            >
                              <div className="text-sm sm:text-base font-black text-[var(--accent-primary)] font-mono">
                                {metric.value}
                              </div>
                              <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)] mt-1 leading-tight">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)]">
                        <span>Read technical case study</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <a
              href="https://devcenterpoint.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <span>Discuss a production engagement</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
