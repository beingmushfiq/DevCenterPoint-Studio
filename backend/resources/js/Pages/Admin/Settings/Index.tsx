import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
  Settings, 
  Save, 
  Globe, 
  Share2, 
  Code, 
  Phone, 
  Mail, 
  Bell, 
  Sparkles, 
  Check, 
  ExternalLink,
  MapPin,
  Calendar,
  MessageSquare,
  Activity,
  Layers,
  Eye,
  Sliders,
  Play
} from 'lucide-react';

interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  group?: string;
}

interface Props {
  settings: SiteSetting[];
}

type SettingsTab = 'brand' | 'hero' | 'seo' | 'banner' | 'social' | 'scripts';

export default function SettingsIndex({ settings }: Props) {
  const initialData: Record<string, string> = {
    site_name: 'DevCenterPoint',
    contact_email: 'contact@devcenterpoint.com',
    whatsapp_number: '+8801988383323',
    whatsapp_prefill_message: 'Hi DevCenterPoint, I would like to discuss engineering a digital product.',
    founder_portfolio_url: 'https://mushfiq.devcenterpoint.com',
    studio_location: 'Dhaka, Bangladesh // Remote Worldwide',
    booking_url: 'https://cal.com/devcenterpoint',
    booking_cta_label: 'Book a Consultation',
    // Hero & Cinema Settings (Strategic Architecture Plan Locked)
    hero_badge_text: 'TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI',
    hero_headline_line1: 'We turn inefficient',
    hero_headline_line2_gradient: 'business processes into software.',
    hero_thesis_statement: 'DevCenterPoint builds custom software, business automation systems, SaaS products, and intelligent digital solutions for businesses and organizations.',
    hero_cta_primary_text: 'Start a Project',
    hero_cta_secondary_text: 'Explore Selected Work',
    hero_video_url: '/launch_video.mp4',
    hero_video_mobile_url: '/launch_video_mobile.mp4',
    hero_video_enabled: 'true',
    lenis_smooth_scroll_enabled: 'true',
    hero_telemetry_badge1_label: 'Status',
    hero_telemetry_badge1_val: 'Operational',
    hero_telemetry_badge2_label: 'Reliability',
    hero_telemetry_badge2_val: '99.9%',
    hero_telemetry_badge3_label: 'Speed',
    hero_telemetry_badge3_val: 'Ultra-Fast',
    visual_liquid_orbs_enabled: 'true',
    visual_radar_status: 'OPERATIONAL // 100% HEALTH',
    // Developer / Demo Controls (hidden from the public site by default)
    show_loading_preview_toggle: 'false',
    show_hero_canvas_controls: 'false',
    // SEO & Announcements
    seo_meta_title: 'Custom Software Development Company in Bangladesh — DevCenterPoint',
    seo_meta_description: 'Custom software development studio in Dhaka, Bangladesh. DevCenterPoint builds SaaS platforms, web apps, ERP systems and AI products for global teams.',
    seo_canonical_url: 'https://devcenterpoint.com',
    seo_og_image: '/og-image.png',
    aeo_system_summary: 'DevCenterPoint Studio is a software engineering and system architecture consultancy founded by Mushfiq. Core capabilities include full-stack SaaS, AI/ML pipelines, real-time telemetry, and resilient cloud systems.',
    announcement_active: 'false',
    announcement_badge: 'UPDATE',
    announcement_text: 'Now accepting select product engineering engagements for 2026.',
    social_github: 'https://github.com/DevCenterPoint',
    social_linkedin: 'https://www.linkedin.com/company/devcenterpoint',
    social_twitter: 'https://x.com/DevCenterPoint',
    social_x: 'https://x.com/DevCenterPoint',
    social_youtube: 'https://youtube.com/@DevCenterPoint',
    social_instagram: 'https://www.instagram.com/devcenterpoint/',
    social_facebook: 'https://facebook.com/DevCenterPoint',
    custom_head_scripts: '',
    custom_body_scripts: '',
  };

  settings.forEach((s) => {
    if (s.value !== null && s.value !== undefined) {
      initialData[s.key] = s.value;
    }
  });

  const [activeTab, setActiveTab] = useState<SettingsTab>('hero');
  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const applyStrategicNorthStar = () => {
    setFormData((prev) => ({
      ...prev,
      hero_badge_text: 'TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI',
      hero_headline_line1: 'We turn inefficient',
      hero_headline_line2_gradient: 'business processes into software.',
      hero_thesis_statement: 'DevCenterPoint builds custom software, business automation systems, SaaS products, and intelligent digital solutions for businesses and organizations.',
      hero_cta_primary_text: 'Start a Project',
      hero_cta_secondary_text: 'Explore Selected Work',
      hero_video_url: '/launch_video.mp4',
      hero_video_mobile_url: '/launch_video_mobile.mp4',
      hero_video_enabled: 'true',
      lenis_smooth_scroll_enabled: 'true',
      booking_url: 'https://cal.com/devcenterpoint',
      booking_cta_label: 'Book a Consultation',
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    router.post('/admin/settings', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      },
      onError: () => {
        setIsSaving(false);
      },
    });
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Atmosphere', icon: Sparkles },
    { id: 'brand', label: 'Brand & Contacts', icon: Phone },
    { id: 'seo', label: 'SEO & AI (AEO)', icon: Globe },
    { id: 'banner', label: 'Announcement Bar', icon: Bell },
    { id: 'social', label: 'Social & Links', icon: Share2 },
    { id: 'scripts', label: 'Analytics & Scripts', icon: Code },
  ];

  return (
    <AdminLayout title="Site Controller Settings">
      <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Site Controller CMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Settings className="w-7 h-7 text-blue-500" />
              Global Configuration
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Configure brand channels, WhatsApp direct integration, SEO/AEO indexers, and live site notices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                <Check className="w-4 h-4" /> Changes Saved
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Public Website Routes Quick-Sync Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#0a0e18] border border-white/10 rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono font-semibold text-[11px] uppercase tracking-wider">
              Live Front Routes:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 border border-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <span>Home (/)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/services"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-600/20 hover:text-emerald-400 border border-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <span>Services (/services)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/work"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 border border-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <span>Work (/work)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-600/20 hover:text-cyan-400 border border-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <span>Blog (/blog)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-600/20 hover:text-amber-400 border border-white/10 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <span>Inquiry (#contact)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Hero & Atmosphere */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Live Interactive Visual Preview Card */}
            <div className="backdrop-blur-2xl bg-[#0c1222]/90 border border-white/15 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {/* Optional Background Video Preview Simulation */}
              {formData['hero_video_enabled'] !== 'false' && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                  <video
                    src={formData['hero_video_url'] || '/launch_video.mp4'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0c1222] via-[#0c1222]/60 to-transparent" />
                </div>
              )}

              {/* Optional Simulated Ambient Liquid Orbs */}
              {formData['visual_liquid_orbs_enabled'] !== 'false' && (
                <>
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 blur-[70px] rounded-full pointer-events-none" />
                  <div className="absolute top-1/2 -right-12 w-52 h-52 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-cyan-400/15 blur-[60px] rounded-full pointer-events-none" />
                </>
              )}

              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Live Front-End Hero Preview
                    </span>
                    {formData['hero_video_enabled'] !== 'false' && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> Video Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={applyStrategicNorthStar}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer border border-white/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply Strategic North Star</span>
                    </button>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      Realtime Feedback
                    </span>
                  </div>
                </div>

                {/* Eyebrow Badge Preview */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                      {formData['hero_badge_text'] || 'TECHNOLOGY COMPANY • BUSINESS AUTOMATION & AI'}
                    </span>
                  </div>
                </div>

                {/* Headline Preview */}
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display">
                  {formData['hero_headline_line1'] || 'We turn inefficient'}{' '}
                  <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    {formData['hero_headline_line2_gradient'] || 'business processes into software.'}
                  </span>
                </div>

                {/* Thesis Preview */}
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                  {formData['hero_thesis_statement'] || 'DevCenterPoint builds custom software, business automation systems, SaaS products, and intelligent digital solutions for businesses and organizations.'}
                </p>

                {/* 4 Distinct CTAs Preview */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="px-5 py-2.5 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 border border-white/20">
                    <span>{formData['hero_cta_primary_text'] || 'Start a Project'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-linear-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{formData['booking_cta_label'] || 'Book a Consultation'}</span>
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-blue-400 fill-current" />
                    <span>{formData['hero_cta_secondary_text'] || 'Explore Selected Work'}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp Direct</span>
                  </div>
                </div>

                {/* Telemetry Strip Preview */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{formData['hero_telemetry_badge1_label'] || 'Status'}: {formData['hero_telemetry_badge1_val'] || 'Operational'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">{formData['hero_telemetry_badge2_val'] || '99.9%'}</span>
                    <span>{formData['hero_telemetry_badge2_label'] || 'Reliability'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="text-purple-400 font-bold">{formData['hero_telemetry_badge3_val'] || 'Ultra-Fast'}</span>
                    <span>{formData['hero_telemetry_badge3_label'] || 'Speed'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Headline Editor */}
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="w-4 h-4 text-blue-400" /> Hero Headline & Architecture Thesis
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-semibold block mb-1">Eyebrow Capsule Badge</label>
                  <input
                    type="text"
                    value={formData['hero_badge_text']}
                    onChange={(e) => handleChange('hero_badge_text', e.target.value)}
                    placeholder="Engineering Studio • Custom Systems & AI"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Displays as the frosted pill with the glowing pulse dot at the very top of the page.</p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Headline Line 1 (Solid White)</label>
                  <input
                    type="text"
                    value={formData['hero_headline_line1']}
                    onChange={(e) => handleChange('hero_headline_line1', e.target.value)}
                    placeholder="Digital products,"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Headline Line 2 (Signature Gradient Accent)</label>
                  <input
                    type="text"
                    value={formData['hero_headline_line2_gradient']}
                    onChange={(e) => handleChange('hero_headline_line2_gradient', e.target.value)}
                    placeholder="engineered properly."
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-semibold block mb-1">Architecture Thesis & Supporting Paragraph</label>
                  <textarea
                    rows={3}
                    value={formData['hero_thesis_statement']}
                    onChange={(e) => handleChange('hero_thesis_statement', e.target.value)}
                    placeholder="DevCenterPoint designs and builds scalable web platforms..."
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white leading-relaxed focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={formData['hero_cta_primary_text']}
                    onChange={(e) => handleChange('hero_cta_primary_text', e.target.value)}
                    placeholder="Start a Project"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={formData['hero_cta_secondary_text']}
                    onChange={(e) => handleChange('hero_cta_secondary_text', e.target.value)}
                    placeholder="Explore Selected Work"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Live Operational Telemetry Badges */}
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Activity className="w-4 h-4 text-emerald-400" /> Operational Telemetry Strip
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Badge 1 */}
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest block font-bold">Telemetry Badge 1</span>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Metric Label</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge1_label']}
                      onChange={(e) => handleChange('hero_telemetry_badge1_label', e.target.value)}
                      placeholder="Status"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge1_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge1_val', e.target.value)}
                      placeholder="Operational"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest block font-bold">Telemetry Badge 2</span>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Metric Label</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge2_label']}
                      onChange={(e) => handleChange('hero_telemetry_badge2_label', e.target.value)}
                      placeholder="Reliability"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge2_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge2_val', e.target.value)}
                      placeholder="99.9%"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest block font-bold">Telemetry Badge 3</span>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Metric Label</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge3_label']}
                      onChange={(e) => handleChange('hero_telemetry_badge3_label', e.target.value)}
                      placeholder="Speed"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge3_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge3_val', e.target.value)}
                      placeholder="Ultra-Fast"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Atmosphere & Visual Effects */}
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Sliders className="w-4 h-4 text-purple-400" /> Atmosphere & Visual Lighting
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Animated Liquid Gradient Light Orbs</label>
                  <select
                    value={formData['visual_liquid_orbs_enabled']}
                    onChange={(e) => handleChange('visual_liquid_orbs_enabled', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Enabled (3 Floating Blurred Gradient Orbs)</option>
                    <option value="false">Disabled (Minimalist Neural Mesh Only)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Adds luminous depth behind the hero headline with smooth CSS floating keyframe animation.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Navigation Radar Status Text</label>
                  <input
                    type="text"
                    value={formData['visual_radar_status']}
                    onChange={(e) => handleChange('visual_radar_status', e.target.value)}
                    placeholder="OPERATIONAL // 100% HEALTH"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Displayed inside the pill in the floating capsule navigation bar.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hero Cinematic Background Video</label>
                  <select
                    value={formData['hero_video_enabled']}
                    onChange={(e) => handleChange('hero_video_enabled', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Enabled (1080p Ambient Loop with Cinema Audio Controller)</option>
                    <option value="false">Disabled (Minimalist Neural Mesh Canvas Only)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Plays /launch_video.mp4 with audio toggle chip, dark glass scrim overlay, and bottom gradient blend.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hero Desktop Video Asset URL / Path</label>
                  <input
                    type="text"
                    value={formData['hero_video_url']}
                    onChange={(e) => handleChange('hero_video_url', e.target.value)}
                    placeholder="/launch_video.mp4"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Desktop ambient video asset in public directory or high-speed CDN video stream URL.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hero Mobile Video Asset URL / Path</label>
                  <input
                    type="text"
                    value={formData['hero_video_mobile_url']}
                    onChange={(e) => handleChange('hero_video_mobile_url', e.target.value)}
                    placeholder="/launch_video_mobile.mp4"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Mobile-optimized vertical/compact video asset (serves screens ≤ 768px).
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Universal Lenis Smooth Scroll</label>
                  <select
                    value={formData['lenis_smooth_scroll_enabled']}
                    onChange={(e) => handleChange('lenis_smooth_scroll_enabled', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Enabled (Universal Smooth Inertia on All Public Pages)</option>
                    <option value="false">Disabled (Native Browser Scroll)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Inertia scroll with automatic reset on Inertia router navigation and prefers-reduced-motion honor.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Preview Loader Debug Widget</label>
                  <select
                    value={formData['show_loading_preview_toggle']}
                    onChange={(e) => handleChange('show_loading_preview_toggle', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="false">Hidden (Recommended for Production)</option>
                    <option value="true">Visible (Replay Loading Screen Trigger)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Developer tool that lets visitors replay the spinner/skeleton loading screen. Keep hidden on the live site.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hero 3D Mood Canvas Controls</label>
                  <select
                    value={formData['show_hero_canvas_controls']}
                    onChange={(e) => handleChange('show_hero_canvas_controls', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="false">Hidden (Recommended for Production)</option>
                    <option value="true">Visible (Mesh / Nodes / Shutter Studio FX)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Floating capsule to switch the hero background canvas mode and tone presets. Intended for previewing only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Brand & Contacts */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Phone className="w-4 h-4 text-blue-400" /> Direct Communication & WhatsApp Integration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Studio Brand Name</label>
                  <input
                    type="text"
                    value={formData['site_name']}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Official Inquiries Email</label>
                  <input
                    type="email"
                    value={formData['contact_email']}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Inquiry notifications will be dispatched here</span>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">WhatsApp Business Number (with country code)</label>
                  <input
                    type="text"
                    value={formData['whatsapp_number']}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    placeholder="+8801988383323"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Renders direct chat links on mobile action bar & menu</span>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">WhatsApp Greeting Pre-fill Text</label>
                  <input
                    type="text"
                    value={formData['whatsapp_prefill_message']}
                    onChange={(e) => handleChange('whatsapp_prefill_message', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Studio Location / Timezone</label>
                  <input
                    type="text"
                    value={formData['studio_location']}
                    onChange={(e) => handleChange('studio_location', e.target.value)}
                    placeholder="Dhaka, Bangladesh // Remote Worldwide"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Founder Portfolio URL</label>
                  <input
                    type="url"
                    value={formData['founder_portfolio_url']}
                    onChange={(e) => handleChange('founder_portfolio_url', e.target.value)}
                    placeholder="https://mushfiq.devcenterpoint.com"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 font-semibold block mb-1">Booking / Cal.com URL</label>
                  <div className="flex items-center gap-2 p-2.5 bg-black/20 border border-white/10 rounded-xl">
                    <span className="text-xs text-slate-300 font-mono truncate flex-1">
                      {formData['booking_url'] || 'https://cal.com/devcenterpoint'}
                    </span>
                    <a
                      href="/admin/appearance"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 shrink-0"
                    >
                      <span>Edit in Appearance</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: SEO & AI Search */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Globe className="w-4 h-4 text-emerald-400" /> Search Engine Optimization & Social Previews
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Global Meta Title (60 chars max)</label>
                  <input
                    type="text"
                    value={formData['seo_meta_title']}
                    onChange={(e) => handleChange('seo_meta_title', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Meta Description (160 chars max)</label>
                  <textarea
                    rows={3}
                    value={formData['seo_meta_description']}
                    onChange={(e) => handleChange('seo_meta_description', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Canonical URL</label>
                    <input
                      type="url"
                      value={formData['seo_canonical_url']}
                      onChange={(e) => handleChange('seo_canonical_url', e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">OpenGraph Share Image URL</label>
                    <input
                      type="text"
                      value={formData['seo_og_image']}
                      onChange={(e) => handleChange('seo_og_image', e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">AI Engine / Generative Engine (AEO/GEO) Context Summary</label>
                  <textarea
                    rows={4}
                    value={formData['aeo_system_summary']}
                    onChange={(e) => handleChange('aeo_system_summary', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Injected into schema.org JSON-LD to optimize answers by Perplexity, SearchGPT, and Claude</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Announcement Bar */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Bell className="w-4 h-4 text-amber-400" /> Header Announcement Banner
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="announcement_active"
                    checked={formData['announcement_active'] === 'true'}
                    onChange={(e) => handleChange('announcement_active', e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/10 focus:ring-blue-500"
                  />
                  <label htmlFor="announcement_active" className="text-white font-semibold cursor-pointer">
                    Enable Top Announcement Bar on Live Website
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={formData['announcement_badge']}
                      onChange={(e) => handleChange('announcement_badge', e.target.value)}
                      placeholder="NEW"
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-400 font-semibold block mb-1">Banner Announcement Message</label>
                    <input
                      type="text"
                      value={formData['announcement_text']}
                      onChange={(e) => handleChange('announcement_text', e.target.value)}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Target Action Link (e.g. #contact or /case-studies)</label>
                  <input
                    type="text"
                    value={formData['announcement_link']}
                    onChange={(e) => handleChange('announcement_link', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Social Ecosystem */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Share2 className="w-4 h-4 text-purple-400" /> Social & Public Developer Links
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">LinkedIn Company Page</label>
                  <input
                    type="url"
                    value={formData['social_linkedin'] || ''}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    placeholder="https://www.linkedin.com/company/devcenterpoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">GitHub Organization / Profile</label>
                  <input
                    type="url"
                    value={formData['social_github'] || ''}
                    onChange={(e) => handleChange('social_github', e.target.value)}
                    placeholder="https://github.com/DevCenterPoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">X (formerly Twitter)</label>
                  <input
                    type="url"
                    value={formData['social_twitter'] || formData['social_x'] || ''}
                    onChange={(e) => {
                      handleChange('social_twitter', e.target.value);
                      handleChange('social_x', e.target.value);
                    }}
                    placeholder="https://x.com/DevCenterPoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">YouTube Channel</label>
                  <input
                    type="url"
                    value={formData['social_youtube'] || ''}
                    onChange={(e) => handleChange('social_youtube', e.target.value)}
                    placeholder="https://youtube.com/@DevCenterPoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Instagram Profile</label>
                  <input
                    type="url"
                    value={formData['social_instagram'] || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    placeholder="https://www.instagram.com/devcenterpoint/"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Facebook Page</label>
                  <input
                    type="url"
                    value={formData['social_facebook'] || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/DevCenterPoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Analytics & Scripts */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
                <Code className="w-4 h-4 text-pink-400" /> Custom Scripts & Tag Management
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Custom &lt;head&gt; Scripts (e.g. GTM / GA4 / Plausible)</label>
                  <textarea
                    rows={4}
                    placeholder="<!-- Google Tag Manager or Meta Pixel -->"
                    value={formData['custom_head_scripts']}
                    onChange={(e) => handleChange('custom_head_scripts', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Custom Body End Scripts</label>
                  <textarea
                    rows={4}
                    placeholder="<!-- Chat widget or conversion tracking snippet -->"
                    value={formData['custom_body_scripts']}
                    onChange={(e) => handleChange('custom_body_scripts', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
