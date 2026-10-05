import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { DevCenterPointLogo } from '../DevCenterPointLogo';
import { CommandPalette } from '../CommandPalette';
import { BookingCta } from '../BookingCta';
import { soundEngine } from '../../lib/soundEngine';
import { HeaderMobileDrawer } from './HeaderMobileDrawer';
import { useHeaderData, type NavLink } from './useHeaderData';
import { useHeaderBehavior } from './useHeaderBehavior';

interface HeaderPresetProps {
  onOpenSandbox?: () => void;
}

interface MegaNavLink extends NavLink {
  children?: NavLink[];
}

export const HeaderMegaMenu: React.FC<HeaderPresetProps> = ({ onOpenSandbox }) => {
  const header = useHeaderData();
  const { scrolled, menuOpen, setMenuOpen, isMuted, handleNavClick, handleToggleSound } =
    useHeaderBehavior();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const navLinks = header.navLinks as MegaNavLink[];

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
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-slate-200 dark:border-white/10 shadow-sm'
            : 'bg-transparent border-transparent'
        }`}
      >
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

            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold">
              {navLinks.map((link) => {
                const hasChildren = !!link.children && link.children.length > 0;
                const isOpen = openMenu === link.label;

                return (
                  <div
                    key={`${link.label}-${link.href}`}
                    className="relative"
                    onMouseEnter={() => hasChildren && setOpenMenu(link.label)}
                    onMouseLeave={() => hasChildren && setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(link.href)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      aria-haspopup={hasChildren || undefined}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
                      <span>{link.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {hasChildren && isOpen && (
                      <div className="absolute left-0 top-full pt-2 w-72">
                        <div className="rounded-2xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 shadow-2xl p-2 space-y-1">
                          {link.children!.map((child) => (
                            <button
                              key={`${child.label}-${child.href}`}
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                handleNavClick(child.href);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {child.label}
                              </div>
                              {child.note && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                  {child.note}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs"
                title="Search site (⌘K)"
              >
                <Search className="w-4 h-4" />
                <kbd className="text-[10px] font-mono opacity-60">⌘K</kbd>
              </button>

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
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors cursor-pointer"
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
