import { useState, useEffect } from 'react';
import { soundEngine } from '../../lib/soundEngine';
import { useTheme } from '../../Context/ThemeContext';
import { SECTION_ORDER } from '../SEOHead';

export function useHeaderBehavior() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isSoundMuted: isMuted, toggleSound } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const scrollPos = window.scrollY + 180;

      // Sections sit inside scroll-reveal motion wrappers, so offsetTop is
      // unreliable while those transforms are active. Measure from the document.
      for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
        const sectionId = SECTION_ORDER[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    soundEngine.playClick();
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = href;
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
