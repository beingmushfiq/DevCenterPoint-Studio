import React from 'react';
import { ArrowUp, Terminal, Shield, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { DevCenterPointLogo } from './DevCenterPointLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white border-t border-slate-200 dark:border-[#2a2a2a] font-sans pt-16 pb-12 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-200 dark:border-[#2a2a2a]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <DevCenterPointLogo variant="horizontal" size="lg" showTagline={true} />

            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-sm font-medium">
              DevCenterPoint designs and engineers software products, SaaS platforms, AI-powered systems, and digital experiences built for real-world business impact.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shadow-[0_0_8px_#22c55e]"></span>
              <span className="uppercase tracking-widest text-[10px]">ALL SYSTEMS OPERATIONAL</span>
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
              <li><a href="#metrics" className="hover:text-blue-600 dark:hover:text-white transition-colors">Efficiency Metrics</a></li>
              <li><a href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">Principles</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ & Engagement</a></li>
              <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">Start Project</a></li>
              <li><a href="#newsletter" className="hover:text-blue-600 dark:hover:text-white transition-colors">Dispatch Newsletter</a></li>
            </ul>
          </div>

          {/* Core Capabilities */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Capabilities
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-gray-400 font-bold">
              <li>Product Engineering</li>
              <li>AI & Machine Learning</li>
              <li>Experience UX/UI</li>
              <li>Business ERP / POS</li>
              <li>Commerce Systems</li>
              <li>Healthcare Platforms</li>
              <li>IoT & Telematics</li>
            </ul>
          </div>

          {/* Office & Contact */}
          <div className="md:col-span-3 space-y-3 text-xs text-slate-600 dark:text-gray-400 font-bold">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Engineering Hub
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>Global Product Studio & Engineering Center</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>contact@devcenterpoint.com</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-gray-500">
          <div>
            © {new Date().getFullYear()} DevCenterPoint. All rights reserved.
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
