import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Film,
  Sparkles
} from 'lucide-react';
import { useCms } from '../Context/CmsContext';

interface HeroVideoCardProps {
  className?: string;
}

export const HeroVideoCard: React.FC<HeroVideoCardProps> = ({ className = '' }) => {
  const cms = useCms();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const isEnabled = cms.getSetting('hero_video_enabled', 'true') !== 'false';
  const videoUrl = cms.getSetting('hero_video_url', '/launch_video.mp4');
  const mobileVideoUrl = cms.getSetting('hero_video_mobile_url', '/launch_video_mobile.mp4');
  const posterUrl = cms.getSetting('hero_video_poster', '/og-image.png');
  const caption = cms.getSetting('hero_video_caption', 'Studio Engineering Reel // Architecture in Motion');
  const soundDefault = cms.getSetting('hero_video_sound_default', 'false') === 'true';

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(!soundDefault);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile viewport to potentially serve mobile video asset
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Safe playback trigger
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!isEnabled) {
    return null;
  }

  const activeSrc = isMobile && mobileVideoUrl ? mobileVideoUrl : videoUrl;

  return (
    <>
      <div 
        className={`relative group rounded-2xl overflow-hidden border hairline-border bg-[var(--bg-surface)] shadow-lg hover:border-[var(--accent-primary)]/40 transition-all duration-300 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Glow behind video */}
        <div className="absolute -inset-1 bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Top Header Tag */}
        <div className="relative z-10 flex items-center justify-between px-3.5 py-2 border-b hairline-border bg-[var(--bg-canvas)]/80 backdrop-blur-md text-[11px] font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Launch Reel
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[var(--accent-primary)] font-bold">
              1080p Stream
            </span>
          </div>
        </div>

        {/* Video Viewport Container (16:9 Aspect Ratio) */}
        <div 
          className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={activeSrc}
            poster={posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover select-none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Center Play/Pause Indicator (appears on hover or when paused) */}
          {(!isPlaying || isHovered) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-105">
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </div>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-auto">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              className="px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[10px] tracking-wider uppercase">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] tracking-wider uppercase text-emerald-300 font-bold">Sound On</span>
                </>
              )}
            </button>

            {/* Expand to Lightbox Modal */}
            <button
              type="button"
              onClick={openModal}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white hover:text-blue-400 transition-all cursor-pointer shadow-md"
              title="Full-Screen Lightbox View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Caption Footer */}
        {caption && (
          <div className="px-3.5 py-2 bg-[var(--bg-canvas)]/90 border-t hairline-border flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
            <span className="truncate pr-2">{caption}</span>
            <span className="text-[10px] text-[var(--accent-primary)] font-bold whitespace-nowrap">
              0:42 // LOOP
            </span>
          </div>
        )}
      </div>

      {/* Full-Screen Cinema Lightbox Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Modal Header */}
          <div 
            className="w-full max-w-5xl flex items-center justify-between pb-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                {caption}
              </span>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Video Player */}
          <div 
            className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={modalVideoRef}
              src={videoUrl}
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

