import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Search,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { FAQ_DATA } from '../data/faq';
import { FAQItem } from '../types';
import { useCms } from '../Context/CmsContext';

const categoryIconMap: Record<string, React.ElementType> = {
  'Engineering & Process': Cpu,
  'Engagement Models': Users,
  'Security & IP': ShieldCheck,
  'Post-Launch & SLAs': Clock,
};

interface FaqHeaderContent {
  badge?: string;
  headline?: string;
  description?: string;
}

const DEFAULT_FAQ_HEADER: FaqHeaderContent = {
  badge: '08 — Methodology & Commitments',
  headline: 'Frequently Asked Questions',
  description:
    'Direct answers regarding our engineering standards, sprint cadence, commercial models, IP ownership, and post-launch SLAs.',
};

export const FAQSection: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<FaqHeaderContent>('faq', 'header', DEFAULT_FAQ_HEADER);

  const allFaqs: FAQItem[] = useMemo(() => {
    if (cms.faqs && cms.faqs.length > 0) {
      return cms.faqs.map((f: any) => ({
        id: `faq-${f.id}`,
        question: f.question,
        answer: f.answer,
        category: f.category || 'General',
        highlights: [],
      }));
    }
    return FAQ_DATA;
  }, [cms.faqs]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allFaqs.map((f) => f.category)));
    return ['All', ...cats];
  }, [allFaqs]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    return new Set(['faq-1', 'faq-2']);
  });

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allFaqs.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const inQuestion = item.question.toLowerCase().includes(query);
      const inAnswer = item.answer.toLowerCase().includes(query);
      const inCategory = item.category.toLowerCase().includes(query);

      return inQuestion || inAnswer || inCategory;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredFAQs.map((f) => f.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const areAllExpanded =
    filteredFAQs.length > 0 &&
    filteredFAQs.every((item) => expandedIds.has(item.id));

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border hairline-border text-[var(--accent-primary)] font-mono text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{headerContent.badge || DEFAULT_FAQ_HEADER.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {headerContent.headline || DEFAULT_FAQ_HEADER.headline}
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {headerContent.description || DEFAULT_FAQ_HEADER.description}
          </p>
        </div>

        {/* Value Proposition Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl editorial-card text-center">
            <div className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase tracking-wider">
              IP Ownership
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
              100% Client Owned
            </div>
          </div>
          <div className="p-4 rounded-xl editorial-card text-center">
            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Code Quality
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
              Strict Type Safety
            </div>
          </div>
          <div className="p-4 rounded-xl editorial-card text-center">
            <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Core Stack
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
              Laravel + React + PG
            </div>
          </div>
          <div className="p-4 rounded-xl editorial-card text-center">
            <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Post-Launch SLA
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
              30-Day Warranty
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border hairline-border ${
                      isSelected
                        ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={areAllExpanded ? handleCollapseAll : handleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border hairline-border text-xs font-semibold cursor-pointer"
              >
                {areAllExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Collapse All</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engineering questions (e.g., 'IP ownership', 'Laravel', 'SLA')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-surface)] border hairline-border text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-medium outline-none focus:border-[var(--accent-primary)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Accordion List Container */}
        <div className="space-y-3">
          {filteredFAQs.map((faq: FAQItem) => {
            const isExpanded = expandedIds.has(faq.id);
            const IconComponent = categoryIconMap[faq.category] || HelpCircle;

            return (
              <div
                key={faq.id}
                className={`rounded-xl transition-all border hairline-border editorial-card ${
                  isExpanded ? 'ring-1 ring-[var(--accent-primary)]/30' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                      {faq.category}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded
                        ? 'rotate-180 bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border hairline-border'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed border-t hairline-border space-y-3">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
