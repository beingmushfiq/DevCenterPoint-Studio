import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, Zap, X, Sliders, Layers, Eye, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';

export type CanvasMode = 'mesh' | 'particles' | 'vortex' | 'matrix' | 'nebula';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  glow: number;
  angle?: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  char?: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  width: number;
}

const MATRIX_GLYPHS = ['0', '1', 'λ', '⚡', '<', '>', '/', '#', '◈', '0x', 'π', '§'];

export const HeroInteractiveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; radius: number }>({
    x: -1000,
    y: -1000,
    active: false,
    radius: 190
  });
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const [mode, setMode] = useState<CanvasMode>('mesh');
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.isSoundMuted());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [particleSpeed, setParticleSpeed] = useState<number>(1);
  const [tonePreset, setTonePreset] = useState<'ethereal' | 'deep_tech' | 'cyber'>(soundEngine.getTonePreset());
  const [volumeLevel, setVolumeLevel] = useState<number>(soundEngine.getVolume());

  // Toggle Sound FX
  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundEngine.playPresetChord(tonePreset);
    }
  };

  const handleToneChange = (preset: 'ethereal' | 'deep_tech' | 'cyber') => {
    setTonePreset(preset);
    soundEngine.setTonePreset(preset);
  };

  const handleVolumeChange = (vol: number) => {
    setVolumeLevel(vol);
    soundEngine.setVolume(vol);
    soundEngine.playTap();
  };

  // Switch Canvas Mode
  const handleModeChange = (newMode: CanvasMode) => {
    soundEngine.playTap();
    setMode(newMode);
    initParticles(newMode);
  };

  // Trigger Sonar Pulse Burst
  const triggerSonarPulse = useCallback((x?: number, y?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const posX = x !== undefined ? x : canvas.width / 2;
    const posY = y !== undefined ? y : canvas.height / 2;

    soundEngine.playTap();

    ripplesRef.current.push({
      x: posX,
      y: posY,
      radius: 4,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.42,
      alpha: 0.85,
      color: mode === 'matrix' ? '#10B981' : mode === 'nebula' ? '#A855F7' : '#3B82F6',
      width: 2.5
    });

    ripplesRef.current.push({
      x: posX,
      y: posY,
      radius: 2,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.28,
      alpha: 0.65,
      color: mode === 'matrix' ? '#065F46' : mode === 'nebula' ? '#EC4899' : '#8B5CF6',
      width: 1.5
    });

    // Particle impulse reaction
    particlesRef.current.forEach((p) => {
      const dx = p.x - posX;
      const dy = p.y - posY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 320) {
        const force = ((320 - dist) / 320) * 8;
        p.vx += (dx / (dist || 1)) * force;
        p.vy += (dy / (dist || 1)) * force;
        p.glow = 18;
      }
    });
  }, [mode]);

  const initParticles = useCallback((currentMode: CanvasMode = mode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const particles: Particle[] = [];

    const defaultColors = ['#3B82F6', '#60A5FA', '#8B5CF6', '#06B6D4', '#10B981', '#F43F5E'];
    const matrixColors = ['#10B981', '#34D399', '#059669', '#6EE7B7', '#A7F3D0'];
    const nebulaColors = ['#8B5CF6', '#C084FC', '#EC4899', '#F472B6', '#38BDF8', '#6366F1'];
    const vortexColors = ['#3B82F6', '#60A5FA', '#06B6D4', '#818CF8', '#E0E7FF'];

    if (currentMode === 'matrix') {
      // 3D Matrix Stream Columns
      const columns = Math.floor(width / 24);
      for (let i = 0; i < columns; i++) {
        const z = Math.random() * 600 - 200;
        const countPerCol = Math.floor(Math.random() * 4) + 3;
        for (let k = 0; k < countPerCol; k++) {
          particles.push({
            x: i * 24 + (Math.random() - 0.5) * 6,
            y: Math.random() * height,
            z,
            vx: 0,
            vy: (Math.random() * 2.5 + 1.5) * particleSpeed,
            vz: 0,
            radius: Math.random() * 2 + 1.2,
            baseRadius: 1.5,
            color: matrixColors[Math.floor(Math.random() * matrixColors.length)],
            alpha: Math.random() * 0.6 + 0.3,
            glow: Math.random() * 10 + 4,
            char: MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)]
          });
        }
      }
    } else if (currentMode === 'vortex') {
      // 3D Warp Tunnel Vortex
      const count = 120;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const orbitRadius = Math.random() * Math.min(width, height) * 0.45 + 30;
        const z = Math.random() * 800 - 200;
        particles.push({
          x: width / 2 + Math.cos(angle) * orbitRadius,
          y: height / 2 + Math.sin(angle) * orbitRadius,
          z,
          vx: 0,
          vy: 0,
          vz: -(Math.random() * 3 + 2) * particleSpeed,
          radius: Math.random() * 2.8 + 1.2,
          baseRadius: 2,
          color: vortexColors[Math.floor(Math.random() * vortexColors.length)],
          alpha: Math.random() * 0.65 + 0.35,
          glow: Math.random() * 12 + 6,
          angle,
          orbitRadius,
          orbitSpeed: (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1)
        });
      }
    } else if (currentMode === 'nebula') {
      // 3D Cosmic Aurora Plasma
      const count = 90;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const orbitRadius = Math.random() * Math.min(width, height) * 0.4 + 20;
        particles.push({
          x: width / 2 + Math.cos(angle) * orbitRadius,
          y: height / 2 + Math.sin(angle) * (orbitRadius * 0.6),
          z: Math.random() * 400 - 150,
          vx: (Math.random() - 0.5) * 0.5 * particleSpeed,
          vy: (Math.random() - 0.5) * 0.5 * particleSpeed,
          vz: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 4.5 + 2.0,
          baseRadius: 3,
          color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
          alpha: Math.random() * 0.5 + 0.25,
          glow: Math.random() * 16 + 8,
          angle,
          orbitRadius,
          orbitSpeed: (Math.random() * 0.008 + 0.004)
        });
      }
    } else {
      // Mesh & Swarm
      const count = currentMode === 'particles' ? 95 : 68;
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2.5 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0,
          vx: (Math.random() - 0.5) * 0.8 * particleSpeed,
          vy: (Math.random() - 0.5) * 0.8 * particleSpeed,
          vz: 0,
          radius,
          baseRadius: radius,
          color: defaultColors[Math.floor(Math.random() * defaultColors.length)],
          alpha: Math.random() * 0.45 + 0.35,
          glow: Math.random() * 8 + 4
        });
      }
    }

    particlesRef.current = particles;
  }, [mode, particleSpeed]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const focalLength = 360;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const centerX = width / 2;
      const centerY = height / 2;
      time += 0.02;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Draw subtle ambient mouse glow aura
      if (mouse.active) {
        const auraGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          160
        );
        if (mode === 'matrix') {
          auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
          auraGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.05)');
        } else if (mode === 'nebula') {
          auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
          auraGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.06)');
        } else {
          auraGrad.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
          auraGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
        }
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5.2;
        r.alpha *= 0.955;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = Math.max(0, r.alpha);
        ctx.lineWidth = r.width;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.stroke();
        ctx.restore();

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update & Draw Particles depending on Mode
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mode === 'matrix') {
          // 3D Matrix Cyber Rain
          p.y += p.vy;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
            p.char = MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
          }

          // Depth perspective
          const scale = focalLength / (focalLength + (p.z || 0));
          const fontSize = Math.max(10, Math.round(13 * scale));

          ctx.font = `${fontSize}px monospace`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * Math.min(1, scale);
          ctx.shadowBlur = p.glow * scale;
          ctx.shadowColor = p.color;
          ctx.fillText(p.char || '1', p.x, p.y);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          continue;
        }

        if (mode === 'vortex') {
          // 3D Tunnel Warp Vortex
          p.angle = (p.angle || 0) + (p.orbitSpeed || 0.01);
          p.z += p.vz;
          if (p.z < -180) {
            p.z = 700;
            p.orbitRadius = Math.random() * Math.min(width, height) * 0.45 + 30;
          }

          const scale = focalLength / (focalLength + p.z);
          const rad = (p.orbitRadius || 100) * scale;
          const px = centerX + Math.cos(p.angle) * rad;
          const py = centerY + Math.sin(p.angle) * rad;

          const renderRadius = Math.max(0.8, p.radius * scale);

          ctx.beginPath();
          ctx.arc(px, py, renderRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.1, p.alpha * scale);
          ctx.shadowBlur = p.glow * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          continue;
        }

        if (mode === 'nebula') {
          // 3D Cosmic Aurora Plasma
          p.angle = (p.angle || 0) + (p.orbitSpeed || 0.005);
          const radX = (p.orbitRadius || 120);
          const radY = (p.orbitRadius || 120) * 0.55;
          const px = centerX + Math.cos(p.angle) * radX + p.vx * 15;
          const py = centerY + Math.sin(p.angle) * radY + p.vy * 15;

          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = p.glow;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          continue;
        }

        // Standard Mesh & Swarm
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.985;
        p.vy *= 0.985;

        if (Math.abs(p.vx) < 0.25) p.vx += (Math.random() - 0.5) * 0.08 * particleSpeed;
        if (Math.abs(p.vy) < 0.25) p.vy += (Math.random() - 0.5) * 0.08 * particleSpeed;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        if (p.glow > 8) p.glow *= 0.95;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = mouse.radius;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            if (mode === 'mesh') {
              p.vx += (dx / dist) * force * 0.45;
              p.vy += (dy / dist) * force * 0.45;
              p.radius = p.baseRadius * (1 + force * 0.9);
            } else {
              p.vx -= (dx / dist) * force * 0.7;
              p.vy -= (dy / dist) * force * 0.7;
              p.radius = p.baseRadius * (1 + force * 1.2);
            }
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }

        // Render point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Vector mesh lines
        if (mode === 'mesh') {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const connectionDistance = 140;

            if (dist < connectionDistance) {
              const lineAlpha = (1 - dist / connectionDistance) * 0.28;
              const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
              grad.addColorStop(0, p.color);
              grad.addColorStop(1, p2.color);

              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = grad;
              ctx.globalAlpha = lineAlpha;
              ctx.lineWidth = 0.9;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }

          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              const mouseAlpha = (1 - dist / 160) * 0.45;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = mouseAlpha;
              ctx.lineWidth = 1.2;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mode, particleSpeed]);

  // Mouse & Touch Gestures
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
      radius: 190
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerSonarPulse(x, y);
  };

  // Mobile Touch Gestures (never block vertical page scroll; pulse only on tap via onClick)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
        radius: 200
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
        radius: 200
      };
    }
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  return (
    <>
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 z-0 pointer-events-auto overflow-hidden select-none cursor-crosshair touch-pan-y"
      title="Tap, click, or swipe across the canvas to interact with 3D particles & audio"
    >
      {/* 2D / 3D Neural Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 dark:opacity-90 pointer-events-none"
      />
    </div>

      {/* Studio FX control: anchored inside the Hero so it scrolls naturally with the canvas and NEVER distracts the rest of the site */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-20 right-3 sm:top-24 sm:right-8 z-30 pointer-events-auto"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Creative Interactive Canvas Physics Capsule */
            <motion.div
              key="collapsed-pill"
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center p-1 rounded-full bg-white/80 dark:bg-[#141414]/80 backdrop-blur-md border border-slate-200/80 dark:border-[#2a2a2a] shadow-lg hover:shadow-xl hover:border-blue-500/40 transition-all duration-200"
            >
              {/* Quick Cycle Mode Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const modes: CanvasMode[] = ['mesh', 'particles', 'vortex', 'matrix', 'nebula'];
                  const nextIdx = (modes.indexOf(mode) + 1) % modes.length;
                  handleModeChange(modes[nextIdx]);
                }}
                className="group/cycle inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] text-xs font-mono font-bold text-slate-800 dark:text-neutral-200 transition-colors cursor-pointer"
                title="Click to cycle next 3D canvas mood"
              >
                <div className="flex items-center gap-0.5">
                  <span className={`w-1 h-3 rounded-full bg-blue-500 transition-all ${!isMuted ? 'animate-pulse' : 'opacity-40'}`} />
                  <span className={`w-1 h-2 rounded-full bg-indigo-500 transition-all ${!isMuted ? 'animate-pulse' : 'opacity-40'}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">3D Mood:</span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover/cycle:underline capitalize">
                  {mode === 'particles' ? 'Swarm' : mode}
                </span>
                <span className="text-[10px] text-slate-400 group-hover/cycle:text-blue-500 transition-transform group-hover/cycle:rotate-45">✦</span>
              </button>

              <div className="w-px h-4 bg-slate-200 dark:bg-[#282828] mx-0.5" />

              {/* Sliders Drawer Opener */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setIsExpanded(true);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] text-slate-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                title="Tune Canvas Physics & Audio"
                aria-label="Open Studio FX Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            /* Expanded Glassmorphic Studio Control Drawer: Responsive Bottom Sheet on Mobile, Floating Card on Desktop */
            <>
              {/* Mobile Backdrop Overlay */}
              <div
                onClick={() => setIsExpanded(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
              />

              <motion.div
                key="expanded-drawer"
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-3 bottom-20 z-50 sm:relative sm:inset-auto sm:z-auto sm:w-80 p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#141414]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#2c2c2c] shadow-2xl space-y-4 text-slate-900 dark:text-white max-h-[82vh] overflow-y-auto"
              >
                {/* Mobile Drag Pill */}
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto -mt-1 mb-2 sm:hidden" />

                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#242424]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Studio FX & 3D Presets
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">Neural Canvas & Web Audio</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setIsExpanded(false);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252525] text-slate-400 hover:text-slate-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    title="Close Controls"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Visual 3D Themes & Background Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                      3D Particle Physics Themes:
                    </span>
                    <span className="text-[9px] font-mono text-blue-500 font-bold">5 Presets</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {[
                      { id: 'mesh', label: 'Mesh', desc: 'Neural Network' },
                      { id: 'particles', label: 'Swarm', desc: 'Quantum Dust' },
                      { id: 'vortex', label: '3D Vortex', desc: 'Warp Tunnel' },
                      { id: 'matrix', label: 'Cyber Rain', desc: 'Code Stream' },
                      { id: 'nebula', label: 'Cosmic 3D', desc: 'Aurora Plasma' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleModeChange(m.id as CanvasMode)}
                        className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                          mode === m.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold ring-1 ring-blue-400/30'
                            : 'bg-slate-50 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#282828] text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-[#383838]'
                        }`}
                      >
                        <div className="text-xs font-black">{m.label}</div>
                        <div className={`text-[9px] font-mono ${mode === m.id ? 'text-blue-100' : 'text-slate-400'}`}>
                          {m.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound Synthesizer Controller with Volume & Tone Presets */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200/80 dark:border-[#282828] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Web Audio Synthesizer
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                        {!isMuted ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Tactile FX Active</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Muted</span>
                          </>
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleSound}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                        !isMuted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-[#282828] text-slate-600 dark:text-gray-400'
                      }`}
                    >
                      {!isMuted ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Sound ON</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Muted</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tone Pitch Presets & Volume */}
                  {!isMuted && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#262626] space-y-2 text-[10px] font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold uppercase">Pitch Tone:</span>
                        <div className="flex items-center gap-1">
                          {[
                            { id: 'ethereal', label: 'Ethereal' },
                            { id: 'deep_tech', label: 'Deep Tech' },
                            { id: 'cyber', label: 'Cyber' }
                          ].map((tone) => (
                            <button
                              key={tone.id}
                              type="button"
                              onClick={() => handleToneChange(tone.id as any)}
                              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                tonePreset === tone.id
                                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-200 dark:bg-[#242424] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {tone.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold uppercase">Volume:</span>
                        <div className="flex items-center gap-1">
                          {[
                            { val: 0.3, label: '30%' },
                            { val: 0.65, label: '65%' },
                            { val: 1.0, label: '100%' }
                          ].map((v) => (
                            <button
                              key={v.label}
                              type="button"
                              onClick={() => handleVolumeChange(v.val)}
                              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                Math.abs(volumeLevel - v.val) < 0.1
                                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'bg-slate-200 dark:bg-[#242424] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Trigger Buttons */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => triggerSonarPulse()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Emit Sonar Ping</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setParticleSpeed((prev) => (prev >= 2 ? 0.7 : prev + 0.65));
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#202020] hover:bg-slate-200 dark:hover:bg-[#282828] text-slate-700 dark:text-gray-300 font-mono text-[11px] font-bold border border-slate-200 dark:border-[#2e2e2e] transition-colors cursor-pointer"
                    title="Toggle Particle Velocity"
                  >
                    {particleSpeed > 1.2 ? 'Fast 2x' : 'Normal 1x'}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
