"use client"

import React, { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { UsersManagement } from "@/components/admin/users-management"
import { TransactionsManagement } from "@/components/admin/transactions-management"
import { ReferralsManagement } from "@/components/admin/referrals-management"
import { SubscriptionsManagement } from "@/components/admin/subscriptions-management"
import { ServicesManagement } from "@/components/admin/services-management"
import { ReportsManagement } from "@/components/admin/reports-management"
import { SettingsManagement } from "@/components/admin/settings-management"
import { PlansManagement } from "@/components/admin/plans-management"
import { Button } from "@/components/ui/button"
import { LogOut, Bell, Search, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 500)
    const router = useRouter()

    // Handle URL tab parameter
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const tabParam = urlParams.get('tab')
        if (tabParam && ['dashboard', 'users', 'transactions', 'plans', 'referrals', 'subscriptions', 'services', 'reports', 'settings'].includes(tabParam)) {
            setActiveTab(tabParam)
        }
    }, [])

    // Update URL when tab changes
    React.useEffect(() => {
        const url = new URL(window.location.href)
        if (activeTab === 'dashboard') {
            url.searchParams.delete('tab')
        } else {
            url.searchParams.set('tab', activeTab)
        }
        window.history.replaceState({}, '', url)
    }, [activeTab])

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" })
            router.push("/")
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardOverview searchTerm={debouncedSearch} />
            case "users":
                return <UsersManagement searchTerm={debouncedSearch} />
            case "transactions":
                return <TransactionsManagement searchTerm={debouncedSearch} />
            case "plans":
                return <PlansManagement searchTerm={debouncedSearch} />
            case "referrals":
                return <ReferralsManagement searchTerm={debouncedSearch} />
            case "subscriptions":
                return <SubscriptionsManagement searchTerm={debouncedSearch} />
            case "services":
                return <ServicesManagement searchTerm={debouncedSearch} />
            case "reports":
                return <ReportsManagement searchTerm={debouncedSearch} />
            case "settings":
                return <SettingsManagement searchTerm={debouncedSearch} />
            default:
                return <DashboardOverview searchTerm={debouncedSearch} />
        }
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Left side spacer for mobile menu button or breadcrumbs */}
                            <div className="flex items-center lg:hidden pl-12">
                                <span className="text-lg font-bold text-slate-800 dark:text-white">Admin</span>
                            </div>

                            <div className="hidden lg:flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                <span className="font-medium text-slate-900 dark:text-white">Platform</span>
                                <span className="mx-2">/</span>
                                <span className="capitalize">{activeTab}</span>
                            </div>

                            <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
                                {/* Global Search */}
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                                    <Input
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64 h-9 bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-slate-800 focus:border-primary transition-all rounded-full text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>

                                {/* Notifications */}
                                <Button variant="ghost" size="icon" className="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                                </Button>

                                <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

                                {/* Sign Out */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full px-4"
                                >
                                    <LogOut className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}
