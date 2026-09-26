import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ListOrdered,
  ChevronDown,
  Compass,
  ArrowRight,
  Check,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  FolderGit2,
  Workflow,
  BarChart3,
  Quote,
  Send,
  Monitor
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export interface TOCSection {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
}

export const TOC_SECTIONS: TOCSection[] = [
  {
    id: 'hero',
    number: '00',
    name: 'System Overview',
    subtitle: 'Command Center & Live Metrics',
    href: '#hero',
    icon: Monitor
  },
  {
    id: 'positioning',
    number: '01',
    name: 'Engineering Thesis',
    subtitle: 'We build systems, not just screens',
    href: '#positioning',
    icon: Compass
  },
  {
    id: 'capabilities',
    number: '02',
    name: 'Core Capabilities',
    subtitle: '8 Specialized Technical Disciplines',
    href: '#capabilities',
    icon: Cpu
  },
  {
    id: 'work',
    number: '03',
    name: 'Selected Work',
    subtitle: 'Production Case Studies & Ledgers',
    href: '#work',
    icon: FolderGit2
  },
  {
    id: 'architecture',
    number: '04',
    name: '5-Tier Architecture',
    subtitle: 'Resilient L1–L5 Engineering Philosophy',
    href: '#architecture',
    icon: Layers
  },
  {
    id: 'tech',
    number: '05',
    name: 'Tech Stack Ecosystem',
    subtitle: '18 Enterprise Frameworks & Runtimes',
    href: '#tech',
    icon: Activity
  },
  {
    id: 'process',
    number: '06',
    name: 'Engineering Lifecycle',
    subtitle: 'M0–M6 Milestones & Quality Gates',
    href: '#process',
    icon: Workflow
  },
  {
    id: 'metrics',
    number: '07',
    name: 'Efficiency Benchmarks',
    subtitle: 'Delivery Velocity & SLA Charts',
    href: '#metrics',
    icon: BarChart3
  },
  {
    id: 'about',
    number: '08',
    name: 'Principles & Culture',
    subtitle: 'Architectural Standards & Convictions',
    href: '#about',
    icon: Quote
  },
  {
    id: 'contact',
    number: '09',
    name: 'Project Scope Builder',
    subtitle: 'Instant Estimator & Contact Dispatch',
    href: '#contact',
    icon: Send
  }
];

interface TableOfContentsDropdownProps {
  activeSection: string;
  onNavigate?: (href: string) => void;
  className?: string;
  variant?: 'navbar' | 'compact';
}

export const TableOfContentsDropdown: React.FC<TableOfContentsDropdownProps> = ({
  activeSection,
  onNavigate,
  className = '',
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    soundEngine.playTap();
    setIsOpen((prev) => !prev);
  };

  const handleSelectSection = (href: string) => {
    soundEngine.playClick();
    setIsOpen(false);

    if (onNavigate) {
      onNavigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentSectionItem = TOC_SECTIONS.find((s) => s.id === activeSection) || TOC_SECTIONS[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Table of Contents Dropdown"
        className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
            : 'bg-slate-100 dark:bg-[#1a1a1a] hover:bg-slate-200 dark:hover:bg-[#252525] text-slate-800 dark:text-gray-200 border-slate-300/80 dark:border-[#2a2a2a]'
        }`}
      >
        <ListOrdered className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
        <span className="font-extrabold tracking-tight">Table of Contents</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10 hidden sm:inline-block">
          {currentSectionItem.number}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-slate-500 dark:text-gray-400'}`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 sm:right-auto sm:left-0 mt-2.5 w-[320px] sm:w-[360px] max-h-[82vh] overflow-hidden rounded-2xl bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-slate-200 dark:border-[#2a2a2a] shadow-2xl z-50 flex flex-col font-sans"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header */}
            <div className="p-3.5 pb-2.5 border-b border-slate-200/80 dark:border-[#222222] bg-slate-50/80 dark:bg-[#161616]/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Page Index & Blueprint</span>
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                  Primary Section Anchors
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-gray-400 bg-slate-200/60 dark:bg-[#202020] px-2 py-0.5 rounded-full">
                {TOC_SECTIONS.length} Sections
              </span>
            </div>

            {/* Scrollable Links List */}
            <div className="p-2 overflow-y-auto space-y-1 max-h-[calc(82vh-100px)] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {TOC_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                const IconComponent = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSelectSection(section.href)}
                    role="menuitem"
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'hover:bg-slate-100 dark:hover:bg-[#1c1c1c] text-slate-800 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono text-[10px] font-black border transition-colors ${
                          isActive
                            ? 'bg-white text-blue-600 border-white'
                            : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-500 dark:text-gray-400 border-slate-200 dark:border-[#2a2a2a] group-hover:border-blue-400 group-hover:text-blue-500'
                        }`}
                      >
                        {section.number}
                      </div>

                      <div className="min-w-0">
                        <div className={`text-xs font-black truncate flex items-center gap-1.5 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          <span>{section.name}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          )}
                        </div>
                        <div
                          className={`text-[10px] truncate leading-tight ${
                            isActive ? 'text-blue-100 font-medium' : 'text-slate-500 dark:text-gray-400'
                          }`}
                        >
                          {section.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isActive ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with Quick Jump Action */}
            <div className="p-2.5 bg-slate-50/90 dark:bg-[#151515]/90 border-t border-slate-200/80 dark:border-[#222222] flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
              <span className="truncate">Press ESC to dismiss</span>
              <button
                onClick={() => handleSelectSection('#contact')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Jump to Contact &rarr;</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
