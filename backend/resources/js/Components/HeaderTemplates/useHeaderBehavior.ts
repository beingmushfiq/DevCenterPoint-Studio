import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { soundEngine } from '../../lib/soundEngine';
import { useTheme } from '../../Context/ThemeContext';
import { SECTION_ORDER } from '../SEOHead';

export function useHeaderBehavior() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isSoundMuted: isMuted, toggleSound } = useTheme();
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Coalesce scroll events into a single update per animation frame so the
    // scroll-spy never runs on every raw scroll tick.
    const runScrollSpy = () => {
      frameRef.current = null;

      setScrolled((prev) => {
        const next = window.scrollY > 30;
        return prev === next ? prev : next;
      });

      const scrollPos = window.scrollY + 180;

      // Sections sit inside scroll-reveal motion wrappers, so offsetTop is
      // unreliable while those transforms are active. Measure from the document.
      for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
        const sectionId = SECTION_ORDER[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveSection((prev) => (prev === sectionId ? prev : sectionId));
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(runScrollSpy);
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

  /**
   * A bare `#anchor` scrolls the current page. A `/#anchor` link points at a
   * section on the homepage, so it navigates there (SPA) and then scrolls once
   * the section has mounted.
   */
  const scrollToSection = (hash: string) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (href: string) => {
    soundEngine.playClick();
    setMenuOpen(false);

    if (href.startsWith('#')) {
      scrollToSection(href);
      return;
    }

    const hashIndex = href.indexOf('#');
    if (hashIndex > 0) {
      const path = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex);
      if (path === window.location.pathname) {
        scrollToSection(hash);
        return;
      }
      router.visit(path, {
        onSuccess: () => window.requestAnimationFrame(() => scrollToSection(hash)),
      });
      return;
    }

    router.visit(href);
  };

  const handleToggleSound = () => {
    toggleSound();
  };

  return {
    scrolled,
    menuOpen,
    setMenuOpen,
    activeSection,
    isMuted,
    handleNavClick,
    handleToggleSound,
  };
}
