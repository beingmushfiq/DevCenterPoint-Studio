import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Settings, Save, Globe, Share2, Code } from 'lucide-react';

interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  group: string;
}

interface Props {
  settings: SiteSetting[];
}

export default function SettingsIndex({ settings }: Props) {
  const initialData: Record<string, string> = {};
  settings.forEach((s) => {
    initialData[s.key] = s.value || '';
  });

  const [formData, setFormData] = useState<Record<string, string>>(initialData);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/admin/settings', formData, { preserveScroll: true });
  };

  return (
    <AdminLayout title="Site Settings">
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-400" /> Global Settings & SEO CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure global brand details, search engine optimization, and social links.
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>

        {/* SEO Group */}
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Globe className="w-4 h-4 text-blue-400" /> Search Engine Optimization (SEO)
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Global Meta Title</label>
              <input
                type="text"
                value={formData['seo_meta_title'] || ''}
                onChange={(e) => handleChange('seo_meta_title', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={formData['seo_meta_description'] || ''}
                onChange={(e) => handleChange('seo_meta_description', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Brand & Communication Group */}
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Share2 className="w-4 h-4 text-purple-400" /> Branding & Communication
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Studio Name</label>
              <input
                type="text"
                value={formData['site_name'] || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Contact Email</label>
              <input
                type="email"
                value={formData['contact_email'] || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData['social_github'] || ''}
                onChange={(e) => handleChange('social_github', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData['social_linkedin'] || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tracking Scripts */}
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Code className="w-4 h-4 text-emerald-400" /> Analytics & Custom Scripts
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Custom &lt;head&gt; Scripts (e.g. GTM / GA4)</label>
              <textarea
                rows={3}
                placeholder="<!-- Google Tag Manager -->"
                value={formData['custom_head_scripts'] || ''}
                onChange={(e) => handleChange('custom_head_scripts', e.target.value)}
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
