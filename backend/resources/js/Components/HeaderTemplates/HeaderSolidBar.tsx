import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { SoundToggle } from '../SoundToggle';
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

export const HeaderSolidBar: React.FC<HeaderPresetProps> = ({ onOpenSandbox }) => {
  const header = useHeaderData();
  const { menuOpen, setMenuOpen, activeSection, isMuted, handleNavClick, handleToggleSound } =
    useHeaderBehavior();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center shrink-0"
              aria-label={`${header.brandName} Home`}
            >
              <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />
            </a>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
              {header.navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={`${link.label}-${link.href}`}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className={`transition-colors cursor-pointer py-1 border-b-2 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                        : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setIsCommandOpen(true);
                }}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 dark:border-white/15 bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252525] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
                aria-label="Search site"
                title="Search site"
              >
                <Search className="w-4 h-4" />
              </button>

              <SoundToggle />

              <ThemeToggle />

              {header.showBooking && (
                <BookingCta
                  url={header.bookingUrl}
                  label={header.bookingLabel}
                  variant="secondary"
                  size="sm"
                  className="hidden sm:inline-flex"
                />
              )}

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold whitespace-nowrap transition-colors cursor-pointer"
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
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer lg:hidden"
                aria-label="Toggle Studio Menu"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
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
