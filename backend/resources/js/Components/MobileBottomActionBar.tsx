import React, { useState, useEffect } from 'react';
import { ArrowUpRight, MessageCircle, Zap, Calendar } from 'lucide-react';
import { useCms } from '../Context/CmsContext';

interface MobileBottomActionBarProps {
  onOpenSandbox?: () => void;
}

export const MobileBottomActionBar: React.FC<MobileBottomActionBarProps> = ({
  onOpenSandbox
}) => {
  const cms = useCms();
  const [visible, setVisible] = useState(true);

  const bookingUrl = cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');
  const bookingLabel = cms.getSetting('booking_cta_label', 'Book');
  const whatsappNumber = cms.getSetting('whatsapp_number', '+8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', "Hi DevCenterPoint, I'd like to discuss an engineering project")
  );

  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          setVisible(false);
          return;
        }
      }
      setVisible(true);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none animate-in slide-in-from-bottom-3 duration-200"
    >
      <div className="max-w-md mx-auto pointer-events-auto p-1.5 rounded-xl bg-[var(--bg-surface)] backdrop-blur-md border hairline-border shadow-lg flex items-center justify-between gap-1 text-[var(--text-ink)]">
        
        {/* 1. Direct WhatsApp Instant Consultation */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-all active:scale-95 whitespace-nowrap"
          title="Direct WhatsApp with Lead Architect"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* 2. Book a Consultation (Cal.com) */}
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 px-1.5 py-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-ink)] border hairline-border text-[11px] font-mono font-bold transition-all active:scale-95 whitespace-nowrap"
            title={bookingLabel}
          >
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
            <span>Book</span>
          </a>
        )}

        {/* 3. 1-Click Live Demos Sandbox Modal */}
        {onOpenSandbox && (
          <button
            type="button"
            onClick={onOpenSandbox}
            className="flex-1 min-w-0 px-1.5 py-2 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-ink)] border hairline-border text-[11px] font-mono font-bold flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Open Live Demos"
          >
            <Zap className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
            <span>Demos</span>
          </button>
        )}

        {/* 4. Primary Estimate Project Scope Button */}
        <button
          type="button"
          onClick={scrollToContact}
          className="flex-1 min-w-0 editorial-btn-primary inline-flex items-center justify-center gap-1 px-1.5 py-2 text-[11px] font-bold active:scale-95 transition-all cursor-pointer whitespace-nowrap rounded-lg"
          title="Estimate Project Scope"
        >
          <span>Scope</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </button>

      </div>
    </nav>
  );
};
