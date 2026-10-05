import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Compass,
  ArrowDown,
  Layers,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

interface BreadcrumbConfig {
  id: string;
  pillar: string;
  pillarTargetId: string;
  label: string;
  order: string;
}

const SECTION_REGISTRY: BreadcrumbConfig[] = [
  {
    id: 'hero',
    pillar: 'Overview',
    pillarTargetId: 'hero',
    label: 'Architecture Studio',
    order: '00',
  },
  {
    id: 'positioning',
    pillar: 'Philosophy',
    pillarTargetId: 'positioning',
    label: 'Positioning & Manifesto',
    order: '01',
  },
  {
    id: 'capabilities',
    pillar: 'Services',
    pillarTargetId: 'capabilities',
    label: 'Engineering Capabilities',
    order: '02',
  },
  {
    id: 'work',
    pillar: 'Portfolio',
    pillarTargetId: 'work',
    label: 'Selected Work & Cases',
    order: '03',
  },
  {
    id: 'architecture',
    pillar: 'Methodology',
    pillarTargetId: 'architecture',
    label: '5-Layer Architecture',
    order: '04',
  },
  {
    id: 'tech',
    pillar: 'Methodology',
    pillarTargetId: 'architecture',
    label: 'Technology Ecosystem',
    order: '05',
  },
  {
    id: 'process',
    pillar: 'Lifecycle',
    pillarTargetId: 'process',
    label: '6-Phase Process',
    order: '06',
  },
  {
    id: 'metrics',
    pillar: 'Lifecycle',
    pillarTargetId: 'process',
    label: 'Efficiency Metrics',
    order: '07',
  },
  {
    id: 'about',
    pillar: 'Philosophy',
    pillarTargetId: 'about',
    label: 'Studio Principles',
    order: '08',
  },
  {
    id: 'faq',
    pillar: 'Transparency',
    pillarTargetId: 'faq',
    label: 'Frequently Asked Questions',
    order: '09',
  },
  {
    id: 'contact',
    pillar: 'Engagement',
    pillarTargetId: 'contact',
    label: 'Project Collaboration',
    order: '10',
  },
  {
    id: 'newsletter',
    pillar: 'Community',
    pillarTargetId: 'newsletter',
    label: 'Dispatch Newsletter',
    order: '11',
  },
];

export const BreadcrumbNavigation: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Make breadcrumb visible once user scrolls past initial hero top fold (~200px)
      setIsVisible(scrollY > 200);

      // Viewport center detection for active section
      const scrollPos = scrollY + 240;
      let matchedSectionId = 'hero';

      for (const section of SECTION_REGISTRY) {
        const el = document.getElementById(section.id);
        if (el) {
          // Scroll-reveal wrappers apply transforms, which break offsetTop.
          const top = el.getBoundingClientRect().top + scrollY;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            matchedSectionId = section.id;
            break;
          }
        }
      }

      setActiveSectionId(matchedSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = useMemo(() => {
    return (
      SECTION_REGISTRY.find((s) => s.id === activeSectionId) ||
      SECTION_REGISTRY[0]
    );
  }, [activeSectionId]);

  const currentIndex = SECTION_REGISTRY.findIndex((s) => s.id === activeSectionId);
  const nextSection =
    currentIndex >= 0 && currentIndex < SECTION_REGISTRY.length - 1
      ? SECTION_REGISTRY[currentIndex + 1]
      : null;

  const scrollToId = (id: string) => {
    soundEngine.playClick();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextSection = () => {
    if (nextSection) {
      scrollToId(nextSection.id);
    }
  };

  const handleScrollTop = () => {
    soundEngine.playScrollTop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Breadcrumb Navigation"
          className="fixed top-[57px] sm:top-[65px] left-0 right-0 z-30 h-9 sm:h-10 bg-white/85 dark:bg-[#0c0c0c]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#222222]/80 select-none transition-colors duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
        >
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-[11px] sm:text-xs">
            
            {/* Left: Dynamic Breadcrumb Trail */}
            <ol className="flex items-center gap-1.5 sm:gap-2 min-w-0 font-medium">
              
              {/* Root Node: Home / DevCenterPoint */}
              <li className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToId('hero')}
                  className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors cursor-pointer group"
                  title="Scroll to Top"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-500 group-hover:rotate-45 transition-transform" />
                  <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase font-bold">
                    DevCenterPoint
                  </span>
                  <span className="sm:hidden font-mono text-[10px] font-bold">DCP</span>
                </button>
              </li>

              {/* Separator 1 */}
              <li className="text-slate-300 dark:text-gray-700 shrink-0">
                <ChevronRight className="w-3 h-3" />
              </li>

              {/* Middle Node: Pillar / Category */}
              <li className="hidden md:flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToId(currentSection.pillarTargetId)}
                  className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {currentSection.pillar}
                </button>
              </li>

              {/* Separator 2 */}
              <li className="hidden md:flex text-slate-300 dark:text-gray-700 shrink-0">
                <ChevronRight className="w-3 h-3" />
              </li>

              {/* Active Leaf Node: Current Section */}
              <li className="flex items-center gap-2 min-w-0 font-bold text-slate-900 dark:text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse shrink-0" />
                <span className="truncate">{currentSection.label}</span>
                <span className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 shrink-0">
                  {currentSection.order}
                </span>
              </li>
            </ol>

            {/* Right: Section Index & Next Section Quick Jumper */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[10px] sm:text-[11px] font-mono">
              
              {/* Progress Index Counter */}
              <div className="hidden lg:flex items-center gap-1 text-slate-400 dark:text-gray-500">
                <span className="text-slate-800 dark:text-gray-200 font-bold">{currentSection.order}</span>
                <span>/</span>
                <span>11</span>
              </div>

              {/* Next Section Action Pill */}
              {nextSection ? (
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#242424] text-slate-700 dark:text-gray-300 border border-slate-200/80 dark:border-[#2a2a2a] transition-all cursor-pointer group"
                  title={`Jump to next: ${nextSection.label}`}
                >
                  <span className="hidden sm:inline text-slate-500 dark:text-gray-400 font-sans">Next:</span>
                  <span className="font-sans font-semibold truncate max-w-[120px]">
                    {nextSection.label}
                  </span>
                  <ArrowDown className="w-3 h-3 text-blue-500 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScrollTop}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 transition-colors cursor-pointer"
                  title="Scroll to Top"
                >
                  <span>Back to Top</span>
                  <ArrowUp className="w-3 h-3" />
                </button>
              )}

            </div>

          </div>

          {/* Micro Reading Scroll Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-200/40 dark:bg-slate-800/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-400 transition-all duration-150 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
