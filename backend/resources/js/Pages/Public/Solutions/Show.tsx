import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Terminal,
  KeyRound,
  Copy,
  Check,
  Server,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  Box,
  Cpu,
  Lock,
} from 'lucide-react';
import { CmsData } from '../../../Context/CmsContext';
import { CmsSolutionProduct, CmsProject } from '../../../types';
import { PublicPageShell } from '../../../Components/PublicPageShell';
import { PageMasthead } from '../../../Components/PageMasthead';
import { truncate } from '../../../lib/markdown';

interface SolutionShowProps extends CmsData {
  solution: CmsSolutionProduct;
  relatedProjects?: CmsProject[];
}

export default function SolutionShow({
  solution,
  relatedProjects = [],
  ...cms
}: SolutionShowProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'logs'>('architecture');

  const stats = Array.isArray(solution.stats) ? solution.stats : [];
  const clientBenefits = Array.isArray(solution.client_benefits) ? solution.client_benefits : [];
  const deliverables = Array.isArray(solution.deliverables) ? solution.deliverables : [];
  const activityLogs = Array.isArray(solution.activity_logs) ? solution.activity_logs : [];
  const businessOutcomes = solution.business_outcomes || {};

  const description = truncate(
    solution.tagline
      ? `${solution.tagline}. Pre-engineered enterprise solution for ${solution.category}.`
      : `${solution.title} enterprise solution architecture by DevCenterPoint.`,
    158
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <PublicPageShell
      cms={cms}
      meta={{
        title: `${solution.title} | Enterprise Solutions | DevCenterPoint`,
        description,
        canonicalPath: `/solutions/${solution.slug}`,
      }}
      extraJsonLd={({ origin, canonicalUrl, ogImageUrl }) => [
        {
          '@type': 'SoftwareApplication',
          '@id': `${canonicalUrl}#software`,
          name: solution.title,
          applicationCategory: solution.category || 'BusinessApplication',
          operatingSystem: 'Cloud / Kubernetes / Web Browser / Mobile',
          description: solution.tagline || '',
          url: solution.live_url || canonicalUrl,
          image: ogImageUrl,
          provider: { '@id': `${origin}/#organization` },
          offers: {
            '@type': 'Offer',
            price: 'Custom',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${origin}/#organization` },
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: `What business outcomes does the ${solution.title} deliver?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${solution.tagline}. Speed to market: ${businessOutcomes.speedToMarket || '6 to 8 weeks'}. Impact: ${businessOutcomes.impact || 'Immediate operational efficiency'}. Security: ${businessOutcomes.security || 'Enterprise RBAC and strict audit compliance'}.`,
              },
            },
            {
              '@type': 'Question',
              name: `What are the core deliverables of this solution?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: deliverables.length
                  ? deliverables.join('. ')
                  : 'Full production source code, architecture runbooks, cloud infrastructure scripts, and SLAs.',
              },
            },
          ],
        },
      ]}
    >
      <PageMasthead
        eyebrow={solution.category || 'Enterprise Solution'}
        title={solution.title}
        description={solution.tagline || undefined}
        crumbs={[
          { label: 'Solutions', href: '/#solutions' },
          { label: solution.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/#solutions"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All solutions</span>
          </Link>
          {solution.live_url && (
            <a
              href={solution.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-colors"
            >
              <span>Explore live demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {solution.admin_url && (
            <a
              href={solution.admin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:border-blue-500/60 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin portal</span>
            </a>
          )}
        </div>
      </PageMasthead>

      {/* KPI & Metric Strip */}
      {stats.length > 0 && (
        <section className="py-8 bg-white dark:bg-[#07090e] border-b border-slate-200/70 dark:border-white/5 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="liquid-glass rounded-2xl p-5 ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                  <dt className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
                    <span>{stat.label}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change || 'Verified'}
                    </span>
                  </dt>
                  <dd className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Architecture, Deliverables, Benefits */}
          <div className="lg:col-span-7 space-y-12">
            {/* System Blueprint Card */}
            <div className="liquid-glass rounded-3xl p-8 border border-slate-200/70 dark:border-white/10 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Architecture Blueprint
                    </h2>
                    <p className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                      {solution.mockup_title || `${solution.title} Core Engine`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === 'architecture'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeTab === 'logs'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Live Telemetry
                  </button>
                </div>
              </div>

              {activeTab === 'architecture' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200/60 dark:border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-500 block mb-1">
                        Deployment SLA
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {businessOutcomes.speedToMarket || '6–8 Weeks'}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200/60 dark:border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-500 block mb-1">
                        Engine Impact
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {businessOutcomes.impact || 'Zero Data Drift'}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/50 border border-slate-200/60 dark:border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-500 block mb-1">
                        Security Layer
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {businessOutcomes.security || 'RBAC + Audit'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
                    Designed as a production-grade foundation, this solution couples deterministic backend services
                    with high-density user interfaces. Built for high concurrency, zero data drift, and seamless
                    enterprise ERP/API interconnectivity.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-neutral-300 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] text-neutral-500 uppercase tracking-widest">
                    <span>Event Stream</span>
                    <span>Status: Healthy</span>
                  </div>
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-[11px] leading-relaxed">
                        <span className="text-blue-400 font-bold shrink-0">{log.time}</span>
                        <span className="text-neutral-200 flex-1">{log.event}</span>
                        {log.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-neutral-300 shrink-0">
                            {log.badge}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-neutral-500 italic py-4 text-center">
                      Listening on secure Kafka / WebSocket event bus...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Client Architectural Benefits */}
            {clientBenefits.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Key Architectural Advantages
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {clientBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="liquid-glass rounded-2xl p-5 border border-slate-200/60 dark:border-white/5 flex items-start gap-4 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-neutral-200 leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Deliverables */}
            {deliverables.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Production Handover Scope
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="liquid-glass rounded-2xl p-4 border border-slate-200/60 dark:border-white/5 flex items-center gap-3"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Demo Credentials Card & Inquiry CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Live Sandbox Credentials Box */}
            {(solution.demo_username || solution.admin_url) && (
              <div className="liquid-glass rounded-3xl p-6 border border-blue-500/30 dark:border-blue-500/20 bg-linear-to-b from-blue-500/5 via-transparent to-transparent shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Instant Sandbox Access
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Explore live admin controls in a sandbox environment
                    </p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {solution.demo_role && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                      <span className="text-slate-500 dark:text-neutral-400">Assigned Role</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{solution.demo_role}</span>
                    </div>
                  )}

                  {solution.demo_username && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
                          Username
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {solution.demo_username}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(solution.demo_username!, 'username')}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 transition-colors"
                        title="Copy username"
                      >
                        {copiedField === 'username' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {solution.demo_password && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-widest block">
                          Password
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {solution.demo_password}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(solution.demo_password!, 'password')}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-300 transition-colors"
                        title="Copy password"
                      >
                        {copiedField === 'password' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-col gap-2.5">
                  {solution.admin_url && (
                    <a
                      href={solution.admin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
                    >
                      <span>Launch Admin Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {solution.live_url && (
                    <a
                      href={solution.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl liquid-glass text-slate-700 dark:text-neutral-300 font-bold text-xs border border-slate-200 dark:border-white/10 hover:border-blue-500/40 transition-colors"
                    >
                      <span>Launch Storefront / Client View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Project Inquiry Card */}
            <div className="liquid-glass rounded-3xl p-8 border border-slate-200/70 dark:border-white/10 shadow-xl space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/25">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Deploy this Architecture
                </h3>
                <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Tailor this production-ready engine to your enterprise requirements with full source code handover.
                </p>
              </div>
              <Link
                href="/#inquiry"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request Architectural Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500 dark:text-neutral-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Full IP Ownership
                </span>
                <span>•</span>
                <span>Production SLAs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Case Studies Section */}
        {relatedProjects.length > 0 && (
          <section className="mt-24 pt-12 border-t border-slate-200/70 dark:border-white/10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1 block">
                  Production Proof
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Related Case Studies
                </h3>
              </div>
              <Link
                href="/work"
                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View all work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group liquid-glass rounded-2xl p-6 border border-slate-200/60 dark:border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      {project.category || 'Case Study'}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-2">
                      {project.tagline || project.overview}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    <span>Inspect Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicPageShell>
  );
}
