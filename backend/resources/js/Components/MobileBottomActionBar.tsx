import React, { useState, useEffect } from 'react';
import { ArrowUpRight, MessageCircle, Zap, Calendar } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';
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
  const bookingLabel = cms.getSetting('booking_cta_label', 'Book a Meeting');
  const whatsappNumber = cms.getSetting('whatsapp_number', '+8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', "Hi DevCenterPoint, I'd like to discuss a project")
  );

  // Auto-hide bottom bar when user reaches the contact section or bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // Hide if contact form is in the viewport
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
    soundEngine.playClick();
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="max-w-md mx-auto pointer-events-auto p-1.5 rounded-full bg-slate-950/92 dark:bg-[#121212]/95 backdrop-blur-xl border border-slate-800/80 dark:border-[#2a2a2a] shadow-2xl flex items-center justify-between gap-1.5 text-white">
        
        {/* Direct WhatsApp Instant Consultation */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playClick()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all active:scale-95"
          title="Direct WhatsApp with Lead Architect"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>

        {/* Book a Meeting (Cal.com) */}
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/35 text-xs font-bold transition-all active:scale-95"
            title={bookingLabel}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </a>
        )}

        {/* 1-Click Live Demos Sandbox Modal */}
        {onOpenSandbox && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playModalOpen();
              onOpenSandbox();
            }}
            className="px-3 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="Open Live Demos"
          >
            <Zap className="w-3 h-3 text-blue-400" />
            <span>Demos</span>
          </button>
        )}

        {/* Primary Start a Project Button */}
        <button
          type="button"
          onClick={scrollToContact}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
        >
          <span>Start Project</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </nav>
  );
};
