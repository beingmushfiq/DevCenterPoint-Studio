import React, { useState } from 'react';
import { PRINCIPLES_DATA } from '../data/about';
import { Quote, Sparkles, CheckCircle2, Users, Github, Linkedin, Twitter } from 'lucide-react';
import { DevCenterPointLogo } from './DevCenterPointLogo';
import { useCms } from '../Context/CmsContext';
import { SectionState } from './SectionState';

const DEFAULT_TEAM = [
  {
    id: 1,
    name: 'Mushfiqur Rahman',
    role: 'Principal Systems Architect & Founder',
    bio: 'Pioneering resilient distributed web backends, high-throughput telemetry pipelines, and enterprise ERP ecosystems across global teams.',
    avatar_url: null,
    social_links: {
      github: 'https://github.com/beingmushfiq',
      linkedin: 'https://linkedin.com/in/beingmushfiq',
    },
  },
  {
    id: 2,
    name: 'Tanvir Hossain',
    role: 'Lead Cloud Infrastructure & SRE',
    bio: 'Specializing in Kubernetes orchestration, zero-downtime CI/CD workflows, automated failover topologies, and cloud cost governance.',
    avatar_url: null,
    social_links: {
      github: 'https://github.com/devcenterpoint',
    },
  },
  {
    id: 3,
    name: 'Ayesha Siddiqua',
    role: 'Head of Product Design & Human Experience',
    bio: 'Crafting high-density operational cockpits, design token architectures, and frictionless client interfaces with pixel-level precision.',
    avatar_url: null,
    social_links: {
      linkedin: 'https://linkedin.com/company/devcenterpoint',
    },
  },
];

export const AboutPrinciples: React.FC = () => {
  const cms = useCms();
  const [selectedNum, setSelectedNum] = useState<string>('01');

  const teamMembers = (cms.team && cms.team.length > 0)
    ? cms.team.filter((m: any) => m.is_active !== false)
    : DEFAULT_TEAM;

  const activePrinciple = PRINCIPLES_DATA.find((p) => p.number === selectedNum) || PRINCIPLES_DATA[0];

  return (
    <section id="about" className="py-28 bg-white dark:bg-[#07090e] text-slate-900 dark:text-white border-t border-slate-200/70 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 liquid-glass px-4 py-1.5 rounded-full mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
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
                      ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-xl shadow-blue-500/25 translate-x-1.5 ring-1 ring-white/20'
                      : 'liquid-glass text-slate-800 dark:text-gray-300 hover:border-blue-400/40 hover:bg-white/80 dark:hover:bg-white/10 shadow-xs'
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
          <div className="lg:col-span-7 liquid-glass rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden font-sans ring-1 ring-black/5 dark:ring-white/10">
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80 dark:border-white/10">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                  PRINCIPLE {activePrinciple.number}
                </span>
                <Quote className="w-8 h-8 text-blue-500/40" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{activePrinciple.title}</h3>
              <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider">{activePrinciple.tagline}</p>

              <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                {activePrinciple.description}
              </p>

              {/* Display Quote Block */}
              <div className="p-6 rounded-2xl liquid-glass border-l-4 border-l-blue-500 my-6 text-sm text-slate-800 dark:text-gray-200 leading-relaxed italic font-medium shadow-xs">
                "{activePrinciple.quote}"
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 dark:text-gray-500">
              <div className="flex items-center gap-2">
                <DevCenterPointLogo variant="mark-only" size="xs" />
                <span className="font-mono text-[10px] tracking-widest uppercase">CODE . BUILD . DEPLOY . SCALE .</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider text-[11px]">System Architecture</span>
            </div>
          </div>
        </div>

        {/* Studio Leadership & Core Team Subsection */}
        <div className="mt-20 pt-16 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                <Users className="w-3.5 h-3.5" /> Studio Leadership
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Principal Architects & Engineering Leads
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm">
              Hands-on senior engineering practitioners overseeing every architecture review, schema migration, and deployment.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <SectionState
              variant="empty"
              title="Team profiles coming soon"
              description="Our leadership profiles are being published right now. Please check back shortly."
            />
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member: any) => (
              <div
                key={member.id}
                className="liquid-glass rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-base">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{member.name}</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3 text-slate-400">
                  {member.social_links?.github && (
                    <a
                      href={member.social_links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_links?.linkedin && (
                    <a
                      href={member.social_links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_links?.twitter && (
                    <a
                      href={member.social_links.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

