import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  Search,
  Command,
  Globe,
  Smartphone,
  Cpu,
  Layers,
  Zap,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { DevCenterPointLogo } from './DevCenterPointLogo';
import { CommandPalette } from './CommandPalette';
import { soundEngine } from '../lib/soundEngine';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('capabilities');
  const [openDropdown, setOpenDropdown] = useState<'services' | 'methodology' | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut for Command Palette (⌘K or Ctrl+K)
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

  // Scroll detection & active section highlighter
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionMap: Record<string, string> = {
        capabilities: 'services',
        work: 'work',
        architecture: 'methodology',
        tech: 'methodology',
        process: 'methodology',
        metrics: 'methodology',
        about: 'methodology',
        faq: 'faq',
        contact: 'contact',
      };

      const sections = ['capabilities', 'work', 'architecture', 'tech', 'process', 'metrics', 'about', 'faq', 'contact'];
      const scrollPos = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionMap[sectionId] || sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    soundEngine.playClick();
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (menu: 'services' | 'methodology') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-2.5 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-[#222222] shadow-lg'
            : 'py-4 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Live Status Pill */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.playClick();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center group transition-transform active:scale-95"
                aria-label="DevCenterPoint Home"
              >
                <DevCenterPointLogo variant="horizontal" size="md" showTagline={false} />
              </a>

              {/* High-trust Availability Indicator */}
              <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Q4</span>
              </div>
            </div>

            {/* Center: Intuitive Dynamic Island Capsule */}
            <nav className="hidden md:flex items-center relative bg-white/80 dark:bg-[#141414]/90 p-1.5 rounded-2xl border border-slate-200/90 dark:border-[#282828] shadow-lg backdrop-blur-xl">
              
              {/* 1. Services Dropdown Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick('#capabilities')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSection === 'services' || openDropdown === 'services'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black'
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'services' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Services Flyout Mega-Card */}
                <AnimatePresence>
                  {openDropdown === 'services' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-[480px] p-4 rounded-3xl bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#2a2a2a] shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between px-2 pt-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                          Engineering Capabilities
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Zero-Downtime Guarantee
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleNavClick('#capabilities')}
                          className="p-3 rounded-2xl text-left bg-slate-50/80 dark:bg-[#1a1a1a]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-[#262626] hover:border-blue-300 dark:hover:border-blue-900/50 transition-all cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Web & SaaS Platforms
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            High-converting portals & web apps
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavClick('#capabilities')}
                          className="p-3 rounded-2xl text-left bg-slate-50/80 dark:bg-[#1a1a1a]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-[#262626] hover:border-blue-300 dark:hover:border-blue-900/50 transition-all cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Mobile Applications
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            iOS & Android with offline sync
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavClick('#capabilities')}
                          className="p-3 rounded-2xl text-left bg-slate-50/80 dark:bg-[#1a1a1a]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-[#262626] hover:border-blue-300 dark:hover:border-blue-900/50 transition-all cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            AI & Smart Workflows
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            Intelligent copilots & automation
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavClick('#capabilities')}
                          className="p-3 rounded-2xl text-left bg-slate-50/80 dark:bg-[#1a1a1a]/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/60 dark:border-[#262626] hover:border-blue-300 dark:hover:border-blue-900/50 transition-all cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Enterprise Modernization
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            Legacy refactoring & scaling
                          </div>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-[#222222] flex items-center justify-between text-xs px-2">
                        <span className="text-[11px] text-slate-500 dark:text-gray-400">
                          Looking for specific stack requirements?
                        </span>
                        <button
                          type="button"
                          onClick={() => handleNavClick('#capabilities')}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Explore All 7 Services</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Selected Work Direct Link */}
              <button
                type="button"
                onClick={() => handleNavClick('#work')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSection === 'work'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black'
                    : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Work</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    activeSection === 'work'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-[#282828] text-slate-600 dark:text-gray-400'
                  }`}
                >
                  6 Cases
                </span>
              </button>

              {/* 3. Methodology Dropdown Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('methodology')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick('#architecture')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSection === 'methodology' || openDropdown === 'methodology'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black'
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>Methodology</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'methodology' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Methodology Flyout Mega-Card */}
                <AnimatePresence>
                  {openDropdown === 'methodology' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-[440px] p-4 rounded-3xl bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#2a2a2a] shadow-2xl z-50 space-y-3"
                    >
                      <div className="flex items-center justify-between px-2 pt-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                          How We Engineer
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Deterministic Execution
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => handleNavClick('#architecture')}
                          className="w-full p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              5-Layer System Architecture
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                              Clean boundary separation, contracts & resilience
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavClick('#tech')}
                          className="w-full p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Technology Ecosystem Matrix
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                              React 19, TypeScript, Node.js, Postgres & Cloud
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavClick('#process')}
                          className="w-full p-2.5 rounded-2xl text-left hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-colors flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              6-Phase Sprint Process & Metrics
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                              From Discovery RFC to automated verification & launch
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. FAQ & Principles Link */}
              <button
                type="button"
                onClick={() => handleNavClick('#faq')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'faq'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black'
                    : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>FAQ</span>
              </button>

              {/* 5. Spotlight Search (⌘K) Trigger Button */}
              <div className="ml-1 pl-1 border-l border-slate-200 dark:border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setIsCommandOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium"
                  title="Search site (⌘K)"
                >
                  <Search className="w-3.5 h-3.5 text-blue-500" />
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-[9px] font-mono text-slate-500 dark:text-gray-400">
                    ⌘K
                  </kbd>
                </button>
              </div>

            </nav>

            {/* Right: Theme Toggle & Primary Action CTA */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <div className="hidden sm:flex items-center">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-wide transition-all shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playMenuToggle(!mobileMenuOpen);
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-white cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Spotlight Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-50 bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-2xl text-slate-900 dark:text-white flex flex-col justify-between p-6 overflow-y-auto md:hidden"
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-[#222222]">
              <DevCenterPointLogo variant="compact" size="sm" showTagline={false} />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Search in Mobile */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCommandOpen(true);
                }}
                className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] text-slate-500 dark:text-gray-400 flex items-center justify-between text-xs font-medium cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span>Search site or jump to section...</span>
                </span>
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#252525]">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Primary Mobile Links */}
            <div className="py-4 space-y-4">
              <button
                type="button"
                onClick={() => handleNavClick('#capabilities')}
                className="w-full text-left py-2 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between text-lg font-bold"
              >
                <span>Services & Capabilities</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#work')}
                className="w-full text-left py-2 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between text-lg font-bold"
              >
                <span className="flex items-center gap-2">
                  <span>Selected Work</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    6 Cases
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#architecture')}
                className="w-full text-left py-2 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between text-lg font-bold"
              >
                <span>Methodology & Architecture</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#faq')}
                className="w-full text-left py-2 border-b border-slate-200 dark:border-[#222222] flex items-center justify-between text-lg font-bold"
              >
                <span>Frequently Asked Questions</span>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </button>
            </div>

            {/* Bottom Mobile CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#222222] space-y-3">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-500 dark:text-gray-400 font-mono">
                🟢 Accepting Q4/Q1 Client Engagements
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
