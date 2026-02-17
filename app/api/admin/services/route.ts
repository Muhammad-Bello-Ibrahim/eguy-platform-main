import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { handleApiError, AuthenticationError, AuthorizationError } from "@/lib/errors"

export const dynamic = "force-dynamic";
export const revalidate = 0;
// export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      throw new AuthenticationError();
    }
    if (session.user.role !== "admin") {
      throw new AuthorizationError();
    }

    // TODO: Implement actual database queries for services data
    const servicesData = {
      totalServices: 8,
      activeServices: 8,
      serviceProviders: 5,
      totalTransactions: 45678,
      services: [
        {
          id: "airtime",
          name: "Airtime Top-up",
          provider: "Multiple Networks",
          status: "active",
          totalTransactions: 15456,
          successRate: 98.5,
          averageValue: 850,
          commission: 2.5
        },
        {
          id: "data",
          name: "Data Bundles",
          provider: "Multiple Networks",
          status: "active",
          totalTransactions: 12345,
          successRate: 97.8,
          averageValue: 1250,
          commission: 3.0
        },
        {
          id: "electricity",
          name: "Electricity Bills",
          provider: "Multiple DISCOs",
          status: "active",
          totalTransactions: 8765,
          successRate: 96.2,
          averageValue: 4500,
          commission: 1.5
        },
        {
          id: "cable",
          name: "Cable TV",
          provider: "DSTV, GOTV, Startimes",
          status: "active",
          totalTransactions: 5432,
          successRate: 94.5,
          averageValue: 3200,
          commission: 2.0
        },
        {
          id: "exam",
          name: "Exam Pins",
          provider: "WAEC, NECO, JAMB",
          status: "active",
          totalTransactions: 2341,
          successRate: 99.1,
          averageValue: 750,
          commission: 1.0
        }
      ],
      providers: [
        {
          id: "mtn",
          name: "MTN Nigeria",
          services: ["airtime", "data"],
          status: "active",
          uptime: 99.9,
          totalTransactions: 15456
        },
        {
          id: "airtel",
          name: "Airtel Nigeria",
          services: ["airtime", "data"],
          status: "active",
          uptime: 99.7,
          totalTransactions: 12345
        },
        {
          id: "eko",
          name: "Eko Electricity",
          services: ["electricity"],
          status: "active",
          uptime: 98.5,
          totalTransactions: 4321
        }
      ]
    }

    return NextResponse.json(servicesData)
  } catch (error) {
    return handleApiError(error as Error, {
      route: '/api/admin/services',
    });
  }
}
