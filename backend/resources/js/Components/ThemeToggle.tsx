import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, isShutterActive } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      disabled={isShutterActive}
      className={`relative w-9 h-9 rounded-full transition-all duration-300 border flex items-center justify-center cursor-pointer group active:scale-95 disabled:opacity-80 ${
        isDark
          ? 'bg-[#1a1a1a] hover:bg-[#252525] border-[#2a2a2a] text-amber-400 hover:border-amber-500/40 shadow-md'
          : 'bg-white hover:bg-slate-100 border-slate-300 text-blue-600 hover:border-blue-400 shadow-md'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode with smooth dropdown transition`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode (Smooth Dropdown Transition)`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 fill-blue-600/20" />
        )}
      </motion.div>
    </button>
  );
};
