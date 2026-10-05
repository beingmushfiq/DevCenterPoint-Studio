import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { soundEngine } from '../lib/soundEngine';
import { ShutterTransitionOverlay } from '../Components/ShutterTransitionOverlay';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isShutterActive: boolean;
  shutterTargetTheme: Theme | null;
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

  const [isShutterActive, setIsShutterActive] = useState(false);
  const [shutterTargetTheme, setShutterTargetTheme] = useState<Theme | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(() => soundEngine.isSoundMuted());
  const shutterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (isShutterActive) return; // Prevent double triggering during active shutter

    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    // Check user accessibility preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger pneumatic mechanical sound synthesis & haptic vibration
    soundEngine.playShutterDownSequence();

    if (prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    // Activate smooth shutter down animation
    setIsShutterActive(true);
    setShutterTargetTheme(nextTheme);

    // Switch theme under the dropdown at midpoint coverage (~240ms)
    setTimeout(() => {
      setThemeState(nextTheme);
    }, 240);

    // Complete dropdown slide cycle fallback
    if (shutterTimeoutRef.current) clearTimeout(shutterTimeoutRef.current);
    shutterTimeoutRef.current = setTimeout(() => {
      handleShutterComplete();
    }, 620);
  };

  const handleShutterComplete = () => {
    // Prevent duplicate triggers if both animation callback and timer fire
    setIsShutterActive((prev) => {
      if (prev) {
        // Trigger subtle 'click' audio cue using Web Audio API when shutter finish settles
        soundEngine.playShutterCompleteClick();
        return false;
      }
      return false;
    });
    setShutterTargetTheme(null);
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
        isShutterActive,
        shutterTargetTheme,
        isSoundMuted,
        toggleSound,
      }}
    >
      {/* Global Cinematic Shutter Down Transition Overlay */}
      <ShutterTransitionOverlay
        isActive={isShutterActive}
        targetTheme={shutterTargetTheme}
        onComplete={handleShutterComplete}
      />
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
