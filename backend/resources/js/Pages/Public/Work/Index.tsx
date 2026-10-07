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

      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500">
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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (idx % 2) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={`/work/${work.slug}`}
                    className="group flex h-full flex-col liquid-glass rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 hover:ring-blue-500/40 transition-all duration-300"
                  >
                    {work.thumbnail_url && (
                      <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-neutral-900">
                        <img
                          src={work.thumbnail_url}
                          alt={`${work.title} — case study`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {work.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm text-[10px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                            {work.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">
                        {work.title}
                      </h2>

                      {work.tagline && (
                        <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                          {work.tagline}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-5">
                        {work.overview}
                      </p>

                      {Array.isArray(work.metrics) && work.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-5">
                          {work.metrics.slice(0, 3).map((metric, i) => (
                            <div
                              key={i}
                              className="rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 p-3 text-center"
                            >
                              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                {metric.value}
                              </div>
                              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-500 mt-1 leading-tight">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>Read the case study</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>Discuss a project like these</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
