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

      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.cover_image_url && (
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              src={post.cover_image_url}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-3xl ring-1 ring-black/5 dark:ring-white/10 mb-10"
            />
          )}

          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-700 dark:text-neutral-300 font-medium leading-relaxed pl-5 border-l-2 border-blue-500 mb-10">
              {post.excerpt}
            </p>
          )}

          {/* Article body. `renderMarkdown` escapes all HTML before formatting,
              so the raw CMS string can never inject markup. */}
          <article
            className="text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-[11px] font-mono font-bold text-slate-600 dark:text-neutral-400"
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All articles</span>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-colors"
            >
              <span>Discuss your project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200/70 dark:border-white/10">
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400 mb-5">
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
