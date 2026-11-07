import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CalendarDays, Tag, User } from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsPost } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { renderMarkdown, markdownToPlainText, truncate } from '../../../lib/markdown';

interface BlogShowProps extends CmsData {
  post: CmsPost;
  related?: CmsPost[];
}

function formatDate(value?: string): string {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return '';
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = months[Number(match[2]) - 1];
  if (!month) return '';
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

export default function BlogShow({ post, related = [], ...cms }: BlogShowProps) {
  const html = useMemo(() => renderMarkdown(post.body || ''), [post.body]);

  const description = truncate(
    post.seo_description || post.excerpt || markdownToPlainText(post.body || ''),
    158
  );

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <PublicPageShell
      cms={cms}
      ogType="article"
      meta={{
        title: `${post.seo_title || post.title} | DevCenterPoint`,
        description,
        canonicalPath: `/blog/${post.slug}`,
      }}
      extraJsonLd={({ origin, canonicalUrl, ogImageUrl }) => [
        {
          '@type': 'BlogPosting',
          '@id': `${canonicalUrl}#article`,
          headline: post.title,
          description,
          url: canonicalUrl,
          image: ogImageUrl,
          ...(post.published_at ? { datePublished: post.published_at } : {}),
          ...(post.updated_at ? { dateModified: post.updated_at } : {}),
          author: {
            '@type': 'Organization',
            name: post.author_name || 'DevCenterPoint',
            url: origin,
          },
          publisher: { '@id': `${origin}/#organization` },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${canonicalUrl}#webpage` },
          ...(post.category ? { articleSection: post.category } : {}),
          ...(tags.length ? { keywords: tags.join(', ') } : {}),
        },
      ]}
    >
      <PageMasthead
        eyebrow={post.category || 'Engineering Blog'}
        title={post.title}
        crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      >
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500">
          {post.author_name && (
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {post.author_name}
            </span>
          )}
          {post.published_at && (
            <time dateTime={post.published_at} className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              {formatDate(post.published_at)}
            </time>
          )}
          {post.category && (
            <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
          )}
        </div>
      </PageMasthead>

      <section className="py-16 sm:py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.cover_image_url && (
            <motion.img
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              src={post.cover_image_url}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-2xl border hairline-border mb-10 shadow-xs"
            />
          )}

          {post.excerpt && (
            <p className="text-base sm:text-lg text-[var(--text-ink)] font-medium leading-relaxed pl-5 border-l-2 border-[var(--accent-primary)] mb-10">
              {post.excerpt}
            </p>
          )}

          {/* Article body. `renderMarkdown` escapes all HTML before formatting,
              so the raw CMS string can never inject markup. */}
          <article
            className="text-sm sm:text-base leading-relaxed text-[var(--text-ink)]"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t hairline-border">
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="tech-tag text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--text-ink)] border hairline-border hover:border-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All articles</span>
            </Link>
            <Link
              href="/#contact"
              className="editorial-btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold"
            >
              <span>Discuss your project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t hairline-border">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-5">
                Continue reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group liquid-glass rounded-2xl p-5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-blue-500/40 transition-all"
                  >
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 line-clamp-2 font-medium">
                      {item.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
