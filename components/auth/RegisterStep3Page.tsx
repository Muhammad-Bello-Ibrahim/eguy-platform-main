"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

        // Retrieve data from Session Storage
        const fullName = sessionStorage.getItem('register_fullName');
        const email = sessionStorage.getItem('register_email');
        const referralCode = sessionStorage.getItem('register_referralCode');
        const dob = sessionStorage.getItem('register_dob');
        const phone = sessionStorage.getItem('register_phone'); // Note: Phone from step 2
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
                    address
                }),
            });

            if (res.ok) {
                // Clear session storage
                sessionStorage.removeItem('register_fullName');
                sessionStorage.removeItem('register_email');
                sessionStorage.removeItem('register_referralCode');
                sessionStorage.removeItem('register_dob');
                sessionStorage.removeItem('register_phone');
                sessionStorage.removeItem('register_address');

                // Save biometric preference
                if (biometricEnabled) {
                    sessionStorage.setItem('register_biometric', 'true');
                }

                router.push(`/verify-prompt?email=${encodeURIComponent(email || '')}`);
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display flex justify-center items-center">
            {/* Mobile Container (iOS Form Factor) */}
            <div className="relative w-full max-w-[402px] h-[874px] bg-background-light dark:bg-background-dark overflow-hidden shadow-2xl border-x border-y border-transparent dark:border-primary/10 sm:rounded-[3rem] flex flex-col">

                {/* Network Background Pattern Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(71, 240, 209, 0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                {/* Status Bar Simulation */}
                <div className="h-12 w-full"></div>

                {/* Progress Header */}
                <div className="px-6 pt-2 pb-4 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-icons-round">arrow_back_ios_new</span>
                        </button>
                        <span className="text-sm font-semibold text-primary/80">Step 3 of 3</span>
                        <div className="w-10 h-10"></div> {/* Spacer */}
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(71,240,209,0.3)]"></div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-4 relative z-10">
                    <header className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Secure Your Account</h1>
                        <p className="text-slate-500 dark:text-primary/60 text-sm leading-relaxed">
                            Set up your secure credentials to protect your digital assets and transactions.
                        </p>
                    </header>

                    <form onSubmit={handleRegister}>
                        {/* 6-Digit PIN Section */}
                        <section className="mb-8">
                            <label className="block text-sm font-bold mb-4 uppercase tracking-wider text-slate-400 dark:text-primary/40">Transaction PIN</label>
                            <p className="text-xs text-slate-500 mb-4">Create a 6-digit PIN for authorizing transactions.</p>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={pin}
                                    onChange={(value) => setPin(value)}
                                >
                                    <InputOTPGroup className="gap-2">
                                        <InputOTPSlot index={0} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                        <InputOTPSlot index={1} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                        <InputOTPSlot index={2} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                        <InputOTPSlot index={3} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                        <InputOTPSlot index={4} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                        <InputOTPSlot index={5} className="w-12 h-16 text-lg font-bold border-2 border-primary/20 rounded-lg" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </section>

                        {/* Password Section */}
                        <section className="space-y-6 mb-8">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-bold">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Account Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full h-14 bg-white dark:bg-black/20 border-2 border-primary/20 focus:border-primary rounded-lg px-4 pr-12 outline-none transition-colors"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 cursor-pointer hover:text-primary focus:outline-none"
                                    >
                                        <span className="material-icons-round">{showPassword ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                                <div className="flex gap-1 mt-2">
                                    <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? (
                                        passwordStrength === 'weak' ? 'bg-red-500' :
                                            passwordStrength === 'strong' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                    ) : 'bg-primary/20'
                                        }`}></div>
                                    <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' || passwordStrength === 'very-strong' ? (
                                        passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-green-500'
                                    ) : 'bg-primary/20'
                                        }`}></div>
                                    <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'very-strong' ? 'bg-green-500' : 'bg-primary/20'
                                        }`}></div>
                                    <span className={`text-[10px] font-bold ml-2 uppercase ${password.length > 0 ? (
                                        passwordStrength === 'weak' ? 'text-red-500' :
                                            passwordStrength === 'strong' ? 'text-yellow-500' :
                                                'text-green-500'
                                    ) : 'text-slate-500'
                                        }`}>
                                        {password.length > 0 ? passwordStrength.replace('-', ' ') : 'Weak'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Verify Password</label>
                                <div className="relative">
                                    <input
                                        className="w-full h-14 bg-white dark:bg-black/20 border-2 border-primary/20 focus:border-primary rounded-lg px-4 pr-12 outline-none transition-colors"
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 cursor-pointer hover:text-primary focus:outline-none"
                                    >
                                        <span className="material-icons-round">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Biometric Toggle */}
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl mb-32">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons-round text-primary">fingerprint</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Biometric Login</p>
                                    <p className="text-[11px] text-slate-500">Use FaceID or Fingerprint</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    checked={biometricEnabled}
                                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                                    className="sr-only peer"
                                    type="checkbox"
                                />
                                <div className="w-12 h-6 bg-slate-400/20 peer-focus:outline-none rounded-full peer dark:bg-neutral-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Fixed Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-4 bg-background-light dark:bg-background-dark/80 backdrop-blur-md z-20 border-t border-primary/5">
                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full h-16 bg-primary text-background-dark font-extrabold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span>{isLoading ? 'CREATING ACCOUNT...' : 'COMPLETE REGISTRATION'}</span>
                        {!isLoading && <span className="material-icons-round group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    </button>
                    <p className="text-center text-[10px] mt-4 text-slate-500">
                        By completing, you agree to our <a className="text-primary font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-bold hover:underline" href="#">Security Policy</a>.
                    </p>
                </div>

                {/* Abstract Security Shield Image - Decorative */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-10 pointer-events-none z-0">
                    <div className="w-full h-full bg-gradient-to-tr from-primary to-transparent rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
