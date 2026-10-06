import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Calendar } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { useFooterData } from './useFooterData';

export const FooterCompactRow: React.FC = () => {
  const footer = useFooterData();

  const flatLinks = footer.columns.flatMap((c) => c.links).slice(0, 6);

  const socials = [
    { href: footer.socialGithub, icon: Github, label: 'GitHub' },
    { href: footer.socialLinkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: footer.socialTwitter, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <footer className="bg-white/90 dark:bg-[#07090e] text-slate-900 dark:text-white border-t border-slate-200/70 dark:border-white/5 font-sans py-10 sm:py-12 relative transition-colors duration-500 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/8 dark:bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />

            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-white/10" />

            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold text-slate-600 dark:text-gray-400">
              {flatLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {footer.showBooking && (
              <a
                href={footer.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-[11px] font-bold transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{footer.bookingLabel}</span>
              </a>
            )}

            <a
              href={`mailto:${footer.contactEmail}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
              aria-label="Email us"
            >
              <Mail className="w-4 h-4" />
            </a>

            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-bold text-slate-500 dark:text-gray-500">
          <span>{footer.copyrightText || `© ${new Date().getFullYear()} ${footer.brandName}. All rights reserved.`}</span>
          <span className="italic font-medium">"{footer.tagline}"</span>
        </div>
      </div>
    </footer>
  );
};
