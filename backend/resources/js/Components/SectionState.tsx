import React from 'react';
import { AlertCircle, Inbox, Loader2, RotateCw } from 'lucide-react';

export type SectionStateVariant = 'loading' | 'empty' | 'error';

interface SectionStateProps {
  /** Which state to render. */
  variant: SectionStateVariant;
  /** Optional headline override. */
  title?: string;
  /** Optional supporting copy override. */
  description?: string;
  /** Optional custom icon. */
  icon?: React.ElementType;
  /** Optional action button label. */
  actionLabel?: string;
  /** Optional action handler. */
  onAction?: () => void;
  /** Number of skeleton rows to render for the `loading` variant. */
  skeletonRows?: number;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
}

const DEFAULTS: Record<SectionStateVariant, { title: string; description: string }> = {
  loading: {
    title: 'Loading content',
    description: 'Fetching the latest published content from the studio CMS.',
  },
  empty: {
    title: 'Nothing published yet',
    description: 'There is no content available here at the moment. Check back soon.',
  },
  error: {
    title: 'We could not load this section',
    description: 'Something went wrong while loading this content. Please try again.',
  },
};

/**
 * Shared, on-brand placeholder for the loading / empty / error states
 * of any data-driven public section.
 */
export const SectionState: React.FC<SectionStateProps> = ({
  variant,
  title,
  description,
  icon,
  actionLabel,
  onAction,
  skeletonRows = 3,
  className = '',
}) => {
  const copy = DEFAULTS[variant];

  if (variant === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`w-full rounded-3xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-[#222222] p-6 sm:p-8 ${className}`}
      >
        <div className="flex items-center gap-2.5 mb-6 text-slate-500 dark:text-neutral-400">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            {title || copy.title}
          </span>
        </div>
        <div className="space-y-3">
          {Array.from({ length: Math.max(1, skeletonRows) }).map((_, idx) => (
            <div
              key={idx}
              className="h-4 rounded-full bg-slate-200/70 dark:bg-neutral-800/70 animate-shimmer"
              style={{ width: `${100 - idx * 12}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const IconComp = icon || (variant === 'error' ? AlertCircle : Inbox);
  const accent =
    variant === 'error'
      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
      : 'bg-slate-100 dark:bg-[#181818] border-slate-200 dark:border-[#2b2b2b] text-slate-500 dark:text-neutral-400';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#222222] ${className}`}
    >
      <div
        className={`mx-auto w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 ${accent}`}
      >
        <IconComp className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
        {title || copy.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto font-medium leading-relaxed">
        {description || copy.description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default SectionState;
