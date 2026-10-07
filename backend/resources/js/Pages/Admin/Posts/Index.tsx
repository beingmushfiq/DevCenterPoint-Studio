import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Newspaper, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Post {
  id: number;
  slug: string;
  title: string;
  category: string;
  author_name: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  display_order: number;
  is_published: boolean;
}

interface Props {
  posts: Post[];
}

export default function PostsIndex({ posts }: Props) {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    author_name: 'DevCenterPoint Team',
    excerpt: '',
    body: '',
    cover_image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    tags: 'Laravel, React, Engineering',
    seo_title: '',
    seo_description: '',
    published_at: new Date().toISOString().slice(0, 10),
    display_order: 0,
    is_published: true,
  });

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      author_name: post.author_name,
      excerpt: post.excerpt,
      body: post.body,
      cover_image_url: post.cover_image_url || '',
      tags: (post.tags || []).join(', '),
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      published_at: post.published_at ? post.published_at.slice(0, 10) : '',
      display_order: post.display_order,
      is_published: post.is_published,
    });
  };

  const payload = () => ({
    ...formData,
    tags: formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      router.put(`/admin/posts/${editingPost.id}`, payload(), {
        preserveScroll: true,
        onSuccess: () => setEditingPost(null),
      });
    } else {
      router.post('/admin/posts', payload(), {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      router.delete(`/admin/posts/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title="Blog Posts">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-cyan-400" /> Blog Posts CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Write and publish articles that rank for search intent and give crawlers indexable pages.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingPost(null);
              setIsCreating(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Newspaper className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        post.is_published
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{post.category}</span>
                  <h3 className="text-base font-bold text-white mt-1">{post.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(post.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  {post.published_at ? post.published_at.slice(0, 10) : 'Unscheduled'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
        {(editingPost || isCreating) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0e131d] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-bold text-white">
                  {editingPost ? `Edit Post: ${editingPost.title}` : 'New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setEditingPost(null);
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Author</label>
                    <input
                      type="text"
                      required
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={formData.published_at}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Excerpt</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Body</label>
                  <textarea
                    rows={10}
                    required
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Plain text or Markdown. Rendered on the public article page.</p>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">SEO Description</label>
                  <textarea
                    rows={2}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
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
                      setEditingPost(null);
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
                    Save Post
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
