import React from 'react';
import { ArrowUp, Mail, MapPin, Calendar, ExternalLink, Send } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { SocialIcon } from '../SocialIcons';
import { useFooterData } from './useFooterData';

export const FooterMegaSitemap: React.FC = () => {
  const footer = useFooterData();
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[var(--bg-canvas)] text-[var(--text-ink)] border-t hairline-border font-sans pt-16 pb-16 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top: Brand + Booking + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12 border-b hairline-border">
          <div className="space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-sm font-normal">
              {footer.bio}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[10px]">{footer.statusLabel}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Book a Discovery Session
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              Direct technical scoping with senior systems architects. Zero sales friction.
            </p>
            {footer.showBooking ? (
              <a
                href={footer.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold"
              >
                <Calendar className="w-4 h-4" />
                <span>{footer.bookingLabel}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ) : (
              <a
                href={`mailto:${footer.contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-ink)] text-xs font-semibold"
              >
                <Mail className="w-4 h-4" />
                <span>{footer.contactEmail}</span>
              </a>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              Engineering Dispatch
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
              Architecture notes, system breakdowns, and studio updates. No fluff.
            </p>
            {subscribed ? (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Send className="w-4 h-4" />
                <span>Subscribed — check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-xs text-[var(--text-ink)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <button
                  type="submit"
                  className="editorial-btn-primary p-2 text-xs font-bold cursor-pointer shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle: Full sitemap grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          {footer.columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-ink)]">
                {column.title}
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-muted)] font-medium">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href} className="hover:text-[var(--accent-primary)] transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-ink)]">
              Studio Ecosystem
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-muted)] font-medium">
              {footer.ecosystemLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-xs text-[var(--text-muted)] font-medium">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-ink)]">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <a href={`mailto:${footer.contactEmail}`} className="hover:text-[var(--accent-primary)] transition-colors">
                {footer.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t hairline-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[var(--text-muted)]">
          <div>
            {footer.copyrightText || (
              <>
                © {new Date().getFullYear()} {footer.brandName}. Founded by{' '}
                <a
                  href={footer.founderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-ink)] hover:text-[var(--accent-primary)] transition-colors underline font-semibold"
                >
                  {footer.founderName}
                </a>
                .
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {footer.socialNetwork.map((channel) => (
              <a
                key={channel.name}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={channel.name}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <SocialIcon name={channel.platform} className="w-3.5 h-3.5" />
              </a>
            ))}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-[var(--bg-surface)] border hairline-border text-[var(--text-muted)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
