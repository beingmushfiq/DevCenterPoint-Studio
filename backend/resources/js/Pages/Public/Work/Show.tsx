import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ExternalLink, Github, Calendar, Users, Clock, AlertTriangle, Wrench } from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsProject } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { truncate } from '../../../lib/markdown';

interface WorkShowProps extends CmsData {
  work: CmsProject;
  related?: CmsProject[];
}

export default function WorkShow({ work, related = [], ...cms }: WorkShowProps) {
  const metrics = Array.isArray(work.metrics) ? work.metrics : [];
  const techStack = Array.isArray(work.tech_stack) ? work.tech_stack : [];
  const gallery = Array.isArray(work.gallery) ? work.gallery : [];

  const description = truncate(
    work.tagline ? `${work.tagline}. ${work.overview ?? ''}` : work.overview || `${work.title} case study.`,
    158
  );

  const screenshots = gallery.filter((src) => src && src !== work.hero_image_url);

  return (
    <PublicPageShell
      cms={cms}
      meta={{
        title: `${work.title} — Case Study | DevCenterPoint`,
        description,
        canonicalPath: `/work/${work.slug}`,
      }}
      extraJsonLd={({ origin, canonicalUrl, ogImageUrl }) => [
        {
          '@type': 'SoftwareApplication',
          '@id': `${canonicalUrl}#software`,
          name: work.title,
          applicationCategory: work.category || 'BusinessApplication',
          operatingSystem: 'Cloud / Web Browser / Mobile',
          description: work.overview || work.tagline || '',
          url: work.live_url || canonicalUrl,
          image: ogImageUrl,
          author: { '@id': `${origin}/#organization` },
          publisher: { '@id': `${origin}/#organization` },
          ...(techStack.length ? { softwareRequirements: techStack.join(', ') } : {}),
        },
        {
          '@type': 'CreativeWork',
          '@id': `${canonicalUrl}#case-study`,
          name: `${work.title} — Case Study`,
          url: canonicalUrl,
          about: { '@id': `${canonicalUrl}#software` },
          creator: { '@id': `${origin}/#organization` },
        },
      ]}
    >
      <PageMasthead
        eyebrow="Case Study"
        title={work.title}
        description={work.tagline || undefined}
        crumbs={[{ label: 'Work', href: '/work' }, { label: work.title }]}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-ink)] border hairline-border hover:border-[var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All case studies</span>
          </Link>
          {work.live_url && (
            <a
              href={work.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold"
            >
              <span>View live product</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {work.github_url && (
            <a
              href={work.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-ink)] border hairline-border hover:border-[var(--accent-primary)] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          )}
        </div>
      </PageMasthead>

      {/* Key facts strip */}
      <section className="py-6 bg-[var(--bg-canvas)] border-b hairline-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Client', value: work.client, icon: Users },
              { label: 'Category', value: work.category, icon: Wrench },
              { label: 'Year', value: work.year, icon: Calendar },
              { label: 'Duration', value: work.duration, icon: Clock },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <div
                  key={item.label}
                  className="editorial-card rounded-xl p-4"
                >
                  <dt className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    <item.icon className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    {item.label}
                  </dt>
                  <dd className="text-sm font-bold text-[var(--text-ink)]">{item.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {work.hero_image_url && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden border hairline-border shadow-xs"
            >
              <img
                src={work.hero_image_url}
                alt={`${work.title} interface`}
                className="w-full aspect-video object-cover"
              />
            </motion.div>
          )}

          {metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="editorial-card rounded-xl p-6 text-center"
                >
                  <div className="text-2xl sm:text-3xl font-black text-[var(--accent-primary)] font-mono">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {work.overview && (
            <article>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
                {work.overview}
              </p>
            </article>
          )}

          {work.problem && (
            <article>
              <h2 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                The problem
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
                {work.problem}
              </p>
            </article>
          )}

          {work.solution && (
            <article>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                The solution
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 leading-relaxed">
                {work.solution}
              </p>
            </article>
          )}

          {techStack.length > 0 && (
            <article>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                Technology stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs font-medium text-slate-700 dark:text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          )}

          {screenshots.length > 0 && (
            <article>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                Product gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {screenshots.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${work.title} screenshot ${idx + 1}`}
                    loading="lazy"
                    className="w-full aspect-16/10 object-cover rounded-2xl ring-1 ring-black/5 dark:ring-white/10"
                  />
                ))}
              </div>
            </article>
          )}

          {related.length > 0 && (
            <article className="pt-8 border-t hairline-border">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-5">
                More case studies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    className="group editorial-card rounded-xl p-5 hover:border-[var(--accent-primary)] transition-all"
                  >
                    <h3 className="text-sm font-black text-[var(--text-ink)] mb-1.5 group-hover:text-[var(--accent-primary)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 font-normal">
                      {item.tagline || item.overview}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--accent-primary)]">
                      Read case study
                      <ArrowRight className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
