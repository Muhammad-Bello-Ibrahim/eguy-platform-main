import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "@/lib/auth"
export async function middleware(request: NextRequest) {
  const session = await getSession()
  const isAuthPage = request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/signup")
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")

  // Protect dashboard for authenticated users
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // Redirect admin users to admin panel when accessing dashboard
  if (isDashboard && session && session.user.email === "oraotechnologiesltd@gmail.com" && session.user.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Restrict access for unverified users, but allow access to signin/signup
  if ((isDashboard || isAdmin) && session && session.user.kycStatus !== "verified" && !isAuthPage) {
    return NextResponse.redirect(new URL(`/verify-prompt?email=${encodeURIComponent(session.user.email)}`, request.url))
  }

  // Protect admin route for specific admin user
  if (isAdmin) {
    if (!session || session.user.email !== "oraotechnologiesltd@gmail.com" || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  // Prevent signed-in users from accessing auth pages
  if (isAuthPage && session) {
    // If admin, redirect to admin dashboard
    if (session.user.email === "oraotechnologiesltd@gmail.com" && session.user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/signin", "/signup"],
}
