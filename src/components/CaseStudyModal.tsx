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
  Share2,
  Github,
  Key,
  Lock,
  Play,
  Activity,
  Zap,
  Workflow
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
  const [copiedUser, setCopiedUser] = useState<boolean>(false);
  const [copiedPass, setCopiedPass] = useState<boolean>(false);
  const [selectedFlowNodeIndex, setSelectedFlowNodeIndex] = useState<number>(0);
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(false);
  const [activeSimStep, setActiveSimStep] = useState<number | null>(null);

  const handleCopyText = (text: string, type: 'user' | 'pass') => {
    soundEngine.playCopySuccess();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'user') {
        setCopiedUser(true);
        setTimeout(() => setCopiedUser(false), 2000);
      } else {
        setCopiedPass(true);
        setTimeout(() => setCopiedPass(false), 2000);
      }
    }
  };

  const handleRunFlowSimulation = () => {
    if (isSimulatingFlow || !deepInsights?.architectureFlow || deepInsights.architectureFlow.length === 0) return;
    setIsSimulatingFlow(true);
    setActiveSimStep(0);
    setSelectedFlowNodeIndex(0);
    soundEngine.playTap();

    const flow = deepInsights.architectureFlow;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < flow.length) {
        setActiveSimStep(step);
        setSelectedFlowNodeIndex(step);
        soundEngine.playTap();
      } else {
        clearInterval(interval);
        setIsSimulatingFlow(false);
        setActiveSimStep(null);
        soundEngine.playSuccessChime();
      }
    }, 800);
  };

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
    setSelectedFlowNodeIndex(0);
    setIsSimulatingFlow(false);
    setActiveSimStep(null);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 lg:p-8 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* Modal Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-[#262626] rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300"
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

            {/* Live App External Link (if verified deployment exists) */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm group cursor-pointer"
                title="Open live verified system in new tab"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live App</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}

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
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 dark:border-[#262626] pb-3 overflow-x-auto no-scrollbar sm:flex-wrap">
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
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
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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
              
              {/* Client Quote & Enterprise Endorsement Callout */}
              {deepInsights?.clientTestimonial && (
                <div className="p-6 rounded-2xl bg-linear-to-br from-blue-50/90 via-slate-50 to-indigo-50/40 dark:from-[#181d2c] dark:via-[#161616] dark:to-[#181818] border border-blue-200/80 dark:border-blue-900/40 relative overflow-hidden shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Verified Enterprise Outcome
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500">
                        • Production Deployment Audit
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-mono font-bold">
                      <span>★★★★★</span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 ml-1">5.0 / 5.0</span>
                    </div>
                  </div>

                  <Quote className="w-10 h-10 text-blue-500/20 absolute -bottom-2 right-4 pointer-events-none" />
                  <p className="text-sm sm:text-base italic text-slate-800 dark:text-gray-100 font-medium leading-relaxed mb-4 relative z-10">
                    "{deepInsights.clientTestimonial.quote}"
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-[#282828] relative z-10">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0">
                      {deepInsights.clientTestimonial.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {deepInsights.clientTestimonial.author}
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 dark:text-gray-400">
                        {deepInsights.clientTestimonial.role} • <span className="font-bold text-blue-600 dark:text-blue-400">{deepInsights.clientTestimonial.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Live Deployment & Evaluation Access Callout */}
              {(project.liveUrl || project.demoCredentials || project.openSourceRepoName || project.githubUrl) && (
                <div className="p-5 sm:p-6 rounded-2xl bg-linear-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 text-white shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Verified Deployment</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white">
                        Live System Environment & Evaluation
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {project.demoCredentials?.notes || 'Direct live access provided for verifying system responsiveness, counter speeds, and enterprise workflows.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-bold transition-all shadow-lg shadow-blue-600/30 group"
                        >
                          <span>Launch Live App</span>
                          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      )}
                      {project.adminUrl && project.adminUrl !== project.liveUrl && (
                        <a
                          href={project.adminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-sans text-xs font-bold border border-slate-700 transition-all"
                        >
                          <span>Admin Portal</span>
                          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-sans text-xs font-bold border border-slate-700 transition-all"
                        >
                          <Github className="w-3.5 h-3.5 text-slate-300" />
                          <span>{project.openSourceRepoName ? project.openSourceRepoName : 'GitHub'}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Credentials pill bar if provided */}
                  {project.demoCredentials && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-blue-400" /> Demo Credentials:
                      </span>
                      <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                        <span className="text-slate-400">User:</span>
                        <span className="text-emerald-400 font-bold">{project.demoCredentials.username}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(project.demoCredentials!.username || '', 'user')}
                          className="ml-1 p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                          title="Copy Username"
                        >
                          {copiedUser ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      {project.demoCredentials.password && (
                        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                          <span className="text-slate-400">Pass:</span>
                          <span className="text-blue-300 font-bold">{project.demoCredentials.password}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(project.demoCredentials!.password!, 'pass')}
                            className="ml-1 p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            title="Copy Password"
                          >
                            {copiedPass ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                      {project.demoCredentials.role && (
                        <span className="text-[10px] text-slate-400 font-sans italic">
                          ({project.demoCredentials.role})
                        </span>
                      )}
                    </div>
                  )}
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
              {deepInsights?.architectureFlow && deepInsights.architectureFlow.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-5 relative overflow-hidden">
                  {/* Subtle Grid Ambient Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none" />

                  {/* Header Bar */}
                  <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                            Production System Architecture Pipeline
                          </h4>
                          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {deepInsights.architectureFlow.length} Active Nodes
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Click any node to inspect SLA benchmarks, transport protocols, and failover topologies.
                        </p>
                      </div>
                    </div>

                    {/* Simulation Trigger Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRunFlowSimulation}
                        disabled={isSimulatingFlow}
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer ${
                          isSimulatingFlow
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.02] active:scale-95'
                        }`}
                        title="Simulate data execution flow across all pipeline nodes"
                      >
                        {isSimulatingFlow ? (
                          <>
                            <Activity className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            <span>Pipelining Node 0{activeSimStep! + 1}...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Simulate Live Pipeline</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Flow Nodes Pipeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
                    {deepInsights.architectureFlow.map((node, nIdx) => {
                      const isSelected = selectedFlowNodeIndex === nIdx;
                      const isSimActive = activeSimStep === nIdx;
                      return (
                        <div
                          key={nIdx}
                          onClick={() => {
                            soundEngine.playTap();
                            setSelectedFlowNodeIndex(nIdx);
                          }}
                          className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 relative border text-left ${
                            isSimActive
                              ? 'bg-blue-900/40 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400 scale-[1.03]'
                              : isSelected
                              ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          {/* Step Header */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5">
                              <span className={isSelected || isSimActive ? 'text-blue-400' : 'text-slate-400'}>
                                NODE {node.step}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-emerald-400 font-mono">
                                {node.sla}
                              </span>
                            </div>

                            <div className="text-xs font-black text-white leading-snug line-clamp-2">
                              {node.title}
                            </div>
                            
                            <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                              {node.description}
                            </div>
                          </div>

                          {/* Protocol badge & selection indicator */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-blue-300 truncate font-semibold">
                              {node.protocol}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Node Deep Telemetry Inspector */}
                  {deepInsights.architectureFlow[selectedFlowNodeIndex] && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3 relative z-10 animate-in fade-in duration-150">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                            NODE {deepInsights.architectureFlow[selectedFlowNodeIndex].step} DEEP TELEMETRY
                          </span>
                          <h5 className="font-extrabold text-white text-sm">
                            {deepInsights.architectureFlow[selectedFlowNodeIndex].title}
                          </h5>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">Target SLA:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                            {deepInsights.architectureFlow[selectedFlowNodeIndex].sla}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {deepInsights.architectureFlow[selectedFlowNodeIndex].description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                            Wire Protocol & Transport
                          </span>
                          <span className="text-xs font-mono font-bold text-blue-400 block truncate">
                            {deepInsights.architectureFlow[selectedFlowNodeIndex].protocol}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Payload: {deepInsights.architectureFlow[selectedFlowNodeIndex].payloadType || 'Typed JSON Event'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                            Security & Encryption
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-400 block truncate">
                            {deepInsights.architectureFlow[selectedFlowNodeIndex].security || 'Strict TLS 1.3 / Signature Validation'}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Cryptographic Zero-Trust verification
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                            Failover & Redundancy
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400 block truncate">
                            {deepInsights.architectureFlow[selectedFlowNodeIndex].failover || 'Dead-Letter Queue with Exponential Backoff'}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Autonomous retry & event replay
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#282828] flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-gray-500 block">
                          {metric.metric}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[9px] font-bold">
                          Verified
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {metric.value}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-[#282828]">
                      {/* Visual Delta Progress Comparison */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400">
                          <span>Legacy Baseline</span>
                          <span className="font-semibold text-slate-700 dark:text-gray-300">{metric.baseline}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#252525] overflow-hidden">
                          <div className="h-full bg-linear-to-r from-blue-600 to-emerald-500 rounded-full w-4/5 animate-pulse" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed pt-1">
                        {metric.impactDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enterprise Production Verification Seal */}
              {deepInsights && (
                <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-blue-500/5 to-slate-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-[#181818] border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          Continuous Production Audit Certificate
                        </h5>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-gray-400 font-medium mt-0.5">
                        Status: <strong className="text-slate-800 dark:text-gray-200">{deepInsights.productionAuditLog.auditStatus}</strong> • Last Validated: <strong className="text-slate-800 dark:text-gray-200">{deepInsights.productionAuditLog.lastVerified}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-[#121212] px-3.5 py-2 rounded-xl border border-emerald-500/20 shadow-xs">
                    <span>Uptime SLA:</span>
                    <span className="text-sm font-black">{deepInsights.productionAuditLog.uptimeSLA}</span>
                  </div>
                </div>
              )}

              {/* Squad & Delivery Timeline */}
              {deepInsights && (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#282828] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Team Squad Size</span>
                      <span className="font-bold text-slate-900 dark:text-white">{deepInsights.teamSquadSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Delivery Velocity</span>
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
