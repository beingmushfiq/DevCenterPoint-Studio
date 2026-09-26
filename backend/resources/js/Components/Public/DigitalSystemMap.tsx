import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Smartphone,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  ShieldCheck,
  Users,
  Bell,
  Check,
  MousePointerClick,
  Laptop
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

interface SolutionProduct {
  id: string;
  category: string;
  badge: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  mockupTitle: string;
  stats: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
  activityLogs: {
    time: string;
    event: string;
    badge: string;
  }[];
  businessOutcomes: {
    speedToMarket: string;
    impact: string;
    security: string;
  };
  clientBenefits: string[];
  deliverables: string[];
  sampleActionLabel: string;
  sampleActionToast: string;
}

const SOLUTIONS: SolutionProduct[] = [
  {
    id: 'saas',
    category: 'Cloud SaaS & Web Apps',
    badge: 'High Conversion',
    title: 'Modern Web Platforms & SaaS',
    tagline: 'Fast, intuitive web applications and customer portals built to turn visitors into loyal subscribers.',
    icon: Globe,
    mockupTitle: 'AcmeCloud • Customer Growth Portal',
    stats: [
      { label: 'Active Monthly Users', value: '42,850', change: '+24% this month', trend: 'up' },
      { label: 'Platform Uptime', value: '99.98%', change: 'Zero downtime', trend: 'up' },
      { label: 'Avg. Page Load', value: '0.42s', change: 'Blazing fast', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Enterprise customer onboarded seamlessly', badge: 'New Client' },
      { time: '2m ago', event: 'Automated subscription renewed via Stripe', badge: 'Billing' },
      { time: '5m ago', event: 'Zero-downtime feature update deployed', badge: 'Cloud' }
    ],
    businessOutcomes: {
      speedToMarket: '6 to 8 weeks to MVP launch',
      impact: '+38% increase in user retention',
      security: 'Enterprise-grade data encryption'
    },
    clientBenefits: [
      'Clean, intuitive user experience designed for non-technical users',
      'Instant loading speeds that boost SEO and sales conversions',
      'Scales automatically from your first 100 users to over 100,000+'
    ],
    deliverables: [
      'Interactive Figma UI/UX designs',
      'Production-ready modern web app',
      'Automated cloud hosting setup',
      '100% full intellectual property transfer'
    ],
    sampleActionLabel: 'Simulate User Checkout',
    sampleActionToast: '✓ Test payment processed in 38ms! User access unlocked.'
  },
  {
    id: 'mobile',
    category: 'Mobile & Tablet Apps',
    badge: 'iOS & Android',
    title: 'Sleek iOS & Android Apps',
    tagline: 'Fluid mobile experiences designed for the palm of your hand, featuring offline sync and instant push alerts.',
    icon: Smartphone,
    mockupTitle: 'PulseGo • Consumer Mobile Experience',
    stats: [
      { label: 'Daily Active Users', value: '18,400', change: '+31% adoption', trend: 'up' },
      { label: 'App Store Rating', value: '4.9 ★', change: 'Over 2,400 reviews', trend: 'up' },
      { label: 'Push Notification Open', value: '41.2%', change: '3x industry avg', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'User completed onboarding in 45 seconds', badge: 'Engaged' },
      { time: '1m ago', event: 'Offline order synced automatically when reconnected', badge: 'Offline' },
      { time: '4m ago', event: 'Targeted push notification delivered to 12k users', badge: 'Push' }
    ],
    businessOutcomes: {
      speedToMarket: '8 to 10 weeks across iOS & Android',
      impact: '2.5x higher daily customer engagement',
      security: 'Biometric FaceID & Secure Keychain'
    },
    clientBenefits: [
      'One unified codebase that runs smoothly on both Apple and Android',
      'Works offline and syncs seamlessly when back on WiFi or cellular',
      'Smooth animations and gestures that feel completely natural'
    ],
    deliverables: [
      'Pixel-perfect iOS & Android apps',
      'App Store & Google Play submission management',
      'Instant push notification engine',
      'Complete developer documentation'
    ],
    sampleActionLabel: 'Trigger Test Push Alert',
    sampleActionToast: '🔔 Notification sent: "Your order is ready!" (Delivered in 12ms)'
  },
  {
    id: 'ai',
    category: 'AI & Smart Workflows',
    badge: 'Intelligent Automation',
    title: 'AI Assistants & Smart Automations',
    tagline: 'Practical AI tools and automated workflows that eliminate repetitive manual tasks and unlock hours every week.',
    icon: Sparkles,
    mockupTitle: 'CognitiveDesk • Intelligent Workflow Copilot',
    stats: [
      { label: 'Weekly Hours Saved', value: '1,280 hrs', change: 'Automated workflows', trend: 'up' },
      { label: 'Accuracy Rating', value: '99.4%', change: 'Continuous learning', trend: 'up' },
      { label: 'Instant Query Time', value: '0.18s', change: 'Real-time assistant', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'AI categorized & answered 85 client inquiries', badge: 'Automated' },
      { time: '3m ago', event: 'Smart summary generated for 40-page contract', badge: 'Document' },
      { time: '6m ago', event: 'Predictive inventory alert dispatched to warehouse', badge: 'Forecast' }
    ],
    businessOutcomes: {
      speedToMarket: '4 to 6 weeks for AI integration',
      impact: '65% reduction in manual data entry',
      security: 'Zero data leakage / Private AI model'
    },
    clientBenefits: [
      'Answers customer questions 24/7 with human-like understanding',
      'Summarizes messy documents and spreadsheets in a fraction of a second',
      'Your private business data is protected and never used to train public models'
    ],
    deliverables: [
      'Custom trained AI assistant & smart search',
      'Automated email & workflow triggers',
      'Executive performance dashboard',
      'Security audit & data privacy shield'
    ],
    sampleActionLabel: 'Generate Smart AI Summary',
    sampleActionToast: '✨ AI Insight: "3 high-priority leads detected. Auto-reply drafted."'
  },
  {
    id: 'dashboards',
    category: 'Operations & Dashboards',
    badge: 'Executive Clarity',
    title: 'Live Operations & Business Dashboards',
    tagline: 'Clear, real-time command centers that give business leaders full visibility into operations, revenue, and team efficiency.',
    icon: BarChart3,
    mockupTitle: 'NexusCommand • Enterprise Operations Portal',
    stats: [
      { label: 'Live Operations Tracked', value: '14,200', change: 'Real-time streaming', trend: 'up' },
      { label: 'System Health Score', value: '100%', change: 'All systems green', trend: 'up' },
      { label: 'Reporting Speed', value: 'Instant', change: 'No waiting for exports', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Global sales overview refreshed in real time', badge: 'Live KPI' },
      { time: '2m ago', event: 'Automated inventory reorder sent to supplier', badge: 'Logistics' },
      { time: '5m ago', event: 'Weekly executive summary exported to PDF', badge: 'Report' }
    ],
    businessOutcomes: {
      speedToMarket: '4 to 8 weeks for custom dashboard',
      impact: '100% transparent operations visibility',
      security: 'Role-based access control (RBAC)'
    },
    clientBenefits: [
      'Eliminates confusion by consolidating data from multiple tools into one place',
      'Custom alerts notify leadership immediately if an anomaly occurs',
      'Permission controls ensure staff only see what is relevant to their role'
    ],
    deliverables: [
      'Interactive executive dashboards',
      'Live third-party API data sync',
      'Automated scheduled email reports',
      'Mobile-friendly responsive views'
    ],
    sampleActionLabel: 'Refresh Live Operations Stream',
    sampleActionToast: '📊 Live data refreshed across all 6 business channels!'
  }
];

export const DigitalSystemMap: React.FC = () => {
  const [activeSolutionId, setActiveSolutionId] = useState<string>('saas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeSolution =
    SOLUTIONS.find((s) => s.id === activeSolutionId) || SOLUTIONS[0];

  const handleSelectSolution = (id: string) => {
    soundEngine.playTap();
    setActiveSolutionId(id);
    setToastMessage(null);
  };

  const handleRunSimulation = () => {
    soundEngine.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      soundEngine.playSuccessChime();
      setIsSimulating(false);
      setToastMessage(activeSolution.sampleActionToast);
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    }, 400);
  };

  const handleScrollToContact = () => {
    soundEngine.playClick();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Top Header Banner */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-[#161616] border-b border-slate-200 dark:border-[#262626] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            DevCenterPoint Solution Studio
          </span>
          <span className="text-slate-300 dark:text-gray-700 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 dark:text-gray-400 font-medium hidden sm:inline">
            Interactive Product Explorer
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-gray-400">
          <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
          <span>Click any category to explore</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* Solution Tabs Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
          {SOLUTIONS.map((item) => {
            const isSelected = item.id === activeSolutionId;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectSolution(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all flex items-start gap-3 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 translate-y-[-2px]'
                    : 'bg-slate-50 dark:bg-[#181818] hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-800 dark:text-gray-200 border-slate-200 dark:border-[#2a2a2a]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white dark:bg-[#121212] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2e2e2e]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${
                      isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'
                    }`}
                  >
                    {item.badge}
                  </div>
                  <div className="text-xs sm:text-sm font-black truncate">
                    {item.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Main Body: Preview (Left) + Value Story (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Live Realistic Product UI Mockup (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden relative">
            
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Mockup Window Navigation Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeSolution.mockupTitle}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Product Demo</span>
                </div>
              </div>

              {/* Dynamic Stats Row inside the Mockup */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {activeSolution.stats.map((stat, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                      {stat.label}
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white font-mono my-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="truncate">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Real-Time Activity Feed Inside The Product */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-5">
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3 h-3 text-blue-400" />
                    Real-Time System Activity Feed
                  </span>
                  <span className="text-emerald-400">Synced</span>
                </div>

                <div className="space-y-2">
                  {activeSolution.activityLogs.map((log, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        <span className="text-slate-200 font-medium truncate">
                          {log.event}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {log.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Simulation Action Bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-medium text-center sm:text-left">
                Test the interactive responsiveness of this build:
              </div>

              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30 shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{activeSolution.sampleActionLabel}</span>
              </button>
            </div>

            {/* Toast popup when interactive action clicked */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Clear, Non-Technical Business Impact Story (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
            <div className="space-y-6">
              
              {/* Solution Overview */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1.5">
                  Business Value & Experience
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {activeSolution.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium leading-relaxed mt-2">
                  {activeSolution.tagline}
                </p>
              </div>

              {/* 3 Clear Business Outcomes */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#242424] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-gray-400 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-blue-500" />
                    Delivery Speed
                  </span>
                  <span className="font-black text-slate-900 dark:text-white font-mono">
                    {activeSolution.businessOutcomes.speedToMarket}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#242424] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    Measurable Result
                  </span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {activeSolution.businessOutcomes.impact}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#242424] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 dark:text-gray-400 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                    Security Guarantee
                  </span>
                  <span className="font-black text-purple-600 dark:text-purple-400 font-mono">
                    {activeSolution.businessOutcomes.security}
                  </span>
                </div>
              </div>

              {/* Why People Love Working With Us */}
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-gray-500">
                  What You Get
                </div>
                <ul className="space-y-2">
                  {activeSolution.clientBenefits.map((benefit, bIdx) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-gray-300 font-medium leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Conversion Prompt */}
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 dark:text-gray-400 font-medium text-center sm:text-left">
                100% IP ownership & full repository handover
              </div>

              <button
                type="button"
                onClick={handleScrollToContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <span>Plan A Project Like This</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
