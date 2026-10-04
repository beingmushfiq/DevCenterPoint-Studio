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
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

type ViewMode = 'velocity' | 'latency' | 'quality' | 'radar';

export const EfficiencyMetricsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState<ViewMode>('velocity');
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

  const kpis = [
    {
      label: 'Avg MVP Lead Time',
      value: '14 Days',
      change: '-72% vs Industry',
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'API Response P99',
      value: '38 ms',
      change: 'Sub-100ms Guaranteed',
      icon: Zap,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Automated CI/CD Pass',
      value: '99.8%',
      change: 'Zero-Regression Gate',
      icon: ShieldCheck,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'System Throughput',
      value: '100k+ rps',
      change: 'Scales to Peak Load',
      icon: Activity,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section id="metrics" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-slate-200 dark:border-[#2a2a2a]"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 mb-3">
              <Sparkles className="w-3 h-3 text-blue-500" />
              05.5 — Data-Driven Engineering
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Lifecycle Efficiency Metrics
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mt-4 md:mt-0 font-bold uppercase tracking-wider">
            Quantifiable engineering performance benchmarks comparing traditional development against DevCenterPoint's modular automated architecture.
          </p>
        </motion.div>

        {/* Top Highlight KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((kpi, idx) => {
            const IconComponent = kpi.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-gray-400">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {kpi.value}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{kpi.change}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Visualization Dashboard */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-[#2a2a2a] p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans">
          {/* Controls Bar: View Selector & Timeframe Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-[#2a2a2a]">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-1">
              <button
                onClick={() => setActiveView('velocity')}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeView === 'velocity'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Delivery Velocity</span>
              </button>

              <button
                onClick={() => setActiveView('latency')}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeView === 'latency'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>API Response Latency</span>
              </button>

              <button
                onClick={() => setActiveView('quality')}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeView === 'quality'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quality & Coverage</span>
              </button>

              <button
                onClick={() => setActiveView('radar')}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0 whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  activeView === 'radar'
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>System Radar Comparison</span>
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-2 self-start lg:self-auto text-xs font-bold text-slate-500 dark:text-gray-400">
              <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="uppercase text-[10px] tracking-widest font-black">Period:</span>
              {(['all', 'q3', 'q4'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTimeframe(p)}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-extrabold cursor-pointer transition-colors ${
                    timeframe === p
                      ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'hover:text-slate-900 dark:hover:text-white'
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
                      <BarChart data={VELOCITY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
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
                      <AreaChart data={LATENCY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
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
                      <LineChart data={QUALITY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
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
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
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
              <span>BENCHMARK DATA REAL-TIME AUDITED FROM PRODUCTION TELEMETRY</span>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold hover:underline group"
            >
              <span>Build a high-performance system</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
