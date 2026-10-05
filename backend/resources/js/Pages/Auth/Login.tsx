import React, { useState, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { soundEngine } from '../../lib/soundEngine';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        soundEngine.playSuccessChime();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleQuickFill = () => {
        soundEngine.playClick();
        setData({
            email: 'admin@devcenterpoint.com',
            password: 'admin12345',
            remember: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Admin Login | DevCenterPoint" />

            {/* Quick Demo Helper Pill */}
            <div className="mb-6 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-blue-300">
                    <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                        <span className="font-semibold block text-[11px] text-white">Default Admin Credentials</span>
                        <span className="font-mono text-[10px] text-blue-300/80">admin@devcenterpoint.com</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleQuickFill}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white font-mono text-[10px] font-bold uppercase transition-all border border-blue-400/30 cursor-pointer whitespace-nowrap"
                >
                    Auto-Fill
                </button>
            </div>

            {status && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Address */}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                        Work Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            required
                            placeholder="admin@devcenterpoint.com"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                            Master Key / Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            required
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-10 pr-11 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                soundEngine.playClick();
                                setShowPassword(!showPassword);
                            }}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs text-slate-400">Remember this workstation</span>
                    </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50 border border-white/20"
                    >
                        <span>{processing ? 'Authenticating Gateway...' : 'Access Command Center'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
