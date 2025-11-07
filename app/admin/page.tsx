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
import { LogOut, Settings, Bell, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
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
        return <DashboardOverview searchTerm={searchTerm} />
      case "users":
        return <UsersManagement searchTerm={searchTerm} />
      case "transactions":
        return <TransactionsManagement searchTerm={searchTerm} />
      case "plans":
        return <PlansManagement searchTerm={searchTerm} />
      case "referrals":
        return <ReferralsManagement searchTerm={searchTerm} />
      case "subscriptions":
        return <SubscriptionsManagement searchTerm={searchTerm} />
      case "services":
        return <ServicesManagement searchTerm={searchTerm} />
      case "reports":
        return <ReportsManagement searchTerm={searchTerm} />
      case "settings":
        return <SettingsManagement searchTerm={searchTerm} />
      default:
        return <DashboardOverview searchTerm={searchTerm} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header - Matching User Dashboard Style */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
                  <p className="text-sm text-slate-600">Platform Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users, transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Sign Out */}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-600 hover:text-slate-900">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
