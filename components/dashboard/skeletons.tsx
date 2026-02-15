import { Skeleton } from "@/components/ui/skeleton";

export function BalanceCardSkeleton() {
    return (
        <div className="w-full bg-slate-900 rounded-3xl p-6 relative overflow-hidden h-auto flex flex-col justify-between">
            <div className="space-y-2 mb-6">
                <Skeleton className="h-4 w-24 bg-slate-800" />
                <Skeleton className="h-10 w-48 bg-slate-800" />
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-12 w-full rounded-xl bg-slate-800" />
                <Skeleton className="h-12 w-12 rounded-xl bg-slate-800" />
            </div>
        </div>
    )
}

export function QuickActionsSkeleton() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <Skeleton className="w-16 h-3" />
                </div>
            ))}
        </div>
    );
}

export function TransactionItemSkeleton() {
    return (
        <div className="flex items-center p-4 border border-slate-100 dark:border-primary/5 rounded-2xl bg-white dark:bg-card-dark/40">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="ml-4 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
            </div>
            <div className="ml-4">
                <Skeleton className="h-5 w-20" />
            </div>
        </div>
    )
}

export function TransactionsListSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20 mb-2" />
                {[1, 2, 3].map((i) => (
                    <TransactionItemSkeleton key={`g1-${i}`} />
                ))}
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20 mb-2" />
                {[1, 2].map((i) => (
                    <TransactionItemSkeleton key={`g2-${i}`} />
                ))}
            </div>
        </div>
    )
}
