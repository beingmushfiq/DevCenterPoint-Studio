import React, { useRef, useState, useEffect } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Cpu, 
  Play, 
  Pause,
  Calendar,
  ChevronDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HeroInteractiveCanvas, CanvasMode } from './HeroInteractiveCanvas';
import { HeroTelemetryStream } from './HeroTelemetryStream';
import { HeroCodeDrawer } from './HeroCodeDrawer';
import { soundEngine } from '../lib/soundEngine';
import { useCms } from '../Context/CmsContext';
import { scrollToTarget } from '../lib/lenis';

export const Hero: React.FC = () => {
  const cms = useCms();
  const heroRef = useRef<HTMLElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [isCinemaActive, setIsCinemaActive] = useState<boolean>(false);
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('mesh');
  const [ctaCoords, setCtaCoords] = useState<{ x: number; y: number; active: boolean } | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const blueprintOpacity = useTransform(scrollYProgress, [0.25, 0.95], [0, 0.75]);

  const badgeText = cms.getSetting('hero_badge_text', 'TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI');
  const headlineLine1 = cms.getSetting('hero_headline_line1', 'We turn inefficient');
  const headlineLine2 = cms.getSetting('hero_headline_line2_gradient', 'business processes into software.');
  const thesis = cms.getSetting(
    'hero_thesis_statement',
    'DevCenterPoint builds custom software, business automation systems, SaaS products, and intelligent digital solutions for businesses and organizations.'
  );
  const ctaPrimary = cms.getSetting('hero_cta_primary_text', 'Start a Project');
  const ctaSecondary = cms.getSetting('hero_cta_secondary_text', 'Explore Selected Work');
  const heroVideoUrl = cms.getSetting('hero_video_url', '/launch_video.mp4');
  const heroVideoMobileUrl = cms.getSetting('hero_video_mobile_url', '/launch_video_mobile.mp4');
  const heroVideoEnabled = cms.getSetting('hero_video_enabled', 'true') === 'true';

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeVideoSrc = isMobile ? heroVideoMobileUrl : heroVideoUrl;

  const tel1Label = cms.getSetting('hero_telemetry_badge1_label', 'Status');
  const tel1Val = cms.getSetting('hero_telemetry_badge1_val', 'Operational');
  const tel2Label = cms.getSetting('hero_telemetry_badge2_label', 'Reliability');
  const tel2Val = cms.getSetting('hero_telemetry_badge2_val', '99.9%');
  const tel3Label = cms.getSetting('hero_telemetry_badge3_label', 'Speed');
  const tel3Val = cms.getSetting('hero_telemetry_badge3_val', 'Ultra-Fast');
  const whatsappNumber = cms.getSetting('whatsapp_number', '8801988383323').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    cms.getSetting('whatsapp_prefill_message', "Hi DevCenterPoint, I'd like to discuss an engineering project.")
  );
  const bookingUrl = cms.getSetting('booking_url', 'https://cal.com/devcenterpoint');
  const bookingLabel = cms.getSetting('booking_cta_label', 'Book a Consultation');

  useEffect(() => {
    if (videoRef.current && heroVideoEnabled) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy without user gesture
        setIsPlaying(false);
      });
    }
  }, [activeVideoSrc, heroVideoEnabled]);

  const toggleVideoPlayback = () => {
    soundEngine.playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVideoAudio = () => {
    soundEngine.playClick();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCtaMouseMove = () => {
    if (!primaryCtaRef.current) return;
    const rect = primaryCtaRef.current.getBoundingClientRect();
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      const heroRect = heroEl.getBoundingClientRect();
      setCtaCoords({
        x: rect.left + rect.width / 2 - heroRect.left,
        y: rect.top + rect.height / 2 - heroRect.top,
        active: true,
      });
    }
  };

  const handleCtaMouseLeave = () => {
    setCtaCoords((prev) => (prev ? { ...prev, active: false } : null));
  };

  const handleNavClick = (target: string) => {
    soundEngine.playClick();
    scrollToTarget(target, { offset: -70, duration: 1.2 });
  };

  const proofPillars = [
    {
      icon: Cpu,
      title: 'Map the Process',
      detail: 'Identify operational friction, bottleneck workflows & manual waste',
      badge: 'Pillar 01'
    },
    {
      icon: Sparkles,
      title: 'Engineer the Fix',
      detail: 'Bespoke web applications, client portals & high-velocity typed backends',
      badge: 'Pillar 02'
    },
    {
      icon: Activity,
      title: 'Automate the Repetition',
      detail: 'Zero-loss event queues, third-party ERP integrations & predictive AI',
      badge: 'Pillar 03'
    },
    {
      icon: ShieldCheck,
      title: 'Scale Without Headcount',
      detail: 'Deterministic CI/CD, SOC2 audit logging & 99.98% production SLAs',
      badge: 'Pillar 04'
    }
  ];

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 sm:pt-36 pb-8 sm:pb-12 overflow-hidden bg-[#000814] text-white selection:bg-blue-600 selection:text-white"
    >
      {/* =========================================================================
          1. CINEMATIC VIDEO BACKGROUND LAYER (Live Interactive Sandbox Viewport)
          ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none transition-transform duration-700 ease-out"
        style={{
          transform: isCinemaActive ? 'perspective(1200px) rotateX(1.8deg) scale(1.02)' : 'none',
        }}
      >
        {heroVideoEnabled && (
          <video
            key={activeVideoSrc}
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-85' : 'opacity-0'
            }`}
          >
            <source src={heroVideoMobileUrl} type="video/mp4" media="(max-width: 768px)" />
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        )}

        {/* Multi-layered cinematic glass scrim and vignette */}
        {/* Layer A: High-density dark tint for pristine text contrast */}
        <div className="absolute inset-0 bg-[#000814]/70 dark:bg-[#00050d]/80 backdrop-blur-[1.5px]" />

        {/* Layer B: Center-weighted radial vignette */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(0, 15, 38, 0.35) 0%, rgba(0, 8, 20, 0.88) 85%, rgba(0, 8, 20, 0.98) 100%)'
          }}
        />

        {/* Layer C: Multi-stop bottom gradient seamlessly blending into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-b from-transparent via-[#000814]/70 via-65% to-slate-50 dark:to-[#0a0a0a] pointer-events-none z-2" />

        {/* Layer D: Translucent interactive neural canvas web with Gravitational Well */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-auto">
          <HeroInteractiveCanvas
            externalMode={canvasMode}
            onModeChange={(m) => setCanvasMode(m)}
            ctaCoordinates={ctaCoords}
            isCinemaActive={isCinemaActive}
          />
        </div>

        {/* Layer E: Scroll-triggered technical blueprint millimeter grid */}
        <motion.div
          style={{ opacity: blueprintOpacity }}
          className="absolute inset-0 pointer-events-none z-1 mix-blend-screen bg-[linear-gradient(to_right,rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.12)_1px,transparent_1px)] bg-[size:32px_32px]"
        />
      </div>

      {/* =========================================================================
          2. FLOATING VIDEO CONTROL CHIP (Discrete Cinema & Sandbox Pill)
          ========================================================================= */}
      {heroVideoEnabled && (
        <div className="absolute top-24 right-4 sm:right-8 z-30 flex items-center gap-2">
          {/* Cinema Sandbox Toggle Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playTap();
              setIsCinemaActive(!isCinemaActive);
            }}
            aria-label={isCinemaActive ? 'Exit Cinema Sandbox' : 'Enter Cinema Interactive Sandbox'}
            title={isCinemaActive ? 'Exit Cinema Sandbox' : 'Enter Cinema Interactive Sandbox'}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-mono flex items-center gap-2 transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-lg ${
              isCinemaActive
                ? 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-blue-500/50 ring-2 ring-blue-400/40'
                : 'bg-slate-950/85 hover:bg-slate-900 border-white/20 text-white hover:text-blue-300 shadow-black/50'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isCinemaActive ? 'bg-amber-400' : 'bg-blue-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCinemaActive ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'}`} />
            </span>
            <span className="font-semibold">{isCinemaActive ? 'Sandbox Active' : isPlaying ? 'Cinema Active' : 'Cinema Paused'}</span>
            <span className="text-[10px] text-blue-300/80">✦</span>
          </button>

          {/* Video Play / Pause Toggle */}
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-label={isPlaying ? 'Pause background cinema video' : 'Play background cinema video'}
            title={isPlaying ? 'Pause background cinema video' : 'Play background cinema video'}
            className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white hover:text-blue-300 text-[11px] transition-all duration-200 cursor-pointer backdrop-blur-xl shadow-lg shadow-black/40"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-blue-400" /> : <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />}
          </button>

          {/* Audio Mute Toggle */}
          <button
            type="button"
            onClick={toggleVideoAudio}
            aria-label={isMuted ? 'Unmute video ambient audio' : 'Mute video audio'}
            title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white hover:text-emerald-400 text-[11px] transition-all duration-200 cursor-pointer backdrop-blur-xl shadow-lg shadow-black/40"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      )}

      {/* =========================================================================
          3. MAIN HERO COCKPIT & MESSAGING (Centered for Maximum Authority)
          ========================================================================= */}
      <motion.div
        animate={{
          opacity: isCinemaActive ? 0.22 : 1,
          scale: isCinemaActive ? 0.97 : 1,
          y: isCinemaActive ? -8 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto text-center transition-all ${
          isCinemaActive ? 'pointer-events-none' : ''
        }`}
      >
        
        {/* Luminous Frosted Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/85 text-slate-900 dark:text-slate-100 text-xs font-semibold mb-6 shadow-md shadow-black/10 dark:shadow-blue-900/20 hover:scale-[1.02] transition-transform duration-300 max-w-full justify-center border border-slate-300/80 dark:border-white/20 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 shadow-[0_0_8px_#2563eb]"></span>
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase font-bold text-slate-900 dark:text-blue-300 truncate">
            {badgeText}
          </span>
        </motion.div>

        {/* Main Hero Headline (Rendered immediately for fast LCP & painted with Space Grotesk) */}
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6 text-white drop-shadow-md wrap-break-word"
        >
          {headlineLine1} <br className="hidden sm:inline" />
          <span className="text-gradient-signature drop-shadow-[0_0_35px_rgba(46,74,249,0.45)]">
            {headlineLine2}
          </span>
        </h1>

        {/* Supporting Statement / Thesis */}
        <p
          className="text-base sm:text-xl text-slate-200/90 max-w-3xl mx-auto leading-relaxed font-normal mb-10 drop-shadow"
        >
          {thesis}
        </p>

        {/* =====================================================================
            4. ACTION GROUP (All 4 CTAs with Disciplined Visual Hierarchy)
            ===================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {/* Primary Action Row: Start a Project + Book a Consultation + Explore Work */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {/* CTA 1: Primary Action Button (Luminous Signature Gradient + Gravity Well) */}
            <button
              ref={primaryCtaRef}
              type="button"
              onClick={() => handleNavClick('contact')}
              onMouseEnter={handleCtaMouseMove}
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-sm sm:text-base font-bold tracking-tight transition-all duration-300 shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer ring-1 ring-white/30"
            >
              <span>{ctaPrimary}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* CTA 2: Secondary Action (Cal.com Consultation Booking) */}
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playClick()}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-lg shadow-amber-950/20 hover:border-amber-400"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{bookingLabel}</span>
              </a>
            )}

            {/* CTA 3: Tertiary Action (Inspect Production Work) */}
            <button
              type="button"
              onClick={() => handleNavClick('work')}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-950/75 hover:bg-slate-900/90 text-white hover:text-blue-300 border border-white/25 hover:border-blue-400/60 shadow-xl shadow-black/40 backdrop-blur-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
              <span>{ctaSecondary}</span>
              <ArrowDownRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* CTA 4: Quick Contact Channel (WhatsApp Direct) */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>Direct WhatsApp Dispatch</span>
          </a>
        </motion.div>

        {/* Operational Telemetry Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/80 border border-slate-300/80 dark:border-white/10 shadow-sm backdrop-blur-md text-slate-800 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{tel1Label}: <strong className="text-slate-900 dark:text-white font-bold">{tel1Val}</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/80 border border-slate-300/80 dark:border-white/10 shadow-sm backdrop-blur-md text-slate-800 dark:text-slate-200">
            <span className="text-blue-600 dark:text-blue-400 font-bold">{tel2Val}</span>
            <span>{tel2Label}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/80 border border-slate-300/80 dark:border-white/10 shadow-sm backdrop-blur-md text-slate-800 dark:text-slate-200">
            <span className="text-purple-600 dark:text-purple-400 font-bold">{tel3Val}</span>
            <span>{tel3Label}</span>
          </div>
        </motion.div>

        {/* Real-time Command Center Telemetry Stream HUD */}
        <div className="mt-7 flex justify-center pointer-events-auto">
          <HeroTelemetryStream
            onOpenSandbox={() => setIsCinemaActive(true)}
            isCinemaActive={isCinemaActive}
          />
        </div>

      </motion.div>

      {/* =========================================================================
          5. OVERLAPPING PROOF PILLARS & SCROLL EXPEDITION (Bottom Edge)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {proofPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + idx * 0.08 }}
                className="p-4 rounded-2xl bg-[#000d20]/85 hover:bg-[#001433]/95 border border-white/20 hover:border-blue-400/60 transition-all duration-300 group shadow-2xl shadow-black/70 backdrop-blur-2xl text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <span className="text-[10px] font-mono text-blue-300/90 uppercase tracking-widest font-semibold">
                    {p.badge}
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {p.title}
                </h2>
                <p className="text-[11px] text-slate-300/90 leading-snug">
                  {p.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle Scroll Cue */}
        <div className="pt-6 flex justify-center">
          <button
            type="button"
            onClick={() => handleNavClick('positioning')}
            className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Explore Engineering Philosophy</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-blue-400" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          6. FLOATING INTERACTIVE ARCHITECTURE & CODE DRAWER
          ========================================================================= */}
      <HeroCodeDrawer
        isOpen={isCinemaActive}
        onClose={() => setIsCinemaActive(false)}
        activeCanvasMode={canvasMode}
        onSelectCanvasMode={(newMode) => setCanvasMode(newMode)}
      />
    </section>
  );
};
