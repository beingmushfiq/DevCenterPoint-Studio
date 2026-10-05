import React from 'react';
import {
  X,
  ArrowRight,
  Zap,
  Volume2,
  VolumeX,
  MessageCircle,
  Mail,
  Github,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../ThemeToggle';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { BookingCta } from '../BookingCta';
import { soundEngine } from '../../lib/soundEngine';
import { useHeaderData, useHeaderDrawerLinks, type NavLink } from './useHeaderData';

interface HeaderMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  onOpenSandbox?: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const HeaderMobileDrawer: React.FC<HeaderMobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSandbox,
  isMuted,
  onToggleSound,
}) => {
  const header = useHeaderData();
  const drawerLinks = useHeaderDrawerLinks();

  const renderLink = (item: NavLink) => (
    <button
      key={`${item.label}-${item.href}`}
      type="button"
      onClick={() => onNavigate(item.href)}
      className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all flex items-center justify-between group cursor-pointer"
    >
      <div>
        <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.label}
        </div>
        {item.note && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.note}</div>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs cursor-pointer"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full sm:w-96 max-w-full h-full bg-white dark:bg-[#121212] text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#242424] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#222222]">
              <div className="flex items-center gap-2">
                <DevCenterPointLogo variant="compact" size="sm" showTagline={false} />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  Studio Index
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                Navigation
              </span>

              <div className="space-y-1">{drawerLinks.map(renderLink)}</div>

              {header.showBooking && (
                <div className="pt-2">
                  <BookingCta
                    url={header.bookingUrl}
                    label={header.bookingLabel}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  />
                </div>
              )}

              {onOpenSandbox && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      soundEngine.playModalOpen();
                      onOpenSandbox();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-left flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-800 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Client Demo Sandbox</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          ERP, Clinic Queue, Qttenzy & AI Studio
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-[#222222]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                Direct Inquiries
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={header.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playClick()}
                  className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:border-emerald-300 flex items-center gap-2 font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[9px] uppercase font-mono text-emerald-600 dark:text-emerald-400">
                      WhatsApp
                    </span>
                    <span>{header.whatsappLabel}</span>
                  </div>
                </a>

                <a
                  href={header.emailUrl}
                  onClick={() => soundEngine.playClick()}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-700 dark:text-slate-200 hover:border-slate-300 flex items-center gap-2 font-bold transition-all"
                >
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[9px] uppercase font-mono text-slate-400">Email</span>
                    <span className="truncate block">{header.emailLabel}</span>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <a
                  href={header.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#262626] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 hover:text-slate-950 dark:hover:text-white"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={header.founderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#262626] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 hover:text-slate-950 dark:hover:text-white"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Founder</span>
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Appearance</span>
                </div>

                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    !isMuted
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-[#252525] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{!isMuted ? 'Audio On' : 'Muted'}</span>
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
