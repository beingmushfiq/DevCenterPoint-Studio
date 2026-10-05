import React, { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import {
  Palette,
  LayoutTemplate,
  Code2,
  Calendar,
  Save,
  Eye,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  PanelBottom,
  PanelTop,
} from 'lucide-react';

type OverrideMode = 'off' | 'preview' | 'live';

interface OverrideState {
  html: string;
  css: string;
  js: string;
  mode: OverrideMode;
}

interface NavLink {
  label: string;
  href: string;
  note?: string;
}

interface FooterColumn {
  title: string;
  links: NavLink[];
}

interface EcosystemLink extends NavLink {
  accent?: string;
}

interface Props {
  settings: Record<string, string>;
  overrides: Record<string, OverrideState>;
  headerTemplates: string[];
  footerTemplates: string[];
}

const HEADER_TEMPLATE_META: Record<string, { name: string; desc: string }> = {
  'glass-pill': {
    name: 'Glass Pill',
    desc: 'Floating frosted pill navigation. Signature look of the current site.',
  },
  'solid-bar': {
    name: 'Solid Bar',
    desc: 'Opaque full-width bar with underline active states. High readability.',
  },
  'mega-menu': {
    name: 'Mega Menu',
    desc: 'Transparent bar that frosts on scroll, with hover dropdown panels.',
  },
};

const FOOTER_TEMPLATE_META: Record<string, { name: string; desc: string }> = {
  'four-column': {
    name: 'Four Column',
    desc: 'Brand block plus sitemap columns and ecosystem links.',
  },
  'compact-row': {
    name: 'Compact Row',
    desc: 'Single condensed row of links with inline social icons.',
  },
  'mega-sitemap': {
    name: 'Mega Sitemap',
    desc: 'Large sitemap grid with booking CTA and newsletter band.',
  },
};

const EMPTY_OVERRIDE: OverrideState = { html: '', css: '', js: '', mode: 'off' };

function parseList<T>(raw: string | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function buildPreviewDoc(code: OverrideState): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; }
  *, *::before, *::after { box-sizing: border-box; }
  ${code.css}
</style>
</head>
<body>
${code.html}
<script>${code.js}<\/script>
</body>
</html>`;
}

const OverrideEditor: React.FC<{ region: 'header' | 'footer'; initial: OverrideState }> = ({
  region,
  initial,
}) => {
  const [code, setCode] = useState<OverrideState>(initial ?? EMPTY_OVERRIDE);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [showPreview, setShowPreview] = useState<boolean>(initial?.mode !== 'off');
  const [savingMode, setSavingMode] = useState<OverrideMode | null>(null);

  const srcDoc = useMemo(() => buildPreviewDoc(code), [code]);
  const isLive = code.mode === 'live';

  const save = (mode: OverrideMode) => {
    const next: OverrideState = { ...code, mode };
    setSavingMode(mode);
    router.post(
      '/admin/appearance/override',
      { region, ...next },
      {
        preserveScroll: true,
        onSuccess: () => setCode(next),
        onFinish: () => setSavingMode(null),
      }
    );
  };

  return (
    <div className="bg-[#0c1017] border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-white/2">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Raw HTML / CSS / JS override</h3>
            <p className="text-[11px] text-slate-500">
              Replaces the {region} preset when published. Runs sandboxed.
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
            isLive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : 'bg-slate-500/10 text-slate-400 border-white/10'
          }`}
        >
          {isLive ? 'Live' : code.mode}
        </span>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {(['html', 'css', 'js'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeTab === t
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="ml-auto px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> {showPreview ? 'Hide' : 'Preview'}
          </button>
        </div>

        <textarea
          value={code[activeTab]}
          onChange={(e) => setCode((prev) => ({ ...prev, [activeTab]: e.target.value }))}
          rows={10}
          spellCheck={false}
          placeholder={
            activeTab === 'html'
              ? '<nav class="my-header">...</nav>'
              : activeTab === 'css'
                ? '.my-header { display: flex; }'
                : '// optional enhancement script'
          }
          className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500 resize-y"
        />

        {showPreview && (
          <div className="rounded-xl border border-white/10 overflow-hidden bg-white">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-black/60 border-b border-white/10">
              Preview (sandboxed)
            </div>
            <iframe
              title={`${region} override preview`}
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-popups"
              className="w-full border-0 block"
              style={{ height: 260 }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            disabled={savingMode !== null}
            onClick={() => save('off')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50"
          >
            Save (off)
          </button>
          <button
            disabled={savingMode !== null}
            onClick={() => save('preview')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 disabled:opacity-50"
          >
            Save as preview
          </button>
          <button
            disabled={savingMode !== null}
            onClick={() => save('live')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-white/10 shadow-lg shadow-emerald-600/25 disabled:opacity-50 flex items-center gap-1.5"
          >
            {savingMode === 'live' ? (
              'Publishing…'
            ) : (
              <>
                <Check className="w-3.5 h-3.5" /> Publish live
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AppearanceIndex({ settings, overrides, headerTemplates, footerTemplates }: Props) {
  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'booking'>('header');
  const [isSaving, setIsSaving] = useState(false);

  const [headerTemplate, setHeaderTemplate] = useState<string>(settings.header_template || 'glass-pill');
  const [footerTemplate, setFooterTemplate] = useState<string>(settings.footer_template || 'four-column');

  const [navLinks, setNavLinks] = useState<NavLink[]>(
    parseList<NavLink>(settings.header_nav_links, [])
  );
  const [drawerLinks, setDrawerLinks] = useState<NavLink[]>(
    parseList<NavLink>(settings.header_drawer_links, [])
  );
  const [columns, setColumns] = useState<FooterColumn[]>(
    parseList<FooterColumn>(settings.footer_columns, [])
  );
  const [ecosystem, setEcosystem] = useState<EcosystemLink[]>(
    parseList<EcosystemLink>(settings.footer_ecosystem_links, [])
  );

  const [footerBio, setFooterBio] = useState<string>(settings.footer_bio || '');
  const [footerStatus, setFooterStatus] = useState<string>(settings.footer_status_label || '');
  const [footerTagline, setFooterTagline] = useState<string>(settings.footer_tagline || '');
  const [footerCopyright, setFooterCopyright] = useState<string>(settings.footer_copyright_text || '');

  const [bookingUrl, setBookingUrl] = useState<string>(
    settings.booking_url || 'https://cal.com/devcenterpoint'
  );
  const [bookingLabel, setBookingLabel] = useState<string>(settings.booking_cta_label || 'Book a Meeting');
  const [bookingInHeader, setBookingInHeader] = useState<boolean>(settings.booking_in_header !== 'false');
  const [bookingInFooter, setBookingInFooter] = useState<boolean>(settings.booking_in_footer !== 'false');

  const cleanLinks = (links: NavLink[]): NavLink[] =>
    links
      .filter((l) => l.label?.trim() && l.href?.trim())
      .map((l) => ({ label: l.label.trim(), href: l.href.trim(), ...(l.note?.trim() ? { note: l.note.trim() } : {}) }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      header_template: headerTemplate,
      footer_template: footerTemplate,
      booking_url: bookingUrl.trim(),
      booking_cta_label: bookingLabel.trim(),
      booking_in_header: bookingInHeader ? 'true' : 'false',
      booking_in_footer: bookingInFooter ? 'true' : 'false',
      header_nav_links: cleanLinks(navLinks),
      header_drawer_links: cleanLinks(drawerLinks),
      footer_columns: columns
        .filter((c) => c.title?.trim())
        .map((c) => ({ title: c.title.trim(), links: cleanLinks(c.links) })),
      footer_ecosystem_links: ecosystem
        .filter((l) => l.label?.trim() && l.href?.trim())
        .map((l) => ({
          label: l.label.trim(),
          href: l.href.trim(),
          ...(l.note?.trim() ? { note: l.note.trim() } : {}),
          ...(l.accent ? { accent: l.accent } : {}),
        })),
      footer_bio: footerBio,
      footer_status_label: footerStatus,
      footer_tagline: footerTagline,
      footer_copyright_text: footerCopyright,
    };

    router.post('/admin/appearance', payload as unknown as Record<string, string>, {
      preserveScroll: true,
      onFinish: () => setIsSaving(false),
    });
  };

  const tabs = [
    { id: 'header' as const, label: 'Header', icon: PanelTop },
    { id: 'footer' as const, label: 'Footer', icon: PanelBottom },
    { id: 'booking' as const, label: 'Book a Meeting', icon: Calendar },
  ];

  const renderLinkRepeater = (
    links: NavLink[],
    onChange: (links: NavLink[]) => void,
    withNote = false
  ) => (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={link.label}
            onChange={(e) =>
              onChange(links.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)))
            }
            placeholder="Label"
            className="flex-1 min-w-0 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <input
            value={link.href}
            onChange={(e) =>
              onChange(links.map((l, i) => (i === index ? { ...l, href: e.target.value } : l)))
            }
            placeholder="#work or https://…"
            className="flex-1 min-w-0 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
          />
          {withNote && (
            <input
              value={link.note || ''}
              onChange={(e) =>
                onChange(links.map((l, i) => (i === index ? { ...l, note: e.target.value } : l)))
              }
              placeholder="Note"
              className="flex-1 min-w-0 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-400 focus:outline-none focus:border-blue-500"
            />
          )}
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...links, { label: '', href: '' }])}
        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add link
      </button>
    </div>
  );

  return (
    <AdminLayout title="Header & Footer Appearance">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-400" /> Header &amp; Footer Appearance
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Choose design templates, edit structured content, or drop in custom HTML / CSS / JS.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === t.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-[#0c1017] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'header' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Header template</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {headerTemplates.map((key) => {
                  const meta = HEADER_TEMPLATE_META[key] || { name: key, desc: '' };
                  const selected = headerTemplate === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setHeaderTemplate(key)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-600/10'
                          : 'border-white/10 bg-white/2 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{meta.name}</span>
                        {selected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{meta.desc}</p>
                      <span className="mt-3 block text-[10px] font-mono text-slate-500">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Primary navigation</h3>
              <p className="text-[11px] text-slate-500 -mt-2">
                Use <code className="text-blue-400">#anchors</code> for on-page sections or full URLs.
              </p>
              {renderLinkRepeater(navLinks, setNavLinks)}
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Mobile drawer links</h3>
              <p className="text-[11px] text-slate-500 -mt-2">
                Shown in the expanded mobile menu, with an optional descriptive note.
              </p>
              {renderLinkRepeater(drawerLinks, setDrawerLinks, true)}
            </div>

            <OverrideEditor region="header" initial={overrides.header_override} />
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Footer template</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {footerTemplates.map((key) => {
                  const meta = FOOTER_TEMPLATE_META[key] || { name: key, desc: '' };
                  const selected = footerTemplate === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setFooterTemplate(key)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-600/10'
                          : 'border-white/10 bg-white/2 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white">{meta.name}</span>
                        {selected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{meta.desc}</p>
                      <span className="mt-3 block text-[10px] font-mono text-slate-500">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Brand copy</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={footerBio}
                    onChange={(e) => setFooterBio(e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status label</label>
                    <input
                      value={footerStatus}
                      onChange={(e) => setFooterStatus(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tagline</label>
                    <input
                      value={footerTagline}
                      onChange={(e) => setFooterTagline(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Copyright</label>
                    <input
                      value={footerCopyright}
                      onChange={(e) => setFooterCopyright(e.target.value)}
                      placeholder="Leave blank for automatic year"
                      className="mt-1.5 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Sitemap columns</h3>
              <div className="space-y-4">
                {columns.map((column, colIndex) => (
                  <div key={colIndex} className="p-4 rounded-xl border border-white/10 bg-white/2 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={column.title}
                        onChange={(e) =>
                          setColumns((prev) =>
                            prev.map((c, i) => (i === colIndex ? { ...c, title: e.target.value } : c))
                          )
                        }
                        placeholder="Column title"
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setColumns((prev) => prev.filter((_, i) => i !== colIndex))}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {renderLinkRepeater(column.links, (links) =>
                      setColumns((prev) =>
                        prev.map((c, i) => (i === colIndex ? { ...c, links } : c))
                      )
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setColumns((prev) => [...prev, { title: '', links: [] }])}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add column
                </button>
              </div>
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Ecosystem links</h3>
              <p className="text-[11px] text-slate-500 -mt-2">
                External studio products shown in the footer. Accent accepts emerald / blue.
              </p>
              <div className="space-y-2">
                {ecosystem.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={link.label}
                      onChange={(e) =>
                        setEcosystem((prev) =>
                          prev.map((l, i) => (i === index ? { ...l, label: e.target.value } : l))
                        )
                      }
                      placeholder="Label"
                      className="flex-1 min-w-0 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      value={link.href}
                      onChange={(e) =>
                        setEcosystem((prev) =>
                          prev.map((l, i) => (i === index ? { ...l, href: e.target.value } : l))
                        )
                      }
                      placeholder="https://…"
                      className="flex-1 min-w-0 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={link.accent || ''}
                      onChange={(e) =>
                        setEcosystem((prev) =>
                          prev.map((l, i) => (i === index ? { ...l, accent: e.target.value } : l))
                        )
                      }
                      className="px-2 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">default</option>
                      <option value="emerald">emerald</option>
                      <option value="blue">blue</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setEcosystem((prev) => prev.filter((_, i) => i !== index))}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEcosystem((prev) => [...prev, { label: '', href: '' }])}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add ecosystem link
                </button>
              </div>
            </div>

            <OverrideEditor region="footer" initial={overrides.footer_override} />
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="space-y-6">
            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Book a Meeting CTA</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Booking URL
                  </label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      value={bookingUrl}
                      onChange={(e) => setBookingUrl(e.target.value)}
                      placeholder="https://cal.com/devcenterpoint"
                      className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
                      title="Open booking page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Button label
                  </label>
                  <input
                    value={bookingLabel}
                    onChange={(e) => setBookingLabel(e.target.value)}
                    placeholder="Book a Meeting"
                    className="mt-1.5 w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Placements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-white/2 cursor-pointer hover:border-white/20">
                  <span>
                    <span className="text-xs font-bold text-white block">Header navigation</span>
                    <span className="text-[11px] text-slate-500">Desktop header + mobile drawer</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={bookingInHeader}
                    onChange={(e) => setBookingInHeader(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-white/2 cursor-pointer hover:border-white/20">
                  <span>
                    <span className="text-xs font-bold text-white block">Footer</span>
                    <span className="text-[11px] text-slate-500">Brand block / footer CTA area</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={bookingInFooter}
                    onChange={(e) => setBookingInFooter(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </label>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/2">
                <span className="text-xs font-bold text-white block mb-1">Always on</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The booking CTA is also placed in the hero section, the mobile sticky action bar, and the
                  project inquiry success card. These follow the URL and label above automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
