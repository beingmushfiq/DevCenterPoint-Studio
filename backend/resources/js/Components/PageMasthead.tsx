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
    <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-20 bg-[var(--bg-canvas)] text-[var(--text-ink)] border-b hairline-border overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs mirror the BreadcrumbList in the JSON-LD graph. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
                Studio
              </Link>
            </li>
            {crumbs.map((crumb, idx) => (
              <li key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[var(--border-hairline)]" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--text-ink)]">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-subtle)] border hairline-border px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-ink)] text-balance">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] font-normal leading-relaxed">
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
