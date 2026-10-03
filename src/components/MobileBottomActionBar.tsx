import React from 'react';
import { Zap, ArrowUpRight, Code2, Sparkles } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

interface MobileBottomActionBarProps {
  onOpenSandbox: () => void;
}

export const MobileBottomActionBar: React.FC<MobileBottomActionBarProps> = ({
  onOpenSandbox
}) => {
  const scrollTo = (id: string) => {
    soundEngine.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 pointer-events-none animate-in slide-in-from-bottom-4 duration-300">
      <div className="max-w-md mx-auto pointer-events-auto p-1.5 rounded-2xl bg-slate-900/90 dark:bg-[#141414]/90 backdrop-blur-xl border border-slate-700/60 dark:border-[#2a2a2a] shadow-2xl flex items-center justify-between gap-1.5 text-white">
        {/* 1-Click Demos Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playModalOpen();
            onOpenSandbox();
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Live Demos</span>
        </button>

        {/* Start Project CTA Button */}
        <button
          type="button"
          onClick={() => scrollTo('contact')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-[#222222] hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-900 dark:text-white font-sans text-xs font-black border border-slate-200/40 dark:border-[#333333] shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span>Start Project</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        </button>
      </div>
    </div>
  );
};
