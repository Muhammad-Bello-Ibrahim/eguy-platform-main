import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import { Database } from "@/lib/database"
import { createSession, generateReferralCode } from "@/lib/auth"

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export async function POST(request: NextRequest) {
    try {
        const { credential } = await request.json()

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload()

        if (!payload || !payload.email) {
            return NextResponse.json({ error: "Invalid Google token" }, { status: 400 })
        }

        const { email, name, picture, sub: googleId } = payload

        // Find or create user
        let user = await Database.findUserByEmail(email)

        if (!user) {
            // Create new user
            user = await Database.createUser({
                fullName: name || "Google User",
                email,
                phone: "", // Google doesn't provide phone by default
                role: "user",
                status: "active",
                kycStatus: "pending",
                walletBalance: 0,
                referralCode: generateReferralCode(),
                avatar: picture,
                elevatexActivated: false,
            })
        } else {
            // Update avatar if missing
            if (!user.avatar && picture) {
                await Database.updateUserByEmail(email, { avatar: picture })
            }
        }

        // Create session
        await createSession({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.fullName,
        })

        return NextResponse.json({ success: true, user })

    } catch (error) {
        console.error("Google auth error:", error)
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
}
