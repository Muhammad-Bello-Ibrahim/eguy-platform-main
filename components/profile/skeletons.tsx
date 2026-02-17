import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
            {/* Header / Profile Section */}
            <div className="pt-12 pb-8 px-6 bg-gradient-to-b from-primary/5 to-transparent flex flex-col items-center">
                <Skeleton className="w-28 h-28 rounded-full border-2 border-primary/20 mb-4" />
                <Skeleton className="h-8 w-48 mb-2 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-32 mb-4 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-8 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>

            <main className="px-5 space-y-6">
                {[1, 2, 3, 4].map((section) => (
                    <div key={section} className="space-y-3">
                        <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-800" />
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-4 space-y-4">
                            {[1, 2].map((item) => (
                                <div key={item} className="flex items-center gap-4">
                                    <Skeleton className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-700" />
                                        <Skeleton className="h-3 w-48 bg-slate-100 dark:bg-slate-700" />
                                    </div>
                                    <Skeleton className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}

export function EditProfileSkeleton() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
            {/* Header */}
            <header className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                <Skeleton className="w-16 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-24 h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="w-10"></div>
            </header>

            <main className="pt-8 px-6 pb-12 space-y-8">
                <div className="flex flex-col items-center">
                    <Skeleton className="w-32 h-32 rounded-full mb-4 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                        </div>
                    ))}
                </div>

                <Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 mt-8" />
            </main>
        </div>
    );
}

export function BankingSkeleton() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
            {/* Header */}
            <header className="px-6 pt-14 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-32 h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="w-10" />
            </header>

            <main className="px-5 pt-6 space-y-8">
                <div className="flex justify-between px-1">
                    <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-5 w-20 bg-slate-200 dark:bg-slate-800" />
                </div>

                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl p-5 h-32 relative">
                            <div className="flex gap-4">
                                <Skeleton className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-700" />
                                    <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-slate-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Skeleton className="h-24 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700" />
            </main>
        </div>
    );
}

export function NotificationsSkeleton() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
            <header className="px-6 pt-14 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-white/5">
                <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-48 h-6 bg-slate-200 dark:bg-slate-800" />
                <div className="w-10" />
            </header>

            <main className="px-5 pt-6 space-y-8">
                {[1, 2, 3].map((section) => (
                    <div key={section} className="space-y-3">
                        <div className="flex gap-2 px-1">
                            <Skeleton className="w-5 h-5 bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5 last:border-0">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40 bg-slate-100 dark:bg-slate-700" />
                                        <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-slate-700" />
                                    </div>
                                    <Skeleton className="w-11 h-6 rounded-full bg-slate-100 dark:bg-slate-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}

export function PayoutsSkeleton() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-32">
            <header className="px-6 pt-14 pb-4 flex items-center gap-4 border-b border-slate-200 dark:border-white/5">
                <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="w-32 h-6 bg-slate-200 dark:bg-slate-800" />
            </header>

            <main className="px-5 space-y-6 pt-6">
                <Skeleton className="h-48 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />

                <div className="space-y-3">
                    <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
                </div>

                <Skeleton className="h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 mt-6" />
            </main>
        </div>
    );
}
