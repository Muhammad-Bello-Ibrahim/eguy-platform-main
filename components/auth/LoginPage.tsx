"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Fingerprint, Loader2 } from 'lucide-react';
import { isBiometricAvailable, authenticateWithBiometric, getBiometricName } from '@/lib/biometric';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [isBiometricLoading, setIsBiometricLoading] = useState(false);

    useEffect(() => { setBiometricAvailable(isBiometricAvailable()); }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone: email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch { setError('An error occurred. Please try again.'); }
        finally { setIsLoading(false); }
    };

    const handleBiometricLogin = async () => {
        if (!email) { setError('Please enter your email first'); return; }
        setIsBiometricLoading(true); setError('');
        try {
            const authData = await authenticateWithBiometric([]);
            const res = await fetch('/api/auth/biometric/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credentialId: authData.credentialId, email }),
            });
            const data = await res.json();
            if (res.ok) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                toast({ title: 'Success!', description: `Authenticated with ${getBiometricName()}` });
                router.push('/dashboard');
            } else {
                setError(data.error || 'Biometric authentication failed');
            }
        } catch (err: any) { setError(err.message || 'Biometric authentication failed'); }
        finally { setIsBiometricLoading(false); }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0e0e1a] flex items-center justify-center p-5 font-sans">
            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#47f0d1]/[0.03] rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-[420px] bg-white dark:bg-[#13131f] border border-slate-100 dark:border-white/[0.06] rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#47f0d1]/60 to-transparent" />

                <div className="p-8">
                    {/* Brand badge */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 bg-[#47f0d1]/10 border border-[#47f0d1]/20 rounded-2xl flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(71,240,209,0.12)]">
                            <span className="text-xl font-black text-[#47f0d1]">eG</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">Welcome back</h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Sign in to your eGuy account</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleLogin}>
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 ml-1">Email or Phone</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] rounded-2xl py-4 px-5 pl-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                    placeholder="email@example.com"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 group-focus-within:text-[#47f0d1] transition-colors pointer-events-none" />
                                <input
                                    className="w-full bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] rounded-2xl py-4 px-5 pl-12 pr-12 text-base font-semibold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#1a1a2e] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                    placeholder="••••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 hover:text-[#47f0d1] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs font-semibold text-[#47f0d1]/80 hover:text-[#47f0d1] transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#3de0c3] text-[#0e0e1a] rounded-2xl font-black text-base shadow-[0_8px_24px_rgba(71,240,209,0.25)] hover:shadow-[0_8px_24px_rgba(71,240,209,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>

                        {/* Divider */}
                        {biometricAvailable && (
                            <>
                                <div className="flex items-center gap-3 py-1">
                                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                                    <span className="text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">or</span>
                                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/[0.06]" />
                                </div>

                                {/* Biometric */}
                                <button
                                    type="button"
                                    onClick={handleBiometricLogin}
                                    disabled={isBiometricLoading || !email}
                                    className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBiometricLoading
                                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating…</>
                                        : <><Fingerprint className="w-5 h-5 text-[#47f0d1]" /> {getBiometricName()}</>
                                    }
                                </button>
                            </>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-6" />

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-[#47f0d1] font-bold hover:underline underline-offset-4">
                            Create one
                        </Link>
                    </p>

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-1.5 mt-5 text-slate-400 dark:text-zinc-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#47f0d1]/60" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Bank-grade 256-bit encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
