"use client";

import Link from 'next/link';

interface DashboardHeaderProps {
    user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Get display name
    const getDisplayName = () => {
        if (!user) return "User";
        if (user.firstName) return user.firstName;
        if (user.fullName) return user.fullName.split(' ')[0];
        if (user.name) return user.name.split(' ')[0];
        if (user.username) return user.username;
        return "User";
    };

    return (
        <header className="sticky top-0 z-50 px-6 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden relative">
                    {user?.avatar ? (
                        <img
                            className="w-full h-full object-cover"
                            alt="User profile avatar"
                            src={user.avatar}
                        />
                    ) : (
                        <span className="text-primary font-bold text-lg">
                            {getDisplayName().charAt(0)}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{getGreeting()},</p>
                    <h1 className="text-base font-bold text-slate-900 dark:text-white">{getDisplayName()}</h1>
                </div>
            </Link>

            <Link href="/notifications" className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-card-dark flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-icons-round">notifications</span>
                {/* Notification dot - logic to show/hide based on actual notifications can be added later */}
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </Link>
        </header>
    );
}
