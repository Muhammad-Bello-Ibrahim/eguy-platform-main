"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState, useEffect, useRef } from "react";

export default function VerifyPromptClient() {
    const params = useSearchParams();
    const router = useRouter();
    const email = params.get("email") || "";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("Signup successful! Please check your email to verify your account.");
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="space-y-4 w-full max-w-md">
                    <Skeleton className="h-10 w-2/3 rounded-xl" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                    <Skeleton className="h-8 w-1/2 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-16 p-6 rounded-xl border border-green-100 bg-white text-center">
            <Alert>
                <AlertDescription>{success}</AlertDescription>
            </Alert>
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col gap-4 mt-6">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                        setIsLoading(true);
                        setError("");
                        try {
                            const response = await fetch("/api/auth/verify-request", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email })
                            });
                            const data = await response.json();
                            if (!response.ok) {
                                // Improved error handling for expired, invalid, or used tokens
                                if (data.error === "Token expired") {
                                    setError("Your verification link has expired. Please request a new one.");
                                } else if (data.error === "Token invalid") {
                                    setError("Invalid verification link. Please request a new one.");
                                } else if (data.error === "Token already used") {
                                    setError("This verification link has already been used. Please login or request a new one.");
                                } else {
                                    setError(data.error || "Something went wrong");
                                }
                                return;
                            }
                            setSuccess("Verification link resent! Please check your email.");
                            setCooldown(60); // 60 seconds cooldown
                        } catch (err) {
                            setError(err instanceof Error ? err.message : "Something went wrong");
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    disabled={isLoading || cooldown > 0}
                >
                    {isLoading ? "Resending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Link"}
                </Button>
                <Button type="button" className="w-full" onClick={() => router.push("/signin")}>Login</Button>
            </div>
        </Card>
    );
}
