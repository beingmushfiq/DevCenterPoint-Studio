import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
  Terminal,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Key,
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface SandboxApp {
  id: number;
  slug: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  live_url: string;
  admin_url?: string | null;
  accent_color: string;
  icon_name: string;
  credentials_username?: string | null;
  credentials_password?: string | null;
  roles?: string[] | null;
  credentials_notes?: string | null;
  features?: string[] | null;
  display_order: number;
  is_active: boolean;
}

interface Props {
  sandboxApps: SandboxApp[];
}

export default function SandboxIndex({ sandboxApps }: Props) {
  const [editingItem, setEditingItem] = useState<SandboxApp | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    category: 'Enterprise Applications',
    badge: 'Live Interactive Demo',
    description: '',
    live_url: '',
    admin_url: '',
    accent_color: 'emerald',
    icon_name: 'Layers',
    credentials_username: 'demo_admin',
    credentials_password: 'Password123!',
    roles: 'Superadmin, Auditor',
    credentials_notes: '',
    features: 'Multi-Tenant Auth, Role RBAC, Real-time Sync',
    display_order: 1,
    is_active: true,
  });

  const openCreate = () => {
    setFormData({
      slug: '',
      name: '',
      category: 'Enterprise Applications',
      badge: 'Live Interactive Demo',
      description: '',
      live_url: '',
      admin_url: '',
      accent_color: 'blue',
      icon_name: 'Layers',
      credentials_username: '',
      credentials_password: '',
      roles: 'Admin, Viewer',
      credentials_notes: '',
      features: 'Full Cloud Sandbox, Interactive UI',
      display_order: sandboxApps.length + 1,
      is_active: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (app: SandboxApp) => {
    setEditingItem(app);
    setFormData({
      slug: app.slug,
      name: app.name,
      category: app.category,
      badge: app.badge,
      description: app.description,
      live_url: app.live_url,
      admin_url: app.admin_url || '',
      accent_color: app.accent_color,
      icon_name: app.icon_name,
      credentials_username: app.credentials_username || '',
      credentials_password: app.credentials_password || '',
      roles: Array.isArray(app.roles) ? app.roles.join(', ') : '',
      credentials_notes: app.credentials_notes || '',
      features: Array.isArray(app.features) ? app.features.join(', ') : '',
      display_order: app.display_order,
      is_active: app.is_active,
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roles: formData.roles ? formData.roles.split(',').map((s) => s.trim()).filter(Boolean) : [],
      features: formData.features ? formData.features.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };

    if (editingItem) {
      router.put(`/admin/sandbox/${editingItem.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => setEditingItem(null),
      });
    } else {
      router.post('/admin/sandbox', payload, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this sandbox app? Note: retain project #1 (ERP & Storefront).')) {
      router.delete(`/admin/sandbox/${id}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <AdminLayout title="Demo Sandbox CMS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-blue-500" /> Interactive Demo Sandbox CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure live demonstration environments, access credentials, and interactive simulators for prospective clients.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Sandbox Environment
          </button>
        </div>

        {/* Create / Edit Form Drawer */}
        {(isCreating || editingItem) && (
          <div className="bg-[#0c1017] border border-blue-500/30 rounded-2xl p-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                {editingItem ? `Edit Environment: ${editingItem.name}` : 'Register New Sandbox App'}
              </h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Application Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. LeadLayer Inbound Intelligence"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slug (Unique Key) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. leadlayer-crm"
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
                    placeholder="e.g. Growth & Marketing Operations"
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
                    placeholder="e.g. B2B Pipeline CRM"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Accent Theme</label>
                  <select
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="emerald">Emerald Green (Production)</option>
                    <option value="blue">Electric Blue (Cloud)</option>
                    <option value="cyan">Cyan (Telemetry)</option>
                    <option value="amber">Amber (Logistics)</option>
                    <option value="violet">Violet (Data & AI)</option>
                    <option value="rose">Rose (Security)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="Layers, Navigation, Truck, Database..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Public Live URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://leadlayer.agencyor.com"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Panel URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.admin_url}
                    onChange={(e) => setFormData({ ...formData, admin_url: e.target.value })}
                    placeholder="https://leadlayer.agencyor.com/admin"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Environment Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the architecture, target industry, and core functionality..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Demo Credentials Section */}
              <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Client Demo Access Credentials</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Demo Username / Email</label>
                    <input
                      type="text"
                      value={formData.credentials_username}
                      onChange={(e) => setFormData({ ...formData, credentials_username: e.target.value })}
                      placeholder="demo_client"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Demo Password</label>
                    <input
                      type="text"
                      value={formData.credentials_password}
                      onChange={(e) => setFormData({ ...formData, credentials_password: e.target.value })}
                      placeholder="DevCenterPoint2026!"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Available Roles (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.roles}
                      onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                      placeholder="Owner, Logistics Director, Driver"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">Credential Security Note</label>
                    <input
                      type="text"
                      value={formData.credentials_notes}
                      onChange={(e) => setFormData({ ...formData, credentials_notes: e.target.value })}
                      placeholder="Read-only sandbox resets hourly"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Key Architecture Features (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="WebSocket Streaming, Sub-10ms Queries, Role-Based Access"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
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
                  <span className="text-xs font-medium text-slate-300">Active & Visible in Modal</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30"
                >
                  {editingItem ? 'Update Sandbox App' : 'Register Environment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sandbox Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sandboxApps.map((app) => (
            <div
              key={app.id}
              className={`bg-[#0c1017] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                app.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    {app.badge}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(app)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {app.slug !== 'erp' && (
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{app.name}</h3>
                <div className="text-[11px] text-slate-400 mb-2">{app.category}</div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">{app.description}</p>

                {/* Credentials summary */}
                {app.credentials_username && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 font-mono text-[11px] text-slate-400">
                    <div>
                      User: <span className="text-blue-400">{app.credentials_username}</span>
                    </div>
                    <div>
                      Pass: <span className="text-emerald-400">{app.credentials_password}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <a
                  href={app.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Sandbox
                </a>
                <span className="text-[10px] font-mono text-slate-500">Order #{app.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
