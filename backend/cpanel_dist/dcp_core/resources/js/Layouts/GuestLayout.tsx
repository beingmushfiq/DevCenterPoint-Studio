import React from 'react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans antialiased">
            {/* Ambient Blurred Floating Light Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/18 blur-[140px] rounded-full pointer-events-none animate-float-orb-1" />
            <div className="absolute bottom-1/4 -right-20 w-md h-112 bg-purple-600/15 blur-[160px] rounded-full pointer-events-none animate-float-orb-2" />
            <div className="absolute top-10 right-1/3 w-80 h-80 bg-cyan-400/10 blur-[130px] rounded-full pointer-events-none animate-float-orb-3" />

            {/* Top Navigation Strip */}
            <header className="w-full max-w-md flex items-center justify-between py-2 relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all border border-white/5"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
                    <span>Return to Site</span>
                </Link>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-semibold text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>SSL ENCRYPTED</span>
                </div>
            </header>

            {/* Central Auth Capsule */}
            <main className="w-full max-w-md my-auto relative z-10">
                {/* Brand Monogram & Title */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block group">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-2xl shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 border border-white/20">
                            D
                        </div>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-4">
                        Mission Control Gateway
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                        DevCenterPoint Studio CMS
                    </p>
                </div>

                {/* Frosted Liquid Glass Card */}
                <div className="backdrop-blur-2xl bg-[#090d16]/92 border border-white/12 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="h-0.5 w-full bg-linear-to-r from-transparent via-blue-500/50 to-transparent absolute top-0 left-0" />
                    {children}
                </div>
            </main>

            {/* System Telemetry Footer */}
            <footer className="w-full max-w-md py-4 text-center text-[11px] font-mono text-slate-500 relative z-10 flex items-center justify-center gap-3">
                <span className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> System Active
                </span>
                <span>•</span>
                <span>DevCenterPoint OS v2.4</span>
                <span>•</span>
                <span className="text-blue-400">99.99% SLA</span>
            </footer>
        </div>
    );
}
