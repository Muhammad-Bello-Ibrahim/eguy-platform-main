"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-background text-foreground transition-colors duration-300 font-sans min-h-screen pb-24">
            <div className="max-w-md mx-auto min-h-screen relative overflow-hidden network-bg">
                {/* Header */}
                <header className="px-6 pt-8 pb-6 flex justify-between items-center sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-icons-round text-primary-foreground text-xl">hub</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">eGuy</span>
                    </div>
                    <div className="relative">
                        <button
                            className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors z-50 relative"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-icons-round text-2xl">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-12 w-48 bg-card rounded-2xl shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-4 duration-200">
                                <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors">
                                    <span className="material-icons-round text-primary text-sm">login</span>
                                    <span className="font-bold text-sm">Login</span>
                                </Link>
                                <Link href="/register" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors">
                                    <span className="material-icons-round text-primary text-sm">person_add</span>
                                    <span className="font-bold text-sm">Create Account</span>
                                </Link>
                                <div className="h-px bg-border my-1"></div>
                                <Link href="/support" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors">
                                    <span className="material-icons-round text-muted-foreground text-sm">help</span>
                                    <span className="text-sm">Support</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="px-6 py-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Affordable VTU & Growth</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                            Digital Services. <br />
                            <span className="text-primary">Real Growth.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            eGuy is a modern VTU platform that lets you buy airtime, data, pay bills, and manage utilities at affordable rates — while ElevateX helps you grow with the community you already have.
                        </p>
                    </div>
                </section>

                {/* SECTION 1: Services Grid */}
                <section className="px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Daily Essentials</h2>
                        <span className="text-primary material-icons-round">category</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Buy Data", icon: "wifi", bg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
                            { label: "Airtime", icon: "phone_in_talk", bg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
                            { label: "Pay Bills", icon: "receipt_long", bg: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
                            { label: "Cable TV", icon: "tv", bg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
                            { label: "Utilities", icon: "lightbulb", bg: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
                            { label: "More", icon: "apps", bg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}>
                                    <span className="material-icons-round text-xl">{item.icon}</span>
                                </div>
                                <span className="font-bold text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 2: Why Choose eGuy */}
                <section className="px-6 py-12 bg-muted/50 rounded-3xl mx-4 border border-border">
                    <h2 className="text-2xl font-bold mb-8 text-center">Why eGuy?</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Unbeatable Rates", desc: "Get data and airtime at distributor prices.", icon: "price_check" },
                            { title: "Instant Delivery", desc: "Automated systems ensure 24/7 fulfillment.", icon: "bolt" },
                            { title: "Bank-Grade Security", desc: "Your wallet and data are fully encrypted.", icon: "lock" }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-background border border-border shadow-sm">
                                <span className="material-icons-round text-primary text-2xl">{feature.icon}</span>
                                <div>
                                    <h3 className="font-bold mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 3: ElevateX Feature */}
                <section id="elevatex" className="px-6 py-12">
                    <div className="p-8 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold mb-4">Meet ElevateX<br /><span className="opacity-80">Grow Together</span></h2>
                            <p className="text-primary-foreground/90 text-lg leading-relaxed mb-6">
                                Turn your network into net worth. ElevateX is our community growth engine where you earn by inviting others.
                            </p>
                            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-xl p-4 border border-primary-foreground/10 mb-6">
                                <p className="font-medium text-sm">
                                    "Invite 5 friends. They invite 5 friends. Watch your community grow exponentially."
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {["Students", "Campuses", "Entrepreneurs", "Everyone"].map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 font-bold px-6 py-3 bg-white text-primary rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                                <span className="material-icons-round">play_arrow</span>
                                See How It Works
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-[40px] pointer-events-none"></div>
                    </div>
                </section>

                {/* SECTION 4: How It Works Steps */}
                <section className="px-6 py-12">
                    <h2 className="text-2xl font-bold mb-8">Simple Growth Steps</h2>
                    <div className="space-y-8 relative">
                        <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-border"></div>
                        {[
                            { title: "Register Account", desc: "Create your secure eGuy wallet in seconds.", icon: "person_add" },
                            { title: "Invite 5 Friends", desc: "Share your unique link with your circle.", icon: "group_add" },
                            { title: "They Transact", desc: "They buy airtime & data as usual.", icon: "shopping_bag" },
                            { title: "You Earn", desc: "Receive bonuses as your network grows.", icon: "monetization_on" }
                        ].map((step, i) => (
                            <div key={i} className="relative flex gap-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center z-10 shadow-sm text-primary font-bold">
                                    <span className="material-icons-round">{step.icon}</span>
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 5: Transparency */}
                <section className="px-6 py-12 bg-muted/30">
                    <div className="text-center max-w-sm mx-auto">
                        <span className="material-icons-round text-4xl text-primary mb-4">visibility</span>
                        <h2 className="text-2xl font-bold mb-4">100% Transparent</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            No hidden fees. No complicated tiers. Just a straightforward platform built for honest community growth.
                        </p>
                        <ul className="text-left space-y-3 bg-card p-6 rounded-2xl border border-border shadow-sm">
                            {[
                                "Real-time wallet tracking",
                                "Visible network tree",
                                "Instant automated withdrawals",
                                "24/7 Support access"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="material-icons-round text-green-500 text-sm">check_circle</span>
                                    <span className="text-sm font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* SECTION 6: Who is it for? */}
                <section className="px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6">Is eGuy for You?</h2>
                    <div className="grid gap-4">
                        <div className="p-5 rounded-2xl bg-secondary/20 border border-secondary text-secondary-foreground">
                            <h3 className="font-bold text-lg mb-2">For Daily Users</h3>
                            <p className="text-sm opacity-80">Stop overpaying for data. Use eGuy for all your utility payments and save money every day.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                            <h3 className="font-bold text-lg mb-2">For Builders</h3>
                            <p className="text-sm opacity-80">Use ElevateX to build a sustainable income stream by empowering your community.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-16 text-center">
                    <h2 className="text-4xl font-extrabold mb-4">Ready to Start?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of smart Nigerians using eGuy today.
                    </p>
                </section>

                {/* Footer */}
                <footer className="px-6 py-12 bg-muted/20 border-t border-border mt-4 mb-20">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-icons-round text-primary-foreground text-xl">hub</span>
                            </div>
                            <span className="text-xl font-bold">eGuy Finance</span>
                        </div>
                        <div className="flex gap-6 text-muted-foreground">
                            <Link href="#" className="hover:text-primary translation-colors">Privacy</Link>
                            <Link href="#" className="hover:text-primary translation-colors">Terms</Link>
                            <Link href="#" className="hover:text-primary translation-colors">Support</Link>
                        </div>
                        <p className="text-xs text-muted-foreground">© 2026 eGuy Network Systems. All rights reserved.</p>
                    </div>
                </footer>

                {/* Fixed Bottom Button */}
                <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent z-50">
                    <div className="max-w-md mx-auto">
                        <Link href="/register">
                            <button className="w-full py-4 bg-primary text-primary-foreground font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                                <span>Get Started</span>
                                <span className="material-icons-round">arrow_forward</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
