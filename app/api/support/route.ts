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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // "all", "open", "in_progress", "closed"
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // TODO: Implement actual support tickets database query
    const mockTickets = [
      {
        id: "TICKET_001",
        subject: "Unable to complete withdrawal",
        description: "I've been trying to withdraw ₦5,000 but the transaction keeps failing. Please help.",
        category: "withdrawal",
        priority: "high",
        status: "open",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        responses: [
          {
            id: "RESP_001",
            message: "We're looking into this issue. Please provide your transaction reference number.",
            from: "support",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: "TICKET_002",
        subject: "Referral bonus not credited",
        description: "I referred a friend 3 days ago but haven't received my bonus yet.",
        category: "referrals",
        priority: "medium",
        status: "in_progress",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        responses: [
          {
            id: "RESP_002",
            message: "Thank you for your patience. We're verifying the referral and will credit your bonus shortly.",
            from: "support",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: "TICKET_003",
        subject: "KYC verification taking too long",
        description: "I submitted my documents for verification 5 days ago but still haven't heard back.",
        category: "kyc",
        priority: "medium",
        status: "closed",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        responses: [
          {
            id: "RESP_003",
            message: "Your KYC has been approved! You can now withdraw up to ₦1,000,000 per day.",
            from: "support",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ]

    // Filter tickets based on status
    let filteredTickets = mockTickets
    if (status && status !== "all") {
      filteredTickets = mockTickets.filter(ticket => ticket.status === status)
    }

    // Sort by creation date (newest first) and apply pagination
    filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const paginatedTickets = filteredTickets.slice(offset, offset + limit)

    return NextResponse.json({
      tickets: paginatedTickets,
      total: filteredTickets.length,
      hasMore: offset + limit < filteredTickets.length
    })
  } catch (error) {
    console.error("Support tickets fetch error:", error)
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
    const { subject, description, category, priority = "medium" } = body

    if (!subject || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement actual ticket creation in database
    const newTicket = {
      id: `TICKET_${Date.now()}`,
      userId: user.id,
      subject,
      description,
      category,
      priority,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
      responses: []
    }

    return NextResponse.json({
      message: "Support ticket created successfully",
      ticket: newTicket
    })
  } catch (error) {
    console.error("Support ticket creation error:", error)
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
    const { ticketId, message } = body

    if (!ticketId || !message) {
      return NextResponse.json({ error: "Ticket ID and message required" }, { status: 400 })
    }

    // TODO: Implement actual response addition to ticket
    const newResponse = {
      id: `RESP_${Date.now()}`,
      message,
      from: "user",
      createdAt: new Date()
    }

    return NextResponse.json({
      message: "Response added to ticket successfully",
      response: newResponse
    })
  } catch (error) {
    console.error("Support response error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
