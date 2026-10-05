import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

/**
 * Single source of truth for the system audio mute control.
 * Reads ThemeContext so the header toggle and the Studio FX drawer never desync.
 */
export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isSoundMuted, toggleSound } = useTheme();
  const label = isSoundMuted ? 'Sound Off' : 'Sound On';

  return (
    <button
      type="button"
      onClick={toggleSound}
      className={`flex items-center justify-center w-9 h-9 rounded-full border transition-colors cursor-pointer active:scale-95 ${
        isSoundMuted
          ? 'text-slate-500 dark:text-slate-400 border-slate-300 dark:border-white/15 bg-white dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#252525]'
          : 'text-blue-600 dark:text-blue-400 border-blue-400/50 dark:border-blue-400/30 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20'
      } ${className}`}
      aria-label={isSoundMuted ? 'Turn sound on' : 'Turn sound off'}
      title={label}
    >
      {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};
