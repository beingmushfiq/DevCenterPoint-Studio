import React from 'react';
import { ArrowUp, Github, Mail, MapPin, ExternalLink, User, Calendar } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { useFooterData } from './useFooterData';

export const FooterFourColumn: React.FC = () => {
  const footer = useFooterData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accentClass = (accent?: string) => {
    if (accent === 'emerald') return 'text-emerald-500 group-hover:text-emerald-400';
    if (accent === 'blue') return 'text-blue-500';
    return 'text-slate-400';
  };

  return (
    <footer className="bg-white/90 dark:bg-[#07090e] text-slate-900 dark:text-white border-t border-slate-200/70 dark:border-white/5 font-sans pt-20 pb-28 sm:pb-16 relative transition-colors duration-500 overflow-hidden">
      <div className="absolute bottom-0 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-500/8 dark:bg-blue-600/12 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-96 h-96 bg-purple-500/8 dark:bg-purple-600/12 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200/80 dark:border-white/10">
          <div className="md:col-span-4 space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />

            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm font-medium">
              {footer.bio}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shadow-[0_0_8px_#22c55e]"></span>
              <span className="uppercase tracking-widest text-[10px]">{footer.statusLabel}</span>
            </div>

            {footer.showBooking && (
              <div className="pt-1">
                <a
                  href={footer.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{footer.bookingLabel}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            )}

            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
              <a
                href={footer.founderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#282828] hover:border-blue-400 transition-colors font-bold text-[11px]"
              >
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Founder Portfolio</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={footer.socialGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#282828] hover:border-blue-400 transition-colors font-bold text-[11px]"
              >
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-gray-300" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title} className="md:col-span-2 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                {column.title}
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      className="hover:text-blue-600 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Studio Ecosystem
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
              {footer.ecosystemLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                    {link.note && (
                      <span className={`text-[10px] font-mono group-hover:text-blue-500 ${accentClass(link.accent)}`}>
                        {link.note}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs text-slate-600 dark:text-gray-400 font-bold">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <a
                href={`mailto:${footer.contactEmail}`}
                className="hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                {footer.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <a
                href={footer.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
              >
                WhatsApp: {footer.contactPhone}
              </a>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-gray-400 font-mono">
              Inquiries processed in &lt; 24h
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-gray-500">
          <div>
            {footer.copyrightText ? (
              footer.copyrightText
            ) : (
              <>
                © {new Date().getFullYear()} {footer.brandName}. Founded by{' '}
                <a
                  href={footer.founderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-slate-700"
                >
                  {footer.founderName}
                </a>
                . All rights reserved.
              </>
            )}
          </div>

          <div className="text-slate-600 dark:text-gray-400 italic font-medium">
            "{footer.tagline}"
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-blue-600 text-slate-800 dark:text-white hover:text-white border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 transition-colors flex items-center gap-1.5 shadow-md font-black uppercase tracking-wider text-[10px] cursor-pointer"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
