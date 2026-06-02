"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Fingerprint,
    Check,
    ShieldCheck,
    Sparkles,
    Lock,
    KeyRound,
} from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function RegisterStep3Page() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'strong' | 'very-strong'>('weak');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [biometricEnabled, setBiometricEnabled] = useState(true);

    const checkPasswordStrength = (pass: string) => {
        if (pass.length < 8) return 'weak';
        const hasLetters = /[a-zA-Z]/.test(pass);
        const hasNumbers = /[0-9]/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        if (pass.length >= 8 && hasLetters && hasNumbers && hasSpecial) return 'very-strong';
        if (pass.length >= 8 && hasLetters && hasNumbers) return 'strong';
        return 'weak';
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPass = e.target.value;
        setPassword(newPass);
        setPasswordStrength(checkPasswordStrength(newPass));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (passwordStrength === 'weak') {
            setError('Please choose a stronger password');
            return;
        }
        if (pin.length !== 6) {
            setError('Please enter a 6-digit Transaction PIN');
            return;
        }

        setIsLoading(true);

        const fullName = sessionStorage.getItem('register_fullName');
        const email = sessionStorage.getItem('register_email');
        const referralCode = sessionStorage.getItem('register_referralCode');
        const dob = sessionStorage.getItem('register_dob');
        const phone = sessionStorage.getItem('register_phone');
        const address = sessionStorage.getItem('register_address');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone: phone || '',
                    password,
                    transactionPin: pin,
                    referralCode,
                    dob,
                    address,
                }),
            });

            if (res.ok) {
                sessionStorage.removeItem('register_fullName');
                sessionStorage.removeItem('register_email');
                sessionStorage.removeItem('register_referralCode');
                sessionStorage.removeItem('register_dob');
                sessionStorage.removeItem('register_phone');
                sessionStorage.removeItem('register_address');
                if (biometricEnabled) {
                    sessionStorage.setItem('register_biometric', 'true');
                }
                router.push(`/verify-prompt?email=${encodeURIComponent(email || '')}`);
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const strengthLabel = {
        weak: 'Weak',
        strong: 'Good',
        'very-strong': 'Strong',
    };
    const strengthColor = {
        weak: 'text-red-400',
        strong: 'text-amber-400',
        'very-strong': 'text-[#47f0d1]',
    };
    const strengthBarActive = {
        weak: 'bg-red-400',
        strong: 'bg-amber-400',
        'very-strong': 'bg-[#47f0d1] shadow-[0_0_8px_rgba(71,240,209,0.5)]',
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-[430px] h-screen bg-white dark:bg-[#131321] relative overflow-hidden flex flex-col shadow-2xl border-x border-slate-100 dark:border-white/5">

                {/* Decorative Glows */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#47f0d1]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <header className="pt-14 pb-4 px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#131321]/80 backdrop-blur-md z-20 border-b border-slate-100 dark:border-white/5">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-[#47f0d1] flex items-center gap-1">
                        Step 3 of 3 <Sparkles className="w-4 h-4 animate-pulse" />
                    </span>
                    <div className="w-10" />
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 px-8 pt-6 pb-8 overflow-y-auto flex flex-col" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex-1">

                        {/* Title */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-950 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                Secure Your Account
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">
                                Set up your secure credentials to protect your digital assets.
                            </p>
                        </div>

                        {/* Progress Bar — full */}
                        <div className="mb-8">
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                <div className="h-full bg-[#47f0d1] w-full rounded-full shadow-[0_0_10px_rgba(71,240,209,0.4)] transition-all duration-500" />
                            </div>
                        </div>

                        <form onSubmit={handleRegister} id="step3-form" className="space-y-7">

                            {/* Error Banner */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-2xl text-center font-semibold">
                                    {error}
                                </div>
                            )}

                            {/* Transaction PIN */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <KeyRound className="w-4 h-4 text-[#47f0d1]" />
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                                        Transaction PIN
                                    </label>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-zinc-500">
                                    Create a 6-digit PIN to authorize transactions.
                                </p>
                                <div className="flex justify-center py-2">
                                    <InputOTP
                                        maxLength={6}
                                        value={pin}
                                        onChange={(value) => setPin(value)}
                                    >
                                        <InputOTPGroup className="gap-3">
                                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                                <InputOTPSlot
                                                    key={i}
                                                    index={i}
                                                    className="w-11 h-14 text-xl font-black border-2 border-slate-100 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 text-slate-900 dark:text-white data-[active=true]:border-[#47f0d1] data-[active=true]:ring-[#47f0d1]/20 data-[active=true]:bg-white dark:data-[active=true]:bg-[#18182d] transition-all"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-white/5" />

                            {/* Account Password */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-[#47f0d1]" />
                                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                                        Account Password
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pr-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-[#47f0d1] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {password.length > 0 && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex gap-1 flex-1">
                                            <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${password.length > 0 ? strengthBarActive[passwordStrength] : 'bg-slate-100 dark:bg-zinc-800'}`} />
                                            <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength === 'strong' || passwordStrength === 'very-strong' ? strengthBarActive[passwordStrength] : 'bg-slate-100 dark:bg-zinc-800'}`} />
                                            <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength === 'very-strong' ? strengthBarActive[passwordStrength] : 'bg-slate-100 dark:bg-zinc-800'}`} />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${strengthColor[passwordStrength]}`}>
                                            {strengthLabel[passwordStrength]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-white/5 rounded-2xl py-4 px-5 pr-12 text-base font-bold placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:bg-white dark:focus:bg-[#18182d] focus:border-[#47f0d1] focus:ring-4 focus:ring-[#47f0d1]/10 text-slate-900 dark:text-white transition-all outline-none"
                                        placeholder="Repeat your password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 hover:text-[#47f0d1] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Match indicator */}
                                {confirmPassword.length > 0 && (
                                    <p className={`text-xs font-semibold ml-1 ${password === confirmPassword ? 'text-[#47f0d1]' : 'text-red-400'}`}>
                                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100 dark:bg-white/5" />

                            {/* Biometric Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#47f0d1]/5 border border-[#47f0d1]/15">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#47f0d1]/10 flex items-center justify-center shrink-0">
                                        <Fingerprint className="w-5 h-5 text-[#47f0d1]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Biometric Login</p>
                                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Use Face ID or Fingerprint</p>
                                    </div>
                                </div>
                                {/* Custom Toggle */}
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={biometricEnabled}
                                    onClick={() => setBiometricEnabled(!biometricEnabled)}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#47f0d1]/40 ${biometricEnabled ? 'bg-[#47f0d1] shadow-[0_0_12px_rgba(71,240,209,0.35)]' : 'bg-slate-200 dark:bg-zinc-700'}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${biometricEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>

                            {/* Privacy Info */}
                            <div className="flex gap-3 p-4 rounded-2xl bg-[#47f0d1]/5 border border-[#47f0d1]/15">
                                <ShieldCheck className="w-5 h-5 text-[#47f0d1] shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                                    Your credentials are end-to-end encrypted. We never store your PIN or passwords in plain text.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-8 space-y-4">
                        <button
                            type="submit"
                            form="step3-form"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#47f0d1] hover:bg-[#47f0d1]/90 disabled:opacity-60 disabled:cursor-not-allowed text-[#131321] rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(71,240,209,0.25)] hover:shadow-[0_10px_30px_rgba(71,240,209,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Complete Registration</span>
                                </>
                            )}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 dark:text-zinc-500">
                            By completing, you agree to our{' '}
                            <a className="text-[#47f0d1] font-bold hover:underline" href="#">Terms of Service</a>
                            {' '}and{' '}
                            <a className="text-[#47f0d1] font-bold hover:underline" href="#">Security Policy</a>.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
