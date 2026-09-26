import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import {
  Inbox,
  Users,
  Briefcase,
  Layers,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Props {
  stats: {
    totalInquiries: number;
    newInquiries: number;
    totalSubscribers: number;
    totalProjects: number;
    totalCapabilities: number;
  };
  recentInquiries: any[];
  recentSubscribers: any[];
}

export default function Dashboard({ stats, recentInquiries, recentSubscribers }: Props) {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-blue-900/20 via-blue-950/10 to-transparent p-6 rounded-2xl border border-blue-500/20">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> DevCenterPoint Studio CMS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">System Command Center</h1>
            <p className="text-sm text-slate-400 mt-1">
              Live operational overview of client inquiries, active subscriptions, and website CMS content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/inquiries"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              Review Leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalInquiries}</span>
              {stats.newInquiries > 0 && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {stats.newInquiries} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">Captured project scopes</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Subscribers</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalSubscribers}</span>
              <span className="text-xs text-slate-400 font-mono">Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Newsletter distribution list</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Case Studies</span>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalProjects}</span>
              <span className="text-xs text-emerald-400 font-mono">Live</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Published portfolio pieces</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Capabilities</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalCapabilities}</span>
              <span className="text-xs text-slate-400 font-mono">Services</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Active service offerings</p>
          </div>
        </div>

        {/* Dual Recent Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries (2 Columns) */}
          <div className="lg:col-span-2 bg-[#0c1017] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-blue-400" /> Recent Inquiries
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View all leads <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No inquiries received yet. Submissions from the public form will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold uppercase">
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Timeline</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 font-medium text-white">
                          <div>{inquiry.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{inquiry.email}</div>
                        </td>
                        <td className="py-3 text-slate-300 text-xs">{inquiry.budget_range}</td>
                        <td className="py-3 text-slate-300 text-xs">{inquiry.timeline}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                              inquiry.status === 'new'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : inquiry.status === 'reviewed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/inquiries?search=${inquiry.reference_number}`}
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Subscribers (1 Column) */}
          <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Subscribers
              </h2>
              <Link
                href="/admin/subscribers"
                className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                Export CSV <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentSubscribers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No newsletter subscribers yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {recentSubscribers.map((sub) => (
                  <li
                    key={sub.id}
                    className="p-3 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="text-xs text-slate-200 block truncate font-mono">{sub.email}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
