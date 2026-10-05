import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Briefcase, Plus, Edit2, Trash2, CheckCircle2, Eye, X } from 'lucide-react';

interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string | null;
  category: string;
  client: string | null;
  year: string;
  duration: string | null;
  overview: string;
  problem: string;
  solution: string;
  metrics: { label: string; value: string }[] | null;
  tech_stack: string[];
  thumbnail_url: string;
  hero_image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
}

interface Props {
  projects: Project[];
}

export default function ProjectsIndex({ projects }: Props) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'Business Systems',
    client: '',
    year: '2025',
    duration: '12 Weeks',
    overview: '',
    problem: '',
    solution: '',
    metrics: [{ label: 'Performance', value: '+50%' }],
    tech_stack: ['React', 'Laravel', 'PostgreSQL'],
    thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    hero_image_url: '',
    live_url: '',
    github_url: '',
    is_featured: false,
    display_order: 1,
    is_published: true,
  });

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      tagline: proj.tagline || '',
      category: proj.category,
      client: proj.client || '',
      year: proj.year,
      duration: proj.duration || '',
      overview: proj.overview,
      problem: proj.problem,
      solution: proj.solution,
      metrics: proj.metrics || [],
      tech_stack: proj.tech_stack || [],
      thumbnail_url: proj.thumbnail_url,
      hero_image_url: proj.hero_image_url || '',
      live_url: proj.live_url || '',
      github_url: proj.github_url || '',
      is_featured: proj.is_featured,
      display_order: proj.display_order,
      is_published: proj.is_published,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      router.put(`/admin/projects/${editingProject.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => setEditingProject(null),
      });
    } else {
      router.post('/admin/projects', formData, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      router.delete(`/admin/projects/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title="Projects CMS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-cyan-400" /> Case Studies & Portfolio CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create, curate, and update interactive case studies showcased on the public archive.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setIsCreating(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Case Study
          </button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  <img
                    src={proj.thumbnail_url}
                    alt={proj.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {proj.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        proj.is_published
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {proj.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{proj.category}</span>
                  <h3 className="text-base font-bold text-white mt-1">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{proj.overview}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tech_stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Order: {proj.display_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Modal */}
        {(editingProject || isCreating) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0e131d] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white">
                  {editingProject ? `Edit Case Study: ${editingProject.title}` : 'Add New Case Study'}
                </h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreating(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Client</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Overview</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Problem Statement</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Engineering Solution</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded bg-black/40 border-white/10 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Feature on Homepage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="rounded bg-black/40 border-white/10 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300">Published Live</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30"
                  >
                    Save Case Study
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
