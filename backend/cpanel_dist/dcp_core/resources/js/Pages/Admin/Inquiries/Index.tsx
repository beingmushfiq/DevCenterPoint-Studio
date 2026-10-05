import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import CreateLeadModal from './CreateLeadModal';
import {
  Inbox,
  Search,
  Plus,
  Download,
  Trash2,
  Building,
  Mail,
  Calendar,
  DollarSign,
  Phone,
  Tag,
  Save,
  Kanban,
  Table as TableIcon,
  Flag,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface Inquiry {
  id: number;
  reference_number: string;
  name: string;
  email: string;
  phone?: string | null;
  company: string | null;
  project_types: string[];
  budget_range: string;
  timeline: string;
  details: string;
  status: 'new' | 'reviewed' | 'contacted' | 'qualified' | 'proposal_sent' | 'closed_won' | 'closed_lost' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  lead_source?: string | null;
  estimated_value?: number | null;
  target_close_date?: string | null;
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
    status?: string;
    search?: string;
    priority?: string;
  };
}

const PIPELINE_STATUSES = [
  { key: 'new', label: 'New Lead', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
  { key: 'reviewed', label: 'Reviewed', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { key: 'contacted', label: 'Contacted', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
  { key: 'qualified', label: 'Qualified', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' },
  { key: 'closed_won', label: 'Closed (Won)', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
  { key: 'closed_lost', label: 'Closed (Lost)', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
];

export default function InquiriesIndex({ inquiries, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/inquiries', { search, status: filters.status, priority: filters.priority }, { preserveState: true });
  };

  const handleStatusFilter = (status: string) => {
    router.get('/admin/inquiries', { search, status: status === 'all' ? '' : status, priority: filters.priority }, { preserveState: true });
  };

  const handlePriorityFilter = (priority: string) => {
    router.get('/admin/inquiries', { search, status: filters.status, priority: priority === 'all' ? '' : priority }, { preserveState: true });
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

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20">Low</span>;
    }
  };

  return (
    <AdminLayout title="Inquiries (CRM)">
      <div className="space-y-6">
        {/* Header with Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Inbox className="w-6 h-6 text-blue-500" /> Enterprise Lead CRM & Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review, qualify, log new opportunities, and manage deals across all studio engagement channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="bg-[#0c1017] border border-white/10 rounded-xl p-1 flex items-center">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Pipeline Kanban"
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
            </div>

            {/* CSV Export */}
            <a
              href="/admin/inquiries/export"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </a>

            {/* Add Lead Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0c1017] border border-white/10 p-3 rounded-2xl">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, email, company, reference ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {['all', 'new', 'reviewed', 'contacted', 'qualified', 'proposal_sent', 'closed_won'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  (filters.status === s || (!filters.status && s === 'all'))
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {s.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Pipeline View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 overflow-x-auto pb-4">
            {PIPELINE_STATUSES.map((col) => {
              const columnLeads = inquiries.data.filter((item) => {
                if (col.key === 'closed_won' && item.status === 'closed') return true;
                return item.status === col.key;
              });

              return (
                <div key={col.key} className="bg-[#0c1017] border border-white/10 rounded-2xl p-3 flex flex-col min-w-60">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-slate-200">{col.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-slate-400">
                      {columnLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 mt-3 flex-1 overflow-y-auto max-h-150">
                    {columnLeads.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-600 italic">No leads in stage</div>
                    ) : (
                      columnLeads.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedInquiry(item);
                            setInternalNotes(item.internal_notes || '');
                          }}
                          className={`p-3 bg-black/40 border rounded-xl cursor-pointer hover:border-blue-500/50 transition-all ${
                            selectedInquiry?.id === item.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono text-[10px] text-blue-400 font-bold">{item.reference_number}</span>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <div className="font-semibold text-white text-xs">{item.name}</div>
                          {item.company && <div className="text-[11px] text-slate-400 truncate">{item.company}</div>}

                          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                            <span>{item.budget_range}</span>
                            {item.estimated_value && (
                              <span className="text-emerald-400 font-mono font-bold">${item.estimated_value.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table & Drawer View */}
        {viewMode === 'table' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${selectedInquiry ? 'lg:col-span-2' : 'lg:col-span-3'} bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden`}>
              {inquiries.data.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No leads found. Use the "+ Add Lead" button above to log one manually.
                </div>
              ) : (
                <div>
                  {/* Mobile Touch Cards (< sm) */}
                  <div className="sm:hidden p-3 space-y-3">
                    {inquiries.data.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedInquiry(item);
                          setInternalNotes(item.internal_notes || '');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedInquiry?.id === item.id ? 'bg-blue-600/15 border-blue-500' : 'bg-black/40 border-white/8 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{item.reference_number}</span>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                              item.status === 'new'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : item.status === 'reviewed'
                                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                : item.status === 'contacted'
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                : item.status === 'closed_won' || item.status === 'closed'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="font-semibold text-white text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.email}</div>
                        {item.company && <div className="text-xs text-slate-500 mt-0.5">{item.company}</div>}

                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-mono">{item.budget_range}</span>
                          <span className="text-blue-400 font-semibold inline-flex items-center gap-1">
                            Inspect Details &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tablet & Desktop Dense Table (>= sm) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/2 text-slate-400 text-xs font-semibold uppercase">
                          <th className="p-4">Reference</th>
                          <th className="p-4">Lead Contact</th>
                          <th className="p-4">Priority / Source</th>
                          <th className="p-4">Budget / Value</th>
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
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 mb-1">{getPriorityBadge(item.priority)}</div>
                              <div className="text-[11px] text-slate-400">{item.lead_source || 'Website Form'}</div>
                            </td>
                            <td className="p-4 text-xs">
                              <div className="text-slate-200 font-medium">{item.budget_range}</div>
                              {item.estimated_value ? (
                                <div className="text-emerald-400 font-mono font-semibold">${item.estimated_value.toLocaleString()}</div>
                              ) : (
                                <div className="text-slate-500">{item.timeline}</div>
                              )}
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
                                    : item.status === 'qualified'
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : item.status === 'proposal_sent'
                                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                    : item.status === 'closed_won' || item.status === 'closed'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {item.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteInquiry(item.id);
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${selectedInquiry.phone}`} className="text-slate-300 hover:text-white font-mono">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.company && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building className="w-4 h-4 text-slate-500" />
                      <span>{selectedInquiry.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-300">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    <span>
                      Budget: {selectedInquiry.budget_range}
                      {selectedInquiry.estimated_value && ` (Est: $${selectedInquiry.estimated_value.toLocaleString()})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Timeline: {selectedInquiry.timeline}</span>
                  </div>
                  {selectedInquiry.lead_source && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Tag className="w-4 h-4 text-slate-500" />
                      <span>Source: {selectedInquiry.lead_source}</span>
                    </div>
                  )}
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
                    Advance Pipeline Stage
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PIPELINE_STATUSES.map((st) => (
                      <button
                        key={st.key}
                        onClick={() => updateStatus(selectedInquiry.id, st.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider transition-all border ${
                          selectedInquiry.status === st.key
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st.label}
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
        )}
      </div>

      {/* Manual Create Lead Modal */}
      <CreateLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </AdminLayout>
  );
}

