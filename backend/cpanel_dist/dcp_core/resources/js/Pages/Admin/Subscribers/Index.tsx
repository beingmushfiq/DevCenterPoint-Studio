import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Users, Download, Trash2, Search, CheckCircle, Clock } from 'lucide-react';

interface Subscriber {
  id: number;
  email: string;
  status: 'subscribed' | 'unsubscribed';
  created_at: string;
  unsubscribed_at: string | null;
}

interface Props {
  subscribers: {
    data: Subscriber[];
    links: any[];
    total: number;
  };
  filters: {
    search: string;
  };
}

export default function SubscribersIndex({ subscribers, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/subscribers', { search }, { preserveState: true });
  };

  const deleteSubscriber = (id: number) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      router.delete(`/admin/subscribers/${id}`, { preserveScroll: true });
    }
  };

  const handleExportCsv = () => {
    window.location.href = '/admin/subscribers/export';
  };

  return (
    <AdminLayout title="Subscribers">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" /> Newsletter Subscribers
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Active audience members subscribed to the studio engineering dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
            >
              <Download className="w-4 h-4" /> Export CSV List
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0c1017] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </form>
          <span className="text-xs text-slate-500 font-mono">{subscribers.total} total subscribers</span>
        </div>

        {/* Table */}
        <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden">
          {subscribers.data.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              No newsletter subscribers recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2 text-slate-400 text-xs font-semibold uppercase">
                    <th className="p-4">Subscriber Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Subscribed Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscribers.data.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 font-mono text-sm text-slate-200">{sub.email}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'subscribed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteSubscriber(sub.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove subscriber"
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
      </div>
    </AdminLayout>
  );
}
