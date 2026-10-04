import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Quote, Plus, Edit2, Trash2, X, CheckCircle, Building, User, Award, ExternalLink } from 'lucide-react';

interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  company_name: string;
  company_logo_url?: string | null;
  avatar_url?: string | null;
  quote: string;
  project_reference?: string | null;
  metric_highlight?: string | null;
  display_order: number;
  is_published: boolean;
}

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialsIndex({ testimonials }: Props) {
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    company_name: '',
    company_logo_url: '',
    avatar_url: '',
    quote: '',
    project_reference: '',
    metric_highlight: '',
    display_order: 1,
    is_published: true,
  });

  const openCreate = () => {
    setFormData({
      client_name: '',
      client_role: '',
      company_name: '',
      company_logo_url: '',
      avatar_url: '',
      quote: '',
      project_reference: '',
      metric_highlight: '',
      display_order: testimonials.length + 1,
      is_published: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      client_role: item.client_role,
      company_name: item.company_name,
      company_logo_url: item.company_logo_url || '',
      avatar_url: item.avatar_url || '',
      quote: item.quote,
      project_reference: item.project_reference || '',
      metric_highlight: item.metric_highlight || '',
      display_order: item.display_order,
      is_published: item.is_published,
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      router.put(`/admin/testimonials/${editingItem.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => setEditingItem(null),
      });
    } else {
      router.post('/admin/testimonials', formData, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this client testimonial?')) {
      router.delete(`/admin/testimonials/${id}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <AdminLayout title="Testimonials & Social Proof">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Quote className="w-6 h-6 text-blue-500" /> Client Testimonials & Social Proof
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage executive testimonials, verified ROI metrics, and enterprise logos showcased on the portfolio.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        {/* Modal / Form drawer */}
        {(isCreating || editingItem) && (
          <div className="bg-[#0c1017] border border-blue-500/30 rounded-2xl p-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Quote className="w-4 h-4 text-blue-400" />
                {editingItem ? 'Edit Client Testimonial' : 'Add New Client Testimonial'}
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
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. David Vance"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Client Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.client_role}
                    onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                    placeholder="e.g. Chief Operating Officer"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Enterprise *</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. Apex Omnichannel Commerce"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Project Reference</label>
                  <input
                    type="text"
                    value={formData.project_reference}
                    onChange={(e) => setFormData({ ...formData, project_reference: e.target.value })}
                    placeholder="e.g. Multi-Tenant ERP & Storefront"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">ROI / Metric Highlight</label>
                  <input
                    type="text"
                    value={formData.metric_highlight}
                    onChange={(e) => setFormData({ ...formData, metric_highlight: e.target.value })}
                    placeholder="e.g. 4.2x Faster Fulfillment"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Client Avatar URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company Logo URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.company_logo_url}
                    onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
                    placeholder="https://.../logo.svg"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Executive Endorsement / Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Detail the transformation, architectural reliability, or delivery milestone achieved..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="w-32">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Display Order</label>
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
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded bg-black/40 border-white/10 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-300">Published on site</span>
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
                  {editingItem ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0c1017] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                item.is_published ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt={item.client_name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm">
                        {item.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-sm">{item.client_name}</h3>
                      <div className="text-xs text-slate-400">
                        {item.client_role} · <span className="text-blue-400 font-medium">{item.company_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
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

                <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-4 bg-black/20 p-3 rounded-xl border border-white/5">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                {item.metric_highlight ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.metric_highlight}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">Order #{item.display_order}</span>
                )}
                {item.project_reference && (
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{item.project_reference}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
