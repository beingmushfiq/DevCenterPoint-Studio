import React, { useState, useEffect } from 'react';
import { ProjectScreenshot } from '../data/simulatedProjectDb';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Monitor,
  Eye,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../lib/soundEngine';

interface ProjectScreenshotCarouselProps {
  screenshots: ProjectScreenshot[];
  projectTitle: string;
}

export const ProjectScreenshotCarousel: React.FC<ProjectScreenshotCarouselProps> = ({
  screenshots,
  projectTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // Reset index if screenshots change
  useEffect(() => {
    setCurrentIndex(0);
    setIsLightboxOpen(false);
    setIsZoomed(false);
  }, [projectTitle]);

  const currentScreenshot = screenshots[currentIndex] || screenshots[0];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playTap();
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playTap();
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = () => {
    soundEngine.playModalOpen();
    setIsLightboxOpen(true);
    setIsZoomed(false);
  };

  const handleCloseLightbox = () => {
    soundEngine.playModalClose();
    setIsLightboxOpen(false);
    setIsZoomed(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playTap();
    setIsZoomed((prev) => !prev);
  };

  // Keyboard navigation for carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') handleCloseLightbox();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === ' ' || e.key === 'Enter') setIsZoomed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, screenshots.length]);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-gray-400">
            System Interface & Production Views
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-gray-400">
            {String(currentIndex + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a1a1a] p-1 rounded-xl border border-slate-200 dark:border-[#2a2a2a]">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-[#252525] text-slate-600 dark:text-gray-300 transition-colors cursor-pointer"
              title="Previous Screenshot (Arrow Left)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-lg hover:bg-white dark:hover:bg-[#252525] text-slate-600 dark:text-gray-300 transition-colors cursor-pointer"
              title="Next Screenshot (Arrow Right)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Carousel Display Card */}
      <div
        onClick={handleOpenLightbox}
        className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#282828] bg-slate-950 aspect-[16/9] sm:aspect-[21/9] cursor-zoom-in shadow-xl transition-all hover:border-blue-500/50"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreenshot.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full h-full relative flex items-center justify-center bg-slate-950"
          >
            {/* Background blur ambiance */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${currentScreenshot.imageUrl})` }}
            />

            {/* High-Resolution Screenshot */}
            <img
              src={currentScreenshot.imageUrl}
              alt={currentScreenshot.title}
              onLoad={() =>
                setImageLoaded((prev) => ({ ...prev, [currentScreenshot.id]: true }))
              }
              className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                imageLoaded[currentScreenshot.id] ? 'opacity-100' : 'opacity-80'
              }`}
            />

            {/* Top Overlay Badge & Fullscreen Prompt */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 text-xs font-mono font-bold tracking-tight shadow-lg">
                  {currentScreenshot.badge}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-mono font-semibold uppercase tracking-wider shadow-lg">
                  {currentScreenshot.category}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 text-xs font-bold shadow-lg group-hover:bg-blue-600 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Fullscreen Lightbox</span>
              </div>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 sm:p-6 z-10 flex flex-col justify-end space-y-1 text-white">
              <h4 className="text-sm sm:text-base font-black tracking-tight text-white leading-snug drop-shadow-md">
                {currentScreenshot.title}
              </h4>
              <p className="text-xs text-slate-300 font-medium line-clamp-2 max-w-3xl leading-relaxed drop-shadow-sm">
                {currentScreenshot.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Floating Nav Buttons */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-blue-600 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-xl z-20"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-blue-600 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-xl z-20"
          aria-label="Next screenshot"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {screenshots.map((shot, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={shot.id}
              type="button"
              onClick={() => {
                soundEngine.playTap();
                setCurrentIndex(idx);
              }}
              className={`p-2 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-slate-50 dark:bg-[#181818] border-slate-200 dark:border-[#282828] hover:border-slate-300 dark:hover:border-[#383838]'
              }`}
            >
              <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200/50 dark:border-white/10 relative">
                <img
                  src={shot.imageUrl}
                  alt={shot.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 truncate">
                  {shot.badge}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate">
                  {shot.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between text-white p-4 sm:p-6 overflow-hidden"
          >
            {/* Lightbox Top Control Bar */}
            <div className="flex items-center justify-between gap-4 z-20 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-mono text-xs font-bold">
                  {projectTitle}
                </span>
                <span className="hidden sm:inline-block text-xs font-bold text-slate-400">
                  {currentScreenshot.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-2">
                  {currentIndex + 1} / {screenshots.length}
                </span>

                <button
                  type="button"
                  onClick={toggleZoom}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isZoomed ? 'Zoom Out (1x)' : 'Zoom In (1.5x)'}
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleCloseLightbox}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Close Lightbox (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Centered Image Canvas */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreenshot.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.35 : 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="max-w-6xl max-h-[72vh] w-full h-full flex items-center justify-center"
                >
                  <img
                    src={currentScreenshot.imageUrl}
                    alt={currentScreenshot.title}
                    className="max-h-[72vh] max-w-full rounded-2xl shadow-2xl object-contain border border-white/10 cursor-pointer"
                    onClick={toggleZoom}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lightbox Side Navigation Chevrons */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer shadow-2xl z-30"
                aria-label="Previous screenshot in lightbox"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer shadow-2xl z-30"
                aria-label="Next screenshot in lightbox"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Bottom Info & Thumbnail Strip */}
            <div className="pt-4 border-t border-white/10 z-20 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {currentScreenshot.title}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {currentScreenshot.description}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">→</kbd> to navigate, <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">ESC</kbd> to exit
                </div>
              </div>

              {/* Scrubber Thumbnail Row */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
                {screenshots.map((shot, idx) => (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setCurrentIndex(idx);
                    }}
                    className={`h-12 w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative shrink-0 ${
                      idx === currentIndex
                        ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/40'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={shot.imageUrl}
                      alt={shot.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
