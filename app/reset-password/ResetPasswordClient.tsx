"use client"
import { ResetRequestForm } from "@/components/auth/reset-request-form"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, Users, Wallet, BarChart3, Shield, Lock, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function ResetPasswordClient() {
    const params = useSearchParams()
    const token = params.get("token") || ""

    const [securityMetrics, setSecurityMetrics] = useState([
        { label: "Active Sessions", value: 1247, change: 8.3, trend: "up" },
        { label: "Failed Logins", value: 3, change: -45.2, trend: "down" },
        { label: "Security Score", value: 94, change: 2.1, trend: "up" },
        { label: "Protected Accounts", value: 50123, change: 12.5, trend: "up" }
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setSecurityMetrics(prev => prev.map(item => ({
                ...item,
                value: item.value + Math.floor(Math.random() * 10) - 5,
                change: (Math.random() * 20) - 10
            })))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    if (token) {
        return (
            <div className="min-h-screen w-full flex bg-gray-50">
                {/* Left side - Large Typography Design */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-8 relative">
                    {/* Animated background patterns */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(245,158,11,0.03),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(251,191,36,0.03),transparent_50%)]"></div>

                    {/* Floating orbs */}
                    <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>

                    <div className="relative z-10 w-full h-full flex flex-col justify-center">
                        <div className="space-y-8">
                            {/* Main headline */}
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                                    <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                                        Reset
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-red-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                        Secure
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-lg">
                                    Regain access to your account with our secure password reset process. Your security is our top priority.
                                </p>
                            </div>

                            {/* Security highlights */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Bank-Grade Security</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Military-level encryption protecting your password reset process
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Instant Verification</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Quick email/SMS verification for immediate account recovery
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Privacy Protected</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Your personal information stays secure throughout the process
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            <ResetPasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex bg-gray-50">
            {/* Left side - Large Typography Design */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-50 p-8 relative">
                {/* Animated background patterns */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(59,130,246,0.03),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(99,102,241,0.03),transparent_50%)]"></div>

                {/* Floating orbs */}
                <div className="absolute top-16 left-16 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-15 animate-pulse delay-500"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center">
                    <div className="space-y-8">
                        {/* Main headline */}
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Recover
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Access
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-lg">
                                Forgot your password? No worries. We'll help you regain access to your account quickly and securely.
                            </p>
                        </div>

                        {/* Security highlights */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Verification</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Secure link sent to your registered email address for verification
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Protected Process</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        All password resets are encrypted and time-limited for maximum security
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Instant Recovery</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Get back into your account within minutes with our streamlined process
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <ResetRequestForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
