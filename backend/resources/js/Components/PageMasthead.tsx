import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

interface PageMastheadProps {
  /** Small uppercase eyebrow above the heading. */
  eyebrow: string;
  title: string;
  description?: string;
  /** Breadcrumb trail, excluding the leading "Home" crumb. */
  crumbs?: Crumb[];
  children?: React.ReactNode;
}

/**
 * The heading block shared by every standalone public page. Sits clear of the
 * fixed header (`pt-32`) so the server-rendered `<h1>` is never clipped.
 */
export const PageMasthead: React.FC<PageMastheadProps> = ({
  eyebrow,
  title,
  description,
  crumbs = [],
  children,
}) => {
  return (
    <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-20 bg-white dark:bg-[#07090e] border-b border-slate-200/70 dark:border-white/5 overflow-hidden transition-colors duration-500">
      {/* Ambient glow, matching the homepage section headers. */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs mirror the BreadcrumbList in the JSON-LD graph. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, idx) => (
              <li key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-slate-400 dark:text-neutral-600" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-700 dark:text-neutral-300">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 liquid-glass px-4 py-1.5 rounded-full mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            {eyebrow}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white text-balance">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-neutral-400 font-medium leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};

export default PageMasthead;
