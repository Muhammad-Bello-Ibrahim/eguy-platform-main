import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isDashboard = pathname.startsWith("/dashboard")
  const isAdmin = pathname.startsWith("/admin")

  // Protect dashboard: redirect to login if no session
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const user = session?.user as any

  // Redirect admin user from dashboard → admin panel
  if (isDashboard && user && user.email === "oraotechnologiesltd@gmail.com" && user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Restrict unverified users from dashboard/admin — send to verify-prompt
  if ((isDashboard || isAdmin) && user && user.kycStatus !== "verified") {
    return NextResponse.redirect(
      new URL(`/verify-prompt?email=${encodeURIComponent(user.email)}`, request.url)
    )
  }

  // Protect admin route
  if (isAdmin) {
    if (!user || user.email !== "oraotechnologiesltd@gmail.com" || user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Prevent signed-in VERIFIED users from accessing auth pages
  if (isAuthPage && session && user) {
    if (user.email === "oraotechnologiesltd@gmail.com" && user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    // Only redirect away from auth if already verified
    if (user.kycStatus === "verified") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Note: verify-prompt is intentionally NOT in the matcher — it must be accessible
  // to both verified and unverified users without middleware loops
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register/:path*"],
}
