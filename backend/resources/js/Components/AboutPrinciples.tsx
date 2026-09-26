import React, { useState } from 'react';
import { PRINCIPLES_DATA } from '../data/about';
import { Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { DevCenterPointLogo } from './DevCenterPointLogo';

export const AboutPrinciples: React.FC = () => {
  const [selectedNum, setSelectedNum] = useState<string>('01');

  const activePrinciple = PRINCIPLES_DATA.find((p) => p.number === selectedNum) || PRINCIPLES_DATA[0];

  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-slate-200 dark:border-[#2a2a2a]">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
              07 — About DevCenterPoint
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Engineering Principles
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md mt-4 md:mt-0 font-bold uppercase tracking-wider">
            How we think shapes how we build. Our core convictions drive every architectural decision and visual line of code.
          </p>
        </div>

        {/* Principles Grid (Top) + Highlighted Quote Inspector (Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Principles Cards */}
          <div className="lg:col-span-5 space-y-3">
            {PRINCIPLES_DATA.map((item) => {
              const isSelected = item.number === selectedNum;
              return (
                <button
                  key={item.number}
                  onClick={() => setSelectedNum(item.number)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 translate-x-1'
                      : 'bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-300 border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-400 dark:text-gray-500'}`}>
                      {item.number}
                    </span>
                    <div>
                      <div className="font-extrabold text-lg">{item.title}</div>
                      <div className={`text-xs ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-500 dark:text-gray-500 font-bold'}`}>
                        {item.tagline}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Principle Detailed View */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-slate-200 dark:border-[#2a2a2a] p-8 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden font-sans">
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-[#2a2a2a]">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                  PRINCIPLE {activePrinciple.number}
                </span>
                <Quote className="w-8 h-8 text-blue-500/40" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{activePrinciple.title}</h3>
              <p className="text-base text-blue-600 dark:text-blue-400 font-extrabold mb-6 uppercase tracking-wider text-xs">{activePrinciple.tagline}</p>

              <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                {activePrinciple.description}
              </p>

              {/* Display Quote Block */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111111] border-l-4 border-l-blue-500 border-y border-r border-slate-200 dark:border-[#2a2a2a] my-6 text-sm text-slate-800 dark:text-gray-300 leading-relaxed italic font-medium">
                "{activePrinciple.quote}"
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-[#2a2a2a] flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <DevCenterPointLogo variant="mark-only" size="xs" />
                <span className="font-mono text-[10px] tracking-widest uppercase">CODE . BUILD . DEPLOY . SCALE .</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider text-[11px]">System Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
