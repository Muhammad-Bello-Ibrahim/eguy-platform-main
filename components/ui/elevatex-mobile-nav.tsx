"use client"

import { useRouter } from "next/navigation"
import { MaterialWallet, MaterialPromo, MaterialNotifications, MaterialProfile } from "./material-icons"

export default function ElevatexMobileNav({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t flex md:hidden justify-between items-center px-4 py-3">
      <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl" onClick={onBack} aria-label="Back to eGuy">
        <span className="flex items-center justify-center w-full h-8">
          {/* Arrow Icon */}
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M15 19l-7-7 7-7"/><line x1="22" y1="12" x2="8" y2="12"/></svg>
        </span>
        <span className="text-xs font-medium text-primary">Back</span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl" onClick={() => router.push('/elevatex/wallet')} aria-label="Wallet">
        <span className="flex items-center justify-center w-full h-8"><MaterialWallet /></span>
        <span className="text-xs font-medium text-primary">Wallet</span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl" onClick={() => router.push('/elevatex/referrals')} aria-label="Referrals">
        <span className="flex items-center justify-center w-full h-8">
          {/* Referrals icon (use MaterialProfile for now) */}
          <MaterialProfile />
        </span>
        <span className="text-xs font-medium text-primary">Referrals</span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl" onClick={() => router.push('/elevatex/leaderboards')} aria-label="Leaderboards">
        <span className="flex items-center justify-center w-full h-8">
          {/* Leaderboards icon (use MaterialPromo for now) */}
          <MaterialPromo />
        </span>
        <span className="text-xs font-medium text-primary">Leaderboards</span>
      </button>
      <button className="flex flex-col items-center justify-center gap-1 w-1/5 p-2 rounded-xl" onClick={() => router.push('/elevatex/profile')} aria-label="Profile">
        <span className="flex items-center justify-center w-full h-8"><MaterialProfile /></span>
        <span className="text-xs font-medium text-primary">Profile</span>
      </button>
    </nav>
  )
}
