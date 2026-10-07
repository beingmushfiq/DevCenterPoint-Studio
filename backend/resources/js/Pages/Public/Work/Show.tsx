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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All case studies</span>
          </Link>
          {work.live_url && (
            <a
              href={work.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-colors"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          )}
        </div>
      </PageMasthead>

      {/* Key facts strip */}
      <section className="py-8 bg-white dark:bg-[#07090e] border-b border-slate-200/70 dark:border-white/5 transition-colors duration-500">
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
                  className="liquid-glass rounded-2xl p-4 ring-1 ring-black/5 dark:ring-white/10"
                >
                  <dt className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-500 mb-1.5">
                    <item.icon className="w-3 h-3" />
                    {item.label}
                  </dt>
                  <dd className="text-sm font-black text-slate-900 dark:text-white">{item.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {work.hero_image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
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
                  className="liquid-glass rounded-3xl p-6 text-center ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500">
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
            <article className="pt-8 border-t border-slate-200/70 dark:border-white/10">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400 mb-5">
                More case studies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/work/${item.slug}`}
                    className="group liquid-glass rounded-2xl p-5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-blue-500/40 transition-all"
                  >
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 line-clamp-2 font-medium">
                      {item.tagline || item.overview}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      Read case study
                      <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
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
