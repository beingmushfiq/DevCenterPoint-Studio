import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Activity,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Bell,
  Check,
  MousePointerClick,
  Laptop,
  ExternalLink,
  Copy,
  Key
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
  liveUrl?: string;
  adminUrl?: string;
  demoCredentials?: {
    user: string;
    pass: string;
    role?: string;
  };
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
    id: 'erp',
    category: 'Enterprise ERP & Commerce',
    badge: 'Omnichannel Core',
    title: 'DevCenterPoint ERP & Storefront',
    tagline: 'Full-stack enterprise ERP integrated with an omnichannel storefront, live inventory sync, and POS sales workflows.',
    icon: Globe,
    mockupTitle: 'DevCenterPoint ERP • Enterprise Control Portal',
    liveUrl: 'https://demoerp.devcenterpoint.com',
    adminUrl: 'https://demoerp.devcenterpoint.com/login',
    demoCredentials: {
      user: 'Admin',
      pass: '12345678',
      role: 'Enterprise Administrator'
    },
    stats: [
      { label: 'Active SKU Matrix', value: '18,450+', change: 'Multi-hub sync', trend: 'up' },
      { label: 'Platform Uptime', value: '99.98%', change: 'Zero stock drift', trend: 'up' },
      { label: 'Order Processing SLA', value: '0.38s', change: 'Redis lock engine', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Enterprise warehouse batch dispatch completed (SKU #4892)', badge: 'Fulfillment' },
      { time: '2m ago', event: 'Omnichannel checkout reconciled via Stripe & Gateway', badge: 'Settlement' },
      { time: '5m ago', event: 'Multi-tier safety stock threshold auto-replenished', badge: 'Inventory' }
    ],
    businessOutcomes: {
      speedToMarket: '6 to 8 weeks to full deployment',
      impact: '100% elimination of double-allocations',
      security: 'Optimistic concurrency & RBAC audit logs'
    },
    clientBenefits: [
      'Unified stock visibility preventing stockouts and overselling across all sales channels',
      'High-density order tables engineered for rapid keyboard navigation & zero fatigue',
      'Automated courier routing rules based on proximity, stock level, and courier SLAs'
    ],
    deliverables: [
      'Omnichannel storefront + back-office ERP',
      'Multi-warehouse inventory synchronization engine',
      'Batch order manifest & shipping label generator',
      '100% full source code repository handover'
    ],
    sampleActionLabel: 'Simulate POS Inventory Dispatch',
    sampleActionToast: '✓ Order #DCP-8842 allocated across 3 warehouses in 34ms! Live stock locked.'
  },
  {
    id: 'healthcare',
    category: 'Healthcare Queue & Clinics',
    badge: 'Healthcare OS',
    title: 'Feroza Medicine Corner Serial Manager',
    tagline: 'Real-time patient queue, counter dispatch, and doctor appointment serial management portal built for healthcare desks.',
    icon: Activity,
    mockupTitle: 'Feroza Medicine Corner • Serial Manager OS',
    liveUrl: 'https://serial.ferozamedicinecorner.com',
    adminUrl: 'https://serial.ferozamedicinecorner.com',
    demoCredentials: {
      user: 'Super Admin',
      pass: '12345678',
      role: 'Clinic Super Admin'
    },
    stats: [
      { label: 'Daily Patient Serials', value: '1,420+', change: 'Outpatient desks', trend: 'up' },
      { label: 'Lobby Congestion', value: '-65%', change: 'Remote SMS tracking', trend: 'up' },
      { label: 'Socket Broadcast', value: '22ms', change: 'Pusher / Reverb', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Patient Token #42 called to Specialist Counter 3', badge: 'Summons' },
      { time: '1m ago', event: 'Automated SMS proximity alert sent to Token #45', badge: 'SMS Alert' },
      { time: '4m ago', event: 'Pharmacy counter dispense verified with barcode scan', badge: 'Dispense' }
    ],
    businessOutcomes: {
      speedToMarket: '4 to 6 weeks for custom clinic setup',
      impact: '65% reduction in waiting room crowd density',
      security: 'Encrypted patient records & offline buffer'
    },
    clientBenefits: [
      'High-legibility waiting room TV display visible from 30+ feet away with audio cues',
      'Patients wait comfortably in cafes or outdoors with live mobile web queue tracking',
      'Doctor desk console enables instant 1-click patient calling, transfers, and emergency triage'
    ],
    deliverables: [
      'Patient self-service token kiosk UI & printer setup',
      'Doctor & receptionist counter control consoles',
      'High-contrast public display screen layout with audio chimes',
      'Automated Twilio / SMS alert gateway integration'
    ],
    sampleActionLabel: 'Simulate Patient Counter Summons',
    sampleActionToast: '🔔 Token #A-108 called! Waiting room TV screen & chime triggered in 18ms.'
  },
  {
    id: 'ai',
    category: 'AI & Smart Workflows',
    badge: 'AI Studio Hub',
    title: 'DevCenterPoint AI Studio',
    tagline: 'Dedicated research & engineering hub exploring applied AI tools, explainable machine learning models, and automated enterprise workflows.',
    icon: Sparkles,
    mockupTitle: 'DevCenterPoint AI Studio • Applied AI Hub',
    liveUrl: 'https://devcenterpoint.ai.studio',
    stats: [
      { label: 'Weekly Hours Saved', value: '1,480 hrs', change: 'Automated LLM pipelines', trend: 'up' },
      { label: 'Inference Latency', value: '0.18s', change: 'FastAPI streaming', trend: 'up' },
      { label: 'Model Precision', value: '99.4%', change: 'Domain fine-tuning', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Autonomous webhook router parsed 120 client leads', badge: 'Agentic' },
      { time: '3m ago', event: 'SHAP feature importance graph computed for career model', badge: 'Explainable' },
      { time: '6m ago', event: 'Clinical screening assessment PDF compiled and dispatched', badge: 'DocGen' }
    ],
    businessOutcomes: {
      speedToMarket: '3 to 5 weeks for domain AI integration',
      impact: '65% reduction in manual data entry & triage',
      security: 'Zero data leakage / Private dedicated inference'
    },
    clientBenefits: [
      'Answers customer and staff questions 24/7 with deep context understanding',
      'Explainable AI models backed by mathematical feature attribution (SHAP)',
      'Your private business data is protected and never used to train public models'
    ],
    deliverables: [
      'Custom domain LLM pipeline & retrieval system (RAG)',
      'FastAPI C-accelerated inference microservices',
      'Automated document processing & PDF extraction engine',
      'Monitoring, hallucination guards, and token usage optimization'
    ],
    sampleActionLabel: 'Trigger AI Pipeline Inference',
    sampleActionToast: '✨ AI Workflow executed in 140ms! Structured JSON response generated.'
  },
  {
    id: 'qttenzy',
    category: 'Dynamic QR & Geofence OS',
    badge: 'IoT & Access',
    title: 'Qttenzy Smart Geofenced Attendance',
    tagline: 'QR-based automated geofenced attendance system that verifies check-ins within precise physical boundaries.',
    icon: ShieldCheck,
    mockupTitle: 'Qttenzy • Smart Geofence Access Portal',
    liveUrl: 'https://qttenzy.vercel.app',
    stats: [
      { label: 'Verified Check-ins', value: '38,200', change: 'Anti-spoofing enabled', trend: 'up' },
      { label: 'Rotating QR Interval', value: '10s', change: 'HMAC-SHA256 tokens', trend: 'up' },
      { label: 'Optical Scan Time', value: '0.45s', change: 'Instant PWA decode', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Geofenced entrance verified within 15m radius', badge: 'Geofence' },
      { time: '2m ago', event: 'Batch attendance ledger synced with campus server', badge: 'Ledger' },
      { time: '5m ago', event: 'Rotating TOTP token refreshed across display terminals', badge: 'Security' }
    ],
    businessOutcomes: {
      speedToMarket: '4 to 6 weeks for campus or office deployment',
      impact: '100% elimination of proxy check-in fraud',
      security: 'Hardware gyroscope & GPS fence validation'
    },
    clientBenefits: [
      'Fraud-resistant dynamic QR codes rotate every 10 seconds to stop screenshot sharing',
      'Client-side GPS boundary checks combined with server-side IP subnet matching',
      'Role-based dashboard tailored for administrators, supervisors, and end-users'
    ],
    deliverables: [
      'Dynamic rotating QR code projection display feed',
      'Offline-capable PWA scanner client with automatic sync',
      'Automated export of attendance records in CSV, PDF, and XLS',
      'Granular department permission controls & shift calculation'
    ],
    sampleActionLabel: 'Simulate Geofence Check-in',
    sampleActionToast: '📍 GPS boundary validated! Dynamic QR token decoded & verified in 42ms.'
  }
];

export const DigitalSystemMap: React.FC = () => {
  const [activeSolutionId, setActiveSolutionId] = useState<string>('erp');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeSolution =
    SOLUTIONS.find((s) => s.id === activeSolutionId) || SOLUTIONS[0];

  const handleSelectSolution = (id: string) => {
    soundEngine.playTap();
    setActiveSolutionId(id);
    setToastMessage(null);
  };

  const handleCopy = (text: string, keyName: string) => {
    soundEngine.playSuccessChime();
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
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
        
        {/* Solution Tabs Selector (Red Box 1) */}
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
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 -translate-y-0.5'
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
          
          {/* Left Column: Live Realistic Product UI Mockup (Red Box 2) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden relative">
            
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Mockup Window Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 truncate">
                    <Laptop className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{activeSolution.mockupTitle}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeSolution.liveUrl && (
                    <a
                      href={activeSolution.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-mono font-bold transition-all"
                    >
                      <span>Live System</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Demo</span>
                  </div>
                </div>
              </div>

              {/* Demo Credentials Bar if available */}
              {activeSolution.demoCredentials && (
                <div className="p-2.5 mb-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-400">User:</span>
                      <span className="text-emerald-400 font-bold">{activeSolution.demoCredentials.user}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeSolution.demoCredentials!.user, 'user')}
                        className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                        title="Copy Username"
                      >
                        {copiedKey === 'user' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-400">Pass:</span>
                      <span className="text-blue-300 font-bold">{activeSolution.demoCredentials.pass}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeSolution.demoCredentials!.pass, 'pass')}
                        className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedKey === 'pass' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>
                  </div>

                  {activeSolution.adminUrl && (
                    <a
                      href={activeSolution.adminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold transition-colors"
                    >
                      <span>Admin Login</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

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

              {/* What You Get */}
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
