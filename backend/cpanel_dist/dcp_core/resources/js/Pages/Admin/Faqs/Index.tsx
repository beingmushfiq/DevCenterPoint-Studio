import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { HelpCircle, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Faq {
  id: number;
  category: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
}

interface Props {
  faqs: Faq[];
}

export default function FaqsIndex({ faqs }: Props) {
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [formData, setFormData] = useState({
    category: 'Engineering & Process',
    question: '',
    answer: '',
    display_order: 1,
    is_published: true,
  });

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs =
    selectedCategory === 'All' ? faqs : faqs.filter((f) => f.category === selectedCategory);

  const openEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_published: faq.is_published,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      router.put(`/admin/faqs/${editingFaq.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => setEditingFaq(null),
      });
    } else {
      router.post('/admin/faqs', formData, {
        preserveScroll: true,
        onSuccess: () => setIsCreating(false),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      router.delete(`/admin/faqs/${id}`, { preserveScroll: true });
    }
  };

  return (
    <AdminLayout title="FAQs CMS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" /> Frequently Asked Questions CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Curate technical process explanations, commercial terms, and SLA details.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingFaq(null);
              setIsCreating(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#0c1017] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#0c1017] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-amber-400 border border-white/5">
                      {faq.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Order: {faq.display_order}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(faq)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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
        {(editingFaq || isCreating) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e131d] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-base font-bold text-white">
                  {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
                </h2>
                <button
                  onClick={() => {
                    setEditingFaq(null);
                    setIsCreating(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Answer</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Display Order</label>
                    <input
                      type="number"
                      required
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                      className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                        className="rounded bg-black/40 border-white/10 text-amber-600 focus:ring-0"
                      />
                      <span className="text-slate-300">Published Live</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaq(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-600/30"
                  >
                    Save FAQ
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
