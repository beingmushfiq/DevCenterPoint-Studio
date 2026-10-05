import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Wrench, Edit2, CheckCircle2, X } from 'lucide-react';

interface Capability {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon_name: string;
  features: string[];
  technologies: string[];
  architecture_points: string[] | null;
  code_snippet: string | null;
  display_order: number;
  is_active: boolean;
}

interface Props {
  capabilities: Capability[];
}

export default function CapabilitiesIndex({ capabilities }: Props) {
  const [editing, setEditing] = useState<Capability | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    icon_name: 'Code2',
    features: ['Feature 1', 'Feature 2'],
    technologies: ['React', 'Laravel'],
    architecture_points: [] as string[],
    code_snippet: '',
    display_order: 1,
    is_active: true,
  });

  const openEdit = (cap: Capability) => {
    setEditing(cap);
    setFormData({
      title: cap.title,
      tagline: cap.tagline,
      description: cap.description,
      icon_name: cap.icon_name,
      features: cap.features || [],
      technologies: cap.technologies || [],
      architecture_points: cap.architecture_points || [],
      code_snippet: cap.code_snippet || '',
      display_order: cap.display_order,
      is_active: cap.is_active,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    router.put(`/admin/capabilities/${editing.id}`, formData, {
      preserveScroll: true,
      onSuccess: () => setEditing(null),
    });
  };

  return (
    <AdminLayout title="Capabilities CMS">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-400" /> Capabilities & Services CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Curate service offerings, deliverables bullets, tech badges, and order of appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.id}
              className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold">Icon: {cap.icon_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      cap.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {cap.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{cap.title}</h3>
                <p className="text-xs font-medium text-slate-300 mt-1">{cap.tagline}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cap.description}</p>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Deliverables</span>
                  {cap.features?.map((f, i) => (
                    <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Order: {cap.display_order}</span>
                <button
                  onClick={() => openEdit(cap)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Capability
                </button>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e131d] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-base font-bold text-white">Edit Capability: {editing.title}</h2>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tagline</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Architectural Standards <span className="text-slate-500 font-normal">(one per line)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.architecture_points.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        architecture_points: e.target.value.split('\n').map((l) => l.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Code Snippet <span className="text-slate-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.code_snippet}
                    onChange={(e) => setFormData({ ...formData, code_snippet: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Icon Name (Lucide)</label>
                    <input
                      type="text"
                      required
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Display Order</label>
                    <input
                      type="number"
                      required
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded bg-black/40 border-white/10 text-emerald-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Active Service Offering</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/30"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
