import Lenis from 'lenis';
import { router } from '@inertiajs/react';

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;
let isInitialized = false;

export interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

/**
 * Initializes the global Lenis smooth scrolling instance.
 * Safe for SSR (no-op on server).
 */
export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;

  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    const raf = (time: number) => {
      if (lenisInstance) {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    };

    rafId = requestAnimationFrame(raf);

    // Bind Inertia route navigation to smooth scroll top or hash target
    if (!isInitialized) {
      isInitialized = true;

      // Handle in-page hash changes and Inertia navigations
      router.on('finish', () => {
        if (!lenisInstance) return;

        const hash = window.location.hash;
        if (hash) {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            lenisInstance.scrollTo(targetEl as HTMLElement, { offset: -80, duration: 1.2 });
            return;
          }
        }
        // Smoothly return to top on new page load
        lenisInstance.scrollTo(0, { immediate: true });
      });
    }

    return lenisInstance;
  } catch (err) {
    console.warn('Failed to initialize Lenis smooth scroll:', err);
    return null;
  }
}

/**
 * Returns the active Lenis instance or null.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Universally scrolls to an element, selector, or position.
 * Uses Lenis if available, falling back to native smooth scrolling.
 */
export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: SmoothScrollOptions
): void {
  if (typeof window === 'undefined') return;

  const lenis = getLenis();
  const offset = options?.offset ?? -70; // Clearance for fixed pill header

  if (lenis) {
    if (typeof target === 'string') {
      const el = target.startsWith('#')
        ? document.getElementById(target.slice(1)) || document.querySelector(target)
        : document.getElementById(target) || document.querySelector(`#${target}`);

      if (el) {
        lenis.scrollTo(el as HTMLElement, {
          offset,
          duration: options?.duration ?? 1.2,
          immediate: options?.immediate ?? false,
        });
      }
    } else {
      lenis.scrollTo(target, {
        offset,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    }
    return;
  }

  // Fallback to native scrolling
  if (typeof target === 'string') {
    const id = target.startsWith('#') ? target.slice(1) : target;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Destroys Lenis instance (useful for cleanups or tests).
 */
export function destroySmoothScroll(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
