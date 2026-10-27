import React, { useState, useEffect, useRef } from 'react';
import { Activity, Terminal, ChevronUp, ChevronDown, Play, Pause, Cpu, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';

interface LogEntry {
  id: string;
  timestamp: string;
  tag: 'SYS' | 'V8' | 'SOC2' | 'DB' | 'EDGE' | 'AI';
  color: string;
  message: string;
}

const SAMPLE_LOG_PATTERNS: Array<{ tag: LogEntry['tag']; color: string; template: () => string }> = [
  {
    tag: 'SYS',
    color: 'text-emerald-400',
    template: () => `EventQueue drained: ${(4200 + Math.floor(Math.random() * 900)).toLocaleString()} msgs/s • 0 dropped`,
  },
  {
    tag: 'V8',
    color: 'text-blue-400',
    template: () => `JIT compiled /api/v2/stream/pipeline in ${(0.8 + Math.random() * 0.7).toFixed(2)}ms`,
  },
  {
    tag: 'SOC2',
    color: 'text-purple-400',
    template: () => `Deterministic ledger audit sealed: 0x${Math.random().toString(16).substring(2, 10)}...`,
  },
  {
    tag: 'DB',
    color: 'text-cyan-400',
    template: () => `PostgreSQL read replica synced in ${(0.28 + Math.random() * 0.3).toFixed(2)}ms (P99)`,
  },
  {
    tag: 'EDGE',
    color: 'text-amber-400',
    template: () => `Global edge cluster roundtrip: ${Math.floor(11 + Math.random() * 6)}ms (Frankfurt • SGP • IAD)`,
  },
  {
    tag: 'AI',
    color: 'text-rose-400',
    template: () => `Tensor kernel latency: ${(3.2 + Math.random() * 1.4).toFixed(2)}ms (99.8% cache hit rate)`,
  },
];

export interface HeroTelemetryStreamProps {
  onOpenSandbox?: () => void;
  isCinemaActive?: boolean;
  className?: string;
}

export const HeroTelemetryStream: React.FC<HeroTelemetryStreamProps> = ({
  onOpenSandbox,
  isCinemaActive = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [fps, setFps] = useState<number>(60);
  const [filter, setFilter] = useState<string>('ALL');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fpsFrameRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: performance.now() });

  // Initialize with initial boot sequence logs
  useEffect(() => {
    const now = new Date();
    const initial: LogEntry[] = [
      {
        id: 'init-1',
        timestamp: now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2),
        tag: 'SYS',
        color: 'text-emerald-400',
        message: 'DevCenterPoint Studio Telemetry Subsystem initialized',
      },
      {
        id: 'init-2',
        timestamp: now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2),
        tag: 'V8',
        color: 'text-blue-400',
        message: 'TypeScript runtime compiled in 1.14ms with zero type warnings',
      },
      {
        id: 'init-3',
        timestamp: now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2),
        tag: 'SOC2',
        color: 'text-purple-400',
        message: 'Runtime integrity cryptographic hash verified: 0x9f8c2b71',
      },
    ];
    setLogs(initial);
  }, []);

  // Live FPS Counter Loop
  useEffect(() => {
    let animId: number;
    const updateFps = () => {
      const now = performance.now();
      fpsFrameRef.current.count++;
      if (now - fpsFrameRef.current.lastTime >= 1000) {
        setFps(Math.min(60, Math.round((fpsFrameRef.current.count * 1000) / (now - fpsFrameRef.current.lastTime))));
        fpsFrameRef.current.count = 0;
        fpsFrameRef.current.lastTime = now;
      }
      animId = requestAnimationFrame(updateFps);
    };
    animId = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Streaming Log Producer
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const pattern = SAMPLE_LOG_PATTERNS[Math.floor(Math.random() * SAMPLE_LOG_PATTERNS.length)];
      const d = new Date();
      const timeStr = d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0').slice(0, 2);

      const newEntry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        tag: pattern.tag,
        color: pattern.color,
        message: pattern.template(),
      };

      setLogs((prev) => {
        const next = [...prev, newEntry];
        return next.length > 25 ? next.slice(next.length - 25) : next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Auto-scroll when new logs arrive and drawer is expanded
  useEffect(() => {
    if (isExpanded && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter((l) => l.tag === filter);

  return (
    <div className={`relative z-20 ${className}`}>
      {/* =========================================================================
          COMPACT TELEMETRY COMMAND CHIP (Always visible, sleek frosted HUD)
          ========================================================================= */}
      <div className="inline-flex items-center gap-2 p-1 pl-3 pr-2 rounded-full bg-slate-950/85 hover:bg-slate-900/95 border border-white/20 shadow-xl shadow-black/50 backdrop-blur-xl text-xs font-mono transition-all duration-300">
        {/* Pulsing Status Orb */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 hidden sm:inline">
            Telemetry
          </span>
        </div>

        <div className="w-px h-3.5 bg-white/20" />

        {/* Live FPS Gauge */}
        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <Activity className="w-3 h-3 text-blue-400" />
          <span className="font-bold text-blue-300">{fps}</span>
          <span className="text-[9px] text-slate-500">FPS</span>
        </div>

        <div className="w-px h-3.5 bg-white/20 hidden sm:block" />

        {/* Sub-millisecond Latency */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-300">
          <Cpu className="w-3 h-3 text-purple-400" />
          <span className="font-bold text-purple-300">0.38ms</span>
          <span className="text-[9px] text-slate-500">P99</span>
        </div>

        {/* Toggle Expand / Collapse */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            setIsExpanded(!isExpanded);
          }}
          className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse Telemetry Terminal' : 'Expand Live Telemetry Terminal'}
          aria-label={isExpanded ? 'Collapse Telemetry Terminal' : 'Expand Live Telemetry Terminal'}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Shortcut to full sandbox code drawer */}
        {onOpenSandbox && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              onOpenSandbox();
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
              isCinemaActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                : 'bg-white/10 hover:bg-white/20 text-blue-300 hover:text-white'
            }`}
            title="Open Interactive Architecture Sandbox Drawer"
          >
            <span>CODE ✦</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          EXPANDED TELEMETRY STREAM TERMINAL (Glassmorphic HUD Window)
          ========================================================================= */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-3 left-0 sm:left-auto sm:right-0 w-[calc(100vw-2rem)] sm:w-[480px] rounded-2xl bg-slate-950/90 border border-white/20 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden font-mono text-xs"
          >
            {/* Terminal Top Bar */}
            <div className="px-3.5 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold text-[11px] text-white tracking-wide">
                  SYSTEM KERNEL TELEMETRY
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Pause/Resume stream */}
                <button
                  type="button"
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isStreaming ? 'Pause stream' : 'Resume stream'}
                >
                  {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
                </button>

                {/* Filter tags */}
                <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[9px]">
                  {['ALL', 'SYS', 'V8', 'SOC2'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFilter(tag)}
                      className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                        filter === tag ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Terminal Output Area */}
            <div
              ref={scrollContainerRef}
              className="p-3 max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/20 font-mono text-[10px] leading-relaxed"
            >
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 hover:bg-white/5 px-1 py-0.5 rounded transition-colors">
                  <span className="text-slate-500 select-none shrink-0 font-light">
                    {log.timestamp}
                  </span>
                  <span className={`font-bold shrink-0 ${log.color}`}>
                    [{log.tag}]
                  </span>
                  <span className="text-slate-300 break-words flex-1">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal Footer Bar */}
            <div className="px-3 py-1.5 bg-slate-900/50 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>Throughput: <strong className="text-slate-200">4.8k ops/s</strong></span>
                <span>Buffer: <strong className="text-emerald-400">0% Loss</strong></span>
              </div>
              {onOpenSandbox && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    onOpenSandbox();
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 cursor-pointer"
                >
                  Inspect Architecture Sandbox →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
