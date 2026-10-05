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
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { FAQ_DATA, FAQ_CATEGORIES, FAQCategory } from '../data/faq';
import { FAQItem } from '../types';
import { soundEngine } from '../lib/soundEngine';

const categoryIconMap: Record<string, React.ElementType> = {
  'Engineering & Process': Cpu,
  'Engagement Models': Users,
  'Security & IP': ShieldCheck,
  'Post-Launch & SLAs': Clock,
};

export const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default open the first two items for immediate visual context
    return new Set(['faq-process-lifecycle', 'faq-engagement-models']);
  });

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      const inQuestion = item.question.toLowerCase().includes(query);
      const inAnswer = item.answer.toLowerCase().includes(query);
      const inCategory = item.category.toLowerCase().includes(query);
      const inHighlights = item.highlights?.some((h) => h.toLowerCase().includes(query));

      return inQuestion || inAnswer || inCategory || inHighlights;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    soundEngine.playTap();
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
    soundEngine.playClick();
    const allFilteredIds = new Set(filteredFAQs.map((f) => f.id));
    setExpandedIds(allFilteredIds);
  };

  const handleCollapseAll = () => {
    soundEngine.playClick();
    setExpandedIds(new Set());
  };

  const areAllExpanded =
    filteredFAQs.length > 0 &&
    filteredFAQs.every((item) => expandedIds.has(item.id));

  const handleCategorySelect = (cat: FAQCategory) => {
    soundEngine.playClick();
    setSelectedCategory(cat);
  };

  const handleScrollToContact = () => {
    soundEngine.playClick();
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="py-24 bg-white dark:bg-[#0c0c0c] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#222222] relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative ambient aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Methodology & Engagement Models</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
            Direct answers regarding our engineering standards, sprint cadence, commercial models, IP ownership, and post-launch SLAs.
          </p>
        </div>

        {/* Value Proposition Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200/80 dark:border-[#242424] text-center">
            <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              IP Ownership
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              100% Client Owned
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200/80 dark:border-[#242424] text-center">
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              Code Quality
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              Strict Type Safety
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200/80 dark:border-[#242424] text-center">
            <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Mobilization
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              5–7 Day Squad Sprint
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200/80 dark:border-[#242424] text-center">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Critical SLA
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
              15-Minute P0 Response
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Control Panel */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {FAQ_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? FAQ_DATA.length
                    : FAQ_DATA.filter((i) => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-100 dark:bg-[#181818] hover:bg-slate-200 dark:hover:bg-[#222222] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#282828]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-blue-500/50 text-white'
                          : 'bg-slate-200 dark:bg-[#282828] text-slate-500 dark:text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse All Quick Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={areAllExpanded ? handleCollapseAll : handleExpandAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181818] hover:bg-slate-200 dark:hover:bg-[#222222] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#282828] text-xs font-bold transition-colors cursor-pointer"
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

          {/* Search Input Bar (16px base font on mobile prevents iOS zoom) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., 'IP ownership', 'sprint cadence', 'SLA')..."
              className="w-full pl-10 pr-10 py-3 sm:py-2.5 rounded-xl bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-[#2b2b2b] focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-base sm:text-xs font-medium transition-all outline-none min-h-[48px]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setSearchQuery('');
                }}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery.trim() && (
          <div className="mb-4 text-xs font-mono text-slate-500 dark:text-gray-400 flex items-center justify-between">
            <span>
              Showing {filteredFAQs.length} matching question{filteredFAQs.length === 1 ? '' : 's'} for "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset filter
            </button>
          </div>
        )}

        {/* Accordion List Container */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-[#222222]">
            <HelpCircle className="w-10 h-10 text-slate-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No matching questions found
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto mb-4 font-medium">
              We couldn't find any questions matching "{searchQuery}". Try a different keyword or contact our engineering lead directly.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              View All Questions
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq: FAQItem) => {
              const isExpanded = expandedIds.has(faq.id);
              const IconComponent = categoryIconMap[faq.category] || HelpCircle;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all border ${
                    isExpanded
                      ? 'bg-slate-50/80 dark:bg-[#151515] border-blue-500/30 dark:border-blue-500/30 shadow-md shadow-blue-500/5'
                      : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-[#222222] hover:border-slate-300 dark:hover:border-[#333333]'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isExpanded}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold tracking-wider uppercase border border-blue-200/60 dark:border-blue-900/40">
                          <IconComponent className="w-3 h-3" />
                          <span>{faq.category}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-[#1c1c1c] text-slate-500 dark:text-gray-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Animated Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed border-t border-slate-200/60 dark:border-[#222222] font-medium space-y-4">
                          <p>{faq.answer}</p>

                          {faq.highlights && faq.highlights.length > 0 && (
                            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0c0c0c] border border-slate-200/80 dark:border-[#262626] space-y-2">
                              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-gray-500">
                                Key Takeaways & Standards
                              </div>
                              <ul className="space-y-1.5">
                                {faq.highlights.map((highlight, hIdx) => (
                                  <li
                                    key={hIdx}
                                    className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Conversion Prompt Card */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#242424] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Have a Custom Technical Requirement?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Ready to explore your project roadmap?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 max-w-xl font-medium">
              Use our interactive Project Scope Estimator to select target frameworks, evaluate timeline tiers, and receive a direct architectural response within 24 hours.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 cursor-pointer shrink-0"
          >
            <span>Start Project Scope</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
