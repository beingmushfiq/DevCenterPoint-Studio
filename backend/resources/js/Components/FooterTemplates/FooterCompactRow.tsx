import React from 'react';
import { ArrowUp, Mail, Calendar } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { SocialIcon } from '../SocialIcons';
import { useFooterData } from './useFooterData';

export const FooterCompactRow: React.FC = () => {
  const footer = useFooterData();

  const flatLinks = footer.columns.flatMap((c) => c.links).slice(0, 6);

  return (
    <footer className="bg-[var(--bg-canvas)] text-[var(--text-ink)] border-t hairline-border font-sans py-10 sm:py-12 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />

            <div className="hidden sm:block w-px h-6 bg-[var(--border-hairline)]" />

            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[var(--text-muted)]">
              {flatLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="hover:text-[var(--accent-primary)] transition-colors"
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
                className="editorial-btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{footer.bookingLabel}</span>
              </a>
            )}

            <a
              href={`mailto:${footer.contactEmail}`}
              className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="Email us"
            >
              <Mail className="w-4 h-4" />
            </a>

            {footer.socialNetwork.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.name}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <SocialIcon name={channel.platform} className="w-4 h-4" />
              </a>
            ))}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-muted)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t hairline-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-medium text-[var(--text-muted)]">
          <span>{footer.copyrightText || `© ${new Date().getFullYear()} ${footer.brandName}. All rights reserved.`}</span>
          <span className="italic">"{footer.tagline}"</span>
        </div>
      </div>
    </footer>
  );
};
