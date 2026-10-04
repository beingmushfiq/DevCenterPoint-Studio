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
    { name: 'Capabilities', href: '/admin/capabilities', icon: Wrench },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Quote },
    { name: 'Demo Sandbox', href: '/admin/sandbox', icon: Terminal },
    { name: 'Team Leadership', href: '/admin/team', icon: UserCheck },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Page Blocks', href: '/admin/sections', icon: Layers },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row antialiased font-sans">
      <Head title={title ? `${title} | DevCenterPoint CMS` : 'DevCenterPoint Studio CMS'} />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0c1017] border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            D
          </div>
          <span className="font-bold text-base tracking-tight text-white">DevCenterPoint CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0e17] border-r border-white/10 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Studio Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/30">
                D
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block">Studio CMS</span>
                <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block">DevCenterPoint</span>
              </div>
            </Link>
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
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
            className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
          </a>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-blue-400">
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
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Flash Message Banner */}
        {flash?.success && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-sm font-medium px-6 py-3 flex items-center justify-between">
            <span>{flash.success}</span>
          </div>
        )}

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
