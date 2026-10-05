import React from 'react';
import { Calendar } from 'lucide-react';
import { useCms } from '../Context/CmsContext';
import { soundEngine } from '../lib/soundEngine';

interface BookingCtaProps {
  url?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    'bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25',
  secondary:
    'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10',
  solid:
    'bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-xs gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

export const BookingCta: React.FC<BookingCtaProps> = ({
  url,
  label,
  variant = 'primary',
  size = 'md',
  className = '',
  iconOnly = false,
}) => {
  const cms = useCms();
  const bookingUrl = url || cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');

  if (!bookingUrl) return null;

  const bookingLabel = label || cms.getSetting('booking_cta_label', 'Book a Meeting');

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => soundEngine.playClick()}
      aria-label={bookingLabel}
      title={bookingLabel}
      className={`inline-flex items-center justify-center rounded-full font-bold transition-all active:scale-95 cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      <Calendar className="w-3.5 h-3.5" />
      {!iconOnly && <span className="whitespace-nowrap">{bookingLabel}</span>}
    </a>
  );
};
