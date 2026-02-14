import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { DepositModal } from "../dashboard/deposit-modal"
import { Wallet, TrendingUp, Bell, Settings, Home } from "lucide-react"

export default function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [showDeposit, setShowDeposit] = useState(false)

  // Determine active tab based on current pathname
  const getTabClasses = (tabPath: string) => {
    // Check if the current path matches the tab path
    const isActive = pathname === tabPath ||
      (tabPath === '/dashboard' && pathname === '/') ||
      (tabPath === '/notifications' && pathname.startsWith('/notifications')) ||
      (tabPath === '/settings' && pathname.startsWith('/settings')) ||
      (tabPath === '/elevatex' && pathname.startsWith('/elevatex'));

    return `flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 w-full ${isActive
        ? 'text-blue-600 bg-blue-50/80 scale-105'
        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
      }`
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[100] md:hidden pb-safe-area shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 gap-2 px-4 py-2 max-w-md mx-auto">
          <button
            className={getTabClasses('/dashboard')}
            onClick={() => router.push('/dashboard')}
            aria-label="Wallet"
          >
            <Wallet className="w-6 h-6 mb-1 transition-transform duration-300" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-wide">Wallet</span>
          </button>

          <button
            className={getTabClasses('/elevatex')}
            onClick={() => router.push('/elevatex')}
            aria-label="ElevateX"
          >
            <TrendingUp className="w-6 h-6 mb-1 transition-transform duration-300" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-wide">ElevateX</span>
          </button>

          <button
            className={`${getTabClasses('/notifications')} relative`}
            onClick={() => router.push('/notifications')}
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell className="w-6 h-6 mb-1 transition-transform duration-300" strokeWidth={2} />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-[10px] font-semibold tracking-wide">Alerts</span>
          </button>

          <button
            className={getTabClasses('/settings')}
            onClick={() => router.push('/settings')}
            aria-label="Settings"
          >
            <Settings className="w-6 h-6 mb-1 transition-transform duration-300" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-wide">Settings</span>
          </button>
        </div>
      </nav>

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onSuccess={() => setShowDeposit(false)} />
    </>
  )
}
