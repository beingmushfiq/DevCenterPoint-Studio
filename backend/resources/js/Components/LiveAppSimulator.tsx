import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Users, 
  QrCode, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Send,
  Database,
  Radio,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCms } from '../Context/CmsContext';

type SimulatorMode = 'erp' | 'queue' | 'qr';

export const LiveAppSimulator: React.FC = () => {
  const cms = useCms();
  const configuredMode = cms.getSetting('simulator_default_mode', 'erp') as SimulatorMode;
  const [mode, setMode] = useState<SimulatorMode>(
    ['erp', 'queue', 'qr'].includes(configuredMode) ? configuredMode : 'erp'
  );

  // Retrieve dynamic sandbox app records if available in CMS payload
  const erpApp = cms.sandboxApps?.find((a) => a.slug === 'erp');
  const queueApp = cms.sandboxApps?.find((a) => a.slug === 'feroza-serial' || a.slug === 'serial');
  const qrApp = cms.sandboxApps?.find((a) => a.slug === 'qttenzy-qr' || a.slug === 'qttenzy');

  const erpLiveUrl = erpApp?.live_url || 'https://demoerp.devcenterpoint.com/login';
  const erpUser = erpApp?.credentials_username || 'Admin';
  const erpPass = erpApp?.credentials_password || '12345678';

  const queueLiveUrl = queueApp?.live_url || 'https://serial.ferozamedicinecorner.com';
  const queueUser = queueApp?.credentials_username || 'clinic_reception';
  const queuePass = queueApp?.credentials_password || 'ClinicVerified99!';

  const qrLiveUrl = qrApp?.live_url || 'https://qttenzy.vercel.app';
  const qrUser = qrApp?.credentials_username || 'site_supervisor';
  const qrPass = qrApp?.credentials_password || 'QttenzySecAuth!';

  // ==========================================
  // 1. ERP Inventory State
  // ==========================================
  const [erpStock, setErpStock] = useState({
    central: 142,
    mirpur: 38,
    chittagong: 64,
  });
  const [erpStatus, setErpStatus] = useState<'idle' | 'locking' | 'dispatched'>('idle');
  const [erpLastLog, setErpLastLog] = useState<string>('Inventory synchronized across 3 depots. Ready for allocation.');

  const handleErpDispatch = () => {
    if (erpStatus === 'locking') return;
    setErpStatus('locking');
    setErpLastLog('ACID transaction initiated: lock row WHERE sku = "DCP-902"...');

    setTimeout(() => {
      setErpStock((prev) => ({
        ...prev,
        central: Math.max(0, prev.central - 4),
        mirpur: Math.max(0, prev.mirpur - 1),
      }));
      setErpStatus('dispatched');
      setErpLastLog('Order #DCP-8841 allocated: 5 units decremented. Manifest dispatched to courier API.');
    }, 450);
  };

  const handleErpReset = () => {
    setErpStock({ central: 142, mirpur: 38, chittagong: 64 });
    setErpStatus('idle');
    setErpLastLog('Inventory reset to initial baseline.');
  };

  // ==========================================
  // 2. Clinic Queue State
  // ==========================================
  const [currentToken, setCurrentToken] = useState<number>(42);
  const [queueList, setQueueList] = useState<number[]>([43, 44, 45, 46]);
  const [smsPayload, setSmsPayload] = useState<string | null>(null);
  const [callingState, setCallingState] = useState<boolean>(false);

  const handleCallNextPatient = () => {
    if (callingState || queueList.length === 0) return;
    setCallingState(true);
    const next = queueList[0];
    const remaining = queueList.slice(1);

    setTimeout(() => {
      setCurrentToken(next);
      setQueueList(remaining.length > 0 ? remaining : [next + 1, next + 2, next + 3]);
      setSmsPayload(`SMS Sent to +88017***: "Serial #${next} called to Counter 01 (Dr. Farhana). Please proceed."`);
      setCallingState(false);
    }, 350);
  };

  // ==========================================
  // 3. Dynamic QR State
  // ==========================================
  const [qrTimer, setQrTimer] = useState<number>(10);
  const [qrHash, setQrHash] = useState<string>('a8f9b2c34d1e');
  const [checkInVerified, setCheckInVerified] = useState<boolean>(false);

  useEffect(() => {
    if (mode !== 'qr') return;
    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          setQrHash(Math.random().toString(16).substring(2, 14));
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const handleSimulateCheckIn = () => {
    setCheckInVerified(true);
    setTimeout(() => setCheckInVerified(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl editorial-card overflow-hidden transition-all duration-300">
      {/* Workbench Header & Tab Selector */}
      <div className="flex flex-wrap items-center justify-between border-b hairline-border bg-slate-50/80 dark:bg-[#16181F] px-4 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
            Live Architecture Simulator
          </span>
        </div>

        {/* Tactical Switcher Tabs */}
        <div className="flex items-center overflow-x-auto scroll-touch-x max-w-full bg-white dark:bg-[#0D0E11] p-1 rounded-lg border hairline-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('erp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              mode === 'erp'
                ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>01. Multi-Warehouse ERP</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              mode === 'queue'
                ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>02. Clinic Serial Queue</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer ${
              mode === 'qr'
                ? 'bg-[#121316] text-white dark:bg-white dark:text-[#121316] font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>03. Geofenced QR</span>
          </button>
        </div>
      </div>

      {/* Simulator Viewport Body */}
      <div className="p-5 sm:p-7 bg-white dark:bg-[#13151A]">
        <AnimatePresence mode="wait">
          {/* TAB 1: ERP INVENTORY DISPATCH */}
          {mode === 'erp' && (
            <motion.div
              key="erp"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b hairline-border">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>DevCenterPoint ERP: Inventory & Multi-Depot Sync</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                      Live Production Core
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Simulate real-time atomic inventory allocation across physical warehouses.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleErpReset}
                    className="p-1.5 rounded-md border hairline-border text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Reset Stock Baseline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={erpLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-medium transition-all"
                  >
                    <span>Open Live ERP Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Warehouse Inventory Stock Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181B22] border hairline-border">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Depot 01: Central Hub (Dhaka)
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {erpStock.central}{' '}
                    <span className="text-xs font-normal text-slate-500">units</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                    <Database className="w-3 h-3" />
                    <span>In-Stock / Allocated</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181B22] border hairline-border">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Depot 02: Mirpur Logistics Desk
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {erpStock.mirpur}{' '}
                    <span className="text-xs font-normal text-slate-500">units</span>
                  </div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1 font-mono">
                    <Radio className="w-3 h-3" />
                    <span>Socket Synchronized</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181B22] border hairline-border">
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Depot 03: Agrabad (Chittagong)
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {erpStock.chittagong}{' '}
                    <span className="text-xs font-normal text-slate-500">units</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>Replenishment Active</span>
                  </div>
                </div>
              </div>

              {/* Action & Real-Time Transaction Log */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white dark:bg-[#0B0C0E] border border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>POSTGRESQL TRANSACTION STATUS:</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200">
                    {erpLastLog}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleErpDispatch}
                  disabled={erpStatus === 'locking' || erpStock.central < 5}
                  className="px-4 py-2 rounded-lg bg-[#0047FF] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold whitespace-nowrap flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch 5 Units</span>
                </button>
              </div>

              {/* Credentials Hint */}
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Direct Credentials: Username: <b>{erpUser}</b> | Password: <b>{erpPass}</b></span>
                <span className="text-slate-400">Stack: Laravel 11 • PostgreSQL • Redis • Reverb</span>
              </div>
            </motion.div>
          )}

          {/* TAB 2: HEALTHCARE CLINIC QUEUE */}
          {mode === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b hairline-border">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Feroza Medicine Corner: Counter Serial & SMS Dispatch</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                      Sub-second WebSocket Queue
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Live patient queue dispatch connected directly to waiting room TV monitors and SMS gateways.
                  </p>
                </div>

                <a
                  href={queueLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-medium transition-all"
                >
                  <span>Open Live Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Counter Display Board & Waiting Room Slice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-[#0B0C0E] border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                      Counter 01 • Dr. Farhana (Consultant)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                      Serving Now
                    </span>
                  </div>

                  <div className="my-4 text-center">
                    <div className="text-5xl font-mono font-bold tracking-tight text-white">
                      #{currentToken}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Consultation Active • Prescription Entry In-Progress
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCallNextPatient}
                    disabled={callingState}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>Call Next Patient (Serial #{queueList[0]})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#181B22] border hairline-border flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold mb-3">
                      Lobby Waiting Line (Next in Line)
                    </div>
                    <div className="space-y-2">
                      {queueList.slice(0, 3).map((token, idx) => (
                        <div
                          key={token}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#13151A] border hairline-border text-xs font-mono"
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Serial #{token}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Est. Wait: {(idx + 1) * 6} mins
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {smsPayload && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                      ✓ {smsPayload}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Super Admin: <b>{queueUser}</b> | Password: <b>{queuePass}</b></span>
                <span className="text-slate-400">Stack: Laravel • WebSockets • Twilio SMS • MySQL</span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: DYNAMIC QR ATTENDANCE */}
          {mode === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b hairline-border">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Qttenzy: Anti-Fraud Geofenced Attendance Token</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40">
                      HMAC-SHA256 10s Rotation
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Prevents QR screenshot sharing through continuous token rotation and client GPS boundary locking.
                  </p>
                </div>

                <a
                  href={qrLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-medium transition-all"
                >
                  <span>Open Qttenzy</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Simulated Token Viewport */}
                <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-[#0B0C0E] border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-md">
                    <div className="w-full h-full border-2 border-dashed border-slate-400 rounded flex flex-col items-center justify-center text-slate-900 font-mono text-[10px]">
                      <QrCode className="w-12 h-12 text-slate-900 mb-1" />
                      <span>{qrHash.substring(0, 8)}</span>
                    </div>
                  </div>

                  <div className="w-full max-w-xs mt-4">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Token Rotation In:</span>
                      <span className="font-bold text-white">{qrTimer}s</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0047FF] transition-all duration-1000"
                        style={{ width: `${(qrTimer / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Geofence & Verification Controller */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#181B22] border hairline-border flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold">
                      Campus Geofence Lock
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-[#13151A] border hairline-border space-y-1.5 text-xs font-mono">
                      <div className="text-slate-500">Target Geofence Coordinates:</div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        23.8103° N, 90.4125° E (Dhaka Hub)
                      </div>
                      <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Client Device within 50m radius • GPS Valid</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {checkInVerified ? (
                      <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Attendance Recorded: Employee #049 (Mushfiq) • 09:14 AM</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSimulateCheckIn}
                        className="w-full py-2.5 rounded-lg bg-[#121316] hover:bg-[#0047FF] dark:bg-white dark:hover:bg-[#0047FF] text-white dark:text-[#121316] dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Simulate Geofenced Check-In</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Supervisor: <b>{qrUser}</b> | Password: <b>{qrPass}</b></span>
                <span className="text-slate-400">Stack: React Native • PWA • Node.js • PostGIS</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

