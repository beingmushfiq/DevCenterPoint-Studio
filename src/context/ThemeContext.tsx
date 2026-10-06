import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { soundEngine } from '../lib/soundEngine';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isSoundMuted: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('dcp_theme', theme);
  }, [theme]);

  const toggleSound = () => {
    const newMuted = soundEngine.toggleMute();
    setIsSoundMuted(newMuted);
    if (!newMuted) {
      soundEngine.playClick();
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    // Check user accessibility preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    // Run a smooth, scoped color crossfade: enable the transition class just
    // long enough to cover the class swap, then remove it so it never affects
    // normal scrolling or hover interactions.
    const root = document.documentElement;
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
