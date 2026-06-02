"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ProfileSkeleton } from './skeletons';

export default function ProfilePage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    // Redirect to login if unauthorized
                    router.push('/login');
                }
            } catch (error) {
                console.error("Failed to load user data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
        setMounted(true);
    }, [router]);

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" });
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error("Sign out failed", error);
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    const displayName = user?.fullName || user?.firstName || user?.username || "User";
    const displayEmail = user?.email || "user@example.com";
    const displayImage = user?.avatar || user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuD1lNvmBqO4jMWo7Ys9w31p80UZdiRaQM2s6HbGrogDJFFY8a1_tyIJ_HxDH6Zz8IWpsai2VDa8B4LihjX37vqc7cWDQhgI91qZ2Ishjut552vgP7wexHgqdVvsSKulQcnO7-eeiva80wKhABj_KhVSmr5IOPQ2Smb7n7JFyGrzsBITWiWSSV4U1QU9wIONZWaWYJT9Vii8Cd_gSOa-sn1ccd29hLL5zSj5qkXX1pBWHRpG5uQtVWuwmhUNJSq1Kw-_I7iLPC1u-RI";

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans min-h-screen pb-32">
            {/* Header / Profile Section */}
            <div className="relative overflow-hidden pt-12 pb-8 px-6 bg-gradient-to-b from-primary/10 to-transparent">
                <div className="flex flex-col items-center">
                    {/* Avatar with Border & Badge */}
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full border-2 border-primary p-1">
                            <img
                                alt="User Profile"
                                className="w-full h-full object-cover rounded-full"
                                src={displayImage}
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-primary text-slate-900 rounded-full p-1 border-4 border-slate-900">
                            <span className="material-icons-round text-sm block">verified</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">{displayName}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{displayEmail}</p>

                    {/* Tier Badge */}
                    <div className={`mt-4 inline-flex items-center gap-2 border px-4 py-1.5 rounded-full ${user?.rank === 'Pinnacle' ? 'bg-red-500/10 border-red-500/30 text-red-600' :
                        user?.rank === 'Premium' ? 'bg-orange-500/10 border-orange-500/30 text-orange-600' :
                            user?.rank === 'Expansion' ? 'bg-purple-500/10 border-purple-500/30 text-purple-600' :
                                user?.rank === 'Growth' ? 'bg-green-500/10 border-green-500/30 text-green-600' :
                                    user?.rank === 'Basic' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600' :
                                        'bg-slate-500/10 border-slate-500/30 text-slate-600'
                        }`}>
                        <span className="material-icons-round text-sm">workspace_premium</span>
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {user?.rank || 'Guest'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <main className="px-5 space-y-6">
                {/* Account Overview */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">Personal Information</h2>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <Link href="/profile/edit" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">person_outline</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Edit Profile</p>
                                    <p className="text-xs text-slate-500">Name, bio, and social links</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </Link>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">alternate_email</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Contact Details</p>
                                    <p className="text-xs text-slate-500">{displayEmail}</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Security & Privacy */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">Security & Privacy</h2>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">phonelink_lock</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Two-Factor Auth</p>
                                    <p className="text-xs text-primary font-medium">Enabled</p>
                                </div>
                            </div>
                            {/* Toggle Switch */}
                            <div className="relative inline-flex items-center cursor-pointer">
                                <div className="w-11 h-6 bg-primary rounded-full"></div>
                                <div className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm"></div>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">pin</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Change PIN</p>
                                    <p className="text-xs text-slate-500">Secure your digital wallet</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Banking & Payouts */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">Banking & Payouts</h2>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <Link href="/profile/banking" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">account_balance</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Linked Accounts</p>
                                    <p className="text-xs text-slate-500">{user?.linkedAccounts?.length || 0} accounts connected</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </Link>
                        <Link href="/profile/payouts" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">payments</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Payout Schedule</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.payoutSchedule?.frequency || "Weekly"} on {user?.payoutSchedule?.preferredDay || "Friday"}s</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </Link>
                    </div>
                </section>

                {/* Preferences */}
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">Preferences</h2>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <Link href="/profile/notifications" className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">notifications_active</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Notifications</p>
                                    <p className="text-xs text-slate-500">Push, Email & SMS</p>
                                </div>
                            </div>
                            <span className="material-icons-round text-slate-400">chevron_right</span>
                        </Link>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-icons-round">
                                        {mounted && theme === 'dark' ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">Appearance</p>
                                    <p className="text-xs text-slate-500">
                                        {mounted ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : 'System Default'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-bold uppercase">
                                {mounted ? (theme === 'dark' ? 'ON' : 'OFF') : 'AUTO'}
                            </div>
                        </button>
                    </div>
                </section>

                {/* Log Out */}
                <div className="pt-4 pb-12 flex flex-col items-center gap-4">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 text-rose-500 font-bold text-sm bg-rose-500/10 hover:bg-rose-500/20 w-full py-4 rounded-xl transition-all"
                    >
                        <span className="material-icons-round text-lg">logout</span>
                        LOG OUT
                    </button>

                    <button
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
                                try {
                                    const res = await fetch("/api/user/delete", { method: "DELETE" });
                                    if (res.ok) {
                                        await handleSignOut();
                                    } else {
                                        alert("Failed to delete account. Please try again.");
                                    }
                                } catch (error) {
                                    console.error("Delete account error", error);
                                    alert("An error occurred.");
                                }
                            }
                        }}
                        className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors mt-2"
                    >
                        Deactivate / Delete Account
                    </button>

                    <p className="text-slate-600 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-4">eGuy Fintech v2.4.1</p>
                </div>
            </main>
        </div>
    );
}
