import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
  Inbox,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  Clock,
  Building,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Save,
} from 'lucide-react';

interface Inquiry {
  id: number;
  reference_number: string;
  name: string;
  email: string;
  company: string | null;
  project_types: string[];
  budget_range: string;
  timeline: string;
  details: string;
  status: 'new' | 'reviewed' | 'contacted' | 'closed';
  internal_notes: string | null;
  created_at: string;
}

interface Props {
  inquiries: {
    data: Inquiry[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    status: string;
    search: string;
  };
}

export default function InquiriesIndex({ inquiries, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/inquiries', { search, status: filters.status }, { preserveState: true });
  };

  const handleStatusFilter = (status: string) => {
    router.get('/admin/inquiries', { search, status }, { preserveState: true });
  };

  const updateStatus = (inquiryId: number, newStatus: string) => {
    router.patch(
      `/admin/inquiries/${inquiryId}`,
      { status: newStatus, internal_notes: internalNotes },
      {
        preserveScroll: true,
        onSuccess: () => {
          if (selectedInquiry && selectedInquiry.id === inquiryId) {
            setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
          }
        },
      }
    );
  };

  const saveNotes = (inquiryId: number) => {
    router.patch(
      `/admin/inquiries/${inquiryId}`,
      { status: selectedInquiry?.status, internal_notes: internalNotes },
      { preserveScroll: true }
    );
  };

  const deleteInquiry = (inquiryId: number) => {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      router.delete(`/admin/inquiries/${inquiryId}`, {
        preserveScroll: true,
        onSuccess: () => setSelectedInquiry(null),
      });
    }
  };

  return (
    <AdminLayout title="Inquiries (CRM)">
      <div className="space-y-6">
        {/* Header with Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Inbox className="w-6 h-6 text-blue-500" /> Inquiries & Lead CRM
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review, qualify, and manage client project submissions captured across the studio site.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, emails, refs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#0c1017] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'new', 'reviewed', 'contacted', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                filters.status === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#0c1017] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {status}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-auto font-mono">{inquiries.total} leads found</span>
        </div>

        {/* Inquiries Table & Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`${selectedInquiry ? 'lg:col-span-2' : 'lg:col-span-3'} bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden`}>
            {inquiries.data.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                No inquiries match your selected filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2 text-slate-400 text-xs font-semibold uppercase">
                      <th className="p-4">Reference</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Budget / Timeline</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.data.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedInquiry(item);
                          setInternalNotes(item.internal_notes || '');
                        }}
                        className={`cursor-pointer transition-colors ${
                          selectedInquiry?.id === item.id ? 'bg-blue-600/10' : 'hover:bg-white/2'
                        }`}
                      >
                        <td className="p-4 font-mono text-xs text-blue-400 font-semibold">{item.reference_number}</td>
                        <td className="p-4">
                          <div className="font-semibold text-white text-sm">{item.name}</div>
                          <div className="text-xs text-slate-400">{item.email}</div>
                          {item.company && <div className="text-[11px] text-slate-500">{item.company}</div>}
                        </td>
                        <td className="p-4 text-xs">
                          <div className="text-slate-200 font-medium">{item.budget_range}</div>
                          <div className="text-slate-400">{item.timeline}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'new'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : item.status === 'reviewed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : item.status === 'contacted'
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteInquiry(item.id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Inquiry Detail Panel */}
          {selectedInquiry && (
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-xs text-blue-400 font-bold block">{selectedInquiry.reference_number}</span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedInquiry.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Contact Meta */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 hover:underline font-mono">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.company && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span>{selectedInquiry.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-300">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span>Budget: {selectedInquiry.budget_range}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Timeline: {selectedInquiry.timeline}</span>
                </div>
              </div>

              {/* Project Scope / Description */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Project Requirements
                </label>
                <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedInquiry.details}
                </div>
              </div>

              {/* Status Update Pipeline */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Pipeline Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['new', 'reviewed', 'contacted', 'closed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedInquiry.id, s)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                        selectedInquiry.status === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Internal Studio Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add private notes on client communication..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => saveNotes(selectedInquiry.id)}
                  className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Internal Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
