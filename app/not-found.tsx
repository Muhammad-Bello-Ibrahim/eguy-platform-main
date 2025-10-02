"use client"

import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 px-8 py-12 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-primary mb-2">Page Not Found</h2>
        <p className="text-base text-muted-foreground mb-6 text-center max-w-xs">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/dashboard" className="mt-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg shadow-lg transition-all duration-200 active:scale-95">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
