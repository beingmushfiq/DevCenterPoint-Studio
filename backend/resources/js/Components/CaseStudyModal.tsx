import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import {
  X,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Database,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Quote,
  Clock,
  Loader2,
  Calendar,
  Users,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from './SEOHead';
import { soundEngine } from '../lib/soundEngine';
import {
  ProjectDeepInsights,
  queryProjectDeepInsights,
  DeepChallenge,
  DeepStackItem,
  MeasurableOutcome
} from '../data/simulatedProjectDb';
import { PROJECTS_DATA } from '../data/projects';
import { ProjectScreenshotCarousel } from './ProjectScreenshotCarousel';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
}

type ModalTab = 'overview' | 'challenges' | 'stack' | 'outcomes';

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject
}) => {
  const { setCustomSEO } = useSEO();
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [deepInsights, setDeepInsights] = useState<ProjectDeepInsights | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbLatency, setDbLatency] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [sharedSuccess, setSharedSuccess] = useState<boolean>(false);

  // Find index for Prev / Next project navigation
  const currentIndex = project
    ? PROJECTS_DATA.findIndex((p) => p.id === project.id)
    : -1;
  const prevProject =
    currentIndex > 0 ? PROJECTS_DATA[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < PROJECTS_DATA.length - 1
      ? PROJECTS_DATA[currentIndex + 1]
      : null;

  const handleClose = () => {
    soundEngine.playModalClose();
    onClose();
  };

  const handleTabChange = (tab: ModalTab) => {
    soundEngine.playTap();
    setActiveTab(tab);
  };

  const handleNavigateProject = (target: Project) => {
    soundEngine.playClick();
    if (onSelectProject) {
      onSelectProject(target);
    }
  };

  const handleCopyLink = () => {
    soundEngine.playCopySuccess();
    if (project && navigator.clipboard) {
      const url = `${window.location.origin}#work-${project.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareCaseStudy = async () => {
    soundEngine.playClick();
    if (!project) return;
    const shareUrl = `${window.location.origin}#work-${project.id}`;
    const shareData = {
      title: `${project.title} — DevCenterPoint Case Study`,
      text: `${project.title}: ${project.subtitle}. Explore the technical architecture, challenges, and verified outcomes:`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        soundEngine.playSuccessChime();
        setSharedSuccess(true);
        setTimeout(() => setSharedSuccess(false), 2500);
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          // If native share was declined or had issue, fallback to copying link
          handleCopyLink();
        }
      }
    } else {
      // Fallback for desktop/browsers without native Web Share API
      handleCopyLink();
    }
  };

  const handlePlanProject = () => {
    soundEngine.playClick();
    onClose();
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Asynchronous query from Simulated Database
  useEffect(() => {
    let isCancelled = false;
    if (project) {
      setIsLoading(true);
      queryProjectDeepInsights(project.id, 280)
        .then((result) => {
          if (!isCancelled) {
            setDeepInsights(result.data);
            setDbLatency(result.latencyMs);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    } else {
      setDeepInsights(null);
    }

    return () => {
      isCancelled = true;
    };
  }, [project?.id]);

  useEffect(() => {
    if (project) {
      soundEngine.playModalOpen();
      setCustomSEO({
        title: `${project.title} — Technical Deep Dive Case Study | DevCenterPoint`,
        description: `${project.subtitle}. ${project.shortDescription}`,
        keywords: [project.title, project.category, project.industry, ...project.techStack],
        canonicalPath: `#work-${project.id}`,
      });
    } else {
      setCustomSEO(null);
    }
    return () => {
      setCustomSEO(null);
    };
  }, [project, setCustomSEO]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && prevProject) handleNavigateProject(prevProject);
      if (e.key === 'ArrowRight' && nextProject) handleNavigateProject(nextProject);
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, prevProject, nextProject]);

  if (!project) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* Modal Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300"
      >
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#161616] gap-3">
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold border border-blue-500/30">
              PROJECT {project.number}
            </span>
            <div className="text-xs font-bold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
              <span>{project.category}</span>
              <span>•</span>
              <span className="text-slate-700 dark:text-gray-300">{project.industry} ({project.year})</span>
            </div>
          </div>

          {/* Prev / Next Switcher & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-[#1f1f1f] p-1 rounded-xl border border-slate-200 dark:border-[#2e2e2e]">
              <button
                type="button"
                disabled={!prevProject}
                onClick={() => prevProject && handleNavigateProject(prevProject)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#282828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={prevProject ? `Previous: ${prevProject.title}` : 'No previous project'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!nextProject}
                onClick={() => nextProject && handleNavigateProject(nextProject)}
                className="p-1.5 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#282828] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={nextProject ? `Next: ${nextProject.title}` : 'No next project'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Share Case Study Button */}
            <button
              type="button"
              onClick={handleShareCaseStudy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-[#2e2e2e] hover:border-blue-400 dark:hover:border-blue-500 text-xs font-bold text-slate-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Share Case Study via Web Share"
            >
              {sharedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white dark:bg-[#1f1f1f] hover:bg-slate-100 dark:hover:bg-[#282828] border border-slate-200 dark:border-[#2e2e2e] text-slate-600 dark:text-gray-300 transition-colors cursor-pointer"
              title="Copy shareable project link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-200 dark:bg-[#1f1f1f] hover:bg-slate-300 dark:hover:bg-[#282828] text-slate-700 dark:text-gray-300 transition-colors cursor-pointer ml-1"
              aria-label="Close case study modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Database Live Telemetry Banner */}
        <div className="px-6 py-2 bg-blue-50/70 dark:bg-[#101726] border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-600 dark:text-blue-300">
            <Database className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Simulated Archive DB:</span>
            <span className="font-bold text-blue-700 dark:text-blue-200">
              dcp-archive-db.production.cluster-east
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Querying records...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Query resolved in {dbLatency}ms</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          
          {/* Main Title & Subtitle Banner */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {project.title}
              </h2>
              {deepInsights && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SLA: {deepInsights.productionAuditLog.uptimeSLA}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-gray-300 text-xs font-bold border border-slate-200 dark:border-[#2e2e2e]">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{deepInsights.sprintDurationWeeks}-Week Sprint</span>
                  </span>
                </div>
              )}
            </div>

            <p className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-bold">
              {project.subtitle}
            </p>

            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
              {project.shortDescription}
            </p>

            {/* Technologies Used Tag Cloud */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-blue-500" />
                  Technologies Used
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-gray-500">
                  ({project.techStack.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 border border-slate-200/90 dark:border-[#282828] hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 transition-all duration-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Image Carousel & Fullscreen Lightbox */}
            {deepInsights?.screenshots && deepInsights.screenshots.length > 0 && (
              <div className="pt-2">
                <ProjectScreenshotCarousel
                  screenshots={deepInsights.screenshots}
                  projectTitle={project.title}
                />
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#262626] pb-3">
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#252525]'
              }`}
            >
              Overview & Architecture
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('challenges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'challenges'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#252525]'
              }`}
            >
              <span>Challenges & Solutions</span>
              {deepInsights && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-[#282828] text-slate-500 dark:text-gray-400'}`}>
                  {deepInsights.challenges.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('stack')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'stack'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#252525]'
              }`}
            >
              <span>Deep Stack & Config</span>
              {deepInsights && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'stack' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-[#282828] text-slate-500 dark:text-gray-400'}`}>
                  {deepInsights.deepStack.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('outcomes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'outcomes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                  : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-[#252525]'
              }`}
            >
              <span>Verified Outcomes</span>
              {deepInsights && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeTab === 'outcomes' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-[#282828] text-slate-500 dark:text-gray-400'}`}>
                  {deepInsights.outcomes.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ARCHITECTURE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Client Quote Callout */}
              {deepInsights?.clientTestimonial && (
                <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 relative">
                  <Quote className="w-8 h-8 text-blue-500/30 absolute top-4 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-base italic text-slate-800 dark:text-gray-200 font-medium leading-relaxed pr-6">
                    "{deepInsights.clientTestimonial.quote}"
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {deepInsights.clientTestimonial.author}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-gray-400">
                      {deepInsights.clientTestimonial.role}, {deepInsights.clientTestimonial.company}
                    </span>
                  </div>
                </div>
              )}

              {/* Context, Problem, Strategy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">
                    01 — Context
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                    {project.context}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 mb-2">
                    02 — The Bottleneck
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                    {project.problem}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828]">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">
                    03 — Engineered Strategy
                  </div>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                    {project.strategy}
                  </p>
                </div>
              </div>

              {/* Interactive 5-Step System Architecture Flow */}
              {deepInsights?.architectureFlow && (
                <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-300">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      <span>Production System Architecture Flow</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                      Continuous Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {deepInsights.architectureFlow.map((node, nIdx) => (
                      <div
                        key={nIdx}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2 relative"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 font-bold mb-1">
                            <span>STEP {node.step}</span>
                            <span className="text-slate-400">{node.sla}</span>
                          </div>
                          <div className="text-xs font-bold text-white leading-snug">
                            {node.title}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-relaxed mt-1">
                            {node.description}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                          {node.protocol}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivered Functionality Grid */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] space-y-3">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
                  Delivered Functionality & Features
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.deliveredFunctionality.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#282828] flex items-start gap-2 text-xs font-medium text-slate-800 dark:text-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CHALLENGES & SOLUTIONS */}
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Detailed breakdown of production roadblocks, root causes, and deterministic solutions engineered by DevCenterPoint:
              </div>

              {deepInsights?.challenges.map((ch, idx) => {
                const isCritical = ch.severity === 'Critical';
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-rose-500' : 'text-amber-500'}`} />
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {ch.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {ch.severity} Severity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold block">
                          Root Cause Analysis
                        </span>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          {ch.rootCause}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#2a2a2a] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                          Architectural Resolution
                        </span>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
                          {ch.architecturalResolution}
                        </p>
                      </div>
                    </div>

                    {ch.codeOrPatternReference && (
                      <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] flex items-center justify-between">
                        <span>Pattern: <strong className="text-blue-400">{ch.codeOrPatternReference}</strong></span>
                        <span className="text-emerald-400 text-[10px] uppercase">Validated</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: DEEP STACK & CONFIG */}
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Component-by-component breakdown of the production stack, runtime versions, and engineering rationale:
              </div>

              <div className="grid grid-cols-1 gap-3">
                {deepInsights?.deepStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500">
                          {item.configOrVersion}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">
                        {item.role}
                      </p>
                    </div>

                    <div className="sm:max-w-xs text-left sm:text-right text-[11px] text-slate-500 dark:text-gray-400 font-medium border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-[#262626]">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-gray-500 block mb-0.5">
                        Engineering Rationale
                      </span>
                      {item.rationale}
                    </div>
                  </div>
                ))}
              </div>

              {/* General Tech Stack Tags */}
              <div className="pt-2">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-2">
                  All Integrated Libraries & Protocols
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 text-xs font-bold border border-slate-200 dark:border-[#2a2a2a]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED OUTCOMES */}
          {activeTab === 'outcomes' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                Verified operational benchmarks measured in production environments:
              </div>

              {/* Benchmark Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {deepInsights?.outcomes.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-gray-500 block mb-1">
                        {metric.metric}
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {metric.value}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-[#282828] space-y-1">
                      <div className="text-[10px] font-mono text-slate-400">
                        Baseline: <strong className="text-slate-600 dark:text-gray-300">{metric.baseline}</strong>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
                        {metric.impactDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Squad & Delivery Timeline */}
              {deepInsights && (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#282828] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Team Composition</span>
                      <span className="font-bold text-slate-900 dark:text-white">{deepInsights.teamSquadSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Delivery Speed</span>
                      <span className="font-bold text-slate-900 dark:text-white">{deepInsights.sprintDurationWeeks} Weeks from Discovery to Production</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-[#161616] border-t border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Interested in architecture of this caliber?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleShareCaseStudy}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202020] hover:bg-slate-100 dark:hover:bg-[#2a2a2a] border border-slate-200 dark:border-[#2e2e2e] text-slate-700 dark:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
              title="Share this case study"
            >
              {sharedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-[#252525] hover:bg-slate-300 dark:hover:bg-[#303030] text-slate-700 dark:text-gray-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Close Inspector
            </button>

            <button
              type="button"
              onClick={handlePlanProject}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <span>Plan A Similar Build</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
