"use client";

import React, { useState } from 'react';
import { X, Fingerprint, Shield, CheckCircle2 } from 'lucide-react';
import { registerBiometric, getBiometricName } from '@/lib/biometric';
import { useToast } from '@/hooks/use-toast';

interface BiometricSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onSuccess?: () => void;
}

export default function BiometricSetupModal({
    isOpen,
    onClose,
    userId,
    userName,
    onSuccess,
}: BiometricSetupModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    if (!isOpen) return null;

    const handleSetup = async () => {
        setIsRegistering(true);
        try {
            // Register biometric credential
            const credential = await registerBiometric(userId, userName);

            // Save to database
            const response = await fetch('/api/auth/biometric/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to register biometric');
            }

            setIsSuccess(true);
            toast({
                title: 'Success!',
                description: `${getBiometricName()} has been set up successfully.`,
            });

            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error('Biometric setup error:', error);
            toast({
                title: 'Setup Failed',
                description: error.message || 'Failed to set up biometric authentication',
                variant: 'destructive',
            });
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-background-dark rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 pb-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            {isSuccess ? (
                                <CheckCircle2 className="w-8 h-8 text-primary" />
                            ) : (
                                <Fingerprint className="w-8 h-8 text-primary" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isSuccess ? 'All Set!' : `Set Up ${getBiometricName()}`}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {isSuccess
                                ? 'You can now use biometric authentication to sign in'
                                : 'Sign in faster and more securely'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {!isSuccess && (
                        <>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                            Enhanced Security
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Your biometric data never leaves your device
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Fingerprint className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                            Quick Access
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Sign in with just a touch or glance
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSetup}
                                    disabled={isRegistering}
                                    className="w-full h-12 bg-primary text-background-dark font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRegistering ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin" />
                                            Setting Up...
                                        </>
                                    ) : (
                                        <>
                                            <Fingerprint className="w-5 h-5" />
                                            Enable {getBiometricName()}
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full h-10 mt-2 text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </>
                    )}

                    {isSuccess && (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Redirecting...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
