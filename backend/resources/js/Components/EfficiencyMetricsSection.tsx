import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Zap,
  ShieldCheck,
  BarChart3,
  Clock,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Database,
  Server,
  BookOpen,
  FileCode,
} from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';
import { useCms } from '../Context/CmsContext';

// Dataset 1: Delivery Velocity (Days to Milestone)
const VELOCITY_DATA = [
  { phase: 'Discovery & Spec', standard: 14, dcp: 3, reduction: '78%' },
  { phase: 'Architecture & DB', standard: 18, dcp: 4, reduction: '77%' },
  { phase: 'Frontend & UI', standard: 28, dcp: 8, reduction: '71%' },
  { phase: 'Backend & APIs', standard: 24, dcp: 6, reduction: '75%' },
  { phase: 'QA & Compliance', standard: 16, dcp: 3, reduction: '81%' },
  { phase: 'CI/CD & Deploy', standard: 10, dcp: 1, reduction: '90%' },
];

// Dataset 2: API Latency & P99 Response Times (ms under load)
const LATENCY_DATA = [
  { requests: '1k req/s', legacyMonolith: 120, dcpMicroservice: 22, dcpEdgeCached: 8 },
  { requests: '5k req/s', legacyMonolith: 280, dcpMicroservice: 38, dcpEdgeCached: 12 },
  { requests: '10k req/s', legacyMonolith: 490, dcpMicroservice: 54, dcpEdgeCached: 18 },
  { requests: '25k req/s', legacyMonolith: 850, dcpMicroservice: 72, dcpEdgeCached: 24 },
  { requests: '50k req/s', legacyMonolith: 1450, dcpMicroservice: 98, dcpEdgeCached: 32 },
  { requests: '100k req/s', legacyMonolith: 2600, dcpMicroservice: 124, dcpEdgeCached: 42 },
];

// Dataset 3: Software Quality & Test Coverage Trends (% over 6 Sprints)
const QUALITY_DATA = [
  { sprint: 'Sprint 1', testCoverage: 68, zeroDefectRate: 88, automatedBuilds: 100 },
  { sprint: 'Sprint 2', testCoverage: 78, zeroDefectRate: 92, automatedBuilds: 100 },
  { sprint: 'Sprint 3', testCoverage: 86, zeroDefectRate: 95, automatedBuilds: 100 },
  { sprint: 'Sprint 4', testCoverage: 91, zeroDefectRate: 97, automatedBuilds: 100 },
  { sprint: 'Sprint 5', testCoverage: 95, zeroDefectRate: 99, automatedBuilds: 100 },
  { sprint: 'Sprint 6', testCoverage: 98, zeroDefectRate: 99.8, automatedBuilds: 100 },
];

// Dataset 4: Operational Efficiency Radar
const RADAR_DATA = [
  { metric: 'Deployment Speed', Standard: 35, DevCenterPoint: 96 },
  { metric: 'API Throughput', Standard: 50, DevCenterPoint: 94 },
  { metric: 'Code Coverage', Standard: 62, DevCenterPoint: 98 },
  { metric: 'Security Audit', Standard: 70, DevCenterPoint: 100 },
  { metric: 'Cost Optimization', Standard: 45, DevCenterPoint: 88 },
  { metric: 'Uptime Reliability', Standard: 82, DevCenterPoint: 99.9 },
];

export interface DeliverableItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  verification: string;
  badge: string;
}

export const PRODUCTION_DELIVERABLES: DeliverableItem[] = [
  {
    id: 'source-code',
    number: '01',
    title: 'Complete Git Repository Transfer',
    summary: 'Full source code ownership transferred on milestone sign-off. Clean commit history, unminified source code, zero obfuscation, and zero ongoing vendor license fees.',
    verification: 'Full push access to your GitHub or GitLab organization with clear README setup.',
    badge: '100% Owned'
  },
  {
    id: 'database-architecture',
    number: '02',
    title: 'Documented Database Architecture',
    summary: 'Normalized schemas with explicit foreign key constraints, indexes on high-frequency query paths, automated migrations, seeders, and zero raw credentials in version control.',
    verification: 'Verifiable with automated migration test scripts and clear schema documentation.',
    badge: 'PostgreSQL / MySQL'
  },
  {
    id: 'automated-test-suite',
    number: '03',
    title: 'Automated Test Suites & Static Checks',
    summary: 'Feature and unit test suites covering mission-critical business flows: payment webhook handling, inventory decrement safety, and authentication guards.',
    verification: 'Green test execution in GitHub Actions CI pipeline before every production deploy.',
    badge: 'PHPUnit / Pest'
  },
  {
    id: 'container-deployment',
    number: '04',
    title: 'Containerization & Deployment Scripts',
    summary: 'Docker Compose orchestration files, Nginx reverse proxy configuration, environment templates, and zero-downtime deployment scripts for cPanel, VPS, or cloud hosts.',
    verification: 'One-command staging environment boot via Docker Compose or deploy script.',
    badge: 'Docker & Nginx'
  },
  {
    id: 'warranty-sla',
    number: '05',
    title: '30-Day Post-Launch Warranty',
    summary: 'Dedicated post-launch warranty covering any bugs or deviations from the agreed scope specification. Production-blocking issues receive a sub-4-hour response SLA.',
    verification: 'Direct communication via dedicated Slack or WhatsApp engineering channel.',
    badge: '< 4h SLA'
  },
  {
    id: 'staff-handover',
    number: '06',
    title: 'Administrative Handover & Documentation',
    summary: 'Recorded video walkthroughs of back-office administration, database backup procedures, and role permission management for your internal operations staff.',
    verification: 'Live handover call plus permanent documentation stored in your repository.',
    badge: 'Recorded Video'
  }
];

type ViewMode = 'deliverables' | 'velocity' | 'latency' | 'quality' | 'radar';

interface MetricsHeader {
  badge?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_METRICS_HEADER: MetricsHeader = {
  badge: '05.5 — Standards & Deliverables',
  headline: 'Production Handover & SLAs',
  subtitle:
    'Every system we build includes full source code ownership, automated tests, documented database architecture, and a 30-day post-launch warranty.',
};

interface MetricKpi {
  label: string;
  value: string;
  change: string;
  iconName?: string;
  color?: string;
  bg?: string;
}

const DEFAULT_KPIS: MetricKpi[] = [
  {
    label: 'Source Code Handover',
    value: '100%',
    change: 'Private Git Transfer',
    iconName: 'ShieldCheck',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    label: 'Post-Launch Warranty',
    value: '30 Days',
    change: 'Included on All Contracts',
    iconName: 'Clock',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    label: 'Incident Response SLA',
    value: '< 4 Hours',
    change: 'Critical Priority Outages',
    iconName: 'Zap',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    label: 'Zero Vendor Lock-in',
    value: '0 Lic. Fees',
    change: 'Standard Open Stack',
    iconName: 'Activity',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
];

const KPI_ICONS: Record<string, React.ElementType> = {
  Clock,
  Zap,
  ShieldCheck,
  Activity,
  FileCode,
  Database,
  Server,
  BookOpen,
  CheckCircle2,
};

export const EfficiencyMetricsSection: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<MetricsHeader>('efficiency_metrics', 'header', DEFAULT_METRICS_HEADER);
  const kpis = cms.getSectionBlock<MetricKpi[]>('efficiency_metrics', 'kpis', DEFAULT_KPIS);
  const deliverables = cms.getSectionBlock<DeliverableItem[]>('efficiency_metrics', 'deliverables', PRODUCTION_DELIVERABLES);
  const velocityData = cms.getSectionBlock('efficiency_metrics', 'velocity', VELOCITY_DATA);
  const latencyData = cms.getSectionBlock('efficiency_metrics', 'latency', LATENCY_DATA);
  const qualityData = cms.getSectionBlock('efficiency_metrics', 'quality', QUALITY_DATA);
  const radarData = cms.getSectionBlock('efficiency_metrics', 'radar', RADAR_DATA);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState<ViewMode>('deliverables');
  const [timeframe, setTimeframe] = useState<'all' | 'q3' | 'q4'>('all');

  // Colors for dark and light themes
  const chartColors = {
    grid: isDark ? '#222222' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#111111' : '#ffffff',
    tooltipBorder: isDark ? '#2a2a2a' : '#cbd5e1',
    primary: '#3b82f6', // Blue
    accent: '#10b981', // Emerald
    secondary: '#8b5cf6', // Purple
    warning: '#f59e0b', // Amber
    muted: isDark ? '#334155' : '#cbd5e1',
  };

  return (
    <section id="metrics" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>{headerContent.badge || DEFAULT_METRICS_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {headerContent.headline || DEFAULT_METRICS_HEADER.headline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            {headerContent.subtitle || DEFAULT_METRICS_HEADER.subtitle}
          </p>
        </div>

        {/* Top Highlight KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const IconComponent = (kpi.iconName && KPI_ICONS[kpi.iconName]) || (kpi as any).icon || Clock;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl editorial-card flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {kpi.label}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[var(--bg-subtle)] border hairline-border text-[var(--accent-primary)]">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    {kpi.value}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Visualization Dashboard */}
        <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Controls Bar: View Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b hairline-border">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveView('deliverables')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border hairline-border cursor-pointer ${
                  activeView === 'deliverables'
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Deliverables & SLAs
              </button>

              <button
                onClick={() => setActiveView('velocity')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border hairline-border cursor-pointer ${
                  activeView === 'velocity'
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Delivery Velocity
              </button>

              <button
                onClick={() => setActiveView('latency')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border hairline-border cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'latency'
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>API Latency</span>
              </button>

              <button
                onClick={() => setActiveView('quality')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border hairline-border cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'quality'
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Test Coverage</span>
              </button>

              <button
                onClick={() => setActiveView('radar')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border hairline-border cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'radar'
                    ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-bold shadow-xs'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>System Radar</span>
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-2 self-start lg:self-auto text-xs font-mono font-bold text-[var(--text-muted)]">
              <Filter className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span className="uppercase text-[10px] tracking-wider">Period:</span>
              {(['all', 'q3', 'q4'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTimeframe(p)}
                  className={`px-2.5 py-1 rounded-md uppercase text-[10px] font-bold cursor-pointer transition-colors ${
                    timeframe === p
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] border hairline-border'
                      : 'hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p === 'all' ? 'Cumulative' : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Visualization Workspace */}
          <div className="min-h-[380px] w-full">
            <AnimatePresence mode="wait">
              {activeView === 'deliverables' && (
                <motion.div
                  key="deliverables"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Standard Handover Specifications
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                        Every system we build includes the following contractual deliverables and verification mechanisms.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                      All 6 Included in Contract
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {deliverables.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#282828] flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                              {item.number}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-gray-400 px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-[#202020]">
                              {item.badge}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                            {item.summary}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-200/80 dark:border-[#222222] text-[11px] font-mono text-slate-500 dark:text-gray-500">
                          <span className="font-bold text-slate-700 dark:text-gray-400">Verification: </span>
                          {item.verification}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'velocity' && (
                <motion.div
                  key="velocity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Milestone Delivery Lead Time (Days)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                        Comparing traditional software agency dev cycles vs DevCenterPoint's automated modular architecture.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-slate-400 dark:bg-slate-600"></span> Standard Agency
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-500"></span> DevCenterPoint Engine
                      </span>
                    </div>
                  </div>

                  <div className="h-[320px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                          dataKey="phase"
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11 }}
                          unit=" d"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            borderColor: chartColors.tooltipBorder,
                            borderRadius: '16px',
                            color: isDark ? '#ffffff' : '#0f172a',
                            fontWeight: 600,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                        <Bar dataKey="standard" name="Standard Agency (Days)" fill={chartColors.muted} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="dcp" name="DevCenterPoint (Days)" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {activeView === 'latency' && (
                <motion.div
                  key="latency"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        P99 Response Latency Under Load (ms)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                        API response times as concurrent traffic scales up to 100,000 requests per second.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-500"></span> Monolith
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-500"></span> DCP Microservice
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-500"></span> DCP Edge Cached
                      </span>
                    </div>
                  </div>

                  <div className="h-[320px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={latencyData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                        <defs>
                          <linearGradient id="colorDcpEdge" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorDcpMicro" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                          dataKey="requests"
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11 }}
                          unit=" ms"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            borderColor: chartColors.tooltipBorder,
                            borderRadius: '16px',
                            color: isDark ? '#ffffff' : '#0f172a',
                            fontWeight: 600,
                          }}
                        />
                        <Area type="monotone" dataKey="legacyMonolith" name="Monolith (ms)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                        <Area type="monotone" dataKey="dcpMicroservice" name="DCP Microservice (ms)" stroke="#3b82f6" fill="url(#colorDcpMicro)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="dcpEdgeCached" name="DCP Edge Cached (ms)" stroke="#10b981" fill="url(#colorDcpEdge)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {activeView === 'quality' && (
                <motion.div
                  key="quality"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Software Quality & Automated Test Coverage (%)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                        Sprint-over-sprint test coverage progression and zero-defect deployment confidence.
                      </p>
                    </div>
                  </div>

                  <div className="h-[320px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={qualityData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                        <XAxis
                          dataKey="sprint"
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }}
                        />
                        <YAxis
                          stroke={chartColors.text}
                          tick={{ fill: chartColors.text, fontSize: 11 }}
                          domain={[50, 100]}
                          unit="%"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            borderColor: chartColors.tooltipBorder,
                            borderRadius: '16px',
                            color: isDark ? '#ffffff' : '#0f172a',
                            fontWeight: 600,
                          }}
                        />
                        <Line type="monotone" dataKey="testCoverage" name="Test Coverage (%)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="zeroDefectRate" name="Zero Defect Rate (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {activeView === 'radar' && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Full-Spectrum System Efficiency Benchmark
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                        Multi-dimensional rating across key operational dimensions (Scale 0-100).
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-slate-400 dark:bg-slate-600"></span> Standard Agency
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-500"></span> DevCenterPoint
                      </span>
                    </div>
                  </div>

                  <div className="h-[320px] w-full pt-2 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke={chartColors.grid} />
                        <PolarAngleAxis dataKey="metric" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={chartColors.grid} />
                        <Radar name="Standard Agency" dataKey="Standard" stroke={chartColors.muted} fill={chartColors.muted} fillOpacity={0.3} />
                        <Radar name="DevCenterPoint" dataKey="DevCenterPoint" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.tooltipBg,
                            borderColor: chartColors.tooltipBorder,
                            borderRadius: '16px',
                            color: isDark ? '#ffffff' : '#0f172a',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ALL DELIVERABLES VERIFIED WITH AUTOMATED CI/CD AND PRODUCTION DEPLOYMENT TESTS</span>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold hover:underline group"
            >
              <span>Scope your custom system</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
