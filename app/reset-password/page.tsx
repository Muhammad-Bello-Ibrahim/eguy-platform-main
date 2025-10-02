"use client";
import { ResetRequestForm } from "@/components/auth/reset-request-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  if (token) {
    return <ResetPasswordForm />;
  }
  return <ResetRequestForm />;
}
