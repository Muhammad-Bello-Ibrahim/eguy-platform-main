"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, Check, CheckCheck } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notifications?limit=50");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message || "Failed to load notifications");
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
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notificationIds.includes(notif.id)
              ? { ...notif, read: true }
              : notif
          )
        );
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
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-green-600" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-green-600" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-red-600 py-8">
                <p>{error}</p>
                <Button
                  onClick={fetchNotifications}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center p-4 pb-24">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-green-600" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
                  </span>
                )}
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification.id} className={`px-2 py-4 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                        <span className="text-sm">{getStatusIcon(notification.status)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                onClick={() => markAsRead([notification.id])}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              onClick={() => deleteNotification(notification.id)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </div>
                          {notification.amount && (
                            <div className="text-xs font-medium text-green-600">
                              ₦{notification.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
