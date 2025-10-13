"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Wallet,
  Network,
  Crown,
  Zap,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "transactions", label: "Transactions", icon: Wallet },
  { id: "plans", label: "Plans", icon: Package },
  { id: "referrals", label: "Referrals", icon: Network },
  { id: "subscriptions", label: "Subscriptions", icon: Crown },
  { id: "services", label: "Services", icon: Zap },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch by only rendering after client-side mount
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything during server-side rendering to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={cn("border-r bg-card transition-all duration-300", "w-64")}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">eG</span>
            </div>
            <span className="text-lg font-bold text-primary">Admin</span>
          </div>
        </div>
      </div>
    )
  }

  // Get user from sessionStorage (or context/provider in production)
  const user = typeof window !== "undefined" ? JSON.parse(window.sessionStorage.getItem("user") || "null") : null;

  if (!user || user.role !== "admin") {
    return <div className="p-4 text-red-600">Access denied: Admins only.</div>;
  }

  return (
    <div className={cn("border-r bg-white transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold text-slate-900">Admin</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-600">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100",
                isCollapsed ? "px-2" : "px-3",
                activeTab === item.id && "bg-blue-50 text-blue-700 border border-blue-200",
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-3")} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
