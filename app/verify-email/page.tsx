"use client";
import { Suspense } from "react";
import { VerifyEmailPrompt } from "@/components/auth/verify-email-prompt";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <VerifyEmailPrompt />
    </Suspense>
  );
}
