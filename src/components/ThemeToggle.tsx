import React from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, isSoundMuted, toggleSound } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Primary Mode Toggler */}
      <button
        onClick={toggleTheme}
        className={`relative px-3 py-2 rounded-2xl transition-all duration-300 border flex items-center justify-center cursor-pointer group active:scale-95 ${
          isDark
            ? 'bg-[#1a1a1a] hover:bg-[#252525] border-[#2a2a2a] text-amber-400 hover:border-amber-500/40 shadow-md'
            : 'bg-white hover:bg-slate-100 border-slate-300 text-blue-600 hover:border-blue-400 shadow-md'
        }`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex items-center gap-2 text-xs font-black tracking-tight"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline text-xs font-bold text-gray-300 group-hover:text-amber-400 transition-colors">
                Light
              </span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-blue-600 fill-blue-600/20" />
              <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                Dark
              </span>
            </>
          )}
        </motion.div>
      </button>

      {/* Optional Sound & Haptics Mute/Unmute Toggle */}
      <button
        type="button"
        onClick={toggleSound}
        className={`p-2 rounded-2xl transition-all border flex items-center justify-center cursor-pointer ${
          isSoundMuted
            ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600'
            : 'bg-slate-100 dark:bg-slate-900 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm'
        }`}
        aria-label={isSoundMuted ? 'Unmute system sounds and haptics' : 'Mute system sounds and haptics'}
        title={isSoundMuted ? 'System Audio: Muted' : 'System Audio: Active (Haptic Sounds)'}
      >
        {isSoundMuted ? (
          <VolumeX className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
