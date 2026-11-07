import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
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

        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
          const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollHeight) * 100));
          setScrollProgress((prev) => (Math.abs(prev - progress) < 0.5 ? prev : progress));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const strokeWidth = 2;
  const size = 44;
  const center = size / 2;
  const radius = center - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40"
        >
          <div className="relative group">
            {/* Tooltip hint */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--bg-surface)] border hairline-border text-[var(--text-ink)] text-[10px] font-mono font-bold uppercase tracking-wider rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-sm">
              Top
            </div>

            {/* Circular Progress & Button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--bg-surface)] backdrop-blur-md border hairline-border text-[var(--text-ink)] shadow-md hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none"
            >
              {/* SVG Scroll Progress Ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                viewBox={`0 0 ${size} ${size}`}
              >
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-[var(--border-hairline)]"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#0047FF"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-150 ease-out"
                />
              </svg>

              <ArrowUp className="w-4 h-4 transition-transform duration-150 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
