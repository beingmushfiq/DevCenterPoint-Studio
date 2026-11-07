import React from 'react';
import { ArrowUp, Github, Mail, MapPin, ExternalLink, User, Calendar } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { SocialIcon } from '../SocialIcons';
import { useFooterData } from './useFooterData';

export const FooterFourColumn: React.FC = () => {
  const footer = useFooterData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-canvas)] text-[var(--text-ink)] border-t hairline-border font-sans pt-16 pb-24 sm:pb-16 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b hairline-border">
          <div className="md:col-span-4 space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-sm font-normal">
              {footer.bio}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[10px]">{footer.statusLabel}</span>
            </div>

            {footer.showBooking && (
              <div className="pt-1">
                <a
                  href={footer.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-btn-primary inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{footer.bookingLabel}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <a
                href={footer.founderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-ink)] hover:text-[var(--accent-primary)] border hairline-border hover:border-[var(--accent-primary)] transition-colors font-mono font-bold text-[11px]"
              >
                <User className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Founder Portfolio</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </a>

              <a
                href={footer.socialGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-ink)] hover:text-[var(--accent-primary)] border hairline-border hover:border-[var(--accent-primary)] transition-colors font-mono font-bold text-[11px]"
              >
                <Github className="w-3.5 h-3.5 text-[var(--text-ink)]" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title} className="md:col-span-2 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                {column.title}
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-medium">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      className="hover:text-[var(--accent-primary)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Studio Network
            </div>
            <div className="space-y-1.5">
              {footer.socialNetwork.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border hairline-border hover:border-[var(--accent-primary)] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SocialIcon
                      name={channel.platform}
                      className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors shrink-0"
                    />
                    <span className="text-xs font-semibold text-[var(--text-ink)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                      {channel.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {channel.handle}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs text-[var(--text-muted)] font-medium">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <Mail className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <a
                href={`mailto:${footer.contactEmail}`}
                className="hover:text-[var(--accent-primary)] transition-colors"
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
                className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors font-mono"
              >
                WhatsApp: {footer.contactPhone}
              </a>
            </div>
            <div className="pt-2 text-[11px] text-[var(--text-muted)] font-mono">
              Direct engineering triage &lt; 24h
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[var(--text-muted)] text-center sm:text-left">
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
                  className="text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors font-semibold underline"
                >
                  {footer.founderName}
                </a>
                . All rights reserved.
              </>
            )}
          </div>

          <div className="text-[var(--text-muted)] italic">
            "{footer.tagline}"
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--accent-primary)] text-[var(--text-ink)] hover:text-white border hairline-border hover:border-[var(--accent-primary)] transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase cursor-pointer"
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
