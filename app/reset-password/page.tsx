import React, { Suspense } from 'react';
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#131321] text-white">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
