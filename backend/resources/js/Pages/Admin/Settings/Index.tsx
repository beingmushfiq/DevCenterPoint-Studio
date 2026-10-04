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
  MessageSquare
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

type SettingsTab = 'brand' | 'seo' | 'banner' | 'social' | 'scripts';

export default function SettingsIndex({ settings }: Props) {
  const initialData: Record<string, string> = {
    site_name: 'DevCenterPoint Studio',
    contact_email: 'contact@devcenterpoint.com',
    whatsapp_number: '+8801988383323',
    whatsapp_prefill_message: 'Hi DevCenterPoint, I would like to discuss engineering a digital product.',
    founder_portfolio_url: 'https://mushfiq.devcenterpoint.com',
    studio_location: 'Dhaka, Bangladesh // Remote Worldwide',
    booking_url: 'https://cal.com/devcenterpoint',
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

  const [activeTab, setActiveTab] = useState<SettingsTab>('brand');
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
                  <input
                    type="url"
                    value={formData['booking_url']}
                    onChange={(e) => handleChange('booking_url', e.target.value)}
                    placeholder="https://cal.com/devcenterpoint"
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
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
