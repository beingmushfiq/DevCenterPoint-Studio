import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { UserCheck, Plus, Edit2, Trash2, X, Github, Linkedin, Twitter, Globe, User } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string | null;
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  display_order: number;
  is_active: boolean;
}

interface Props {
  team: TeamMember[];
}

export default function TeamIndex({ team }: Props) {
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar_url: '',
    github: '',
    linkedin: '',
    twitter: '',
    display_order: 1,
    is_active: true,
  });

  const openCreate = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      avatar_url: '',
      github: '',
      linkedin: '',
      twitter: '',
      display_order: team.length + 1,
      is_active: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingItem(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      avatar_url: member.avatar_url || '',
      github: member.social_links?.github || '',
      linkedin: member.social_links?.linkedin || '',
      twitter: member.social_links?.twitter || '',
      display_order: member.display_order,
      is_active: member.is_active,
    });
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio,
      avatar_url: formData.avatar_url || null,
      social_links: {
        github: formData.github || undefined,
        linkedin: formData.linkedin || undefined,
        twitter: formData.twitter || undefined,
      },
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      router.put(`/admin/team/${editingItem.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => setEditingItem(null),
      });
    } else {
      router.post('/admin/team', payload, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this team member record?')) {
      router.delete(`/admin/team/${id}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <AdminLayout title="Studio Leadership & Team">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-500" /> Studio Leadership & Core Team
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage executive profiles, specialized engineering leads, and bios displayed on the studio about page.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        </div>

        {/* Modal / Form Drawer */}
        {(isCreating || editingItem) && (
          <div className="bg-[#0c1017] border border-blue-500/30 rounded-2xl p-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                {editingItem ? `Edit Member: ${editingItem.name}` : 'Add New Team Member'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mushfiqur Rahman"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Studio Role & Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Founder & Principal Systems Architect"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Avatar / Headshot URL</label>
                <input
                  type="text"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /images/team/mushfiq.jpg"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Bio *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summarize expertise, years of architectural experience, and engineering domains..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Twitter / X Profile</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
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
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded bg-black/40 border-white/10 text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs font-medium text-slate-300">Active Profile</span>
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
                  {editingItem ? 'Update Profile' : 'Save Team Member'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member) => (
            <div
              key={member.id}
              className={`bg-[#0c1017] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                member.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-base">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-sm">{member.name}</h3>
                      <div className="text-xs text-blue-400 font-medium">{member.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(member)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">{member.bio}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {member.social_links?.github && (
                    <a href={member.social_links.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_links?.linkedin && (
                    <a href={member.social_links.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_links?.twitter && (
                    <a href={member.social_links.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <span className="font-mono text-[10px]">Order #{member.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
