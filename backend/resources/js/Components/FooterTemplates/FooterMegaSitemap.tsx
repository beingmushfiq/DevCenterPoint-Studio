import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, MapPin, Calendar, ExternalLink, Send } from 'lucide-react';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
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

  const socials = [
    { href: footer.socialGithub, icon: Github, label: 'GitHub' },
    { href: footer.socialLinkedin, icon: Linkedin, label: 'LinkedIn' },
    { href: footer.socialTwitter, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <footer className="bg-white/90 dark:bg-[#07090e] text-slate-900 dark:text-white border-t border-slate-200/70 dark:border-white/5 font-sans pt-20 pb-16 relative transition-colors duration-500 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/8 dark:bg-blue-600/12 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/8 dark:bg-purple-600/12 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top: Brand + Booking + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-14 border-b border-slate-200/80 dark:border-white/10">
          <div className="space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm font-medium">
              {footer.bio}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shadow-[0_0_8px_#22c55e]"></span>
              <span className="uppercase tracking-widest text-[10px]">{footer.statusLabel}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Book a Discovery Call
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
              Pick a slot that works for you. We will review your goals and map a technical roadmap on the call.
            </p>
            {footer.showBooking ? (
              <a
                href={footer.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25"
              >
                <Calendar className="w-4 h-4" />
                <span>{footer.bookingLabel}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            ) : (
              <a
                href={`mailto:${footer.contactEmail}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-800 dark:text-gray-200 text-xs font-bold"
              >
                <Mail className="w-4 h-4" />
                <span>{footer.contactEmail}</span>
              </a>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Engineering Dispatch
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
              Architecture notes, system breakdowns, and studio updates. No noise.
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
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#141414] border border-slate-200 dark:border-[#282828] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle: Full sitemap grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 py-14">
          {footer.columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                {column.title}
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
                {column.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Studio Ecosystem
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
              {footer.ecosystemLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-gray-400 font-bold">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <a href={`mailto:${footer.contactEmail}`} className="hover:text-blue-600 dark:hover:text-white transition-colors">
                {footer.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-gray-500">
          <div>
            {footer.copyrightText || (
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
                .
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
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
