import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  ShieldAlert,
  Radio,
  ShoppingCart,
  Layers,
  Heart,
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
    id: 'roadsafety',
    category: 'Civic Ops & Safety Platform',
    badge: 'Civic OS',
    title: 'Road Safety Movement',
    tagline: 'Central operational platform coordinating nationwide civic campaigns, verified member directories, and public safety emergency alerts.',
    icon: ShieldAlert,
    mockupTitle: 'Road Safety Movement • Civic Coordination Portal',
    liveUrl: 'https://roadsafetymovement.org',
    adminUrl: 'https://roadsafetymovement.org',
    demoCredentials: {
      user: 'Coordinator Demo',
      pass: '12345678',
      role: 'Campaign Coordinator'
    },
    stats: [
      { label: 'Active Members', value: '12,400+', change: 'Verified advocates', trend: 'up' },
      { label: 'Dispatch Latency', value: '1.2s', change: 'Emergency broadcast', trend: 'up' },
      { label: 'Resolution Rate', value: '94.8%', change: 'Community response SLA', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Emergency highway awareness campaign dispatched to 450 volunteers', badge: 'Dispatch' },
      { time: '3m ago', event: 'New civic advocate identity badge verified and issued', badge: 'Verified' },
      { time: '8m ago', event: 'Community incident report triaged by regional coordinator', badge: 'Triage' }
    ],
    businessOutcomes: {
      speedToMarket: '3 to 5 weeks for civic / org setup',
      impact: '90% faster emergency volunteer mobilization',
      security: 'Strict RBAC & encrypted member directory'
    },
    clientBenefits: [
      'Verified member directory with digital role credentials and tamper-proof security badges',
      'Campaign dispatch console for sub-second community broadcast alerts and volunteer mobilization',
      'High-contrast mobile interface optimized for on-the-ground volunteer coordination'
    ],
    deliverables: [
      'Member registration & digital ID verification portal',
      'Real-time campaign logistics dispatch & coordinator workflow',
      'Public announcement and incident report management engine',
      'Operational impact analytics dashboard for organizational governance'
    ],
    sampleActionLabel: 'Dispatch Campaign Alert',
    sampleActionToast: '🚨 Safety Alert dispatched! 450 verified community volunteers mobilized in 1.2s.'
  },
  {
    id: 'traccar',
    category: 'IoT & Fleet Telematics',
    badge: 'Fleet OS',
    title: 'Traccar GPS Telematics Deployment',
    tagline: 'Containerized open-source GPS tracking and telematics stack processing high-frequency hardware IoT packets with real-time geofence boundaries.',
    icon: Radio,
    mockupTitle: 'Traccar Telematics • Live Fleet Vector Canvas',
    liveUrl: 'https://github.com/beingmushfiq',
    demoCredentials: {
      user: 'Fleet Lead',
      pass: '12345678',
      role: 'Fleet Supervisor'
    },
    stats: [
      { label: 'Connected Assets', value: '850+ Fleet', change: 'Live GPS telemetry', trend: 'up' },
      { label: 'TCP Packet Ingestion', value: '3,200/s', change: 'GT06 / J1939 streams', trend: 'up' },
      { label: 'Spatial Precision', value: '< 5 meters', change: 'PostGIS polygon bounds', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Vehicle #F-104 entered Depot Zone Alpha (Geofence alert cleared)', badge: 'Geofence' },
      { time: '2m ago', event: 'Harsh braking event detected on Highway A3 — Telemetry logged', badge: 'Telematics' },
      { time: '6m ago', event: 'High-frequency TCP packet stream synced with PostGIS cluster', badge: 'Data Stream' }
    ],
    businessOutcomes: {
      speedToMarket: '4 to 6 weeks for Docker fleet stack',
      impact: '32% reduction in fuel waste & unauthorized idling',
      security: 'End-to-end encrypted TCP telemetry pipeline'
    },
    clientBenefits: [
      'Live fleet tracking map with 60fps vector canvas rendering hundreds of concurrent assets',
      'Automated geofence boundary alerts sent instantly to dispatch supervisors via WebSockets',
      'Historical trip playback with speed graphs, engine status, and driver safety scoring'
    ],
    deliverables: [
      'Containerized Docker telematics server deployment',
      'High-throughput TCP packet parser for automotive trackers',
      'Interactive Mapbox vector map client with route replay',
      'Real-time WebSocket event broadcaster and alert rules engine'
    ],
    sampleActionLabel: 'Simulate Telemetry Ping',
    sampleActionToast: '📡 Telemetry Ping received! Vehicle #F-104 location & speed updated on canvas in 14ms.'
  },
  {
    id: 'slicemart',
    category: 'Retail & Inventory FMS',
    badge: 'Retail Engine',
    title: 'Slice Mart FMS',
    tagline: 'Grocery and retail floor management platform enabling instant barcode scanning, shelf-level stock counts, and POS inventory checkout.',
    icon: ShoppingCart,
    mockupTitle: 'Slice Mart • Retail Floor & Stock Controller',
    liveUrl: 'https://slice-mart-fms.vercel.app',
    demoCredentials: {
      user: 'Store Manager',
      pass: '12345678',
      role: 'Floor Manager'
    },
    stats: [
      { label: 'Tracked Shelf SKUs', value: '6,800+', change: 'Floor inventory mapped', trend: 'up' },
      { label: 'Barcode Scan Speed', value: '180ms', change: 'Camera PWA decode', trend: 'up' },
      { label: 'Audit Discrepancy', value: '< 0.02%', change: 'Real-time sync', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Aisle 4 shelf count updated via barcode scanner (Batch #902)', badge: 'Stock Audit' },
      { time: '1m ago', event: 'Cashier checkout register #2 decremented 14 item units', badge: 'POS Sync' },
      { time: '5m ago', event: 'Low stock safety reorder trigger dispatched to supplier portal', badge: 'Auto-Order' }
    ],
    businessOutcomes: {
      speedToMarket: '3 to 5 weeks for store deployment',
      impact: '85% faster physical inventory audit cycles',
      security: 'Offline-first PWA with resilient cloud sync'
    },
    clientBenefits: [
      'Instant barcode camera scanning turning any smartphone or tablet into a rugged inventory terminal',
      'Shelf-level inventory visibility preventing out-of-stock items on retail sales floors',
      'Unified cashier POS integration ensuring zero sync latency between sales and warehouse'
    ],
    deliverables: [
      'Progressive Web App (PWA) barcode scanner client',
      'Store floor layout & multi-shelf SKU management console',
      'Automated stock replenishment notification webhook service',
      'Real-time POS checkout integration ledger'
    ],
    sampleActionLabel: 'Simulate Barcode SKU Audit',
    sampleActionToast: '📦 Barcode #079342 scanned! Aisle 4 shelf stock confirmed & ledger synchronized in 28ms.'
  },
  {
    id: 'leadlayer',
    category: 'B2B Sales & Pipeline CRM',
    badge: 'Automated Pipeline',
    title: 'LeadLayer System Architecture',
    tagline: 'High-velocity webhook ingestion pipeline and CRM automation tool designed for automated lead qualification and round-robin sales distribution.',
    icon: Layers,
    mockupTitle: 'LeadLayer CRM • Pipeline Automation Engine',
    liveUrl: 'https://github.com/beingmushfiq',
    demoCredentials: {
      user: 'Sales Director',
      pass: '12345678',
      role: 'Sales Director'
    },
    stats: [
      { label: 'Webhooks Ingested', value: '45,000+', change: 'Multi-channel intake', trend: 'up' },
      { label: 'Ingestion Latency', value: '0.12s', change: 'Webhook to Kanban queue', trend: 'up' },
      { label: 'Conversion Lift', value: '+38%', change: 'Fast-response routing', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Enterprise inbound lead parsed and scored (Fit Score: 94/100)', badge: 'AI Scoring' },
      { time: '2m ago', event: 'Round-robin assigned lead #L-8392 to Account Exec Sarah T.', badge: 'Routing' },
      { time: '7m ago', event: 'Deal stage transitioned to Contract Review via Zapier webhook', badge: 'Kanban' }
    ],
    businessOutcomes: {
      speedToMarket: '2 to 4 weeks to deploy CRM workflows',
      impact: '4x faster lead response time for sales teams',
      security: 'Encrypted OAuth2 tokens & webhook HMAC checks'
    },
    clientBenefits: [
      'Sub-second webhook intake connecting forms, landing pages, and ad channels with zero dropped leads',
      'Intuitive drag-and-drop Kanban interface with optimistic UI updates and zero lag',
      'Automated criteria-based and round-robin lead allocation preventing sales bottleneck'
    ],
    deliverables: [
      'Multi-channel webhook receiver with HMAC signature validation',
      'Interactive Kanban deal pipeline with custom stages',
      'Automated email sequence and task assignment triggers',
      'Deal velocity & sales forecasting analytics suite'
    ],
    sampleActionLabel: 'Simulate Inbound Lead Ingestion',
    sampleActionToast: '⚡ New Enterprise Lead ingested via webhook! Scored 94/100 & assigned to rep in 35ms.'
  },
  {
    id: 'ngodemo',
    category: 'Social Impact & Crowdfunding',
    badge: 'Civic Impact',
    title: 'NGO Demo (DCP)',
    tagline: 'Donation drives, transparent fund tracking, and campaign management platform built for NGOs and civic organizations.',
    icon: Heart,
    mockupTitle: 'NGO Platform • Transparent Fund Allocation Ledger',
    liveUrl: 'https://ngodemo-dcp.vercel.app',
    demoCredentials: {
      user: 'Fund Auditor',
      pass: '12345678',
      role: 'Transparent Fund Auditor'
    },
    stats: [
      { label: 'Disbursed Grants', value: '$420,000+', change: '100% verified trace', trend: 'up' },
      { label: 'Audit Transparency', value: '100%', change: 'Public ledger verification', trend: 'up' },
      { label: 'Donor Retention', value: '88.5%', change: 'Live impact reporting', trend: 'up' }
    ],
    activityLogs: [
      { time: 'Just now', event: 'Emergency flood relief allocation verified and logged to public ledger', badge: 'Disbursement' },
      { time: '4m ago', event: 'Micro-donation of $250 reconciled via instant payment gateway', badge: 'Donation' },
      { time: '9m ago', event: 'Community impact photo report published to active donor feed', badge: 'Story' }
    ],
    businessOutcomes: {
      speedToMarket: '3 to 5 weeks for civic campaign launch',
      impact: '100% transparent audit trail for every dollar',
      security: 'Cryptographic transaction ledger verification'
    },
    clientBenefits: [
      'Complete public transparency that builds unbreakable donor trust and boosts repeat gifts',
      'Integrated donation checkout supporting international cards and local mobile wallets',
      'Automated tax receipts and personalized impact updates sent to donors on milestone completion'
    ],
    deliverables: [
      'Public donation portal with multi-currency checkout',
      'Transparent fund allocation ledger & reporting dashboard',
      'Volunteer campaign management & event coordination suite',
      'Automated donor receipt generation & email dispatch'
    ],
    sampleActionLabel: 'Simulate Transparent Grant Allocation',
    sampleActionToast: '💙 Grant of $1,500 allocated to Community Clean Water project! Public audit ledger updated.'
  },
  {
    id: 'aistudio',
    category: 'Applied AI & Workflow Hub',
    badge: 'Explainable AI',
    title: 'DevCenterPoint AI Studio',
    tagline: 'Dedicated research & engineering hub showcasing explainable machine learning models, XGBoost inference, and workflow automation.',
    icon: Sparkles,
    mockupTitle: 'DevCenterPoint AI Studio • Applied AI Hub',
    liveUrl: 'https://devcenterpoint.ai.studio',
    demoCredentials: {
      user: 'Data Scientist',
      pass: '12345678',
      role: 'ML Research Lead'
    },
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
    <div className="relative w-full rounded-3xl liquid-glass shadow-2xl overflow-hidden transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
      
      {/* Top Header Banner */}
      <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
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

      <div className="p-3.5 sm:p-6 lg:p-8">
        
        {/* Solution Tabs Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-2 sm:gap-2.5 mb-6 sm:mb-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-5">
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
