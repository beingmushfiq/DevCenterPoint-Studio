import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Briefcase,
  Wrench,
  HelpCircle,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Quote,
  Terminal,
  UserCheck,
  CreditCard,
  Palette,
  Newspaper,
} from 'lucide-react';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
  const { auth, flash } = usePage<any>().props;
  const currentUrl = usePage().url;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Inquiries (CRM)', href: '/admin/inquiries', icon: Inbox },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'Projects CMS', href: '/admin/projects', icon: Briefcase },
    { name: 'Blog Posts', href: '/admin/posts', icon: Newspaper },
    { name: 'Capabilities', href: '/admin/capabilities', icon: Wrench },
    { name: 'Plans & Pricing', href: '/admin/plans', icon: CreditCard },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { name: 'Demo Sandbox', href: '/admin/sandbox', icon: Terminal },
    { name: 'Solution Studio', href: '/admin/solutions', icon: Layers },
    { name: 'Team Leadership', href: '/admin/team', icon: UserCheck },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Page Blocks', href: '/admin/sections', icon: Layers },
    { name: 'Appearance', href: '/admin/appearance', icon: Palette },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col md:flex-row antialiased font-sans relative overflow-hidden">
      <Head title={title ? `${title} | DevCenterPoint CMS` : 'DevCenterPoint CMS'}>
        {/* The whole admin surface is private; keep it out of every index. */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Ambient Blurred Atmosphere Behind Admin Panel */}
      <div className="fixed top-0 right-1/4 w-lg h-128 bg-blue-600/8 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/3 w-104 h-104 bg-purple-600/6 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#0a0e18]/90 border-b border-white/10 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            D
          </div>
          <span className="font-bold text-base tracking-tight text-white">DevCenterPoint CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/10 cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity cursor-pointer"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-2xl bg-[#090d16]/95 border-r border-white/10 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col justify-between shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Studio Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                D
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">Studio CMS</span>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-semibold">DevCenterPoint</span>
              </div>
            </Link>
          </div>

          {/* System Heartbeat & Telemetry Status Pill */}
          <div className="px-4 pt-4">
            <div className="px-3.5 py-2 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-medium">Cluster 7/7</span>
              </div>
              <span className="text-emerald-400 font-semibold tracking-tight">99.99% SLA</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentUrl.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-150 ${
                    isActive
                      ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-white/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> View Public Site
            </span>
          </a>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-white/15 flex items-center justify-center text-xs font-bold text-blue-400 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-200 block truncate max-w-27.5">
                  {auth?.user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Super Admin</span>
              </div>
            </div>

            <Link
              href="/logout"
              method="post"
              as="button"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        {/* Flash Message Banner */}
        {flash?.success && (
          <div className="backdrop-blur-md bg-emerald-500/15 border-b border-emerald-500/25 text-emerald-300 text-sm font-medium px-6 py-3 flex items-center justify-between shadow-sm">
            <span>{flash.success}</span>
          </div>
        )}

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
