"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { DepositModal } from "../dashboard/deposit-modal"
import { MaterialWallet, MaterialPromo, MaterialNotifications, MaterialProfile, MaterialPlus } from "./material-icons"

export default function MobileNav({ onFundWallet }: { onFundWallet?: () => void }) {
  const router = useRouter()
  const [showDeposit, setShowDeposit] = useState(false)
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t flex md:hidden justify-between items-center px-4 py-3 rounded-t-3xl">
        <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl transition-all duration-200 active:bg-primary/10" onClick={() => router.push('/dashboard')} aria-label="Wallet">
          <span className="flex items-center justify-center w-full h-8"><MaterialWallet /></span>
          <span className="text-xs font-medium text-primary">Wallet</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl transition-all duration-200 active:bg-primary/10" onClick={() => router.push('/elevatex')} aria-label="ElevateX">
          <span className="flex items-center justify-center w-full h-8"><MaterialPromo /></span>
          <span className="text-xs font-medium text-primary">ElevateX</span>
        </button>
        <div className="relative flex flex-col items-center justify-center w-1/5">
          <button
            className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full shadow-xl bg-gradient-to-br from-primary to-secondary text-white border-4 border-white w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="Fund Wallet"
            onClick={() => setShowDeposit(true)}
          >
            <span className="flex items-center justify-center w-full h-10"><MaterialPlus /></span>
          </button>
        </div>
        <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl transition-all duration-200 active:bg-primary/10" onClick={() => router.push('/notifications')} aria-label="Notifications">
          <span className="flex items-center justify-center w-full h-8"><MaterialNotifications /></span>
          <span className="text-xs font-medium text-primary">Notifications</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl transition-all duration-200 active:bg-primary/10" onClick={() => router.push('/profile')} aria-label="Profile">
          <span className="flex items-center justify-center w-full h-8"><MaterialProfile /></span>
          <span className="text-xs font-medium text-primary">Profile</span>
        </button>
      </nav>
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} onSuccess={() => setShowDeposit(false)} />
    </>
  )
}
