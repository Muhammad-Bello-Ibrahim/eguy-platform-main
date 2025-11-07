import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic database method
    const userCount = await Database.getUserCount()
    console.log("User count from database:", userCount)

    return NextResponse.json({
      success: true,
      userCount,
      message: "Database connection successful"
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Database connection failed"
    })
  }
}
