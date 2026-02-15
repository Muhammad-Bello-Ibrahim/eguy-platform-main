"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [name, setName] = useState("Alexander Wright");
    const [bio, setBio] = useState("Fintech enthusiast & Growth Strategist. Building the future of networking at eGuy. 🚀");
    const [twitter, setTwitter] = useState("@alex_wright_growth");
    const [linkedin, setLinkedin] = useState("linkedin.com/in/alexwright");

    return (
        <div className="bg-background-dark text-slate-100 font-sans min-h-screen pb-32">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors"
                >
                    <span className="material-icons-round text-2xl">chevron_left</span>
                    <span className="font-bold text-sm">BACK</span>
                </button>
                <h1 className="text-lg font-extrabold tracking-tight">Edit Profile</h1>
                <div className="w-10"></div>
            </header>

            <main className="pt-32 px-6 pb-12 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-surface-dark p-1 bg-gradient-to-tr from-primary to-primary/20 shadow-xl shadow-primary/10">
                            <img
                                alt="User Profile"
                                className="w-full h-full object-cover rounded-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1lNvmBqO4jMWo7Ys9w31p80UZdiRaQM2s6HbGrogDJFFY8a1_tyIJ_HxDH6Zz8IWpsai2VDa8B4LihjX37vqc7cWDQhgI91qZ2Ishjut552vgP7wexHgqdVvsSKulQcnO7-eeiva80wKhABj_KhVSmr5IOPQ2Smb7n7JFyGrzsBITWiWSSV4U1QU9wIONZWaWYJT9Vii8Cd_gSOa-sn1ccd29hLL5zSj5qkXX1pBWHRpG5uQtVWuwmhUNJSq1Kw-_I7iLPC1u-RI"
                            />
                        </div>
                        <button className="absolute bottom-1 right-1 bg-primary text-background-dark w-10 h-10 rounded-full flex items-center justify-center border-4 border-surface-dark shadow-lg">
                            <span className="material-icons-round text-xl">edit</span>
                        </button>
                    </div>
                    <p className="mt-4 text-xs font-bold text-primary uppercase tracking-widest">Change Photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 ml-1">Full Name</label>
                        <div className="relative">
                            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">person</span>
                            <input
                                className="w-full bg-surface-dark border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold transition-all focus:ring-1 focus:ring-primary outline-none"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 ml-1">Bio</label>
                        <div className="relative">
                            <textarea
                                className="w-full bg-surface-dark border-white/5 rounded-2xl p-4 text-sm font-medium leading-relaxed transition-all focus:ring-1 focus:ring-primary outline-none"
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 ml-1">Social Networks</label>

                        {/* Twitter */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                            </div>
                            <input
                                className="w-full bg-surface-dark border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold transition-all focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Twitter Username"
                                type="text"
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                            </div>
                            <input
                                className="w-full bg-surface-dark border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold transition-all focus:ring-1 focus:ring-primary outline-none"
                                placeholder="LinkedIn Profile URL"
                                type="text"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button className="w-full bg-primary text-background-dark font-extrabold py-5 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest text-sm uppercase">
                        Save Changes
                    </button>
                    <p className="text-center text-slate-600 text-[10px] mt-6 uppercase tracking-widest font-bold">Account Security: AES-256 Encrypted</p>
                </div>
            </main>
        </div>
    );
}
