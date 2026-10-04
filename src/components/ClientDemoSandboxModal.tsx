import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Key,
  ShieldCheck,
  ShieldAlert,
  Radio,
  ShoppingCart,
  Heart,
  Globe,
  Zap,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  RefreshCw,
  MapPin,
  Terminal,
  Cpu,
  Send,
  Barcode
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';
import { useCms } from '../context/CmsContext';

interface SandboxApp {
  id: string;
  name: string;
  category: string;
  description: string;
  liveUrl: string;
  adminUrl?: string;
  badge: string;
  accentColor: string;
  icon: React.ElementType;
  credentials?: {
    username: string;
    password?: string;
    roles: string[];
    notes: string;
  };
  features: string[];
}

const SANDBOX_APPS: SandboxApp[] = [
  {
    id: 'erp',
    name: 'DevCenterPoint ERP & Storefront',
    category: 'Enterprise Commerce & Logistics',
    description: 'Full-stack enterprise ERP integrated with multi-warehouse inventory, POS checkout, and dispatch queues.',
    liveUrl: 'https://demoerp.devcenterpoint.com',
    adminUrl: 'https://demoerp.devcenterpoint.com/login',
    badge: 'Live Production Cluster',
    accentColor: '#2E4AF9',
    icon: Globe,
    credentials: {
      username: 'Admin',
      password: '12345678',
      roles: ['Enterprise Administrator', 'Warehouse Logistics Lead', 'POS Counter Operator'],
      notes: 'Unrestricted evaluation access to order ledger, stock balancing, and sales reporting.'
    },
    features: ['Multi-Warehouse FIFO', 'Sub-35ms Inventory Sync', 'Batch Order Processing', 'Financial Reports']
  },
  {
    id: 'roadsafety',
    name: 'Road Safety Movement',
    category: 'Civic Operations & Safety',
    description: 'Central operational platform coordinating nationwide civic campaigns, verified member directories, and public safety emergency alerts.',
    liveUrl: 'https://roadsafetymovement.org',
    adminUrl: 'https://roadsafetymovement.org',
    badge: 'Live Civic Portal',
    accentColor: '#EF4444',
    icon: ShieldAlert,
    credentials: {
      username: 'Coordinator Demo',
      password: '12345678',
      roles: ['Campaign Coordinator', 'Field Dispatch Lead', 'Verified Advocate'],
      notes: 'Live evaluation of emergency campaign broadcast, verified member registry, and incident dispatch.'
    },
    features: ['Verified Member Directory', 'Campaign Dispatch Console', 'Instant Incident Broadcast', 'Operational Impact Analytics']
  },
  {
    id: 'traccar',
    name: 'Traccar GPS Telematics Deployment',
    category: 'IoT & Fleet Telematics',
    description: 'Containerized open-source GPS tracking and telematics stack processing high-frequency hardware IoT packets with real-time geofence boundaries.',
    liveUrl: 'https://github.com/beingmushfiq',
    badge: 'Live Telemetry Stack',
    accentColor: '#F59E0B',
    icon: Radio,
    credentials: {
      username: 'Fleet Lead',
      password: '12345678',
      roles: ['Fleet Supervisor', 'Route Dispatcher', 'Telematics Analyst'],
      notes: 'Direct evaluation of live vehicle positions, high-frequency TCP stream, and geofence alarms.'
    },
    features: ['High-Throughput TCP Server', 'PostGIS Geospatial Queries', 'Dynamic Polygon Geofencing', 'Live WebSocket Marker Stream']
  },
  {
    id: 'slicemart',
    name: 'Slice Mart FMS',
    category: 'Retail & Inventory FMS',
    description: 'Grocery and retail floor management platform enabling instant barcode scanning, shelf-level stock counts, and POS inventory checkout.',
    liveUrl: 'https://slice-mart-fms.vercel.app',
    badge: 'Live Retail Engine',
    accentColor: '#10B981',
    icon: ShoppingCart,
    credentials: {
      username: 'Store Manager',
      password: '12345678',
      roles: ['Floor Manager', 'Inventory Auditor', 'Cashier Station'],
      notes: 'Full access to floor inventory scanning, aisle shelf matrix, and automated replenishment triggers.'
    },
    features: ['Multi-Shelf Inventory Mapping', 'Barcode Scanner PWA', 'Auto-Replenish Triggers', 'Cashier POS Sync']
  },
  {
    id: 'leadlayer',
    name: 'LeadLayer System Architecture',
    category: 'B2B Sales & Pipeline CRM',
    description: 'High-velocity webhook ingestion pipeline and CRM automation tool designed for automated lead qualification and round-robin sales distribution.',
    liveUrl: 'https://github.com/beingmushfiq',
    badge: 'Automated Pipeline',
    accentColor: '#8B5CF6',
    icon: Layers,
    credentials: {
      username: 'Sales Director',
      password: '12345678',
      roles: ['Sales Director', 'Account Executive', 'Lead Qualification Agent'],
      notes: 'Experience instant webhook parsing, drag-and-drop Kanban transitions, and deal velocity tracking.'
    },
    features: ['Multi-Channel Webhook Ingestion', 'Drag-and-Drop Kanban', 'SSE Real-time Deal Alerts', 'Lead Scoring Rules']
  },
  {
    id: 'ngodemo',
    name: 'NGO Demo (DCP)',
    category: 'Social Impact & Crowdfunding',
    description: 'Donation drives, transparent fund tracking, and campaign management platform built for NGOs and civic organizations.',
    liveUrl: 'https://ngodemo-dcp.vercel.app',
    badge: 'Civic Impact Ledger',
    accentColor: '#EC4899',
    icon: Heart,
    credentials: {
      username: 'Fund Auditor',
      password: '12345678',
      roles: ['Civic Campaign Lead', 'Transparent Fund Auditor', 'Volunteer Coordinator'],
      notes: 'Audit public grant disbursement ledgers, live donor checkout, and verified milestone reporting.'
    },
    features: ['Transparent Fund Ledger', 'Live Donation Stream', 'Cause Campaign Manager', 'Donor Impact Analytics']
  },
  {
    id: 'aistudio',
    name: 'DevCenterPoint AI Studio',
    category: 'Applied AI & Workflow Hub',
    description: 'Dedicated studio hub showcasing explainable machine learning models, XGBoost inference, and workflow automation.',
    liveUrl: 'https://devcenterpoint.ai.studio',
    badge: 'Explainable AI Hub',
    accentColor: '#6366F1',
    icon: Sparkles,
    credentials: {
      username: 'Data Scientist',
      password: '12345678',
      roles: ['ML Research Lead', 'Inference Engineer', 'Workflow Auditor'],
      notes: 'Test explainable SHAP feature graphs, sub-200ms FastAPI neural inference, and autonomous document extractors.'
    },
    features: ['SHAP Feature Attribution', 'Sub-200ms Inference', 'XGBoost Explainability', 'Automated Doc Extraction']
  }
];

interface ClientDemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDemoSandboxModal: React.FC<ClientDemoSandboxModalProps> = ({
  isOpen,
  onClose
}) => {
  const cms = useCms();

  const iconMap: Record<string, React.ElementType> = {
    Globe,
    Radio,
    MapPin,
    ShoppingCart,
    Zap,
    Heart,
    Sparkles,
    Layers,
    Terminal,
    Cpu,
  };

  const apps: SandboxApp[] = (cms.sandboxApps && cms.sandboxApps.length > 0)
    ? cms.sandboxApps.map((dbApp: any) => {
        const fallback = SANDBOX_APPS.find((a) => a.id === dbApp.slug);
        return {
          id: dbApp.slug || String(dbApp.id),
          name: dbApp.name,
          category: dbApp.category,
          description: dbApp.description,
          liveUrl: dbApp.live_url,
          adminUrl: dbApp.admin_url || undefined,
          badge: dbApp.badge,
          accentColor: dbApp.accent_color?.startsWith('#')
            ? dbApp.accent_color
            : (fallback?.accentColor || '#2E4AF9'),
          icon: iconMap[dbApp.icon_name] || fallback?.icon || Globe,
          credentials: (dbApp.credentials_username || fallback?.credentials) ? {
            username: dbApp.credentials_username || fallback?.credentials?.username || 'demo_user',
            password: dbApp.credentials_password || fallback?.credentials?.password || 'Password123!',
            roles: Array.isArray(dbApp.roles) && dbApp.roles.length > 0
              ? dbApp.roles
              : (fallback?.credentials?.roles || ['Client Auditor']),
            notes: dbApp.credentials_notes || fallback?.credentials?.notes || 'Interactive cloud environment.',
          } : undefined,
          features: Array.isArray(dbApp.features) && dbApp.features.length > 0
            ? dbApp.features
            : (fallback?.features || ['Live Production Sandbox']),
        };
      })
    : SANDBOX_APPS;

  const [selectedAppId, setSelectedAppId] = useState<string>('erp');
  const [selectedRole, setSelectedRole] = useState<string>('Enterprise Administrator');
  const [copiedUser, setCopiedUser] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'simulator'>('credentials');

  // ERP simulation state
  const [erpBatch, setErpBatch] = useState<number>(48);
  const [erpStockCount, setErpStockCount] = useState<number>(3420);
  const [erpSyncStatus, setErpSyncStatus] = useState<string>('Sync Clean • Latency 24ms');

  // Road Safety simulation state
  const [safetyDispatches, setSafetyDispatches] = useState<number>(14);
  const [safetyVolunteers, setSafetyVolunteers] = useState<number>(450);
  const [safetyAlertStatus, setSafetyAlertStatus] = useState<string>('Emergency Highway Safety Broadcast Sent (12 Zones)');

  // Traccar GPS Telematics simulation state
  const [telematicsSpeed, setTelematicsSpeed] = useState<number>(72);
  const [telematicsPings, setTelematicsPings] = useState<number>(1284);
  const [geofenceVerified, setGeofenceVerified] = useState<boolean>(true);

  // Slice Mart FMS simulation state
  const [shelfStock, setShelfStock] = useState<number>(148);
  const [scannedSku, setScannedSku] = useState<string>('SKU-GROC-8841');
  const [scanCount, setScanCount] = useState<number>(39);

  // LeadLayer CRM simulation state
  const [crmLeads, setCrmLeads] = useState<number>(1240);
  const [assignedRep, setAssignedRep] = useState<string>('Sarah Jenkins');
  const [leadScore, setLeadScore] = useState<number>(94);

  // NGO Demo simulation state
  const [disbursedTotal, setDisbursedTotal] = useState<number>(421500);
  const [grantCount, setGrantCount] = useState<number>(84);
  const [blockHash, setBlockHash] = useState<string>('0x7a8f...4c19');

  // AI Studio simulation state
  const [riskSlider, setRiskSlider] = useState<number>(28);

  const selectedApp = apps.find((a) => a.id === selectedAppId) || apps[0];

  useEffect(() => {
    if (selectedApp.credentials && selectedApp.credentials.roles?.length > 0) {
      setSelectedRole(selectedApp.credentials.roles[0]);
    }
  }, [selectedAppId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundEngine.playModalClose();
        onClose();
      }
    };
    if (isOpen) {
      soundEngine.playModalOpen();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSimulateErpDispatch = () => {
    soundEngine.playTap();
    setErpBatch((prev) => prev + 1);
    setErpStockCount((prev) => prev - 12);
    setErpSyncStatus(`Dispatched batch #${erpBatch + 1} • Sync Latency 19ms`);
  };

  const handleSimulateSafetyDispatch = () => {
    soundEngine.playSuccessChime();
    setSafetyDispatches((prev) => prev + 1);
    setSafetyVolunteers((prev) => prev + 25);
    setSafetyAlertStatus(`🚨 Emergency alert dispatched to ${safetyVolunteers + 25} volunteers in 1.1s`);
  };

  const handleSimulateGpsPing = () => {
    soundEngine.playTap();
    setTelematicsPings((prev) => prev + 1);
    setTelematicsSpeed(Math.floor(65 + Math.random() * 15));
    setGeofenceVerified(true);
  };

  const handleSimulateBarcodeScan = () => {
    soundEngine.playSuccessChime();
    setScanCount((prev) => prev + 1);
    setShelfStock((prev) => Math.max(0, prev - 1));
    const skus = ['SKU-GROC-8841', 'SKU-DAIRY-2194', 'SKU-BEV-9932', 'SKU-SNACK-1048'];
    setScannedSku(skus[Math.floor(Math.random() * skus.length)]);
  };

  const handleSimulateLeadIngest = () => {
    soundEngine.playTap();
    setCrmLeads((prev) => prev + 1);
    const reps = ['Sarah Jenkins', 'Marcus Chen', 'Elena Rostova', 'David Miller'];
    setAssignedRep(reps[Math.floor(Math.random() * reps.length)]);
    setLeadScore(Math.floor(88 + Math.random() * 11));
  };

  const handleSimulateGrantAllocation = () => {
    soundEngine.playSuccessChime();
    setGrantCount((prev) => prev + 1);
    setDisbursedTotal((prev) => prev + 1500);
    setBlockHash(`0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`);
  };

  const handleCopy = (text: string, type: 'user' | 'pass') => {
    soundEngine.playCopySuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'user') {
        setCopiedUser(true);
        setTimeout(() => setCopiedUser(false), 2000);
      } else {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          soundEngine.playModalClose();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white font-sans"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Client Demo Sandbox Launcher
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Verified Environments
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Test-drive our active enterprise systems with pre-filled administrative credentials.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playModalClose();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-[#202020] hover:bg-slate-300 dark:hover:bg-[#282828] text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* App Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
            {apps.map((app) => {
              const isSelected = selectedAppId === app.id;
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedAppId(app.id);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 ring-2 ring-blue-500/40'
                      : 'bg-slate-50 dark:bg-[#181818] border-slate-200 dark:border-[#282828] text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-[#383838]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#121212] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#2e2e2e]'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[8.5px] font-mono uppercase font-bold tracking-wider truncate max-w-16.25 ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'}`}>
                        {app.category.split('&')[0]}
                      </span>
                    </div>
                    <div className="text-[11px] font-black leading-snug line-clamp-2">
                      {app.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                    <span className={isSelected ? 'text-blue-200' : 'text-emerald-500 font-bold'}>
                      ● Active
                    </span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Sandbox App Showcase Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedApp.badge}
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {selectedApp.name}
                </h4>
                <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={selectedApp.adminUrl || selectedApp.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-black tracking-wide shadow-lg shadow-blue-600/30 transition-all active:scale-95 group cursor-pointer"
                >
                  <span>Launch Live Sandbox</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {selectedApp.adminUrl && selectedApp.adminUrl !== selectedApp.liveUrl && (
                  <a
                    href={selectedApp.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Storefront View</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                )}
              </div>
            </div>

            {/* View Mode Toggle: Credentials vs Interactive Simulator */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('credentials');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'credentials'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Access Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('simulator');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-300" />
                <span>Interactive Live Simulator</span>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] uppercase tracking-wider">New</span>
              </button>
            </div>

            {/* TAB CONTENT: Credentials & Role Selector Drawer */}
            {activeTab === 'credentials' && selectedApp.credentials && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                    <Key className="w-4 h-4 text-blue-400" />
                    <span>PRE-CONFIGURED EVALUATION CREDENTIALS</span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400">
                    Auto-Fill Ready • Instant Passkey
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Username Pill */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 block font-bold">Account Username</span>
                      <span className="text-emerald-400 font-extrabold text-sm">{selectedApp.credentials.username}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedApp.credentials!.username, 'user')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
                      title="Copy Username"
                    >
                      {copiedUser ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedUser ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Password Pill */}
                  {selectedApp.credentials.password && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase text-slate-500 block font-bold">Password</span>
                        <span className="text-blue-300 font-extrabold text-sm">{selectedApp.credentials.password}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedApp.credentials!.password!, 'pass')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
                        title="Copy Password"
                      >
                        {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedPass ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Role Switcher Pill Bar */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Available Access Roles:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.credentials.roles.map((role, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedRole(role);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedRole === role
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{role}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {selectedApp.credentials.notes}
                </p>
              </div>
            )}

            {/* TAB CONTENT: Interactive Simulator Console */}
            {activeTab === 'simulator' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
                {/* 1. ERP Simulator */}
                {selectedApp.id === 'erp' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-slate-200">ERP CLOUD SYNC & INVENTORY PIPELINE</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {erpSyncStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Active Warehouse SKU Stock</span>
                        <span className="text-xl font-black text-emerald-400">{erpStockCount.toLocaleString()} units</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Multi-location buffer sync</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Batches Auto-Dispatched</span>
                        <span className="text-xl font-black text-blue-400">{erpBatch} batches</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Automated ERP event stream</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Transactional Isolation</span>
                        <span className="text-xl font-black text-purple-400">PostgreSQL 16</span>
                        <span className="text-[9px] text-slate-500 block mt-1">ACID Safe • Zero-deadlock</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Click to simulate an outbound omnichannel sale fulfillment event in real time:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateErpDispatch}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Simulate Batch Dispatch (-12 Units)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Road Safety Movement Simulator */}
                {selectedApp.id === 'roadsafety' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-slate-200">CIVIC SAFETY DISPATCH & ADVOCATE NETWORK</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        Broadcast SLA: 1.2s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Mobilized Volunteers</span>
                        <span className="text-xl font-black text-rose-400">{safetyVolunteers} Advocates</span>
                        <span className="text-[9px] text-slate-500 block mt-1">12 Sector Hubs Ready</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Campaign Dispatches</span>
                        <span className="text-xl font-black text-amber-400">{safetyDispatches} Runs</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Emergency Push & SMS</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Advocate Verification</span>
                        <span className="text-xl font-black text-emerald-400">100% Tamper-Proof</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Digital Security Badge</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        {safetyAlertStatus}
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateSafetyDispatch}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Simulate Emergency Dispatch (+25 Volunteers)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Traccar GPS Telematics Simulator */}
                {selectedApp.id === 'traccar' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-200">HIGH-FREQUENCY TCP TELEMETRY & POSTGIS ENGINE</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {geofenceVerified ? 'Geofence Bound: Depot Zone Alpha' : 'Boundary Check Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Telemetry Pings Processed</span>
                        <span className="text-xl font-black text-amber-400">{telematicsPings.toLocaleString()} pings</span>
                        <span className="text-[9px] text-slate-500 block mt-1">3,200 TCP packets/sec</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Active Fleet Vehicle Speed</span>
                        <span className="text-xl font-black text-cyan-400">{telematicsSpeed} km/h</span>
                        <span className="text-[9px] text-slate-500 block mt-1">23.7806° N, 90.4193° E</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Spatial Index</span>
                        <span className="text-xl font-black text-purple-400">PostGIS R-Tree</span>
                        <span className="text-[9px] text-slate-500 block mt-1">&lt; 5m polygon accuracy</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Simulate an incoming vehicle telemetry burst over raw TCP socket:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateGpsPing}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Trigger Live Telematics Ping</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Slice Mart FMS Simulator */}
                {selectedApp.id === 'slicemart' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">RETAIL FLOOR MANAGEMENT & BARCODE AUDITING</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Real-time PWA Sync Clean
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Scanned SKU Item</span>
                        <span className="text-lg font-black text-emerald-400 truncate block">{scannedSku}</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Aisle 4 • Shelf Tier B</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Shelf Inventory Count</span>
                        <span className="text-xl font-black text-blue-400">{shelfStock} Units</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Min Threshold: 20 units</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Audits Today</span>
                        <span className="text-xl font-black text-purple-400">{scanCount} Barcodes</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Optical scan time: 180ms</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Scan shelf barcode to verify physical floor count against central POS database:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateBarcodeScan}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Barcode className="w-3.5 h-3.5" />
                        <span>Simulate Barcode SKU Scan (-1 Unit)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. LeadLayer System Architecture Simulator */}
                {selectedApp.id === 'leadlayer' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-slate-200">WEBHOOK INGESTION & ROUND-ROBIN ROUTER</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Queue SLA: 0.12s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Processed Inbound Leads</span>
                        <span className="text-xl font-black text-purple-400">{crmLeads.toLocaleString()} Leads</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Multi-Channel Webhooks</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Assigned Account Exec</span>
                        <span className="text-lg font-black text-emerald-400 truncate block">{assignedRep}</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Round-Robin Algorithm</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Lead Fit Quality</span>
                        <span className="text-xl font-black text-blue-400">{leadScore}/100</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Enterprise Conversion Prob</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Trigger an incoming webhook lead to test algorithmic qualification & rep allocation:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateLeadIngest}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Simulate Webhook Ingestion</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. NGO Demo Simulator */}
                {selectedApp.id === 'ngodemo' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="font-bold text-slate-200">TRANSPARENT CIVIC FUND LEDGER & ALLOCATION</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30">
                        Public Cryptographic Proof: Clean
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Disbursed Community Grants</span>
                        <span className="text-xl font-black text-pink-400">${disbursedTotal.toLocaleString()}</span>
                        <span className="text-[9px] text-slate-500 block mt-1">100% Publicly Auditable</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Completed Relief Milestones</span>
                        <span className="text-xl font-black text-emerald-400">{grantCount} Grants</span>
                        <span className="text-[9px] text-slate-500 block mt-1">Clean Water Project #CW-102</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Cryptographic Block Hash</span>
                        <span className="text-sm font-black text-cyan-300 font-mono block mt-1">{blockHash}</span>
                        <span className="text-[9px] text-slate-500 block mt-1">SHA-256 Ledger Block</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Allocate a grant to community relief and verify the cryptographic public receipt:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateGrantAllocation}
                        className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Allocate Transparent Grant ($1,500)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. AI Studio Simulator */}
                {selectedApp.id === 'aistudio' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-slate-200">APPLIED AI NEURAL FRAUD SCORING & SHAP INFERENCE</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        Inference Latency: 14ms
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Anomaly Detection Confidence Threshold:</span>
                        <span className="text-indigo-300 font-bold">{riskSlider}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="95"
                        value={riskSlider}
                        onChange={(e) => {
                          setRiskSlider(Number(e.target.value));
                          soundEngine.playTap();
                        }}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[9px] uppercase text-slate-500 block">Decision Vector</span>
                          <span className={riskSlider > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {riskSlider > 60 ? '⚡ AUTOMATED HUMAN REVIEW' : '✓ INSTANT PASS APPROVAL'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[9px] uppercase text-slate-500 block">Agent Execution Mode</span>
                          <span className="text-indigo-300 font-bold">Autonomous RAG Stream</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Core Verified Features */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block tracking-wider">
                Delivered Architectural Modules:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedApp.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-200 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-[#161616] border-t border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Need custom enterprise software or dedicated cloud infrastructure?</span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
              const contactElem = document.getElementById('contact');
              if (contactElem) {
                contactElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Request Custom Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
