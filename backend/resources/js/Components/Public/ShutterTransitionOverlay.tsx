import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ShutterTransitionOverlayProps {
  isActive: boolean;
  targetTheme: 'dark' | 'light' | null;
  onComplete?: () => void;
}

/**
 * ShutterTransitionOverlay:
 * A soothing, ultra-smooth dropdown slide-in from top that covers the screen
 * gracefully, transitions the theme underneath, and glides smoothly out of view.
 */
export const ShutterTransitionOverlay: React.FC<ShutterTransitionOverlayProps> = ({
  isActive,
  targetTheme,
  onComplete,
}) => {
  const isGoingDark = targetTheme === 'dark';

  return (
    <AnimatePresence>
      {isActive && (
        <div
          className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* Soothing single-surface dropdown curtain sliding in from the top */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{
              y: ['-100%', '0%', '0%', '100%'],
            }}
            transition={{
              duration: 0.58,
              times: [0, 0.42, 0.58, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              onComplete?.();
            }}
            className={`absolute inset-0 w-full h-full flex flex-col justify-between ${
              isGoingDark
                ? 'bg-gradient-to-b from-[#0a0d14] via-[#0d111a] to-[#0f172a] shadow-[0_30px_70px_rgba(0,0,0,0.6)]'
                : 'bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f1f5f9] shadow-[0_30px_70px_rgba(0,0,0,0.1)]'
            }`}
          >
            {/* Subtle ambient lighting inside the dropdown veil */}
            <div
              className={`absolute inset-0 opacity-40 pointer-events-none ${
                isGoingDark
                  ? 'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(37,99,235,0.18),transparent)]'
                  : 'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.12),transparent)]'
              }`}
            />

            {/* Centered Soothing Minimalist Mode Pill */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.94 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-12, 0, 0, 10],
                  scale: [0.94, 1, 1, 0.96],
                }}
                transition={{
                  duration: 0.58,
                  times: [0, 0.32, 0.68, 1],
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`px-5 py-2.5 rounded-full border backdrop-blur-xl shadow-xl flex items-center gap-3 ${
                  isGoingDark
                    ? 'bg-[#151a24]/90 border-blue-500/30 text-white shadow-blue-500/10'
                    : 'bg-white/90 border-amber-500/30 text-slate-800 shadow-amber-500/10'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isGoingDark
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-600'
                  }`}
                >
                  {isGoingDark ? (
                    <Moon className="w-4 h-4 fill-blue-400/20" />
                  ) : (
                    <Sun className="w-4 h-4 fill-amber-400/20" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold tracking-tight">
                  <span className="opacity-60 font-medium">Switching to</span>
                  <span
                    className={`font-bold ${
                      isGoingDark ? 'text-blue-400' : 'text-amber-600'
                    }`}
                  >
                    {isGoingDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Soothing leading bottom edge glow line */}
            <div
              className={`w-full h-[2px] ${
                isGoingDark
                  ? 'bg-gradient-to-r from-transparent via-blue-500/70 to-transparent shadow-[0_0_15px_#3b82f6]'
                  : 'bg-gradient-to-r from-transparent via-amber-500/60 to-transparent shadow-[0_0_15px_#f59e0b]'
              }`}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
