export const dynamic = "force-dynamic";
export const revalidate = 0;
// export const runtime = "nodejs";

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Fetching admin stats for user:", session.user.email);

    let userCount = 0;
    try {
      userCount = await Database.getUserCount();
      console.log("Database connection successful, user count:", userCount);
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      throw dbError;
    }

    let totalUsers = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let pendingWithdrawals = 0;
    let monthlyRevenue = 0;
    let totalTransactions = 0;
    let successfulTransactions = 0;
    let totalUsersFund = 0;
    let referralStats = {
      totalReferrals: 0,
      activeReferrals: 0,
      totalBonusPaid: 0,
      averageTreeSize: 0,
      topReferrer: "No referrals yet"
    };
    let serviceStats = {
      airtimeTransactions: 0,
      dataTransactions: 0,
      billPayments: 0,
      subscriptions: 0,
      mostPopularService: "Airtime"
    };

    try { totalUsers = await Database.getUserCount() || 0; } catch (error) { console.error("Error getting user count:", error); }
    try { totalDeposits = await Database.getTotalDeposits() || 0; } catch (error) { console.error("Error getting total deposits:", error); }
    try { totalWithdrawals = await Database.getTotalWithdrawals() || 0; } catch (error) { console.error("Error getting total withdrawals:", error); }
    try { pendingWithdrawals = await Database.getPendingWithdrawals() || 0; } catch (error) { console.error("Error getting pending withdrawals:", error); }
    try { monthlyRevenue = await Database.getMonthlyRevenue() || 0; } catch (error) { console.error("Error getting monthly revenue:", error); }
    try { totalTransactions = await Database.getTransactionCount() || 0; } catch (error) { console.error("Error getting transaction count:", error); }
    try { successfulTransactions = await Database.getSuccessfulTransactionCount() || 0; } catch (error) { console.error("Error getting successful transaction count:", error); }
    try { totalUsersFund = await Database.getTotalUsersFund() || 0; } catch (error) { console.error("Error getting total users fund:", error); }
    try { referralStats = await Database.getReferralStats(); } catch (error) { console.error("Error getting referral stats:", error); }
    try { serviceStats = await Database.getServiceUsageStats(); } catch (error) { console.error("Error getting service usage stats:", error); }

    const netRevenue = totalDeposits - totalWithdrawals;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
    const averageTransactionValue = successfulTransactions > 0 ? totalDeposits / successfulTransactions : 0;
    const profitMargin = netRevenue - totalUsersFund;

    const stats = {
      users: {
        total: totalUsers || 0,
        active: Math.floor((totalUsers || 0) * 0.85),
        suspended: Math.floor((totalUsers || 0) * 0.02),
        newThisMonth: Math.floor((totalUsers || 0) * 0.12),
        growth: 12.5,
      },
      financial: {
        totalDeposits: totalDeposits || 0,
        totalWithdrawals: totalWithdrawals || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        netRevenue: netRevenue || 0,
        monthlyRevenue: monthlyRevenue || 0,
        totalUsersFund: totalUsersFund || 0,
        profitMargin: profitMargin || 0,
        revenueGrowth: 8.3,
      },
      referrals: {
        totalReferrals: referralStats.totalReferrals || 0,
        activeReferrals: referralStats.activeReferrals || 0,
        totalBonusPaid: referralStats.totalBonusPaid || 0,
        averageTreeSize: referralStats.averageTreeSize || 0,
        topReferrer: referralStats.topReferrer || "No referrals yet",
        referralGrowth: 15.2,
      },
      transactions: {
        totalTransactions: totalTransactions || 0,
        successfulTransactions: successfulTransactions || 0,
        failedTransactions: Math.max(0, totalTransactions - successfulTransactions),
        successRate: Math.round((successRate || 0) * 100) / 100,
        averageTransactionValue: Math.round(averageTransactionValue || 0),
      },
      services: {
        airtimeTransactions: serviceStats.airtimeTransactions || 0,
        dataTransactions: serviceStats.dataTransactions || 0,
        billPayments: serviceStats.billPayments || 0,
        subscriptions: serviceStats.subscriptions || 0,
        mostPopularService: serviceStats.mostPopularService || "Airtime",
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
