"use client";

import { useState, useEffect } from "react";
import {
  Bell, CheckCheck, Wallet, UserPlus, TrendingUp, ShieldCheck,
  Award, Trash2, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  amount?: number;
  status: "success" | "error" | "warning" | "info";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "earnings" | "network">("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications?limit=50");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notificationIds.includes(notif.id) ? { ...notif, read: true } : notif
          )
        );
        toast({ title: "Marked as read" });
      }
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
      case 'deposit':
      case 'payment':
        return <Wallet className="w-6 h-6" />;
      case 'referral':
      case 'network':
        return <UserPlus className="w-6 h-6" />;
      case 'earning':
      case 'commission':
        return <TrendingUp className="w-6 h-6" />;
      case 'verification':
        return <ShieldCheck className="w-6 h-6" />;
      case 'bonus':
        return <Award className="w-6 h-6" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "earnings") return ['earning', 'commission', 'bonus', 'withdrawal', 'deposit'].includes(n.type);
    if (activeTab === "network") return ['referral', 'network', 'verification'].includes(n.type);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10221e] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#47f0d1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f8] dark:bg-[#10221e] pb-24 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-md mx-auto px-6">
        {/* Header */}
        <header className="flex justify-between items-end pt-8 pb-6 sticky top-0 bg-[#f6f8f8]/80 dark:bg-[#10221e]/80 backdrop-blur-xl z-30">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">Notifications</h1>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-[#47f0d1] font-semibold text-sm mb-1 hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        </header>

        {/* Tabs */}
        <nav className="bg-slate-200 dark:bg-[#162b27]/50 p-1.5 rounded-xl mb-8 flex items-center sticky top-24 z-20 backdrop-blur-sm">
          {(["all", "earnings", "network"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 font-bold py-2 rounded-lg text-sm transition-all capitalize",
                activeTab === tab
                  ? "bg-[#47f0d1] text-[#10221e] shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <Bell className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p>No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-5 border shadow-sm transition-all flex gap-4 items-start",
                  notif.read
                    ? "bg-white dark:bg-[#1b3530]/40 border-slate-200 dark:border-white/5 opacity-70"
                    : "bg-white dark:bg-[#1b3530] border-[#47f0d1]/30 dark:border-white/10 shadow-md"
                )}
              >
                {!notif.read && <div className="absolute top-0 left-0 w-1 h-full bg-[#47f0d1]"></div>}

                <div className={cn(
                  "p-3 rounded-xl flex-shrink-0",
                  !notif.read ? "bg-[#47f0d1]/20 text-[#47f0d1]" : "bg-slate-100 dark:bg-[#47f0d1]/10 text-slate-400 dark:text-[#47f0d1]/60"
                )}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-bold text-base leading-tight", !notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                      {notif.title}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {getTimeAgo(notif.createdAt)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markAsRead([notif.id]); }}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded"
                            title="Mark read"
                          >
                            <Check className="w-3 h-3 text-slate-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.amount && (
                    <p className="mt-2 text-sm font-bold text-[#47f0d1]">
                      ₦{notif.amount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
