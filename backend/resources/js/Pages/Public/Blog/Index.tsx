import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsPost } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { SectionState } from '../../../Components/SectionState';
import { soundEngine } from '../../../lib/soundEngine';

interface BlogIndexProps extends CmsData {
  posts?: CmsPost[];
}

function formatDate(value?: string): string {
  if (!value) return '';
  // Parsed manually so the server-rendered string and the client-hydrated
  // string are byte-identical (Intl output can differ across ICU versions).
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

export default function BlogIndex(props: BlogIndexProps) {
  const posts = props.posts ?? [];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => {
      if (post.category) set.add(post.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? posts : posts.filter((post) => post.category === activeCategory)),
    [posts, activeCategory]
  );

  return (
    <PublicPageShell
      cms={props}
      meta={{
        title: 'Engineering Blog — Software, ERP & AI Notes | DevCenterPoint',
        description:
          'Practical notes on custom software strategy, Laravel and React engineering, ERP delivery and applied AI — written from real production projects in Bangladesh.',
        canonicalPath: '/blog',
      }}
      extraJsonLd={({ origin, canonicalUrl }) =>
        posts.length
          ? [
              {
                '@type': 'Blog',
                '@id': `${canonicalUrl}#blog`,
                name: 'DevCenterPoint Engineering Blog',
                url: canonicalUrl,
                publisher: { '@id': `${origin}/#organization` },
                blogPost: posts.map((post) => ({
                  '@type': 'BlogPosting',
                  headline: post.title,
                  url: `${origin}/blog/${post.slug}`,
                  datePublished: post.published_at || undefined,
                  author: { '@type': 'Organization', name: post.author_name || 'DevCenterPoint' },
                })),
              },
            ]
          : []
      }
    >
      <PageMasthead
        eyebrow="Engineering Blog"
        title="Notes From Production Software"
        description="Strategy breakdowns and engineering write-ups from the systems we ship — written for buyers and technical leads, not for search engines."
        crumbs={[{ label: 'Blog' }]}
      >
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shrink-0 transition-all border hairline-border cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </PageMasthead>

      <section className="py-16 sm:py-24 bg-[var(--bg-canvas)] text-[var(--text-ink)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <SectionState
              variant="empty"
              title="No articles published yet"
              description="The engineering blog is being written right now. Please check back shortly."
            />
          ) : filtered.length === 0 ? (
            <SectionState
              variant="empty"
              title="No articles in this category"
              description="There are no published articles under this topic yet. Try another category."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: (idx % 3) * 0.05 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col editorial-card rounded-2xl overflow-hidden hover:border-[var(--accent-primary)] transition-all duration-200"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-video overflow-hidden bg-[var(--bg-subtle)] border-b hairline-border">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        {post.category && (
                          <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)]">
                            <Tag className="w-3 h-3" />
                            {post.category}
                          </span>
                        )}
                        {post.published_at && (
                          <time dateTime={post.published_at} className="inline-flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </time>
                        )}
                      </div>

                      <h2 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-ink)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-3 font-normal">
                        {post.excerpt}
                      </p>

                      <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)]">
                        <span>Read write-up</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicPageShell>
  );
}
