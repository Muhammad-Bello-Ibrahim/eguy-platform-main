"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { UsersManagement } from "@/components/admin/users-management"
import { TransactionsManagement } from "@/components/admin/transactions-management"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

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
        return <DashboardOverview />
      case "users":
        return <UsersManagement />
      case "transactions":
        return <TransactionsManagement />
      case "referrals":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Referrals management coming soon...</p>
          </div>
        )
      case "subscriptions":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Subscriptions management coming soon...</p>
          </div>
        )
      case "services":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Services management coming soon...</p>
          </div>
        )
      case "reports":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Reports and analytics coming soon...</p>
          </div>
        )
      case "settings":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">System settings coming soon...</p>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b bg-card h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold capitalize">{activeTab.replace("-", " ")}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
