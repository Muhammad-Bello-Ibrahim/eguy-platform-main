import { NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { createSession, generateReferralCode } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const { accessToken } = await request.json()

        if (!accessToken) {
            return NextResponse.json({ error: "Access token is required" }, { status: 400 })
        }

        // Verify the Google token by fetching user info
        // Since we are using an access token from the frontend (implicit flow),
        // we need to call the UserInfo endpoint instead of verifying an ID token.
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!userInfoResponse.ok) {
            return NextResponse.json({ error: "Failed to fetch user info from Google" }, { status: 401 })
        }

        const payload = await userInfoResponse.json()

        if (!payload || !payload.email) {
            return NextResponse.json({ error: "Invalid Google token or missing email" }, { status: 400 })
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
