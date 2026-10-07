import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLoadingScreenProps {
  /**
   * Callback fired once the initial loading indicator has completed.
   */
  onMountComplete?: () => void;
  /**
   * Minimum display time in ms so the bar reads as a deliberate progress
   * indicator rather than a flash. Default: 600ms.
   */
  minDuration?: number;
}

/**
 * Thin top progress bar shown during the initial mount.
 *
 * This replaced a full-screen opaque overlay. The overlay covered the hero —
 * the Largest Contentful Paint element — until hydration finished, which added
 * multiple seconds to the LCP render delay reported by PageSpeed Insights. A
 * 2px bar at the top of the viewport communicates progress without ever
 * obscuring the page content, so the hero paints on the first frame.
 */
export const GlobalLoadingScreen: React.FC<GlobalLoadingScreenProps> = ({
  onMountComplete,
  minDuration = 600,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onMountComplete?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onMountComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          key="global-progress-bar"
          className="fixed top-0 left-0 right-0 z-99999 h-0.5 pointer-events-none"
          role="progressbar"
          aria-label="Loading DevCenterPoint"
        >
          <motion.div
            className="h-full bg-linear-to-r from-blue-600 via-sky-500 to-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: minDuration / 1000, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
