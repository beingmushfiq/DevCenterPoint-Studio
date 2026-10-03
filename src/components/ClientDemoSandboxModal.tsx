import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Server,
  Zap,
  Lock,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Play,
  RefreshCw,
  QrCode,
  Stethoscope,
  Sliders,
  Bell,
  MapPin,
  Terminal,
  Volume2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';

interface SandboxApp {
  id: string;
  name: string;
  category: string;
  description: string;
  liveUrl: string;
  adminUrl?: string;
  badge: string;
  accentColor: string;
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
    credentials: {
      username: 'Admin',
      password: '12345678',
      roles: ['Enterprise Administrator', 'Warehouse Logistics Lead', 'POS Counter Operator'],
      notes: 'Unrestricted evaluation access to order ledger, stock balancing, and sales reporting.'
    },
    features: ['Multi-Warehouse FIFO', 'Sub-35ms Inventory Sync', 'Batch Order Processing', 'Financial Reports']
  },
  {
    id: 'serial',
    name: 'Feroza Clinic Queue & Serial Manager',
    category: 'Healthcare & Outpatient Systems',
    description: 'Real-time patient queue, counter management, and doctor consultation portal with live TV feed.',
    liveUrl: 'https://serial.ferozamedicinecorner.com',
    adminUrl: 'https://serial.ferozamedicinecorner.com',
    badge: 'Live Clinical Portal',
    accentColor: '#10B981',
    credentials: {
      username: 'Super Admin',
      password: '12345678',
      roles: ['Clinic Super Admin', 'Doctor Consultation Desk', 'Triage Reception Kiosk'],
      notes: 'Direct evaluation of doctor patient summons, SMS waiting alerts, and live TV display chimes.'
    },
    features: ['Pusher WebSocket TV Feed', 'SMS Proximity Dispatch', 'Multi-Doctor Counter Routing', 'Audit Logs']
  },
  {
    id: 'qttenzy',
    name: 'Qttenzy Attendance OS',
    category: 'Access Control & Geofencing',
    description: 'Zero-trust dynamic QR attendance platform featuring rotating encrypted HMAC tokens and GPS geofence bounds.',
    liveUrl: 'https://qttenzy.vercel.app',
    badge: 'Live PWA Scanner',
    accentColor: '#00D084',
    features: ['10s Rotating TOTP Tokens', 'Anti-Screenshot Protection', 'Client Gyroscope Check', 'Offline PWA Sync']
  },
  {
    id: 'ai-studio',
    name: 'DevCenterPoint AI Studio',
    category: 'Applied AI & Workflow Hub',
    description: 'Dedicated studio hub showcasing explainable machine learning models, XGBoost inference, and workflow automation.',
    liveUrl: 'https://devcenterpoint.ai.studio',
    badge: 'Dedicated AI Hub',
    accentColor: '#8B5CF6',
    features: ['SHAP Feature Attribution', 'Sub-200ms Inference', 'Workflow Automation', 'Interactive Visualizers']
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
  const [selectedAppId, setSelectedAppId] = useState<string>('erp');
  const [selectedRole, setSelectedRole] = useState<string>('Enterprise Administrator');
  const [copiedUser, setCopiedUser] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'simulator'>('credentials');

  // ERP simulation state
  const [erpBatch, setErpBatch] = useState<number>(48);
  const [erpStockCount, setErpStockCount] = useState<number>(3420);
  const [erpSyncStatus, setErpSyncStatus] = useState<string>('Sync Clean • Latency 24ms');

  // Clinic simulation state
  const [clinicTicket, setClinicTicket] = useState<number>(104);
  const [clinicCalling, setClinicCalling] = useState<boolean>(false);

  // Qttenzy simulation state
  const [qrToken, setQrToken] = useState<string>('DCP-TOTP-7819');
  const [qrSeconds, setQrSeconds] = useState<number>(9);
  const [gpsVerified, setGpsVerified] = useState<boolean>(true);

  // AI Studio simulation state
  const [riskSlider, setRiskSlider] = useState<number>(0.28);

  const selectedApp = SANDBOX_APPS.find((a) => a.id === selectedAppId) || SANDBOX_APPS[0];

  useEffect(() => {
    if (selectedApp.credentials) {
      setSelectedRole(selectedApp.credentials.roles[0]);
    }
  }, [selectedAppId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQrSeconds((prev) => {
        if (prev <= 1) {
          setQrToken(`DCP-TOTP-${Math.floor(1000 + Math.random() * 9000)}`);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleSimulateClinicCall = () => {
    soundEngine.playSuccessChime();
    setClinicCalling(true);
    setClinicTicket((prev) => prev + 1);
    setTimeout(() => setClinicCalling(false), 2000);
  };

  const handleVerifyGps = () => {
    soundEngine.playTap();
    setGpsVerified(true);
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
        className="relative w-full max-w-4xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white font-sans"
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
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-[#202020] hover:bg-slate-300 dark:hover:bg-[#282828] text-slate-600 dark:text-gray-300 transition-colors cursor-pointer"
            aria-label="Close Sandbox Launcher"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* App Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SANDBOX_APPS.map((app) => {
              const isSelected = selectedAppId === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedAppId(app.id);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 ring-2 ring-blue-500/40'
                      : 'bg-slate-50 dark:bg-[#181818] border-slate-200 dark:border-[#282828] text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-[#383838]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[9px] font-mono uppercase font-bold tracking-wider block ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-gray-500'}`}>
                      {app.category.split('&')[0]}
                    </span>
                    <div className="text-xs font-black leading-snug line-clamp-2">
                      {app.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className={isSelected ? 'text-blue-200' : 'text-emerald-500 font-bold'}>
                      ● Active
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
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
                {/* ERP Simulator */}
                {selectedApp.id === 'devcenterpoint-erp' && (
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

                {/* Healthcare Clinic Simulator */}
                {selectedApp.id === 'feroza-clinic' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">SMART TELEMEDICINE & CLINIC QUEUE DISPLAY</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        WebSocket Channel #clinic-queue-01
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className={`p-4 rounded-xl border transition-all ${clinicCalling ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40' : 'bg-slate-900 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 block font-semibold">NOW CALLING</span>
                        <div className="text-2xl font-black text-emerald-400 tracking-wider">
                          #T-{String(clinicTicket).padStart(3, '0')}
                        </div>
                        <span className="text-[10px] text-slate-300 font-bold block mt-1">
                          {clinicCalling ? '🔔 Paging Audio Chime...' : 'Consultation Room 3B'}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">NEXT IN LINE</span>
                        <div className="text-xl font-bold text-slate-200">
                          #T-{String(clinicTicket + 1).padStart(3, '0')}
                        </div>
                        <span className="text-[9px] text-slate-500 block mt-1">Estimated Wait: ~4 mins</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">EMR TELEMEDICINE STATUS</span>
                        <div className="text-xl font-bold text-blue-400">
                          WebRTC Online
                        </div>
                        <span className="text-[9px] text-slate-500 block mt-1">HIPAA Compliant Session</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 font-sans">
                        Summon the next patient to test the synchronized audio chime & digital waiting room TV board:
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateClinicCall}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Summon Next Patient (Audio Chime)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Qttenzy Attendance Simulator */}
                {selectedApp.id === 'qttenzy' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-slate-200">TIME-BASED ROTATING QR & GEOFENCE VALIDATOR</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        Anti-Screenshot TOTP Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Dynamic Rotating QR Representation */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-white p-1.5 flex flex-col items-center justify-center shrink-0 shadow-inner">
                          <QrCode className="w-16 h-16 text-slate-950" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="text-[9px] uppercase text-slate-400 block font-semibold">Active Rolling Hash</span>
                          <div className="text-xs font-mono font-black text-cyan-400 truncate">
                            {qrToken}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span>Rotating in:</span>
                              <span className="text-cyan-300 font-bold">{qrSeconds}s</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-cyan-400 h-full transition-all duration-1000"
                                style={{ width: `${(qrSeconds / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* GPS Radius Geofence Verification */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 block font-semibold">Physical Coordinate Boundary</span>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className={`w-4 h-4 ${gpsVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
                            <span className="text-xs font-bold text-slate-200">
                              {gpsVerified ? 'Within 35m Campus Boundary (Verified)' : 'Pending Device Verification'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyGps}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            gpsVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{gpsVerified ? '✓ Geofence Confirmed' : 'Trigger Device GPS Check'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Studio Simulator */}
                {selectedApp.id === 'devcenterpoint-ai' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-slate-200">APPLIED AI NEURAL FRAUD SCORING INFERENCE</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Inference Latency: 14ms
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Anomaly Detection Confidence Threshold:</span>
                        <span className="text-purple-300 font-bold">{riskSlider}%</span>
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
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
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
                          <span className="text-purple-300 font-bold">Autonomous RAG Stream</span>
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
