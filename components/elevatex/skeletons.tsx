import { Skeleton } from "@/components/ui/skeleton";

export function ElevateXPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#131321] text-slate-100 pb-24 font-sans">
            {/* Header Skeleton */}
            <header className="px-6 pt-14 pb-4 sticky top-0 z-40 bg-[#131321]/80 backdrop-blur-lg flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-slate-800" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-1 bg-slate-800" />
                        <Skeleton className="h-2 w-16 bg-slate-800" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-10 h-10 rounded-xl bg-slate-800" />
                    <Skeleton className="w-10 h-10 rounded-xl bg-slate-800" />
                </div>
            </header>

            <main className="px-5 pt-6 space-y-6">
                {/* Invite Code Skeleton */}
                <Skeleton className="h-16 w-full rounded-2xl bg-slate-800" />

                {/* Wallet Card Skeleton */}
                <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-32 bg-slate-800" />
                        <Skeleton className="h-10 w-48 bg-slate-800" />
                    </div>

                    <div className="flex gap-3">
                        <Skeleton className="flex-1 h-12 rounded-2xl bg-slate-800" />
                        <Skeleton className="flex-1 h-12 rounded-2xl bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <Skeleton className="h-2 w-20 bg-slate-800" />
                            <Skeleton className="h-6 w-24 bg-slate-800" />
                        </div>
                        <div className="space-y-2 flex flex-col items-end">
                            <Skeleton className="h-2 w-20 bg-slate-800" />
                            <Skeleton className="h-6 w-16 bg-slate-800" />
                        </div>
                    </div>
                </div>

                {/* Network Visualization Skeleton */}
                <div className="pt-4 space-y-4">
                    <div className="flex justify-between px-2">
                        <Skeleton className="h-3 w-24 bg-slate-800" />
                        <Skeleton className="h-3 w-10 bg-slate-800" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-2xl bg-slate-800" />
                        <div className="flex gap-8">
                            <Skeleton className="w-16 h-16 rounded-xl bg-slate-800" />
                            <Skeleton className="w-16 h-16 rounded-xl bg-slate-800" />
                        </div>
                    </div>
                </div>

                {/* Recent Activity Skeleton */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <Skeleton className="h-3 w-24 bg-slate-800" />
                        <Skeleton className="h-3 w-16 bg-slate-800" />
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-xl bg-slate-800" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-32 bg-slate-800" />
                                    <Skeleton className="h-2 w-20 bg-slate-800" />
                                </div>
                            </div>
                            <div className="space-y-2 flex flex-col items-end">
                                <Skeleton className="h-3 w-16 bg-slate-800" />
                                <Skeleton className="h-2 w-12 bg-slate-800" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
