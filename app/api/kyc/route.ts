import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user's KYC information
    const kycData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      kycStatus: user.kycStatus || "not_submitted",
      submittedDocuments: user.submittedDocuments || [],
      verificationStatus: user.verificationStatus || "pending",
      submittedAt: user.kycSubmittedAt || null,
      verifiedAt: user.kycVerifiedAt || null,
      rejectionReason: user.kycRejectionReason || null
    }

    return NextResponse.json({ kyc: kycData })
  } catch (error) {
    console.error("KYC fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { documentType, documentNumber, documentImage, selfieImage } = body

    if (!documentType || !documentNumber || !documentImage || !selfieImage) {
      return NextResponse.json({ error: "Missing required KYC information" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create KYC submission record
    const kycSubmission = {
      documentType,
      documentNumber,
      documentImage,
      selfieImage,
      status: "pending",
      submittedAt: new Date()
    }

    // Update user KYC status
    const updated = await Database.updateUserByEmail(session.user.email, {
      kycStatus: "submitted",
      submittedDocuments: [kycSubmission],
      kycSubmittedAt: new Date()
    })

    if (!updated) {
      return NextResponse.json({ error: "Failed to submit KYC" }, { status: 500 })
    }

    return NextResponse.json({
      message: "KYC submitted successfully",
      kyc: {
        status: "submitted",
        submittedAt: new Date()
      }
    })
  } catch (error) {
    console.error("KYC submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    // Only admins can update KYC status
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("email")

    if (!userEmail) {
      return NextResponse.json({ error: "User email required" }, { status: 400 })
    }

    const updateData: any = {
      kycStatus: status
    }

    if (status === "verified") {
      updateData.kycVerifiedAt = new Date()
      updateData.verificationStatus = "verified"
    } else if (status === "rejected") {
      updateData.kycRejectionReason = rejectionReason
      updateData.verificationStatus = "rejected"
    }

    const updated = await Database.updateUserByEmail(userEmail, updateData)

    if (!updated) {
      return NextResponse.json({ error: "Failed to update KYC status" }, { status: 500 })
    }

    return NextResponse.json({
      message: "KYC status updated successfully",
      kyc: {
        status,
        updatedAt: new Date()
      }
    })
  } catch (error) {
    console.error("KYC update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
