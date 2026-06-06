"use client"

import React, { useState, useEffect } from "react"
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
    Menu
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
    const [isMobile, setIsMobile] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // Handle responsiveness
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) {
                setIsCollapsed(true)
            } else {
                setIsCollapsed(false)
            }
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    return (
        <>
            {/* Mobile Menu Toggle */}
            {isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-50 lg:hidden"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            )}

            {/* Sidebar Container */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 bg-white dark:bg-card-dark border-r border-slate-200 dark:border-white/5 transition-all duration-300 ease-in-out lg:relative",
                    isMobile && !showMobileMenu ? "-translate-x-full" : "translate-x-0",
                    isCollapsed && !isMobile ? "w-20" : "w-64",
                    isMobile ? "w-64 shadow-2xl" : ""
                )}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-white/5">
                    <div className={cn("flex items-center space-x-3", isCollapsed && !isMobile ? "justify-center w-full" : "")}>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-background-dark font-extrabold text-lg">A</span>
                        </div>
                        {(!isCollapsed || isMobile) && (
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Admin</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Panel</span>
                            </div>
                        )}
                    </div>

                    {!isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 hidden lg:flex"
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </Button>
                    )}
                </div>

                <ScrollArea className="flex-1 py-6 px-3">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start mb-1 transition-all duration-200",
                                    activeTab === item.id
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5"
                                        : "border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5",
                                    isCollapsed && !isMobile ? "px-2 justify-center" : "px-3"
                                )}
                                onClick={() => {
                                    onTabChange(item.id)
                                    if (isMobile) setShowMobileMenu(false)
                                }}
                            >
                                <item.icon
                                    className={cn(
                                        "h-5 w-5",
                                        activeTab === item.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white",
                                        isCollapsed && !isMobile ? "mr-0" : "mr-3"
                                    )}
                                />
                                {(!isCollapsed || isMobile) && (
                                    <span className="font-medium">{item.label}</span>
                                )}

                                {(!isCollapsed || isMobile) && activeTab === item.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
                                )}
                            </Button>
                        ))}
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t border-slate-100 dark:border-white/5">
                    <div className={cn(
                        "rounded-xl bg-slate-50 dark:bg-background-dark p-4 border border-slate-100 dark:border-white/5",
                        isCollapsed && !isMobile ? "hidden" : "block"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                                <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium text-slate-700 dark:text-white truncate">Admin User</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">super@admin.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobile && showMobileMenu && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}
        </>
    )
}
