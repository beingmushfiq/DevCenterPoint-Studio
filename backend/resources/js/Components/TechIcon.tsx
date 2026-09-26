import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = '', size = 20 }) => {
  const s = size;

  switch (name) {
    case 'React 19':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="React">
          <ellipse cx="50" cy="50" rx="44" ry="17" stroke="#38BDF8" strokeWidth="6" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="44" ry="17" stroke="#38BDF8" strokeWidth="6" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="44" ry="17" stroke="#38BDF8" strokeWidth="6" transform="rotate(120 50 50)" />
          <circle cx="50" cy="50" r="8" fill="#38BDF8" />
        </svg>
      );

    case 'Next.js':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Next.js">
          <circle cx="50" cy="50" r="46" fill="#000000" stroke="#3B82F6" strokeWidth="5" />
          <path d="M 36 30 L 36 70" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 36 30 L 68 70" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 68 30 L 68 55" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'TypeScript':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="TypeScript">
          <rect width="100" height="100" rx="20" fill="#3178C6" />
          <path d="M 22 36 L 50 36 M 36 36 L 36 74" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="square" />
          <path
            d="M 76 42 C 72 37 63 36 58 40 C 53 44 56 50 63 53 C 74 58 75 66 69 71 C 62 76 53 74 48 69"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'Tailwind CSS':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Tailwind CSS">
          <path
            d="M 28 50 C 31 38 40 34 50 38 C 45 45 43 49 53 54 C 58 57 62 61 62 68 C 62 76 52 80 43 76 C 36 72 33 66 35 59 C 23 60 17 55 17 44 C 17 32 30 24 45 24 C 62 24 73 34 71 50"
            fill="#38BDF8"
          />
        </svg>
      );

    case 'Laravel':
    case 'Laravel v13.x':
    case 'Laravel 13.x':
    case 'Laravel 13':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Laravel">
          <rect width="100" height="100" rx="20" fill="#FF2D20" />
          <path
            d="M 30 28 L 54 42 L 54 72 L 30 58 Z M 54 42 L 78 28 L 78 58 L 54 72 Z M 30 28 L 54 14 L 78 28 L 54 42 Z"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'Node.js & Express':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Node.js">
          <path
            d="M 50 12 L 85 32 L 85 72 L 50 92 L 15 72 L 15 32 Z"
            fill="#339933"
            stroke="#22C55E"
            strokeWidth="4"
          />
          <path
            d="M 50 32 L 68 43 L 68 64 L 50 74 L 32 64 L 32 43 Z"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
          />
        </svg>
      );

    case 'PHP 8.4':
    case 'PHP 8.3+':
    case 'PHP':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="PHP">
          <ellipse cx="50" cy="50" rx="46" ry="28" fill="#777BB4" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="30"
          >
            PHP
          </text>
        </svg>
      );

    case 'FastAPI':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="FastAPI">
          <rect width="100" height="100" rx="20" fill="#009688" />
          <path
            d="M 50 16 L 80 34 L 80 66 L 50 84 L 20 66 L 20 34 Z"
            fill="#00796B"
            stroke="#80CBC4"
            strokeWidth="3"
          />
          <path
            d="M 54 26 L 36 50 L 48 50 L 44 74 L 64 46 L 52 46 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'PostgreSQL':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="PostgreSQL">
          <rect width="100" height="100" rx="20" fill="#336791" />
          <path
            d="M 32 30 C 40 22 60 22 68 30 C 74 36 76 50 72 62 C 68 74 54 80 44 76 L 36 82 L 36 68 C 30 62 26 50 28 40 Z"
            fill="#FFFFFF"
          />
          <circle cx="44" cy="42" r="4" fill="#336791" />
        </svg>
      );

    case 'MySQL':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="MySQL">
          <rect width="100" height="100" rx="20" fill="#00758F" />
          <path
            d="M 24 64 C 30 46 45 32 70 32 C 60 44 65 55 76 56 C 58 64 45 68 24 64 Z"
            fill="#F29111"
          />
          <circle cx="56" cy="42" r="3" fill="#FFFFFF" />
        </svg>
      );

    case 'Redis':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Redis">
          <rect width="100" height="100" rx="20" fill="#DC382D" />
          <path
            d="M 50 20 L 78 34 L 50 48 L 22 34 Z M 22 44 L 50 58 L 78 44 M 22 56 L 50 70 L 78 56 M 22 68 L 50 82 L 78 68"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    case 'Docker':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Docker">
          <rect width="100" height="100" rx="20" fill="#2496ED" />
          {/* Container blocks */}
          <rect x="30" y="32" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="44" y="32" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="58" y="32" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="30" y="44" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="44" y="44" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="58" y="44" width="10" height="8" fill="#FFFFFF" rx="1" />
          <rect x="72" y="44" width="10" height="8" fill="#FFFFFF" rx="1" />
          {/* Whale body */}
          <path
            d="M 18 56 C 24 54 82 54 86 64 C 88 74 76 80 50 80 C 30 80 18 72 18 56 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'Linux / Nginx':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Nginx">
          <rect width="100" height="100" rx="20" fill="#009639" />
          <path
            d="M 28 72 L 28 28 L 72 72 L 72 28"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'WebSockets':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="WebSockets">
          <rect width="100" height="100" rx="20" fill="#1E293B" />
          <circle cx="50" cy="50" r="32" stroke="#38BDF8" strokeWidth="4" strokeDasharray="12 8" />
          <path d="M 52 24 L 38 52 L 48 52 L 44 76 L 64 46 L 52 46 Z" fill="#F59E0B" />
        </svg>
      );

    case 'Laravel Reverb':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Laravel Reverb">
          <rect width="100" height="100" rx="20" fill="#FF2D20" />
          <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
          <path
            d="M 32 32 C 42 22 58 22 68 32 M 22 22 C 38 6 62 6 78 22 M 32 68 C 42 78 58 78 68 68 M 22 78 C 38 94 62 94 78 78"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'Python':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="Python">
          <rect width="100" height="100" rx="20" fill="#306998" />
          {/* Blue head */}
          <path
            d="M 48 20 C 34 20 30 26 30 32 L 30 40 L 52 40 L 52 44 L 24 44 C 18 44 14 50 14 58 C 14 66 18 72 26 72 L 32 72 L 32 64 C 32 58 38 52 46 52 L 68 52 C 74 52 78 48 78 42 L 78 32 C 78 24 72 20 62 20 Z"
            fill="#FFD43B"
          />
          <circle cx="38" cy="28" r="3.5" fill="#306998" />
          <circle cx="62" cy="72" r="3.5" fill="#FFD43B" />
        </svg>
      );

    case 'SHAP & XGBoost':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" className={className} aria-label="SHAP XGBoost">
          <rect width="100" height="100" rx="20" fill="#0F172A" />
          {/* Decision tree branches */}
          <path d="M 50 22 L 30 46 M 50 22 L 70 46 M 30 46 L 20 74 M 30 46 L 40 74 M 70 46 L 60 74 M 70 46 L 80 74" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="22" r="8" fill="#38BDF8" />
          <circle cx="30" cy="46" r="6" fill="#10B981" />
          <circle cx="70" cy="46" r="6" fill="#F59E0B" />
          <circle cx="20" cy="74" r="5" fill="#8B5CF6" />
          <circle cx="40" cy="74" r="5" fill="#EC4899" />
          <circle cx="60" cy="74" r="5" fill="#3B82F6" />
          <circle cx="80" cy="74" r="5" fill="#10B981" />
        </svg>
      );

    default:
      return (
        <div className={`rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs ${className}`} style={{ width: s, height: s }}>
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
