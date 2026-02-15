"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HelpSupportPage() {
    return (
        <div className="bg-background text-foreground min-h-screen font-sans">
            {/* Main Container */}
            <div className="max-w-md mx-auto px-6 pb-24 relative min-h-screen flex flex-col">

                {/* Header */}
                <header className="flex items-center justify-between py-6">
                    <Link href="/">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-foreground hover:bg-muted transition-colors">
                            <span className="material-icons-round">chevron_left</span>
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Help Center</h1>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 text-foreground hover:bg-muted transition-colors">
                        <span className="material-icons-round text-[20px]">notifications_none</span>
                    </button>
                </header>

                {/* Search Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold mb-2">How can we help?</h2>
                    <p className="text-muted-foreground text-sm mb-6">Search our knowledge base or contact a specialist.</p>
                    <div className="relative group">
                        <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full bg-muted/50 border-none rounded-full py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
                            placeholder="Search topics, questions..."
                            type="text"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    {[
                        { label: "Wallet", desc: "Transfers, assets & deposits", icon: "account_balance_wallet" },
                        { label: "Security", desc: "2FA & account safety", icon: "verified_user" },
                        { label: "ElevateX", desc: "Growth & platform analytics", icon: "auto_graph" },
                        { label: "Referral", desc: "Network growth rewards", icon: "group_add" }
                    ].map((item, i) => (
                        <div key={i} className="bg-card p-5 rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <span className="material-icons-round text-primary">{item.icon}</span>
                            </div>
                            <h3 className="font-bold text-sm mb-1">{item.label}</h3>
                            <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions List */}
                <div className="space-y-3 mb-10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Support Channels</h4>

                    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons-round text-primary text-xl">confirmation_number</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Submit a Ticket</p>
                                <p className="text-[11px] text-muted-foreground">Average response: 24h</p>
                            </div>
                        </div>
                        <span className="material-icons-round text-muted-foreground">chevron_right</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-icons-round text-primary text-xl">forum</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Community Forums</p>
                                <p className="text-[11px] text-muted-foreground">Join 50k+ eGuy users</p>
                            </div>
                        </div>
                        <span className="material-icons-round text-muted-foreground">chevron_right</span>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-12">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-2">Common Questions</h4>
                    <div className="space-y-4">
                        {[
                            "How do I reset my security phrase?",
                            "Why is my ElevateX yield pending?",
                            "Which countries are supported for KYC?"
                        ].map((question, i) => (
                            <div key={i} className="pb-4 border-b border-border">
                                <div className="flex justify-between items-center cursor-pointer hover:text-primary transition-colors">
                                    <p className="text-sm font-medium">{question}</p>
                                    <span className="material-icons-round text-muted-foreground text-sm">add</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center space-x-3 mb-8">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <p className="text-[12px] font-medium text-primary">All systems operational</p>
                </div>
            </div>

            {/* Floating Live Chat Button */}
            <div className="fixed bottom-24 right-6 z-50">
                <button className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <span className="material-icons-round text-2xl">chat_bubble</span>
                </button>
            </div>
        </div>
    );
}
