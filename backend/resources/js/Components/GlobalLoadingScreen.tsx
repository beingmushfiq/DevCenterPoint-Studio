import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../Context/ThemeContext';
import { useCms } from '../Context/CmsContext';

export type LoadingViewMode = 'spinner' | 'skeleton';

interface GlobalLoadingScreenProps {
  /**
   * Forced override for mounting state (optional).
   */
  isMounting?: boolean;
  /**
   * Callback fired when initial mounting animation completes.
   */
  onMountComplete?: () => void;
  /**
   * Minimum display time in ms to ensure smooth visual transition.
   * Default: 500ms.
   */
  minDuration?: number;
  /**
   * Initial visual style: 'spinner' or 'skeleton'
   */
  defaultView?: LoadingViewMode;
  /**
   * Floating preview trigger to replay loading screen.
   * When omitted, falls back to the CMS setting `show_loading_preview_toggle`.
   */
  allowPreviewToggle?: boolean;
}

export const GlobalLoadingScreen: React.FC<GlobalLoadingScreenProps> = ({
  isMounting: externalIsMounting,
  onMountComplete,
  minDuration = 500,
  defaultView = 'spinner',
  allowPreviewToggle,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cms = useCms();

  // Dev-only debug switch: hidden from the public site unless enabled in the CMS.
  const showPreviewToggle =
    allowPreviewToggle ?? cms.getSetting('show_loading_preview_toggle', 'false') === 'true';

  const [internalIsMounting, setInternalIsMounting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<LoadingViewMode>(defaultView);
  const shouldReduceMotion = useReducedMotion();

  const isVisible = externalIsMounting !== undefined ? externalIsMounting : internalIsMounting;

  // Fluid continuous progress update loop
  useEffect(() => {
    let step = 0;
    const intervalDuration = 20; // 50 updates/sec for smooth fluid bar progression
    const totalSteps = Math.max(Math.floor(minDuration / intervalDuration), 1);

    const intervalId = setInterval(() => {
      step++;
      const ratio = Math.min(step / totalSteps, 1);

      // Smooth ease-out progression that begins advancing immediately
      const eased = Math.round((1 - Math.pow(1 - ratio, 2.2)) * 100);
      const bounded = Math.min(Math.max(eased, 0), 100);
      setProgress(bounded);

      if (step >= totalSteps) {
        clearInterval(intervalId);
        setProgress(100);
        const timeout = setTimeout(() => {
          setInternalIsMounting(false);
          onMountComplete?.();
        }, 80);
        return () => clearTimeout(timeout);
      }
    }, intervalDuration);

    return () => {
      clearInterval(intervalId);
    };
  }, [minDuration, onMountComplete]);

  // Handler to manually re-trigger the loading screen for inspection
  const triggerReplay = (mode: LoadingViewMode) => {
    setViewMode(mode);
    setProgress(0);
    setInternalIsMounting(true);

    const replayDuration = 1200;
    const intervalDuration = 20;
    const totalSteps = Math.floor(replayDuration / intervalDuration);
    let step = 0;

    const replayIntervalId = setInterval(() => {
      step++;
      const ratio = Math.min(step / totalSteps, 1);
      const eased = Math.round((1 - Math.pow(1 - ratio, 2.2)) * 100);
      const bounded = Math.min(Math.max(eased, 0), 100);
      setProgress(bounded);

      if (step >= totalSteps) {
        clearInterval(replayIntervalId);
        setProgress(100);
        setTimeout(() => {
          setInternalIsMounting(false);
        }, 200);
      }
    }, intervalDuration);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="global-loader-screen"
            initial={{ opacity: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.99,
                    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                  }
            }
            /* 100% Solid Opaque Background: Completely eliminates any site bleed or watermark */
            className={`fixed inset-0 z-99999 flex flex-col justify-center items-center overflow-hidden transition-colors duration-300 select-none ${
              isDark
                ? 'bg-[#070b14] text-white'
                : 'bg-[#f8fafc] text-slate-900'
            }`}
            role="status"
            aria-live="polite"
            aria-label="Loading DevCenterPoint"
          >
            {/* MAIN CONTENT: SKELETON MODE */}
            {viewMode === 'skeleton' ? (
              <div className="relative z-10 w-full max-w-5xl px-6 py-8">
                <SimpleElegantSkeleton isDark={isDark} />
              </div>
            ) : (
              /* MAIN CONTENT: PROMINENT, HIGH-VISIBILITY ELEGANT LOADER */
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                {/* Minimalist Branded Symbol with Outer Centered Spinner */}
                <div className="relative flex items-center justify-center w-28 h-28 mb-6">
                  {/* Outer subtle spinner ring: Hardware-accelerated centered rotation */}
                  <motion.div
                    className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                    animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{ transformOrigin: 'center center' }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Static Track Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}
                        strokeWidth="2.5"
                      />
                      {/* Active Spinning Head with Rounded Caps */}
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke={isDark ? '#38bdf8' : '#2563eb'}
                        strokeWidth="2.5"
                        strokeDasharray="75 214"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.div>

                  {/* Brand emblem mark container with ambient illumination & theme adaptation */}
                  <motion.div
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative w-20 h-20 rounded-2xl flex items-center justify-center p-3 backdrop-blur-md transition-all duration-300 ${
                      isDark
                        ? 'bg-slate-900/95 border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.35)]'
                        : 'bg-white border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(37,99,235,0.16),0_4px_12px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    {/* Backlight halo glow with organic breathing pulse */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? { opacity: 0.35, scale: 1 }
                          : {
                              opacity: isDark
                                ? [0.3, 0.75, 0.35, 0.65, 0.3, 0.3]
                                : [0.25, 0.6, 0.3, 0.5, 0.25, 0.25],
                              scale: [0.95, 1.12, 0.98, 1.07, 0.95, 0.95],
                            }
                      }
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : {
                              duration: 2.0,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              times: [0, 0.14, 0.28, 0.42, 0.58, 1],
                            }
                      }
                      className={`absolute inset-0 rounded-2xl blur-md pointer-events-none transition-colors ${
                        isDark
                          ? 'bg-linear-to-tr from-blue-600/30 to-sky-400/25'
                          : 'bg-linear-to-tr from-blue-500/15 to-sky-300/20'
                      }`}
                    />

                    {/* Highly visible vector logo emblem with organic heartbeat scaling */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? { scale: 1 }
                          : {
                              scale: [1, 1.08, 0.98, 1.05, 1, 1],
                            }
                      }
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : {
                              duration: 2.0,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              times: [0, 0.14, 0.28, 0.42, 0.58, 1],
                            }
                      }
                      className={`relative z-10 shrink-0 flex items-center justify-center ${
                        isDark
                          ? 'filter drop-shadow-[0_2px_8px_rgba(37,99,235,0.45)]'
                          : 'filter drop-shadow-[0_2px_6px_rgba(37,99,235,0.22)]'
                      }`}
                    >
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 500 500"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                        aria-label="DevCenterPoint Logo Emblem"
                      >
                        <defs>
                          <linearGradient
                            id="loader-p-gradient"
                            x1="240"
                            y1="120"
                            x2="380"
                            y2="340"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#2563EB'} />
                            <stop offset="45%" stopColor={isDark ? '#2563EB' : '#1D4ED8'} />
                            <stop offset="100%" stopColor={isDark ? '#1D4ED8' : '#1E40AF'} />
                          </linearGradient>
                          <radialGradient
                            id="loader-iris-gradient"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(254 240) rotate(45) scale(38)"
                          >
                            <stop offset="0%" stopColor={isDark ? '#93C5FD' : '#60A5FA'} />
                            <stop offset="45%" stopColor="#38BDF8" />
                            <stop offset="80%" stopColor="#2563EB" />
                            <stop offset="100%" stopColor="#1E3A8A" />
                          </radialGradient>
                        </defs>

                        {/* 1. Left 'D' - Theme Adaptive High Visibility */}
                        {/* Light mode: Deep Charcoal #0E131F for bold contrast against white card */}
                        {/* Dark mode: Crisp Pure White #FFFFFF for luminous contrast against dark card */}
                        <path
                          d="M 120 100 
                             L 255 100 
                             C 335 100, 375 160, 375 250 
                             C 375 340, 335 400, 255 400 
                             L 120 400 
                             Z
                             M 175 160 
                             L 175 340 
                             L 245 340 
                             C 285 340, 310 305, 310 250 
                             C 310 195, 285 160, 245 160 
                             Z"
                          fill={isDark ? '#FFFFFF' : '#0E131F'}
                          className="transition-colors duration-300"
                        />

                        {/* 2. Right 'P' Loop with Pointer Tail */}
                        <path
                          d="M 252 118
                             C 315 118, 385 145, 385 228
                             C 385 298, 335 332, 275 332
                             L 256 396
                             L 256 312
                             C 256 312, 252 200, 252 118
                             Z"
                          fill="url(#loader-p-gradient)"
                        />

                        {/* 3. Outer White Target Ring with Precision Border */}
                        <circle
                          cx="260"
                          cy="246"
                          r="58"
                          fill="#FFFFFF"
                          stroke={isDark ? '#070B14' : '#0E131F'}
                          strokeWidth="5"
                        />

                        {/* 4. Inner Center Point Radiant Sphere */}
                        <circle
                          cx="260"
                          cy="246"
                          r="34"
                          fill="url(#loader-iris-gradient)"
                        />

                        {/* 5. Specular Reflection Highlight on Sphere */}
                        <circle
                          cx="249"
                          cy="235"
                          r="8"
                          fill={isDark ? '#FFFFFF' : '#93C5FD'}
                          opacity="0.95"
                        />

                        {/* 6. Angled Code Brackets </> inside the P Loop */}
                        <g
                          transform="translate(328, 172) rotate(38)"
                          stroke="#FFFFFF"
                          strokeWidth="5.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M -12 -9 L -18 0 L -12 9" />
                          <path d="M 4 -12 L -4 12" />
                          <path d="M 12 -9 L 18 0 L 12 9" />
                        </g>
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Brand Name & Tagline */}
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 font-sans flex items-center justify-center gap-2">
                  <span>
                    <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>DevCenter</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>Point</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] inline-block" />
                </h1>
                <p
                  className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                    isDark ? 'text-slate-400 font-medium' : 'text-slate-500'
                  }`}
                >
                  CODE &bull; BUILD &bull; DEPLOY &bull; SCALE
                </p>

                {/* Active Moving Loading Bar (Smooth, continuous progression) */}
                <div
                  className={`w-52 h-1.5 rounded-full mt-6 overflow-hidden shadow-inner border transition-colors ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700/50'
                      : 'bg-slate-200/90 border-slate-300/80'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      isDark
                        ? 'bg-linear-to-r from-blue-500 via-sky-400 to-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                        : 'bg-linear-to-r from-blue-600 via-sky-500 to-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                    }`}
                    style={{
                      width: `${progress}%`,
                      transition: 'width 60ms linear',
                    }}
                  />
                </div>
                <div
                  className={`flex items-center justify-between w-52 mt-2 text-[11px] font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span>Mounting systems</span>
                  <span
                    className={`font-semibold ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    {progress}%
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Preview Switcher (Allows user to inspect either mode easily) */}
      {showPreviewToggle && !isVisible && (
        <div className="fixed bottom-5 left-5 z-40">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md text-xs font-sans transition-colors ${
              isDark
                ? 'bg-slate-900/90 text-slate-400 border-slate-800'
                : 'bg-white/95 text-slate-600 border-slate-200/90 shadow-slate-200/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span
              className={`font-medium mr-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Preview Loader:
            </span>
            <button
              type="button"
              onClick={() => triggerReplay('spinner')}
              className={`px-2 py-0.5 rounded transition-colors ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              Spinner
            </button>
            <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
            <button
              type="button"
              onClick={() => triggerReplay('skeleton')}
              className={`px-2 py-0.5 rounded transition-colors ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              Skeleton
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Simple Yet Elegant Skeleton:
 * Clean, soft-lit placeholder shapes representing standard page layout
 * theme-adaptive to both Light Mode (default) and Dark Mode.
 */
function SimpleElegantSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* 1. Header Bar Placeholder with subtle brand presence */}
      <div
        className={`w-full h-14 rounded-xl px-5 flex items-center justify-between transition-colors ${
          isDark
            ? 'bg-slate-900/80 border border-slate-800/60'
            : 'bg-white/90 border border-slate-200/90 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center p-1.5 shadow-sm transition-colors ${
              isDark
                ? 'bg-slate-900 border border-slate-700/80'
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <img
              src={isDark ? '/logo-mark-white.svg' : '/logo-mark.svg'}
              alt="DevCenterPoint"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>DevCenter</span>
            <span className={isDark ? 'text-slate-300' : 'text-slate-900'}>Point</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className={`w-14 h-2.5 rounded ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/90'}`} />
          <div className={`w-16 h-2.5 rounded ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/90'}`} />
          <div className={`w-14 h-2.5 rounded ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/90'}`} />
          <div className={`w-16 h-2.5 rounded ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/90'}`} />
        </div>
        <div className={`w-24 h-8 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
      </div>

      {/* 2. Hero Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        <div className="lg:col-span-7 space-y-4">
          {/* Tag pill */}
          <div className={`w-32 h-6 rounded-full ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/90'}`} />

          {/* Main title lines */}
          <div className="space-y-2.5 pt-1">
            <div className={`w-4/5 h-10 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`w-3/5 h-10 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Subtitle lines */}
          <div className="space-y-2 pt-2">
            <div className={`w-full h-3 rounded ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/70'}`} />
            <div className={`w-5/6 h-3 rounded ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/70'}`} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4">
            <div className={`w-36 h-10 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`w-28 h-10 rounded-lg ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
          </div>
        </div>

        {/* Feature showcase card */}
        <div className="lg:col-span-5">
          <div
            className={`w-full h-64 rounded-2xl p-6 flex flex-col justify-between transition-colors ${
              isDark
                ? 'bg-slate-900/80 border border-slate-800/60'
                : 'bg-white/90 border border-slate-200/90 shadow-sm'
            }`}
          >
            <div className={`w-1/3 h-4 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className="space-y-2">
              <div
                className={`w-full h-16 rounded-xl ${
                  isDark ? 'bg-slate-800/40' : 'bg-slate-100'
                }`}
              />
              <div
                className={`w-full h-16 rounded-xl ${
                  isDark ? 'bg-slate-800/40' : 'bg-slate-100'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Minimal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-24 rounded-xl p-4 flex flex-col justify-between transition-colors ${
              isDark
                ? 'bg-slate-900/60 border border-slate-800/60'
                : 'bg-white/80 border border-slate-200/80 shadow-sm'
            }`}
          >
            <div className={`w-24 h-2.5 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`w-16 h-6 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
