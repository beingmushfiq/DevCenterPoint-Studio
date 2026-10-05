import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Search,
  Zap,
  Volume2,
  VolumeX,
  MessageCircle,
  Mail,
  Github,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { DevCenterPointLogo } from './DevCenterPointLogo';
import { CommandPalette } from './CommandPalette';
import { soundEngine } from '../lib/soundEngine';

interface NavigationProps {
  onOpenSandbox?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenSandbox }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('work');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());

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
      setScrolled(window.scrollY > 30);

      const sections = ['work', 'capabilities', 'process', 'faq', 'contact'];
      const scrollPos = window.scrollY + 180;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    soundEngine.playClick();
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playSuccessChime();
    }
  };

  return (
    <>
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl rounded-full glass-pill-nav px-3.5 sm:px-5 py-2 transition-all duration-300 ${
          scrolled ? 'shadow-2xl shadow-blue-900/10 dark:shadow-black/70 scale-[0.99]' : 'shadow-lg shadow-slate-200/40 dark:shadow-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 h-10">
          {/* Left: Brand Emblem & Clean Wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundEngine.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center group transition-transform active:scale-98"
              aria-label="DevCenterPoint Home"
            >
              <DevCenterPointLogo variant="horizontal" size="sm" showTagline={false} />
            </a>
          </div>

          {/* Center: Editorial Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-black/30 p-1 rounded-full border border-slate-200/60 dark:border-white/5 backdrop-blur-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleNavClick('#work')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeSection === 'work'
                  ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Work
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#capabilities')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeSection === 'capabilities'
                  ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Capabilities
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#philosophy')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeSection === 'philosophy'
                  ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Architecture
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#testimonials')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeSection === 'testimonials'
                  ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Proof
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#about')}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeSection === 'about'
                  ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              Team
            </button>
          </nav>

          {/* Right: Actions & Primary CTA */}
          <div className="flex items-center gap-2">
            {/* Try Live Demos Pill */}
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

            {/* Spotlight Search (⌘K) */}
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

            {/* Sound FX Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              aria-label="Toggle Sound Effects"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-500" />}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Primary Start a Project Button */}
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

            {/* Minimal Menu Trigger for Mobile Drawer */}
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

      {/* Spotlight Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Minimal Editorial Studio Menu (Full Sheet Drawer) */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Sliding Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full sm:w-96 max-w-full h-full bg-white dark:bg-[#121212] text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#242424] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              {/* Panel Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#222222]">
                <div className="flex items-center gap-2">
                  <DevCenterPointLogo variant="compact" size="sm" showTagline={false} />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                    Studio Index
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Navigation Links */}
              <div className="py-6 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                  Navigation
                </span>

                <div className="space-y-1">
                  {[
                    { label: 'Selected Work', href: '#work', note: '9 Production Systems' },
                    { label: 'Capabilities & Services', href: '#capabilities', note: 'Full-stack & AI' },
                    { label: 'Sprint Methodology', href: '#process', note: 'Discovery to Deployment' },
                    { label: 'Frequently Asked Questions', href: '#faq', note: 'Engagements, SLAs, Terms' },
                    { label: 'Start Project Collaboration', href: '#contact', note: 'Scope & Architecture Estimator' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNavClick(item.href)}
                      className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.note}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                    </button>
                  ))}
                </div>

                {/* 1-Click Sandbox Modal Launcher */}
                {onOpenSandbox && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
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

              {/* Direct Founder & WhatsApp Contact Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-[#222222]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold block">
                  Direct Inquiries
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/8801988383323?text=Hi%20DevCenterPoint,%20I'd%20like%20to%20discuss%20a%20project"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playClick()}
                    className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:border-emerald-300 flex items-center gap-2 font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <span className="block text-[9px] uppercase font-mono text-emerald-600 dark:text-emerald-400">WhatsApp</span>
                      <span>+880 1988 383323</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contact@devcenterpoint.com"
                    onClick={() => soundEngine.playClick()}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#282828] text-slate-700 dark:text-slate-200 hover:border-slate-300 flex items-center gap-2 font-bold transition-all"
                  >
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="truncate">
                      <span className="block text-[9px] uppercase font-mono text-slate-400">Email</span>
                      <span>contact@...</span>
                    </div>
                  </a>
                </div>

                {/* Ecosystem Links */}
                <div className="flex items-center gap-2 text-xs">
                  <a
                    href="https://github.com/beingmushfiq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#262626] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 hover:text-slate-950 dark:hover:text-white"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://buildwithmushfiq.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#262626] text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 hover:text-slate-950 dark:hover:text-white"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Founder</span>
                  </a>
                </div>

                {/* Controls Bar: Theme Toggle & Sound Toggle */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200/80 dark:border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Appearance</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSound}
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
    </>
  );
};
