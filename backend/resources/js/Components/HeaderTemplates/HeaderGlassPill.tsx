import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Search, Zap, Volume2, VolumeX } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { CommandPalette } from '../CommandPalette';
import { BookingCta } from '../BookingCta';
import { soundEngine } from '../../lib/soundEngine';
import { HeaderMobileDrawer } from './HeaderMobileDrawer';
import { useHeaderData } from './useHeaderData';
import { useHeaderBehavior } from './useHeaderBehavior';

interface HeaderPresetProps {
  onOpenSandbox?: () => void;
}

export const HeaderGlassPill: React.FC<HeaderPresetProps> = ({ onOpenSandbox }) => {
  const header = useHeaderData();
  const {
    scrolled,
    menuOpen,
    setMenuOpen,
    activeSection,
    isMuted,
    handleNavClick,
    handleToggleSound,
  } = useHeaderBehavior();

  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl rounded-full glass-pill-nav px-3.5 sm:px-5 py-2 transition-all duration-300 ${
          scrolled ? 'shadow-2xl shadow-blue-900/10 dark:shadow-black/70 scale-[0.99]' : 'shadow-lg shadow-slate-200/40 dark:shadow-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 h-10">
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group transition-transform active:scale-98"
              aria-label={`${header.brandName} Home`}
            >
              <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-black/30 p-1 rounded-full border border-slate-200/60 dark:border-white/5 backdrop-blur-md text-xs font-semibold">
            {header.navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={`${link.label}-${link.href}`}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {onOpenSandbox && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  onOpenSandbox();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                title="Launch Live Client Sandbox"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Demos</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setIsCommandOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs"
              title="Search site (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label="Toggle Sound Effects"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-500" />}
            </button>

            <ThemeToggle />

            {header.showBooking && (
              <BookingCta
                url={header.bookingUrl}
                label={header.bookingLabel}
                variant="ghost"
                size="sm"
                className="hidden xl:inline-flex"
              />
            )}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                soundEngine.playMenuToggle(!menuOpen);
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center lg:hidden"
              aria-label="Toggle Studio Menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <HeaderMobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavClick}
        onOpenSandbox={onOpenSandbox}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />
    </>
  );
};
