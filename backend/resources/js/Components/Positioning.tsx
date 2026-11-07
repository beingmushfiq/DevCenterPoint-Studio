import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  GitBranch, 
  Zap,
  Server
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';

interface PositioningPillar {
  num: string;
  title: string;
  desc: string;
}

interface PositioningContent {
  badge?: string;
  headlinePrefix?: string;
  headlineHighlight?: string;
  description?: string;
  tags?: string[];
  pillars?: PositioningPillar[];
}

const DEFAULT_CONTENT: PositioningContent = {
  badge: '01 — Problem & Approach',
  headlinePrefix: 'When spreadsheets and off-the-shelf SaaS',
  headlineHighlight: 'stop fitting your business operations.',
  description:
    'Generic SaaS platforms force your operations into their rigid constraints, while charging steep monthly per-seat fees. We engineer bespoke web systems and ERP cores tailored to your exact workflows—delivered with 100% source code ownership.',
  tags: ['100% CODE OWNERSHIP', 'TRANSACTIONAL ACID INTEGRITY', 'ZERO RECURRING LICENSING'],
};

export const Positioning: React.FC = () => {
  const cms = useCms();
  const content = cms.getSectionBlock<PositioningContent>('positioning', 'content', DEFAULT_CONTENT);
  const tags = content.tags && content.tags.length > 0 ? content.tags : DEFAULT_CONTENT.tags!;

  const [activeTab, setActiveTab] = useState<'contrast' | 'lifecycle'>('contrast');

  const beforeItems = [
    {
      title: 'Spreadsheet Drift & Double-Allocation',
      desc: 'Multiple reps editing local sheets simultaneously lead to overselling stock and delayed fulfillment.',
    },
    {
      title: 'Untracked Orders in WhatsApp Chats',
      desc: 'Customer receipts, address changes, and payment proofs get buried in scattered chat history.',
    },
    {
      title: 'Per-Seat Monthly SaaS Tax',
      desc: 'Paying $30–$80/user/month to foreign SaaS platforms that refuse to integrate with bKash or local couriers.',
    },
    {
      title: 'Zero Permanent Data Control',
      desc: 'If the third-party SaaS alters their API, raises pricing, or locks your account, your business grinds to a halt.',
    },
  ];

  const afterItems = [
    {
      title: 'Deterministic PostgreSQL Schema',
      desc: 'Atomic transactional locks (ACID) prevent inventory drift across central and remote warehouse locations.',
    },
    {
      title: 'Unified High-Density Web Portal',
      desc: 'Custom roles for admins, inventory staff, accountants, and dispatch desks with real-time status updates.',
    },
    {
      title: 'Local Rail Integration Built-In',
      desc: 'Native automated reconciliation for bKash, SSLCommerz, Nagad, and direct courier manifest printing.',
    },
    {
      title: 'Permanent Source Code Handover',
      desc: 'You own every migration, React component, and Docker file. Run on your own servers forever with 0 license fees.',
    },
  ];

  return (
    <section id="positioning" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header Block */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
            <span>{content.badge || DEFAULT_CONTENT.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]">
            {content.headlinePrefix || DEFAULT_CONTENT.headlinePrefix} <br />
            <span className="text-[var(--accent-primary)]">
              {content.headlineHighlight || DEFAULT_CONTENT.headlineHighlight}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {content.description || DEFAULT_CONTENT.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            {tags.map((tag, tIdx) => (
              <span key={tIdx} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* =========================================================================
            THE ARCHITECTURAL CONTRAST: BEFORE VS AFTER
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* THE FRAGILE STATE (Spreadsheet Chaos) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-red-200/80 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-red-200/60 dark:border-red-900/40">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>The Fragile Workflow (Spreadsheets & Generic SaaS)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold">
                  HIGH FRICTION
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {beforeItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5 text-xs font-bold font-mono">
                      ✕
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-red-200/60 dark:border-red-900/40 text-[11px] font-mono text-red-700 dark:text-red-400">
              Result: Operational overhead grows with every new employee and order.
            </div>
          </div>

          {/* THE ENGINEERED STATE (DevCenterPoint Core) */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[var(--accent-primary)]/30 bg-blue-50/20 dark:bg-[#131722] space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 dark:border-blue-900/40">
                <div className="flex items-center gap-2 text-[var(--accent-primary)] font-mono text-xs font-bold uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>The DevCenterPoint Engineered System</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[var(--accent-primary)] dark:text-blue-300 font-bold">
                  PERMANENT ASSET
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {afterItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-[var(--accent-primary)] shrink-0 mt-0.5 text-xs font-bold font-mono">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] font-mono text-[var(--accent-primary)] dark:text-blue-400 flex items-center justify-between">
              <span>Result: Operational cost stays flat as volume scales 10x.</span>
              <span className="font-bold">100% Owned</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
