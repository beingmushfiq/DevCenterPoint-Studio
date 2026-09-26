import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ArrowRight,
  ExternalLink,
  Layers,
  Briefcase,
  HelpCircle,
  Cpu,
  BarChart3,
  Sparkles,
  Command,
  X,
  Send,
  Zap,
  ShieldCheck,
  Globe,
  Smartphone
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Services' | 'Case Studies' | 'Methodology' | 'FAQ' | 'Actions';
  description: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  // Actions
  {
    id: 'act-start-project',
    title: 'Start a Project / Request Scope',
    category: 'Actions',
    description: 'Tell us about your product goals and get an architectural roadmap in 24h',
    href: '#contact',
    icon: Send,
    badge: 'Fast-Track',
  },
  {
    id: 'act-newsletter',
    title: 'Join DevCenterPoint Dispatch Newsletter',
    category: 'Actions',
    description: 'Bi-weekly architectural post-mortems and distributed systems insights',
    href: '#newsletter',
    icon: Sparkles,
  },

  // Services
  {
    id: 'svc-product-eng',
    title: 'Product Engineering (Full-Stack SaaS)',
    category: 'Services',
    description: 'High-performance web apps, APIs, and mission-critical cloud software',
    href: '#capabilities',
    icon: Globe,
    badge: '01',
  },
  {
    id: 'svc-ai-ml',
    title: 'AI & Machine Learning Copilots',
    category: 'Services',
    description: 'Intelligent automation, custom LLM pipelines, and predictive analytics',
    href: '#capabilities',
    icon: Cpu,
    badge: '02',
  },
  {
    id: 'svc-mobile',
    title: 'Mobile Applications (iOS & Android)',
    category: 'Services',
    description: 'Fluid cross-platform mobile apps with offline sync and push alerts',
    href: '#capabilities',
    icon: Smartphone,
    badge: '03',
  },
  {
    id: 'svc-enterprise',
    title: 'Enterprise ERP & Modernization',
    category: 'Services',
    description: 'Legacy codebase refactoring, microservices, and high-throughput scaling',
    href: '#capabilities',
    icon: Layers,
    badge: '04',
  },

  // Case Studies
  {
    id: 'case-ordershield',
    title: 'OrderShield • Enterprise OMS',
    category: 'Case Studies',
    description: 'Real-time order lifecycle, multi-warehouse sync, and sub-50ms stock checks',
    href: '#work',
    icon: Briefcase,
    badge: 'Logistics',
  },
  {
    id: 'case-qttenzy',
    title: 'Qttenzy • Smart QR Attendance',
    category: 'Case Studies',
    description: 'Zero-latency dynamic attendance tracking for high-security facilities',
    href: '#work',
    icon: Briefcase,
    badge: 'Workplace',
  },
  {
    id: 'case-medipulse',
    title: 'MediPulse • Telehealth & AI Diagnostics',
    category: 'Case Studies',
    description: 'HIPAA-compliant video consults and automated clinical intake workflows',
    href: '#work',
    icon: Briefcase,
    badge: 'Healthcare',
  },
  {
    id: 'case-fleetflow',
    title: 'FleetFlow • Telematics IoT Command',
    category: 'Case Studies',
    description: 'Sub-50ms sensor streaming, GPS tracking, and predictive fleet maintenance',
    href: '#work',
    icon: Briefcase,
    badge: 'IoT',
  },

  // Methodology
  {
    id: 'meth-arch',
    title: '5-Layer Architecture Engine',
    category: 'Methodology',
    description: 'System philosophy, clean boundaries, telemetry, and fault-tolerance',
    href: '#architecture',
    icon: Layers,
  },
  {
    id: 'meth-tech',
    title: 'Tech Ecosystem Matrix',
    category: 'Methodology',
    description: 'React 19, TypeScript, Node.js, Postgres, Docker, Redis & Cloudflare',
    href: '#tech',
    icon: Zap,
  },
  {
    id: 'meth-process',
    title: '6-Phase Lifecycle Process',
    category: 'Methodology',
    description: 'From Discovery RFC to automated verification and zero-downtime deployment',
    href: '#process',
    icon: BarChart3,
  },
  {
    id: 'meth-metrics',
    title: 'Efficiency & Reliability Metrics',
    category: 'Methodology',
    description: 'Deterministic benchmark data: 42% faster sprints, 99.98% uptime',
    href: '#metrics',
    icon: BarChart3,
  },
  {
    id: 'meth-principles',
    title: 'Studio Principles & Engineering Constitution',
    category: 'Methodology',
    description: 'Our core philosophy: craftsmanship, speed, transparency, and type safety',
    href: '#about',
    icon: ShieldCheck,
  },

  // FAQ
  {
    id: 'faq-ip',
    title: 'IP Ownership & Code Handover',
    category: 'FAQ',
    description: '100% full intellectual property transfer from day 1 to your cloud accounts',
    href: '#faq',
    icon: HelpCircle,
  },
  {
    id: 'faq-sprint',
    title: 'Sprint Cadence & Engagement Models',
    category: 'FAQ',
    description: 'Dedicated squads, milestone deliverables, and 2-week bi-directional sprints',
    href: '#faq',
    icon: HelpCircle,
  },
  {
    id: 'faq-sla',
    title: 'Post-Launch SLAs & 30-Day Warranty',
    category: 'FAQ',
    description: '15-minute P0 critical response SLA and complimentary 30-day warranty',
    href: '#faq',
    icon: HelpCircle,
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      soundEngine.playModalOpen();
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    } else {
      soundEngine.playModalClose();
    }
  }, [isOpen]);

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ITEMS;
    return COMMAND_ITEMS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    soundEngine.playClick();
    onClose();
    if (item.href) {
      const el = document.querySelector(item.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      soundEngine.playTap();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      soundEngine.playTap();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#282828] shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-[#242424] gap-3">
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search services, case studies, architecture, or FAQs..."
              className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1e1e1e] text-[10px] font-mono text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-[#333333]">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-xs">
                No matching results found for "{query}". Try "SaaS", "Mobile", "IP", or "SLA".
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full p-3 rounded-2xl text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-white'
                        : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-[#1c1c1c] text-slate-500 dark:text-gray-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold truncate">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? 'bg-blue-200/60 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold'
                                : 'bg-slate-100 dark:bg-[#202020] text-slate-400 dark:text-gray-500'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1e1e1e] text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-[#2e2e2e]">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'translate-x-1 text-blue-600 dark:text-blue-400' : 'opacity-0'
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#161616] border-t border-slate-200 dark:border-[#222222] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#222222]">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#222222]">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#222222]">↵</kbd>
                <span>Select</span>
              </span>
            </div>
            <div>
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#222222]">ESC</kbd> to close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
