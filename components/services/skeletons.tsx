import { Skeleton } from "@/components/ui/skeleton";

export function AirtimeSkeleton() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex justify-center font-[Manrope]">
            <div className="w-full max-w-[430px] min-h-screen bg-background-light dark:bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="pt-12 pb-6 px-6 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
                    <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-800" />
                    <div className="w-10"></div>
                </header>

                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar space-y-8">
                    {/* Segment Control */}
                    <Skeleton className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />

                    {/* Networks */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <Skeleton className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-3 w-10 bg-slate-200 dark:bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Amount / Plans */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                            ))}
                        </div>
                        <Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 mt-2" />
                    </div>
                </main>

                {/* Footer */}
                <footer className="absolute bottom-0 left-0 w-full p-6 pt-10 bg-gradient-to-t from-background-light dark:from-background-dark z-30">
                    <div className="flex justify-between mb-4 px-2">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-2xl bg-primary/20" />
                </footer>
            </div>
        </div>
    );
}

export function CableSkeleton() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex justify-center font-[Manrope]">
            <div className="w-full max-w-[430px] min-h-screen bg-white dark:bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
                    <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-6 w-24 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                </header>

                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar space-y-8">
                    {/* Providers */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="w-24 h-24 rounded-xl flex-shrink-0 bg-slate-200 dark:bg-slate-800" />
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-14 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                                ))}
                            </div>
                        </div>

                        <Skeleton className="h-16 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                    </div>
                </main>

                <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl">
                    <Skeleton className="h-14 w-full rounded-lg bg-primary/20" />
                </div>
            </div>
        </div>
    );
}

export function ElectricitySkeleton() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex justify-center font-[Manrope]">
            <div className="w-full max-w-[430px] min-h-screen bg-background-dark relative overflow-hidden flex flex-col">
                <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-10">
                    <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                    <Skeleton className="h-6 w-24 bg-white/5" />
                    <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
                </header>

                <main className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-white/5" />
                        <Skeleton className="h-14 w-full rounded-lg bg-white/5" />
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-12 flex-1 rounded-md bg-white/5" />
                        <Skeleton className="h-12 flex-1 rounded-md bg-white/5" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-white/5" />
                        <Skeleton className="h-14 w-full rounded-lg bg-white/5" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-white/5" />
                        <Skeleton className="h-14 w-full rounded-lg bg-white/5" />
                    </div>
                </main>

                <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-background-dark/95 backdrop-blur-xl">
                    <Skeleton className="h-14 w-full rounded-lg bg-primary/20" />
                </div>
            </div>
        </div>
    );
}
