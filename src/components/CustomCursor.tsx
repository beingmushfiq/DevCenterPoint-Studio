import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  label?: string;
  isHovered?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ label, isHovered }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ${
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
