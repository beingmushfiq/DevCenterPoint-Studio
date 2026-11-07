import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { CommandPalette } from '../CommandPalette';
import { BookingCta } from '../BookingCta';
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
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-[95%] max-w-7xl rounded-full studio-nav-bar px-3.5 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 ${
          scrolled
            ? 'shadow-xl shadow-black/5 dark:shadow-black/60 scale-[0.99] border-black/10 dark:border-white/10'
            : 'border-black/5 dark:border-white/5'
        }`}
      >
        <div className="flex items-center justify-between gap-3 h-10">
          {/* Brand Logo & Studio Availability Marker */}
          <div className="flex items-center gap-3.5 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  router.visit('/');
                }
              }}
              className="flex items-center group transition-transform active:scale-98 shrink-0"
              aria-label={`${header.brandName} Home`}
            >
              <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />
            </a>

            {/* Subtle Editorial Status Beacon */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="status-beacon-live" />
              <span className="tracking-tight">Available Q1/Q2</span>
            </div>
          </div>

          {/* Typographic Navigation Deck */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200/60 dark:border-white/5 text-xs font-medium">
            {header.navLinks.map((link) => {
              const anchor = link.href.replace(/^\/?#/, '');
              const isActive = anchor !== link.href && activeSection === anchor;
              return (
                <button
                  key={`${link.label}-${link.href}`}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-[#0047FF] dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Tactical Action Deck */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenSandbox && (
              <button
                type="button"
                onClick={onOpenSandbox}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0047FF]/10 hover:bg-[#0047FF]/15 text-[#0047FF] dark:text-blue-400 border border-[#0047FF]/20 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer"
                title="Launch Live Client Sandbox"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0047FF] animate-pulse" />
                <span>Live Apps</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#15171C] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Search site (⌘K)"
              title="Search site (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>

            {header.showBooking && (
              <BookingCta
                url={header.bookingUrl}
                label={header.bookingLabel}
                variant="secondary"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white text-xs font-semibold transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <span>Estimate Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#15171C] text-slate-700 dark:text-slate-200 cursor-pointer transition-colors shrink-0 active:scale-95"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenSandbox={onOpenSandbox}
      />

      {/* Mobile Drawer Navigation */}
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
