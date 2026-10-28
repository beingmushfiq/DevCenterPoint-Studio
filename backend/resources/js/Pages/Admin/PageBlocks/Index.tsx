import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Layers, Edit3, Save, CheckCircle2, Eye, Code, AlertTriangle, Check } from 'lucide-react';

interface PageSection {
  id: number;
  section_key: string;
  block_key: string;
  content: string;
  is_visible: boolean;
  display_order: number;
}

interface Props {
  sections: PageSection[];
}

export default function PageBlocksIndex({ sections }: Props) {
  const sectionKeys = Array.from(new Set(sections.map((s) => s.section_key)));
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>(() => sectionKeys[0] || 'hero');
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, string | null>>({});
  const [successSaved, setSuccessSaved] = useState<string | null>(null);

  const currentBlocks = sections.filter((s) => s.section_key === selectedSectionKey);

  const handleContentChange = (blockKey: string, newContent: string) => {
    setEditData({
      ...editData,
      [blockKey]: newContent,
    });
    // Clear json error on edit
    if (jsonErrors[blockKey]) {
      setJsonErrors({ ...jsonErrors, [blockKey]: null });
    }
  };

  const handleFormatJson = (blockKey: string, rawContent: string) => {
    try {
      const parsed = JSON.parse(rawContent);
      const formatted = JSON.stringify(parsed, null, 2);
      setEditData({
        ...editData,
        [blockKey]: formatted,
      });
      setJsonErrors({ ...jsonErrors, [blockKey]: null });
    } catch (err: any) {
      setJsonErrors({ ...jsonErrors, [blockKey]: `Invalid JSON syntax: ${err.message}` });
    }
  };

  const handleSaveBlock = (sectionKey: string, blockKey: string, content: string) => {
    const raw = editData[blockKey] !== undefined ? editData[blockKey] : content;

    // If starts with { or [, validate JSON before submitting
    const trimmed = raw.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        JSON.parse(trimmed);
      } catch (err: any) {
        setJsonErrors({ ...jsonErrors, [blockKey]: `Cannot save: Invalid JSON syntax (${err.message})` });
        return;
      }
    }

    router.post(
      '/admin/sections',
      {
        section_key: sectionKey,
        block_key: blockKey,
        content: raw,
        is_visible: true,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSuccessSaved(`${sectionKey}:${blockKey}`);
          setTimeout(() => setSuccessSaved(null), 2500);
        },
      }
    );
  };

  return (
    <AdminLayout title="Page Blocks CMS">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-400" /> Universal Page Blocks CMS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Total control over every block, headline, badge, CTA button, and copy across the entire landing page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {sections.length} Live CMS Blocks
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {sectionKeys.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSectionKey(sec)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedSectionKey === sec
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#0c1017] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {sec.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Blocks Editor */}
        <div className="space-y-6">
          {currentBlocks.map((block) => {
            const rawContent = editData[block.block_key] !== undefined ? editData[block.block_key] : block.content;
            const isJson = rawContent.trim().startsWith('{') || rawContent.trim().startsWith('[');
            const isSaved = successSaved === `${block.section_key}:${block.block_key}`;
            const error = jsonErrors[block.block_key];

            return (
              <div
                key={block.id}
                className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                      [{block.section_key} &gt; {block.block_key}]
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                      Live Block
                    </span>
                    {isJson && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono font-bold uppercase">
                        JSON
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isJson && (
                      <button
                        type="button"
                        onClick={() => handleFormatJson(block.block_key, rawContent)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                        title="Format & Prettify JSON"
                      >
                        <Code className="w-3.5 h-3.5 text-purple-400" />
                        <span>Prettify JSON</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleSaveBlock(block.section_key, block.block_key, block.content)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Block</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={rawContent.length > 300 ? 12 : rawContent.length > 100 ? 6 : 3}
                    value={rawContent}
                    onChange={(e) => handleContentChange(block.block_key, e.target.value)}
                    className={`w-full p-3.5 bg-black/40 border rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none ${
                      error
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-white/10 focus:border-blue-500'
                    }`}
                  />
                  {error ? (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 font-mono">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {isJson
                        ? 'Structured JSON payload directly hydrating frontend UI components.'
                        : 'Raw text content directly binding to landing section components.'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

