import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface SolutionProduct {
  id: number;
  slug: string;
  category: string;
  badge: string;
  title: string;
  tagline: string;
  icon_name: string;
  mockup_title: string;
  live_url?: string | null;
  admin_url?: string | null;
  demo_username?: string | null;
  demo_password?: string | null;
  demo_role?: string | null;
  stats?: any[] | null;
  activity_logs?: any[] | null;
  business_outcomes?: Record<string, string> | null;
  client_benefits?: string[] | null;
  deliverables?: string[] | null;
  sample_action_label?: string | null;
  sample_action_toast?: string | null;
  display_order: number;
  is_active: boolean;
}

interface Props {
  solutions: SolutionProduct[];
  showSolutionStudioOnSite: boolean;
}

const emptyForm = {
  slug: '',
  category: 'Enterprise Applications',
  badge: 'Live Product',
  title: '',
  tagline: '',
  icon_name: 'Globe',
  mockup_title: '',
  live_url: '',
  admin_url: '',
  demo_username: '',
  demo_password: '',
  demo_role: '',
  stats: '[]',
  activity_logs: '[]',
  business_outcomes: '{}',
  client_benefits: '',
  deliverables: '',
  sample_action_label: '',
  sample_action_toast: '',
  display_order: 1,
  is_active: true,
};

export default function SolutionsIndex({ solutions, showSolutionStudioOnSite }: Props) {
  const [editingItem, setEditingItem] = useState<SolutionProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  const openCreate = () => {
    setFormData({ ...emptyForm, display_order: solutions.length + 1 });
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (item: SolutionProduct) => {
    setEditingItem(item);
    setFormData({
      slug: item.slug,
      category: item.category,
      badge: item.badge,
      title: item.title,
      tagline: item.tagline,
      icon_name: item.icon_name,
      mockup_title: item.mockup_title,
      live_url: item.live_url || '',
      admin_url: item.admin_url || '',
      demo_username: item.demo_username || '',
      demo_password: item.demo_password || '',
      demo_role: item.demo_role || '',
      stats: JSON.stringify(item.stats ?? [], null, 2),
      activity_logs: JSON.stringify(item.activity_logs ?? [], null, 2),
      business_outcomes: JSON.stringify(item.business_outcomes ?? {}, null, 2),
      client_benefits: (item.client_benefits ?? []).join('\n'),
      deliverables: (item.deliverables ?? []).join('\n'),
      sample_action_label: item.sample_action_label || '',
      sample_action_toast: item.sample_action_toast || '',
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const linesToArray = (v: string) =>
      v ? v.split('\n').map((s) => s.trim()).filter(Boolean) : [];

    const safeJson = (v: string, fallback: any) => {
      try {
        return v.trim() ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    };

    const payload = {
      slug: formData.slug.trim(),
      category: formData.category,
      badge: formData.badge,
      title: formData.title,
      tagline: formData.tagline,
      icon_name: formData.icon_name,
      mockup_title: formData.mockup_title,
      live_url: formData.live_url || null,
      admin_url: formData.admin_url || null,
      demo_username: formData.demo_username || null,
      demo_password: formData.demo_password || null,
      demo_role: formData.demo_role || null,
      stats: safeJson(formData.stats, []),
      activity_logs: safeJson(formData.activity_logs, []),
      business_outcomes: safeJson(formData.business_outcomes, {}),
      client_benefits: linesToArray(formData.client_benefits),
      deliverables: linesToArray(formData.deliverables),
      sample_action_label: formData.sample_action_label || null,
      sample_action_toast: formData.sample_action_toast || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      router.put(`/admin/solutions/${editingItem.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => closeForm(),
      });
    } else {
      router.post('/admin/solutions', payload, {
        preserveScroll: true,
        onSuccess: () => closeForm(),
      });
    }
  };

  const handleToggleActive = (item: SolutionProduct) => {
    router.patch(`/admin/solutions/${item.id}/active`, {}, { preserveScroll: true });
  };

  const handleToggleSiteStudio = () => {
    router.post(
      '/admin/solutions/site-studio',
      { show_solution_studio: !showSolutionStudioOnSite },
      { preserveScroll: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this solution product?')) {
      router.delete(`/admin/solutions/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title="Solution Studio CMS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-500" /> Solution Studio CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage the interactive Solution Studio showcase: toggle the whole section, each product, and edit their content.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Solution Product
          </button>
        </div>

        {/* Master Section Toggle */}
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Show Solution Studio on public site</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Master switch for the entire Solution Studio section in the hero.
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleSiteStudio}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all shrink-0 ${
              showSolutionStudioOnSite
                ? 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600/25'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {showSolutionStudioOnSite ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showSolutionStudioOnSite ? 'Visible — click to hide' : 'Hidden — click to show'}
          </button>
        </div>

        {/* Create / Edit Form Drawer */}
        {(isCreating || editingItem) && (
          <div className="bg-[#0c1017] border border-blue-500/30 rounded-2xl p-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                {editingItem ? `Edit Solution: ${editingItem.title}` : 'Register New Solution Product'}
              </h2>
              <button onClick={closeForm} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. DevCenterPoint ERP & Storefront"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slug (Unique Key)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto from title if blank"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Enterprise ERP & Commerce"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Badge Text *</label>
                  <input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Omnichannel Core"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Icon Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="Globe, Radio, ShoppingCart, Layers, Heart, Sparkles, Languages..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mockup Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.mockup_title}
                    onChange={(e) => setFormData({ ...formData, mockup_title: e.target.value })}
                    placeholder="e.g. DevCenterPoint ERP • Enterprise Control Portal"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tagline *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Short descriptive summary shown under the title..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Public Live URL</label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://demoerp.devcenterpoint.com"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Panel URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.admin_url}
                    onChange={(e) => setFormData({ ...formData, admin_url: e.target.value })}
                    placeholder="https://demoerp.devcenterpoint.com/login"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Demo Credentials Section */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Demo Access Credentials</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Demo Username</label>
                    <input
                      type="text"
                      value={formData.demo_username}
                      onChange={(e) => setFormData({ ...formData, demo_username: e.target.value })}
                      placeholder="Admin"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Demo Password</label>
                    <input
                      type="text"
                      value={formData.demo_password}
                      onChange={(e) => setFormData({ ...formData, demo_password: e.target.value })}
                      placeholder="12345678"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Demo Role</label>
                    <input
                      type="text"
                      value={formData.demo_role}
                      onChange={(e) => setFormData({ ...formData, demo_role: e.target.value })}
                      placeholder="Enterprise Administrator"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Stats (JSON array)</label>
                  <textarea
                    rows={6}
                    value={formData.stats}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Activity Logs (JSON array)</label>
                  <textarea
                    rows={6}
                    value={formData.activity_logs}
                    onChange={(e) => setFormData({ ...formData, activity_logs: e.target.value })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Business Outcomes (JSON object)</label>
                  <textarea
                    rows={6}
                    value={formData.business_outcomes}
                    onChange={(e) => setFormData({ ...formData, business_outcomes: e.target.value })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Client Benefits (one per line)</label>
                  <textarea
                    rows={4}
                    value={formData.client_benefits}
                    onChange={(e) => setFormData({ ...formData, client_benefits: e.target.value })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Deliverables (one per line)</label>
                  <textarea
                    rows={4}
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Sample Action Label</label>
                  <input
                    type="text"
                    value={formData.sample_action_label}
                    onChange={(e) => setFormData({ ...formData, sample_action_label: e.target.value })}
                    placeholder="e.g. Simulate POS Inventory Dispatch"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Sample Action Toast</label>
                  <input
                    type="text"
                    value={formData.sample_action_toast}
                    onChange={(e) => setFormData({ ...formData, sample_action_toast: e.target.value })}
                    placeholder="Toast message shown after running the simulation"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="w-32">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Order #</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded bg-black/40 border-white/10 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-300">Active & Visible in Solution Studio</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30"
                >
                  {editingItem ? 'Update Solution' : 'Register Solution'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solutions.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0c1017] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                item.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.is_active
                          ? 'text-emerald-400 hover:text-emerald-300 hover:bg-white/5'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                      }`}
                      title={item.is_active ? 'Visible — click to hide' : 'Hidden — click to show'}
                    >
                      {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                <div className="text-[11px] text-slate-400 mb-2">{item.category}</div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">{item.tagline}</p>

                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-black/40 border border-white/5">
                    {item.icon_name}
                  </span>
                  <span className={`px-2 py-0.5 rounded border ${
                    item.is_active
                      ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-white/5 text-slate-500 border-white/10'
                  }`}>
                    {item.is_active ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                {item.live_url ? (
                  <a
                    href={item.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Launch
                  </a>
                ) : (
                  <span className="text-xs text-slate-600">No live URL</span>
                )}
                <span className="text-[10px] font-mono text-slate-500">Order #{item.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
