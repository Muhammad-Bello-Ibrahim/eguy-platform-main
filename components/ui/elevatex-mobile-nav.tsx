import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Wallet, Users, Trophy, User } from "lucide-react"

export default function ElevatexMobileNav({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const pathname = usePathname()

  const getTabClasses = (tabPath: string) => {
    const isActive = pathname === tabPath || pathname?.startsWith(tabPath);
    return `flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-2xl transition-all duration-300 ${isActive
        ? 'text-primary bg-primary/10 scale-105'
        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
      }`
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-t border-gray-100 flex md:hidden justify-between items-center px-4 py-2 pb-safe-area shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
      <button
        className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 transition-all duration-300"
        onClick={onBack}
        aria-label="Back to eGuy"
      >
        <ArrowLeft className="w-6 h-6 mb-0.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-wide">Back</span>
      </button>

      <button
        className={getTabClasses('/elevatex/wallet')}
        onClick={() => router.push('/elevatex/wallet')}
        aria-label="Wallet"
      >
        <Wallet className="w-6 h-6 mb-0.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-wide">Wallet</span>
      </button>

      <button
        className={getTabClasses('/elevatex/referrals')}
        onClick={() => router.push('/elevatex/referrals')}
        aria-label="Referrals"
      >
        <Users className="w-6 h-6 mb-0.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-wide">Referrals</span>
      </button>

      <button
        className={getTabClasses('/elevatex/leaderboards')}
        onClick={() => router.push('/elevatex/leaderboards')}
        aria-label="Leaderboards"
      >
        <Trophy className="w-6 h-6 mb-0.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-wide">Leaderboard</span>
      </button>

      <button
        className={getTabClasses('/elevatex/profile')}
        onClick={() => router.push('/elevatex/profile')}
        aria-label="Profile"
      >
        <User className="w-6 h-6 mb-0.5" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-wide">Profile</span>
      </button>
    </nav>
  )
}
