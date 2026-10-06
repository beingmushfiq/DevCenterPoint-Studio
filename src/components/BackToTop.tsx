import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Coalesce scroll events into one update per animation frame.
    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;

        const hero = document.getElementById('hero');
        const heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 100 : 500;

        const currentScrollY = window.scrollY;
        setIsVisible((prev) => {
          const next = currentScrollY > heroBottom;
          return prev === next ? prev : next;
        });

        // Calculate total page scroll percentage
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
          const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollHeight) * 100));
          setScrollProgress((prev) => (Math.abs(prev - progress) < 0.5 ? prev : progress));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const scrollToTop = () => {
    soundEngine.playScrollTop();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG circular progress parameters
  const strokeWidth = 2.5;
  const size = 48;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40"
        >
          <div className="relative group">
            {/* Tooltip hint */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/90 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
              Back to Top
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/90 dark:border-t-white" />
            </div>

            {/* Circular Progress & Button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border border-slate-200 dark:border-[#2a2a2a] text-slate-800 dark:text-white shadow-xl shadow-slate-900/10 dark:shadow-black/40 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {/* SVG Scroll Progress Ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox={`0 0 ${size} ${size}`}
              >
                {/* Background track circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-200/60 dark:text-[#2a2a2a]"
                />
                {/* Animated active progress circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="url(#backToTopGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-150 ease-out"
                />
                <defs>
                  <linearGradient id="backToTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Arrow Up Icon with subtle hover elevation */}
              <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
