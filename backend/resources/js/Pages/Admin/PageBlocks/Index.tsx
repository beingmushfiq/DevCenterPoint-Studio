import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Layers, Edit3, Save, CheckCircle2, Eye } from 'lucide-react';

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
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>('hero');
  const [editData, setEditData] = useState<Record<string, string>>({});

  const sectionKeys = Array.from(new Set(sections.map((s) => s.section_key)));

  const currentBlocks = sections.filter((s) => s.section_key === selectedSectionKey);

  const handleContentChange = (blockKey: string, newContent: string) => {
    setEditData({
      ...editData,
      [blockKey]: newContent,
    });
  };

  const handleSaveBlock = (sectionKey: string, blockKey: string, content: string) => {
    router.post(
      '/admin/sections',
      {
        section_key: sectionKey,
        block_key: blockKey,
        content: editData[blockKey] !== undefined ? editData[blockKey] : content,
        is_visible: true,
      },
      { preserveScroll: true }
    );
  };

  return (
    <AdminLayout title="Page Blocks CMS">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" /> Universal Page Blocks CMS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Total control over every block, headline, badge, CTA button, and copy across the entire landing page.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {sectionKeys.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSectionKey(sec)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedSectionKey === sec
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#0c1017] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Section: {sec}
            </button>
          ))}
        </div>

        {/* Blocks Editor */}
        <div className="space-y-6">
          {currentBlocks.map((block) => {
            const rawContent = editData[block.block_key] !== undefined ? editData[block.block_key] : block.content;

            return (
              <div
                key={block.id}
                className="bg-[#0c1017] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                      [{block.section_key} &gt; {block.block_key}]
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                      Live Block
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveBlock(block.section_key, block.block_key, block.content)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Block
                  </button>
                </div>

                <div>
                  <textarea
                    rows={rawContent.length > 200 ? 6 : 3}
                    value={rawContent}
                    onChange={(e) => handleContentChange(block.block_key, e.target.value)}
                    className="w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Raw text or JSON content directly binding to landing section components.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
