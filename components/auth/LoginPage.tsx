"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

    useEffect(() => {
        setBiometricAvailable(isBiometricAvailable());
    }, []);

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

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        if (!email) {
            setError('Please enter your email first');
            return;
        }

        setIsBiometricLoading(true);
        setError('');

        try {
            // Authenticate with biometric
            const authData = await authenticateWithBiometric([]);

            // Send to server for verification
            const res = await fetch('/api/auth/biometric/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credentialId: authData.credentialId,
                    email,
                }),
            });

            if (res.ok) {
                toast({
                    title: 'Success!',
                    description: `Authenticated with ${getBiometricName()}`,
                });
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Biometric authentication failed');
            }
        } catch (error: any) {
            console.error('Biometric login error:', error);
            setError(error.message || 'Biometric authentication failed');
        } finally {
            setIsBiometricLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center p-6 overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Main Container */}
            <main className="relative w-full max-w-[400px] flex flex-col items-center">
                {/* Header Section */}
                <header className="w-full text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6 border border-primary/20 shadow-lg shadow-primary/5">
                        <span className="material-icons-round text-primary text-4xl">shield</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-400 font-medium">Securely access your eGuy account</p>
                </header>

                {/* Login Card */}
                <div className="w-full bg-surface-dark/80 dark:bg-surface-dark border border-white/5 p-8 rounded-xl shadow-2xl backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-bold">
                                {error}
                            </div>
                        )}

                        {/* Email/Username Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email or Username</label>
                            <div className="relative flex items-center group focus-within:ring-1 focus-within:ring-primary/30 rounded-lg transition-all">
                                <span className="material-icons-round absolute left-4 text-slate-500 group-focus-within:text-primary transition-colors">person</span>
                                <input
                                    className="w-full bg-neutral-900 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                                    placeholder="e.g. alex@eguy.io"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                            </div>
                            <div className="relative flex items-center group focus-within:ring-1 focus-within:ring-primary/30 rounded-lg transition-all">
                                <span className="material-icons-round absolute left-4 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    className="w-full bg-neutral-900 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-4 text-slate-500 hover:text-white transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-icons-round text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Link className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors" href="/forgot-password">Forgot Password?</Link>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                            {!isLoading && <span className="material-icons-round text-xl">arrow_forward</span>}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">or access with</span>
                            <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        {/* Biometric Section */}
                        {biometricAvailable && (
                            <div className="flex justify-center">
                                <button
                                    className="flex flex-col items-center space-y-2 group"
                                    type="button"
                                    onClick={handleBiometricLogin}
                                    disabled={isBiometricLoading || !email}
                                >
                                    <div className="w-14 h-14 bg-neutral-900 border border-white/5 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-inner group-disabled:opacity-50 group-disabled:cursor-not-allowed">
                                        {isBiometricLoading ? (
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <span className="material-icons-round text-3xl">fingerprint</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 group-hover:text-primary transition-colors">
                                        {getBiometricName()}
                                    </span>
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer Navigation */}
                <footer className="mt-8 text-center">
                    <p className="text-slate-400 font-medium">
                        Don't have an account?
                        <Link className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-primary/30" href="/register">Sign Up</Link>
                    </p>
                </footer>

                {/* Security Badge */}
                <div className="mt-12 flex items-center space-x-2 text-slate-600">
                    <span className="material-icons-round text-sm">verified_user</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Bank-grade 256-bit encryption</span>
                </div>
            </main>
        </div>
    );
}
