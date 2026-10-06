import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { soundEngine } from '../lib/soundEngine';

type Theme = 'dark' | 'light';

/** Screen coordinates of the element that triggered a theme switch. */
export interface ThemeOrigin {
  x: number;
  y: number;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: ThemeOrigin) => void;
  setTheme: (theme: Theme) => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
}

// View Transitions API is not yet in the default DOM lib types.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Apply the theme class to <html>. Idempotent so it is safe to call twice. */
function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('dcp_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Default to light mode as requested
    return 'light';
  });

  const [isSoundMuted, setIsSoundMuted] = useState(() => soundEngine.isSoundMuted());
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem('dcp_theme', theme);
  }, [theme]);

  const toggleSound = () => {
    const newMuted = soundEngine.toggleMute();
    setIsSoundMuted(newMuted);
    if (!newMuted) {
      soundEngine.playClick();
    }
  };

  const toggleTheme = (origin?: ThemeOrigin) => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    // Check user accessibility preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    const root = document.documentElement;
    const doc = document as ViewTransitionDocument;

    // Preferred: a circular reveal expanding from the toggle button, using the
    // View Transitions API. The radius reaches the farthest viewport corner so
    // the new theme always covers the full screen.
    if (origin && typeof doc.startViewTransition === 'function') {
      const dx = Math.max(origin.x, window.innerWidth - origin.x);
      const dy = Math.max(origin.y, window.innerHeight - origin.y);
      const radius = Math.hypot(dx, dy);

      root.style.setProperty('--theme-toggle-x', `${origin.x}px`);
      root.style.setProperty('--theme-toggle-y', `${origin.y}px`);
      root.style.setProperty('--theme-toggle-radius', `${radius}px`);
      root.classList.add('theme-vt');

      const transition = doc.startViewTransition(() => {
        // Apply the class and state synchronously: React 19 defers renders, so
        // the DOM must already reflect the new theme when the browser captures
        // the "after" snapshot for the reveal animation.
        flushSync(() => {
          applyThemeClass(nextTheme);
          setThemeState(nextTheme);
        });
      });

      transition.finished.finally(() => {
        root.classList.remove('theme-vt');
        root.style.removeProperty('--theme-toggle-x');
        root.style.removeProperty('--theme-toggle-y');
        root.style.removeProperty('--theme-toggle-radius');
      });
      return;
    }

    // Fallback (no View Transitions / no origin): scoped colour crossfade.
    root.classList.add('theme-transition');
    setThemeState(nextTheme);

    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 320);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isSoundMuted,
        toggleSound,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
