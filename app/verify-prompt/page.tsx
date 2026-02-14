"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyPromptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [polling, setPolling] = useState(true);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  // Poll verification status every 3 seconds
  useEffect(() => {
    if (!email || !polling) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/verify-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.verified) {
          setPolling(false);
          router.push("/dashboard");
        }
      } catch { }
    }, 3000);
    return () => clearInterval(interval);
  }, [email, polling, router]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  const handleResend = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/auth/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        // Improved error handling
        if (data.error === "Token expired") {
          setError("Your verification link has expired. Please request a new one.");
        } else if (data.error === "Token invalid") {
          setError("Invalid verification link. Please request a new one.");
        } else if (data.error === "Token already used") {
          setError("This link has already been used.");
        } else {
          setError(data.error || "Something went wrong");
        }
        return;
      }
      setSuccess("Verification link resent! Please check your email.");
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-teal-500/10 to-emerald-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-white/50 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl p-8 lg:p-10 relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">

        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-bounce-slow">
          <Mail className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Check your email</h1>

        <p className="text-zinc-500 mb-8 leading-relaxed">
          We've sent a verification link to <br />
          <span className="font-semibold text-zinc-900">{email}</span>
        </p>

        <div className="space-y-4">
          {success && (
            <Alert className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-800 text-left">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="font-medium ml-2">{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800 text-left">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription className="font-medium ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full h-12 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-all"
            disabled={isLoading || cooldown > 0}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : cooldown > 0 ? (
              <>Resend in {cooldown}s</>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Resend Email
              </>
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/50 px-2 text-zinc-400">
                or
              </span>
            </div>
          </div>

          <Link href="/signin" className="block w-full">
            <Button className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-lg hover:shadow-zinc-500/20 transition-all">
              Back to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          Didn't receive the email? Check your spam folder or try another email address.
        </p>
      </div>
    </div>
  );
}
