import { Suspense } from "react";
import { VerifyEmailPrompt } from "@/components/auth/verify-email-prompt";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPrompt />
    </Suspense>
  );
}
