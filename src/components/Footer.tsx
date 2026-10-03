import React from 'react';
import { ArrowUp, Terminal, Shield, Github, Linkedin, Mail, MapPin, ExternalLink, Globe, Cpu, User } from 'lucide-react';
import { DevCenterPointLogo } from './DevCenterPointLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] font-sans pt-16 pb-12 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200 dark:border-[#2a2a2a]">
          {/* Brand Info & Founder */}
          <div className="md:col-span-4 space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />

            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm font-medium">
              DevCenterPoint is a custom software engineering studio building cloud architectures, high-performance web systems, and applied AI workflows.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shadow-[0_0_8px_#22c55e]"></span>
              <span className="uppercase tracking-widest text-[10px]">ALL SYSTEMS OPERATIONAL</span>
            </div>

            {/* Founder & Open-Source Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs">
              <a
                href="https://buildwithmushfiq.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#282828] hover:border-blue-400 transition-colors font-bold text-[11px]"
              >
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Founder Portfolio</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://github.com/beingmushfiq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] text-slate-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-[#282828] hover:border-blue-400 transition-colors font-bold text-[11px]"
              >
                <Github className="w-3.5 h-3.5 text-slate-700 dark:text-gray-300" />
                <span>@beingmushfiq</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Navigation
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
              <li><a href="#capabilities" className="hover:text-blue-600 dark:hover:text-white transition-colors">Capabilities</a></li>
              <li><a href="#work" className="hover:text-blue-600 dark:hover:text-white transition-colors">Selected Work</a></li>
              <li><a href="#architecture" className="hover:text-blue-600 dark:hover:text-white transition-colors">Architecture</a></li>
              <li><a href="#tech" className="hover:text-blue-600 dark:hover:text-white transition-colors">Tech Ecosystem</a></li>
              <li><a href="#process" className="hover:text-blue-600 dark:hover:text-white transition-colors">Lifecycle Process</a></li>
              <li><a href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">Principles</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ & Engagement</a></li>
              <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Start Project</a></li>
            </ul>
          </div>

          {/* Studio Ecosystem & Live Hubs */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Studio Ecosystem
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
              <li>
                <a
                  href="https://devcenterpoint.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Engineering Studio</span>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-500">devcenterpoint.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://devcenterpoint.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>AI Applied Studio</span>
                  <span className="text-[10px] font-mono text-emerald-500 group-hover:text-emerald-400">devcenterpoint.ai</span>
                </a>
              </li>
              <li>
                <a
                  href="https://demoerp.devcenterpoint.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Enterprise ERP Demo</span>
                  <span className="text-[10px] font-mono text-blue-500">demoerp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://serial.ferozamedicinecorner.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Healthcare Serial Manager</span>
                  <span className="text-[10px] font-mono text-emerald-500">serial</span>
                </a>
              </li>
              <li>
                <a
                  href="https://roadsafetymovement.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Road Safety Movement</span>
                  <span className="text-[10px] font-mono text-slate-400">roadsafety</span>
                </a>
              </li>
              <li>
                <a
                  href="https://qttenzy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Qttenzy Smart Attendance</span>
                  <span className="text-[10px] font-mono text-slate-400">qttenzy</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Studio Hub */}
          <div className="md:col-span-3 space-y-3 text-xs text-slate-600 dark:text-gray-400 font-bold">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Global Software Studio & Scalable Systems Lab</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <a href="mailto:contact@devcenterpoint.com" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                contact@devcenterpoint.com
              </a>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 dark:text-gray-400 font-mono">
              Inquiries processed in &lt; 24h
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-gray-500">
          <div>
            © {new Date().getFullYear()} DevCenterPoint. Founded by{' '}
            <a
              href="https://buildwithmushfiq.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors underline decoration-slate-300 dark:decoration-slate-700"
            >
              Mushfiq
            </a>
            . All rights reserved.
          </div>

          <div className="text-slate-600 dark:text-gray-400 italic font-medium">
            "Designed with intent. Engineered with purpose."
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white dark:bg-[#1a1a1a] hover:bg-blue-600 text-slate-800 dark:text-white hover:text-white border border-slate-200 dark:border-[#2a2a2a] hover:border-blue-400 transition-colors flex items-center gap-1.5 shadow-md font-black uppercase tracking-wider text-[10px] cursor-pointer"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
