"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { DepositModal } from "../dashboard/deposit-modal"

export default function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [showDeposit, setShowDeposit] = useState(false)

  // Determine active tab based on current pathname
  const getTabClasses = (tabPath: string) => {
    const isActive = pathname === tabPath ||
      (tabPath === '/dashboard' && pathname === '/') ||
      (tabPath === '/notifications' && pathname.startsWith('/notifications'))

    return `flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-3">
          <button
            className={getTabClasses('/dashboard')}
            onClick={() => router.push('/dashboard')}
            aria-label="Wallet"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-xs font-medium">Wallet</span>
          </button>

          <button
            className={getTabClasses('/elevatex')}
            onClick={() => router.push('/elevatex')}
            aria-label="ElevateX"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium">ElevateX</span>
          </button>

          <button
            className={`${getTabClasses('/notifications')} relative`}
            onClick={() => router.push('/notifications')}
            aria-label="Notifications"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5h5m-5-5v5h5M4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-7.362 12-9.683a5.017 5.017 0 00-10-3.634A5.017 5.017 0 004 11.317c0 2.32 4.038 9.683 12 9.683 7.962 0 12-7.362 12-9.683a5.017 5.017 0 00-10-3.634" />
            </svg>
            <span className="text-xs font-medium">Alerts</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          <button
            className={getTabClasses('/settings')}
            onClick={() => router.push('/settings')}
            aria-label="Settings"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </nav>

      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onSuccess={() => setShowDeposit(false)} />
    </>
  )
}
