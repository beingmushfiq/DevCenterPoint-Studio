import React, { useState, useEffect } from 'react';
import { 
  X, 
  Terminal, 
  Code2, 
  Cpu, 
  Sparkles, 
  Check, 
  Copy, 
  Sliders, 
  Play, 
  Pause, 
  Zap, 
  Volume2, 
  VolumeX, 
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';
import { CanvasMode } from './HeroInteractiveCanvas';

export interface HeroCodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCanvasMode: CanvasMode;
  onSelectCanvasMode: (mode: CanvasMode) => void;
}

const SAMPLE_ARCHITECTURE_CODE = `// DevCenterPoint High-Throughput Event Queue & Typed Reactor
import { createPipeline, defineContract } from '@dcp/runtime-core';

export const TelemetryContract = defineContract<{
  channel: 'events' | 'audit' | 'telematics';
  throughput: number;
  deterministicHash: string;
}>({
  strictMode: true,
  zeroLossTolerance: true,
});

export const realtimeReactor = createPipeline({
  concurrency: 64,
  maxBatchSize: 1024,
  drainIntervalMs: 2,
  handler: async (batch) => {
    // Zero-copy deserialization over V8 memory buffer
    const verified = await batch.verifySOC2Integrity();
    return verified.dispatchToEdgeCluster();
  }
});`;

export const HeroCodeDrawer: React.FC<HeroCodeDrawerProps> = ({
  isOpen,
  onClose,
  activeCanvasMode,
  onSelectCanvasMode,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'telemetry' | 'physics'>('code');
  const [copied, setCopied] = useState<boolean>(false);
  const [particleSpeed, setParticleSpeed] = useState<number>(1);
  const [tonePreset, setTonePreset] = useState<'ethereal' | 'deep_tech' | 'cyber'>(soundEngine.getTonePreset());

  // Keyboard accessibility: Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundEngine.playTap();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyCode = async () => {
    soundEngine.playTap();
    try {
      await navigator.clipboard.writeText(SAMPLE_ARCHITECTURE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToneChange = (preset: 'ethereal' | 'deep_tech' | 'cyber') => {
    setTonePreset(preset);
    soundEngine.setTonePreset(preset);
    soundEngine.playPresetChord(preset);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity"
          />

          {/* Floating Drawer: Bottom sheet on mobile, docked sleek cockpit panel on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 left-0 sm:left-auto w-full sm:w-[540px] max-h-[85vh] sm:max-h-[82vh] z-50 rounded-t-3xl sm:rounded-3xl bg-slate-950/95 border border-white/20 shadow-2xl shadow-black/90 backdrop-blur-2xl flex flex-col overflow-hidden text-white font-mono"
          >
            {/* Mobile Drag Pill */}
            <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto mt-2.5 sm:hidden" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight text-white font-sans">
                      Cinema Sandbox & Architecture
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-[9px] font-mono text-blue-300 font-bold uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Interactive engineering telemetry & runtime inspection
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="Close Sandbox (Esc)"
                aria-label="Close Sandbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center px-4 pt-2.5 border-b border-white/10 gap-1 bg-slate-900/40 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('code');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl transition-all cursor-pointer font-sans font-semibold border-b-2 ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Typed Pipeline</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('physics');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl transition-all cursor-pointer font-sans font-semibold border-b-2 ${
                  activeTab === 'physics'
                    ? 'border-blue-500 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>3D Mood & Shaders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('telemetry');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl transition-all cursor-pointer font-sans font-semibold border-b-2 ${
                  activeTab === 'telemetry'
                    ? 'border-blue-500 text-white bg-white/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Runtime Ledger</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: CODE */}
              {activeTab === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      pipeline_engine.ts (TypeScript 5.8)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 overflow-x-auto text-[11px] leading-relaxed text-slate-300 font-mono shadow-inner">
                    <pre className="text-blue-300">{SAMPLE_ARCHITECTURE_CODE}</pre>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400">V8 Compilation</div>
                      <div className="font-bold text-emerald-400 text-xs mt-0.5">1.14ms</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400">Deterministic SLA</div>
                      <div className="font-bold text-blue-400 text-xs mt-0.5">99.98%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400">Zero-Loss Queue</div>
                      <div className="font-bold text-purple-400 text-xs mt-0.5">Enforced</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHYSICS & 3D MOOD */}
              {activeTab === 'physics' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                      Select 3D Canvas Physics Mood:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'mesh', label: 'Neural Mesh', desc: 'Connected Nodes' },
                        { id: 'vortex', label: '3D Vortex', desc: 'Tunnel Warp' },
                        { id: 'matrix', label: 'Cyber Rain', desc: 'Matrix Glyph Stream' },
                        { id: 'nebula', label: 'Cosmic 3D', desc: 'Aurora Plasma' },
                        { id: 'particles', label: 'Quantum Swarm', desc: 'High Velocity Dust' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playTap();
                            onSelectCanvasMode(m.id as CanvasMode);
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                            activeCanvasMode === m.id
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 font-bold ring-1 ring-blue-400/40'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold font-sans">{m.label}</div>
                          <div className={`text-[9px] font-mono mt-0.5 ${activeCanvasMode === m.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {m.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Synthesizer Controls */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Web Audio Pitch Preset
                      </span>
                      <span className="text-[9px] text-blue-400 font-bold uppercase">Synthesizer Active</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'ethereal', label: 'Ethereal' },
                        { id: 'deep_tech', label: 'Deep Tech' },
                        { id: 'cyber', label: 'Cyber' },
                      ].map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => handleToneChange(tone.id as any)}
                          className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer font-sans text-xs font-semibold ${
                            tonePreset === tone.id
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300'
                          }`}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sonar Ping Action */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        // Trigger custom sonar event
                        window.dispatchEvent(new CustomEvent('hero-sonar-ping'));
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans text-xs font-bold transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Emit High-Energy Sonar Ping</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: RUNTIME LEDGER */}
              {activeTab === 'telemetry' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Audit Status: Operational (SOC2 Sealed)</span>
                    <span className="text-emerald-400 font-bold">P99 &lt; 0.4ms</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-1.5 font-mono text-[10px] leading-relaxed max-h-56 overflow-y-auto">
                    <div className="text-slate-500">[00:00.01] KERNEL_INIT: Bootstrapping v8 memory slab 64MB</div>
                    <div className="text-blue-400">[00:00.04] ROUTE_ESTABLISHED: TLS 1.3 0-RTT session resumed</div>
                    <div className="text-emerald-400">[00:00.09] QUEUE_READY: Zero-loss event queue bound to cluster</div>
                    <div className="text-purple-400">[00:00.12] CRYPTO_SEAL: Integrity root hash confirmed: 0x9f8c...</div>
                    <div className="text-slate-400">[00:00.15] WORKER_THREADS: 8 worker threads active on edge nodes</div>
                    <div className="text-cyan-400">[00:00.22] DB_REPLICA: Synchronous commit latency 0.38ms</div>
                    <div className="text-amber-400">[00:00.30] TELEMETRY_STREAM: 4,820 events/sec active</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Memory Pressure: <strong className="text-slate-200">12%</strong></span>
                    <span>Zero Packet Drop: <strong className="text-emerald-400">100%</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-900/60 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>DevCenterPoint Sandbox Environment</span>
              </span>
              <span className="text-slate-500 font-mono">Press ESC to exit</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
