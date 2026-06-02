"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import VerifyEmailModal from "@/components/auth/VerifyEmailModal";

export default function VerifyPromptPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#131321]">
                <Loader2 className="h-8 w-8 animate-spin text-[#47f0d1]" />
            </div>
        }>
            <VerifyPromptContent />
        </Suspense>
    );
}

function VerifyPromptContent() {
    const params = useSearchParams();
    const router = useRouter();
    const email = params.get("email") || "";

    // Check immediately on mount if the user is already verified
    const [checking, setChecking] = useState(true);
    const [alreadyVerified, setAlreadyVerified] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!email) {
            setChecking(false);
            return;
        }

        // Hit verify-status to see if the DB already has them as verified
        fetch("/api/auth/verify-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.verified) {
                    // User is already verified — show "already verified" state briefly then redirect
                    setAlreadyVerified(true);
                    setChecking(false);
                } else {
                    setChecking(false);
                }
            })
            .catch(() => setChecking(false));
    }, [email]);

    // Countdown for already-verified auto-redirect
    useEffect(() => {
        if (!alreadyVerified) return;
        if (countdown <= 0) {
            router.push("/dashboard");
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [alreadyVerified, countdown, router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#131321]">
                <Loader2 className="h-8 w-8 animate-spin text-[#47f0d1]" />
            </div>
        );
    }

    if (alreadyVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#131321] p-4">
                {/* Already-verified modal */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full max-w-[380px] rounded-3xl bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 shadow-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#47f0d1]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#47f0d1]/8 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            {/* Success Icon */}
                            <div className="w-20 h-20 rounded-full bg-[#47f0d1]/15 shadow-[0_0_30px_rgba(71,240,209,0.3)] flex items-center justify-center mx-auto mb-5">
                                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                                    <circle cx="24" cy="24" r="24" fill="rgba(71,240,209,0.15)" />
                                    <path d="M14 24l7 7 13-13" stroke="#47f0d1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                Already Verified! ✅
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                                Your account is already verified. Redirecting you to your dashboard in{" "}
                                <span className="font-black text-[#47f0d1]">{countdown}s</span>…
                            </p>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-[#47f0d1] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(71,240,209,0.5)]"
                                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                />
                            </div>

                            <button
                                onClick={() => router.push("/dashboard")}
                                className="w-full h-12 rounded-2xl bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-black text-sm shadow-[0_8px_20px_rgba(71,240,209,0.25)] active:scale-95 transition-all"
                            >
                                Go to Dashboard Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normal state — show the verify modal on top of a minimal background
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#131321]">
            {/* Subtle background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#47f0d1]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#47f0d1]/3 rounded-full blur-3xl" />
            </div>

            <VerifyEmailModal
                email={email}
                required={true}
            />
        </div>
    );
}
