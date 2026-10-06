import React, { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  label?: string;
  isHovered?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ label, isHovered }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const frameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    // Position updates are written straight to the DOM inside a single rAF
    // tick, so a fast mouse never triggers a React render per event.
    const applyPosition = () => {
      frameRef.current = null;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(applyPosition);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseLeave = () => {
      setIsVisible(false);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 hidden md:block top-0 left-0 will-change-transform"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        className={`flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovered || label
            ? 'bg-[#2E4AF9] text-white px-3 py-1 scale-110 shadow-lg shadow-[#2E4AF9]/30 border border-white/20'
            : 'w-3 h-3 bg-[#2E4AF9] border border-white/40 ring-4 ring-[#2E4AF9]/20'
        }`}
      >
        {label && (
          <span className="text-[10px] font-mono tracking-widest uppercase font-semibold whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
