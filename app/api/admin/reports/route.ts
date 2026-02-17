export const dynamic = "force-dynamic"; // ensure no static optimization
export const revalidate = 0; // disable ISR
// export const runtime = "nodejs"; // optional if you need Node APIs

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { handleApiError, AuthenticationError, AuthorizationError } from "@/lib/errors"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }
    if (session.user.role !== "admin") {
      throw new AuthorizationError();
    }

    // TODO: Implement actual database queries for reports data
    const reportsData = {
      summary: {
        totalRevenue: 2450000,
        totalUsers: 1247,
        totalTransactions: 8934,
        growthRate: 15.7
      },
      revenue: {
        daily: [
          { date: "2024-01-15", amount: 45000 },
          { date: "2024-01-14", amount: 38000 },
          { date: "2024-01-13", amount: 52000 },
          { date: "2024-01-12", amount: 41000 },
          { date: "2024-01-11", amount: 47000 }
        ],
        monthly: [
          { month: "Jan", amount: 245000 },
          { month: "Dec", amount: 210000 },
          { month: "Nov", amount: 195000 },
          { month: "Oct", amount: 180000 }
        ],
        byService: [
          { service: "Airtime", amount: 890000, percentage: 36.3 },
          { service: "Data", amount: 675000, percentage: 27.6 },
          { service: "Electricity", amount: 445000, percentage: 18.2 },
          { service: "Cable TV", amount: 320000, percentage: 13.1 },
          { service: "Exam Pins", amount: 120000, percentage: 4.9 }
        ]
      },
      users: {
        byLocation: [
          { location: "Lagos", count: 456, percentage: 36.6 },
          { location: "Abuja", count: 234, percentage: 18.8 },
          { location: "Port Harcourt", count: 189, percentage: 15.2 },
          { location: "Kano", count: 145, percentage: 11.6 },
          { location: "Others", count: 223, percentage: 17.9 }
        ],
        byKycStatus: [
          { status: "Verified", count: 1089, percentage: 87.3 },
          { status: "Pending", count: 123, percentage: 9.9 },
          { status: "Rejected", count: 35, percentage: 2.8 }
        ],
        growth: [
          { month: "Jan", newUsers: 156, total: 1247 },
          { month: "Dec", newUsers: 134, total: 1091 },
          { month: "Nov", newUsers: 145, total: 957 }
        ]
      },
      transactions: {
        successRate: 98.0,
        averageValue: 2750,
        byType: [
          { type: "Deposit", count: 2341, amount: 4500000 },
          { type: "Withdrawal", count: 1876, amount: 3200000 },
          { type: "Airtime", count: 1543, amount: 1250000 },
          { type: "Data", count: 1234, amount: 1450000 },
          { type: "Electricity", count: 876, amount: 2100000 }
        ],
        failures: [
          { reason: "Insufficient Balance", count: 89 },
          { reason: "Network Error", count: 45 },
          { reason: "Invalid Details", count: 34 },
          { reason: "System Error", count: 12 }
        ]
      }
    }

    return NextResponse.json(reportsData)
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/reports',
    });
  }
}
