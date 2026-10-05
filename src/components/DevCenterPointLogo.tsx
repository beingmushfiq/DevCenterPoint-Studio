import React from 'react';

interface DevCenterPointLogoProps {
  variant?: 'full' | 'horizontal' | 'mark-only' | 'compact' | 'asset-horizontal' | 'asset-mark' | 'asset-full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const DevCenterPointLogo: React.FC<DevCenterPointLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  // Direct asset variants
  if (variant === 'asset-horizontal') {
    return (
      <img
        src="/logo-horizontal.svg"
        alt="DevCenterPoint Logo"
        className={`h-auto object-contain ${
          size === 'xs' ? 'h-6' : size === 'sm' ? 'h-8' : size === 'md' ? 'h-10' : size === 'lg' ? 'h-14' : 'h-20'
        } ${className}`}
      />
    );
  }

  if (variant === 'asset-mark') {
    return (
      <img
        src="/logo-mark.svg"
        alt="DevCenterPoint Logo Mark"
        className={`object-contain ${
          size === 'xs' ? 'w-6 h-6' : size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-20 h-20'
        } ${className}`}
      />
    );
  }

  if (variant === 'asset-full') {
    return (
      <img
        src="/logo.svg"
        alt="DevCenterPoint Full Logo"
        className={`w-auto object-contain ${
          size === 'xs' ? 'h-24' : size === 'sm' ? 'h-36' : size === 'md' ? 'h-48' : size === 'lg' ? 'h-64' : 'h-80'
        } ${className}`}
      />
    );
  }

  // Sizing definitions for responsive inline SVG
  const sizeMap = {
    xs: { mark: 28, text: 'text-sm', sub: 'text-[7px]' },
    sm: { mark: 36, text: 'text-base', sub: 'text-[8.5px]' },
    md: { mark: 44, text: 'text-lg', sub: 'text-[9.5px]' },
    lg: { mark: 56, text: 'text-2xl', sub: 'text-[11px]' },
    xl: { mark: 76, text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  // The distinctive DP CenterPoint Vector Mark (matching logo-mark.svg and favicon.svg)
  const LogoMark = ({ customSize }: { customSize?: number }) => {
    const s = customSize || currentSize.mark;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="dcp-p-grad" x1="240" y1="120" x2="380" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          <radialGradient id="dcp-iris-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(254 240) rotate(45) scale(38)">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>

        {/* 1. Left 'D' - theme adaptive (White on dark, Navy Charcoal on light) */}
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
          className="fill-[#0E131F] dark:fill-white transition-colors duration-300"
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
          fill="url(#dcp-p-grad)"
        />

        {/* 3. Outer White Target Ring with Precision Border */}
        <circle
          cx="260"
          cy="246"
          r="58"
          fill="#FFFFFF"
          stroke="#0E131F"
          strokeWidth="5"
        />

        {/* 4. Inner Center Point Blue Sphere */}
        <circle
          cx="260"
          cy="246"
          r="34"
          fill="url(#dcp-iris-grad)"
        />

        {/* 5. Specular Reflection Highlight on Sphere */}
        <circle
          cx="249"
          cy="235"
          r="8"
          fill="#93C5FD"
          opacity="0.9"
        />

        {/* 6. Angled Code Brackets </> inside the P Loop */}
        <g transform="translate(328, 172) rotate(38)" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M -12 -9 L -18 0 L -12 9" />
          <path d="M 4 -12 L -4 12" />
          <path d="M 12 -9 L 18 0 L 12 9" />
        </g>
      </svg>
    );
  };

  // Only the Mark (matching logo-mark.svg)
  if (variant === 'mark-only') {
    return <LogoMark />;
  }

  // Compact variant for navigation or tight headers
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
        <LogoMark />
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${currentSize.text}`}>
            <span className="text-blue-600 dark:text-blue-500">DevCenter</span><span className="text-[#0E131F] dark:text-white">Point</span>
          </span>
          {showTagline && (
            <span className="text-[7.5px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase mt-1">
              CODE. BUILD. DEPLOY. SCALE.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full stacked variant (matching logo.svg)
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center group ${className}`}>
        <LogoMark customSize={size === 'xl' ? 96 : 84} />
        <div className="mt-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            <span className="text-blue-600 dark:text-blue-500">DevCenter</span><span className="text-[#0E131F] dark:text-white">Point</span>
          </h2>
          {showTagline && (
            <p className="mt-2 text-xs sm:text-sm font-black tracking-[0.28em] text-slate-700 dark:text-slate-300 uppercase">
              CODE. BUILD. DEPLOY. SCALE.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal layout (matching logo-horizontal.svg)
  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      <LogoMark />
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none flex items-center ${currentSize.text}`}>
          <span className="inline-flex items-baseline">
            <span className="text-blue-600 dark:text-blue-500">DevCenter</span><span className="text-[#0E131F] dark:text-white">Point</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] ml-1.5"></span>
        </div>
        {showTagline && (
          <span className={`font-black tracking-[0.24em] text-slate-700 dark:text-slate-400 uppercase mt-1 ${currentSize.sub}`}>
            CODE. BUILD. DEPLOY. SCALE.
          </span>
        )}
      </div>
    </div>
  );
};
