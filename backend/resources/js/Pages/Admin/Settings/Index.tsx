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
    site_name: 'DevCenterPoint Studio',
    contact_email: 'contact@devcenterpoint.com',
    whatsapp_number: '+8801988383323',
    whatsapp_prefill_message: 'Hi DevCenterPoint, I would like to discuss engineering a digital product.',
    founder_portfolio_url: 'https://mushfiq.devcenterpoint.com',
    studio_location: 'Dhaka, Bangladesh // Remote Worldwide',
    booking_url: 'https://cal.com/devcenterpoint',
    // Hero & Atmosphere Settings
    hero_badge_text: 'Engineering Studio • Custom Systems & AI',
    hero_headline_line1: 'Digital products,',
    hero_headline_line2_gradient: 'engineered properly.',
    hero_thesis_statement: 'DevCenterPoint designs and builds scalable web platforms, cloud architecture, and intelligent systems tailored for businesses that cannot afford technical debt.',
    hero_cta_primary_text: 'Start a Project',
    hero_cta_secondary_text: 'Explore Selected Work',
    hero_telemetry_badge1_label: 'Cluster',
    hero_telemetry_badge1_val: '7 Nodes Active',
    hero_telemetry_badge2_label: 'Uptime SLA',
    hero_telemetry_badge2_val: '99.99%',
    hero_telemetry_badge3_label: 'Avg Latency',
    hero_telemetry_badge3_val: '12ms',
    visual_liquid_orbs_enabled: 'true',
    visual_radar_status: 'OPERATIONAL // 100% HEALTH',
    // SEO & Announcements
    seo_meta_title: 'DevCenterPoint Studio | Software Engineering & System Architecture',
    seo_meta_description: 'Elite software engineering consultancy specializing in scalable web systems, AI pipelines, and resilient cloud architectures.',
    seo_meta_keywords: 'software engineering, enterprise web systems, AI pipelines, full stack development, cloud architecture',
    seo_canonical_url: 'https://devcenterpoint.com',
    seo_og_image: '/og-image.png',
    aeo_system_summary: 'DevCenterPoint Studio is a software engineering and system architecture consultancy founded by Mushfiq. Core capabilities include full-stack SaaS, AI/ML pipelines, real-time telemetry, and resilient cloud systems.',
    announcement_active: 'false',
    announcement_badge: 'UPDATE',
    announcement_text: 'Now accepting select product engineering engagements for 2026.',
    announcement_link: '#contact',
    social_github: 'https://github.com/beingmushfiq',
    social_linkedin: 'https://linkedin.com/company/devcenterpoint',
    social_twitter: 'https://twitter.com/devcenterpoint',
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
              {/* Optional Simulated Ambient Liquid Orbs */}
              {formData['visual_liquid_orbs_enabled'] !== 'false' && (
                <>
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/20 blur-[70px] rounded-full pointer-events-none" />
                  <div className="absolute top-1/2 -right-12 w-52 h-52 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-cyan-400/15 blur-[60px] rounded-full pointer-events-none" />
                </>
              )}

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Live Front-End Hero Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                    Realtime Feedback
                  </span>
                </div>

                {/* Eyebrow Badge Preview */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                      {formData['hero_badge_text'] || 'Engineering Studio • Custom Systems & AI'}
                    </span>
                  </div>
                </div>

                {/* Headline Preview */}
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {formData['hero_headline_line1'] || 'Digital products,'}{' '}
                  <span className="bg-linear-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                    {formData['hero_headline_line2_gradient'] || 'engineered properly.'}
                  </span>
                </div>

                {/* Thesis Preview */}
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                  {formData['hero_thesis_statement'] || 'DevCenterPoint designs and builds scalable web platforms, cloud architecture, and intelligent systems tailored for businesses that cannot afford technical debt.'}
                </p>

                {/* Buttons Preview */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="px-5 py-2.5 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 border border-white/20">
                    <span>{formData['hero_cta_primary_text'] || 'Start a Project'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-blue-400 fill-current" />
                    <span>{formData['hero_cta_secondary_text'] || 'Explore Selected Work'}</span>
                  </div>
                </div>

                {/* Telemetry Strip Preview */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{formData['hero_telemetry_badge1_label'] || 'Cluster'}: {formData['hero_telemetry_badge1_val'] || '7 Nodes Active'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="text-blue-400 font-bold">{formData['hero_telemetry_badge2_val'] || '99.99%'}</span>
                    <span>{formData['hero_telemetry_badge2_label'] || 'Uptime SLA'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
                    <span className="text-purple-400 font-bold">{formData['hero_telemetry_badge3_val'] || '12ms'}</span>
                    <span>{formData['hero_telemetry_badge3_label'] || 'Avg Latency'}</span>
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
                      placeholder="Cluster"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge1_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge1_val', e.target.value)}
                      placeholder="7 Nodes Active"
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
                      placeholder="Uptime SLA"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge2_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge2_val', e.target.value)}
                      placeholder="99.99%"
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
                      placeholder="Avg Latency"
                      className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Value / Status</label>
                    <input
                      type="text"
                      value={formData['hero_telemetry_badge3_val']}
                      onChange={(e) => handleChange('hero_telemetry_badge3_val', e.target.value)}
                      placeholder="12ms"
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
                  <label className="text-slate-400 font-semibold block mb-1">GitHub Organization / Profile</label>
                  <input
                    type="url"
                    value={formData['social_github']}
                    onChange={(e) => handleChange('social_github', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">LinkedIn Page</label>
                  <input
                    type="url"
                    value={formData['social_linkedin']}
                    onChange={(e) => handleChange('social_linkedin', e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">X / Twitter</label>
                  <input
                    type="url"
                    value={formData['social_twitter']}
                    onChange={(e) => handleChange('social_twitter', e.target.value)}
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
