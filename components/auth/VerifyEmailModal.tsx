"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Mail,
    X,
    RefreshCw,
    Loader2,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Clock,
} from "lucide-react";

interface VerifyEmailModalProps {
    email: string;
    onClose?: () => void;
    /** If true, modal cannot be dismissed (e.g. right after registration) */
    required?: boolean;
}

type ModalState = "waiting" | "resending" | "resent" | "already_verified" | "verified";

export default function VerifyEmailModal({ email, onClose, required = false }: VerifyEmailModalProps) {
    const router = useRouter();
    const [state, setState] = useState<ModalState>("waiting");
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState("");
    const cooldownRef = useRef<NodeJS.Timeout | null>(null);
    const pollRef = useRef<NodeJS.Timeout | null>(null);

    // ── Cooldown countdown ───────────────────────────────────────────────────
    useEffect(() => {
        if (cooldown > 0) {
            cooldownRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
        }
        return () => { if (cooldownRef.current) clearTimeout(cooldownRef.current); };
    }, [cooldown]);

    // ── Poll verification status every 4 seconds ─────────────────────────────
    const startPolling = useCallback(() => {
        if (!email) return;

        const poll = async () => {
            try {
                const res = await fetch("/api/auth/verify-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();
                if (data.verified) {
                    setState("verified");
                    if (pollRef.current) clearInterval(pollRef.current);

                    // Redirect to dashboard after short delay
                    setTimeout(() => router.push("/dashboard"), 1800);
                }
            } catch { /* silently ignore poll errors */ }
        };

        pollRef.current = setInterval(poll, 4000);
        // Also run immediately
        poll();

        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [email, router]);

    useEffect(() => {
        const stop = startPolling();
        return stop;
    }, [startPolling]);

    // ── Resend email ──────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (state === "resending" || cooldown > 0) return;
        setError("");
        setState("resending");

        try {
            const res = await fetch("/api/auth/verify-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.alreadyVerified) {
                // User is already verified — refresh session and redirect
                setState("already_verified");
                setTimeout(() => router.push("/dashboard"), 2000);
                return;
            }

            if (!res.ok) {
                setError(data.error || "Failed to resend email");
                setState("waiting");
                return;
            }

            setState("resent");
            setCooldown(60);
            // Go back to waiting after 3 seconds
            setTimeout(() => setState("waiting"), 3000);
        } catch {
            setError("Something went wrong. Please try again.");
            setState("waiting");
        }
    };

    // ── Go to login ───────────────────────────────────────────────────────────
    const handleGoToLogin = () => {
        if (pollRef.current) clearInterval(pollRef.current);
        router.push("/login");
    };

    // ────────────────────────────────────────────────────────────────────────────
    //  RENDER STATES
    // ────────────────────────────────────────────────────────────────────────────

    const isVerified = state === "verified" || state === "already_verified";

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={required ? undefined : onClose}
            />

            {/* Modal panel */}
            <div className="relative w-full max-w-[400px] rounded-3xl bg-white dark:bg-[#131321] border border-slate-100 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Glow orbs */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#47f0d1]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#47f0d1]/8 rounded-full blur-3xl pointer-events-none" />

                {/* Close button (only when not required) */}
                {!required && !isVerified && onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="relative z-10 p-8 text-center">

                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${isVerified
                        ? "bg-[#47f0d1]/15 shadow-[0_0_30px_rgba(71,240,209,0.3)]"
                        : "bg-slate-100 dark:bg-zinc-800/60"
                        }`}>
                        {state === "verified" || state === "already_verified" ? (
                            <CheckCircle2 className="w-10 h-10 text-[#47f0d1]" />
                        ) : state === "resending" ? (
                            <Loader2 className="w-10 h-10 text-[#47f0d1] animate-spin" />
                        ) : state === "resent" ? (
                            <CheckCircle2 className="w-10 h-10 text-[#47f0d1]" />
                        ) : (
                            <Mail className="w-10 h-10 text-slate-500 dark:text-zinc-400" />
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black tracking-tight mb-2 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        {state === "verified" && "Email Verified! 🎉"}
                        {state === "already_verified" && "Already Verified!"}
                        {state === "resent" && "Email Sent!"}
                        {state === "resending" && "Sending..."}
                        {state === "waiting" && "Check Your Email"}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mb-6">
                        {state === "verified" && (
                            <>Your account is verified. Redirecting to your dashboard<span className="inline-flex gap-0.5 ml-1"><span className="animate-bounce delay-0">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span></>
                        )}
                        {state === "already_verified" && (
                            <>Your email is already verified. Taking you to dashboard<span className="inline-flex gap-0.5 ml-1"><span className="animate-bounce delay-0">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span></span></>
                        )}
                        {state === "resent" && (
                            <>A fresh verification link has been sent to <strong className="text-slate-800 dark:text-white">{email}</strong>. Check your inbox (and spam).</>
                        )}
                        {state === "resending" && (
                            "Sending a new verification link to your email address…"
                        )}
                        {state === "waiting" && (
                            <>We sent a verification link to <strong className="text-slate-800 dark:text-white">{email}</strong>. Click the link in your email to verify your account.</>
                        )}
                    </p>

                    {/* Polling indicator */}
                    {state === "waiting" && (
                        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-400 dark:text-zinc-500">
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#47f0d1] animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#47f0d1] animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#47f0d1] animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            <span>Waiting for verification…</span>
                        </div>
                    )}

                    {/* Error banner */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    {!isVerified && (
                        <div className="space-y-3">
                            {/* Resend Button */}
                            <button
                                onClick={handleResend}
                                disabled={state === "resending" || cooldown > 0}
                                className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {state === "resending" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                                ) : cooldown > 0 ? (
                                    <><Clock className="w-4 h-4" /> Resend in {cooldown}s</>
                                ) : (
                                    <><RefreshCw className="w-4 h-4" /> Resend Email</>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
                                <span className="text-xs text-slate-400 dark:text-zinc-600">or</span>
                                <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
                            </div>

                            {/* Back to Login */}
                            <button
                                onClick={handleGoToLogin}
                                className="w-full h-12 rounded-2xl bg-[#47f0d1] hover:bg-[#47f0d1]/90 text-[#131321] font-black text-sm shadow-[0_8px_20px_rgba(71,240,209,0.2)] hover:shadow-[0_8px_20px_rgba(71,240,209,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Back to Login <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Verified state CTA */}
                    {state === "verified" && (
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-zinc-500 mt-2">
                            <ShieldCheck className="w-4 h-4 text-[#47f0d1]" />
                            <span>Account secured & verified</span>
                        </div>
                    )}

                    {/* Footer note */}
                    {!isVerified && (
                        <p className="mt-5 text-[11px] text-slate-400 dark:text-zinc-600">
                            Didn't receive it? Check your spam folder or try a different email.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
