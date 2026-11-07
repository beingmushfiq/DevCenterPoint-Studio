import React, { useState } from 'react';
import { PRINCIPLES_DATA } from '../data/about';
import { Quote, CheckCircle2, Users, Github, Linkedin } from 'lucide-react';
import { DevCenterPointLogo } from './DevCenterPointLogo';
import { useCms } from '../Context/CmsContext';
import { SectionState } from './SectionState';

const DEFAULT_TEAM = [
  {
    id: 1,
    name: 'Mushfiqur Rahman',
    role: 'Founder & Systems Architect',
    bio: 'Engineers custom Laravel and React business software, multi-warehouse ERPs, and automated logistics systems.',
    avatar_url: null,
    social_links: {
      github: 'https://github.com/beingmushfiq',
      linkedin: 'https://linkedin.com/in/beingmushfiq',
    },
  },
  {
    id: 2,
    name: 'Tanvir Hossain',
    role: 'Cloud Infrastructure & SRE',
    bio: 'Configures Docker container environments, automated CI/CD deployment pipelines, and PostgreSQL reliability.',
    avatar_url: null,
    social_links: {
      github: 'https://github.com/devcenterpoint',
    },
  },
  {
    id: 3,
    name: 'Ayesha Siddiqua',
    role: 'Product & Interface Design',
    bio: 'Designs high-density administrative workflows, design token systems, and clear back-office staff portals.',
    avatar_url: null,
    social_links: {
      linkedin: 'https://linkedin.com/company/devcenterpoint',
    },
  },
];

interface PrinciplesHeader {
  badge?: string;
  headline?: string;
  subtitle?: string;
}

const DEFAULT_PRINCIPLES_HEADER: PrinciplesHeader = {
  badge: '06 — Engineering Culture & Convictions',
  headline: 'Core Principles of Craft',
  subtitle:
    'How we think determines what we build. Our architectural convictions guide every relational schema, queue worker, and interface component.',
};

export const AboutPrinciples: React.FC = () => {
  const cms = useCms();
  const headerContent = cms.getSectionBlock<PrinciplesHeader>('principles', 'header', DEFAULT_PRINCIPLES_HEADER);
  const principles = cms.getSectionBlock('principles', 'items', PRINCIPLES_DATA);

  const [selectedNum, setSelectedNum] = useState<string>(principles[0]?.number || '01');

  const teamMembers = (cms.team && cms.team.length > 0)
    ? cms.team.filter((m: any) => m.is_active !== false)
    : DEFAULT_TEAM;

  const activePrinciple = principles.find((p: any) => p.number === selectedNum) || principles[0] || PRINCIPLES_DATA[0];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-t hairline-border relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b hairline-border gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wide text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full border hairline-border">
              <span>{headerContent.badge || DEFAULT_PRINCIPLES_HEADER.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {headerContent.headline || DEFAULT_PRINCIPLES_HEADER.headline}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
            {headerContent.subtitle || DEFAULT_PRINCIPLES_HEADER.subtitle}
          </p>
        </div>

        {/* Principles Grid & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Principles Selector Column (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {principles.map((item: any) => {
              const isSelected = item.number === selectedNum;
              return (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => setSelectedNum(item.number)}
                  className={`w-full text-left p-4 rounded-xl editorial-card transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)] bg-[var(--accent-subtle)]'
                      : 'hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                      {item.number}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">{item.title}</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {item.tagline}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Principle Detailed View (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b hairline-border">
              <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                CONVICTION {activePrinciple.number}
              </span>
              <Quote className="w-6 h-6 text-[var(--text-muted)]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[var(--text-primary)]">{activePrinciple.title}</h3>
              <p className="text-xs font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wide">
                {activePrinciple.tagline}
              </p>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {activePrinciple.description}
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border-l-4 border-l-[var(--accent-primary)] text-xs text-[var(--text-primary)] italic leading-relaxed">
              "{activePrinciple.quote}"
            </div>

            <div className="pt-4 border-t hairline-border flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>DEVCENTERPOINT CHARTER</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>

        {/* Studio Leadership & Core Team */}
        <div className="pt-14 border-t hairline-border space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-[var(--accent-primary)] mb-1">
                <Users className="w-3.5 h-3.5" /> Studio Leadership
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Principal Architects & Engineering Leads
              </h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              Hands-on senior engineering practitioners overseeing every architecture review, database schema, and deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member: any) => (
              <div
                key={member.id}
                className="rounded-2xl editorial-card p-6 flex flex-col justify-between space-y-4 hover:border-[var(--accent-primary)] transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border hairline-border flex items-center justify-center font-bold text-sm text-[var(--accent-primary)]">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">{member.name}</h4>
                      <p className="text-xs font-mono text-[var(--accent-primary)]">{member.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t hairline-border flex items-center gap-3">
                  {member.social_links?.github && (
                    <a
                      href={member.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_links?.linkedin && (
                    <a
                      href={member.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
