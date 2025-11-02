import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "your-secret-key"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input) {
  try {
    if (!input) return null
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Safe version of getSession — requires an active request context.
 * Avoids being executed during build analysis.
 */
export async function getSession(req) {
  try {
    // If `req` is available (API route or server action)
    const cookieStore =
      req?.cookies || (typeof cookies === "function" ? cookies() : null)
    const session = cookieStore?.get("session")?.value
    if (!session) return null
    return await decrypt(session)
  } catch (error) {
    // Build-time or context errors are caught here
    console.error("getSession error:", error.message)
    return null
  }
}

export async function createSession(user) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ user, expires })

  cookies().set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  cookies().delete("session")
}

export function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
