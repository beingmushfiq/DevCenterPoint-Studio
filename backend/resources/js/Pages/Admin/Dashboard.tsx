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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl bg-linear-to-r from-blue-950/35 via-indigo-950/20 to-[#0c1222]/80 p-6 sm:p-8 rounded-3xl border border-blue-500/25 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" /> DevCenterPoint Studio CMS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE CLUSTER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">System Command Center</h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-xl">
              Live operational overview of client inquiries, active subscriptions, and website CMS content.
            </p>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <Link
              href="/admin/inquiries"
              className="px-5 py-2.5 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 border border-white/20"
            >
              Review Leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-blue-500/30 to-transparent absolute top-0 left-0" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Leads</span>
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 group-hover:scale-110 transition-transform">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalInquiries}</span>
              {stats.newInquiries > 0 && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                  {stats.newInquiries} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">Captured project scopes</p>
          </div>

          <div className="p-5 rounded-2xl backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all group relative overflow-hidden">
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-purple-500/30 to-transparent absolute top-0 left-0" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Subscribers</span>
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalSubscribers}</span>
              <span className="text-xs text-slate-400 font-mono">Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">Newsletter audience</p>
          </div>

          <div className="p-5 rounded-2xl backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all group relative overflow-hidden">
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-cyan-500/30 to-transparent absolute top-0 left-0" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Case Studies</span>
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalProjects}</span>
              <span className="text-xs text-emerald-400 font-mono">Live</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">Published client works</p>
          </div>

          <div className="p-5 rounded-2xl backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-emerald-500/30 to-transparent absolute top-0 left-0" />
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Capabilities</span>
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">{stats.totalCapabilities}</span>
              <span className="text-xs text-slate-400 font-mono">Services</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">Engineering disciplines</p>
          </div>
        </div>

        {/* Dual Recent Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Inquiries (2 Columns) */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-blue-400" /> Recent Inquiries
              </h2>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View all leads <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No inquiries received yet. Submissions from the public form will appear here.
              </div>
            ) : (
              <div>
                {/* Mobile Touch Cards (< sm) */}
                <div className="sm:hidden space-y-3">
                  {recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="p-3.5 rounded-xl bg-white/3 border border-white/8 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-sm">{inquiry.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inquiry.email}</div>
                        </div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                            inquiry.status === 'new'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : inquiry.status === 'reviewed'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {inquiry.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/5 font-mono">
                        <span>{inquiry.budget_range} • {inquiry.timeline}</span>
                        <Link
                          href={`/admin/inquiries?search=${inquiry.reference_number}`}
                          className="text-blue-400 hover:text-blue-300 font-semibold text-xs inline-flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop & Tablet Dense Table (>= sm) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold uppercase font-mono">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Budget</th>
                        <th className="pb-3">Timeline</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentInquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-white/3 transition-colors">
                          <td className="py-3 font-medium text-white">
                            <div className="font-semibold text-slate-100">{inquiry.name}</div>
                            <div className="text-xs text-slate-400 font-mono">{inquiry.email}</div>
                          </td>
                          <td className="py-3 text-slate-300 text-xs font-mono">{inquiry.budget_range}</td>
                          <td className="py-3 text-slate-300 text-xs font-mono">{inquiry.timeline}</td>
                          <td className="py-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                                inquiry.status === 'new'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : inquiry.status === 'reviewed'
                                  ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
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
              </div>
            )}
          </div>

          {/* Recent Subscribers (1 Column) */}
          <div className="backdrop-blur-xl bg-[#0c1222]/80 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" /> Subscribers
              </h2>
              <Link
                href="/admin/subscribers"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
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
                    className="p-3 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 flex items-center justify-between transition-colors"
                  >
                    <div className="truncate pr-2">
                      <span className="text-xs text-slate-200 block truncate font-mono">{sub.email}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
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
