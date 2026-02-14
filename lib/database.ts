// Database connection and operations
// This would typically connect to MongoDB Atlas in production

export interface DatabaseUser {
  id: string
  fullName: string
  email: string
  phone: string
  passwordHash?: string
  walletBalance: number
  referralCode: string
  referredBy?: string
  kycStatus: "pending" | "verified" | "rejected"
  status: "active" | "suspended" | "inactive"
  role: "user" | "admin"
  avatar?: string
  payoutAccount?: {
    bank: string;
    accountNumber: string;
    accountName: string;
    recipientCode?: string;
  };
  elevatexActivated?: boolean;
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "referral_bonus"
  amount: number
  description: string
  status: "pending" | "completed" | "failed" | "cancelled"
  reference?: string
  metadata?: any
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  id: string
  referrerId: string
  referredId: string
  level: number
  bonusAmount: number
  status: "active" | "completed" | "inactive"
  createdAt: Date
}

import mongoose from "mongoose"
import { MongoClient, ObjectId } from "mongodb"
import Notification from "./models/Notification"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/eguy"
const client = new MongoClient(uri)
const dbName = uri.split("/").pop()?.split("?")[0] || "eguy"
let db: any
let mongooseConnected = false

export class Database {
  static async getDb() {
    if (!db) {
      try {
        await client.connect()
        db = client.db(dbName)
        console.log("Database connected successfully")
      } catch (error) {
        console.error("Database connection failed:", error)
        throw new Error("Database connection failed")
      }
    }
    return db
  }

  static async connectMongoose() {
    if (!mongooseConnected && uri) {
      try {
        await mongoose.connect(uri)
        mongooseConnected = true
        console.log("Mongoose connected successfully")
      } catch (error) {
        console.error("Mongoose connection error:", error)
        throw error
      }
    }
  }
  static async findUserByReferralCode(referralCode: string): Promise<DatabaseUser | null> {
    const db = await Database.getDb();
    const user = await db.collection("users").findOne({ referralCode });
    if (!user) return null;
    return {
      ...user,
      id: user._id.toString(),
    };
  }
  static async updateUserPayoutAccount(email: string, payoutAccount: { bank: string; accountNumber: string; accountName: string }): Promise<DatabaseUser | null> {
    const db = await Database.getDb();
    await db.collection("users").updateOne(
      { email },
      { $set: { payoutAccount, updatedAt: new Date() } }
    );
    const user = await db.collection("users").findOne({ email });
    if (!user) return null;
    return {
      ...user,
      id: user._id.toString(),
    };
  }
  static async updateUserById(userId: string, updates: Partial<Omit<DatabaseUser, "id" | "createdAt" | "updatedAt">>): Promise<DatabaseUser | null> {
    const db = await Database.getDb()
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return null
    }

    // Return the updated user
    const updatedUser = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return {
      ...updatedUser,
      id: updatedUser._id.toString(),
    }
  }

  static async updateUserByEmail(email: string, updates: Partial<Omit<DatabaseUser, "id" | "createdAt" | "updatedAt">>): Promise<DatabaseUser | null> {
    const db = await Database.getDb()
    const result = await db.collection("users").updateOne(
      { email },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return null
    }

    // Return the updated user
    const updatedUser = await db.collection("users").findOne({ email })
    return {
      ...updatedUser,
      id: updatedUser._id.toString(),
    }
  }
  static async createUser(userData: Omit<DatabaseUser, "id" | "createdAt" | "updatedAt">): Promise<DatabaseUser> {
    const db = await Database.getDb();
    const now = new Date();
    const result = await db.collection("users").insertOne({
      ...userData,
      role: "user", // default role
      createdAt: now,
      updatedAt: now,
    });
    const user = await db.collection("users").findOne({ _id: result.insertedId });
    return {
      ...user,
      id: user._id.toString(),
    };
  }

  static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const db = await Database.getDb()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async findUserByPhone(phone: string): Promise<DatabaseUser | null> {
    const db = await Database.getDb()
    const user = await db.collection("users").findOne({ phone })
    if (!user) return null
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async findUserById(id: string): Promise<DatabaseUser | null> {
    const db = await Database.getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!user) return null;
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async updateUserWallet(userId: string, amount: number): Promise<void> {
    const db = await Database.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { walletBalance: amount }, $set: { updatedAt: new Date() } }
    )
  }

  static async createTransaction(transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
    const db = await Database.getDb()
    const now = new Date()
    const result = await db.collection("transactions").insertOne({
      ...transactionData,
      createdAt: now,
      updatedAt: now,
    })
    const transaction = await db.collection("transactions").findOne({ _id: result.insertedId })
    return {
      ...transaction,
      id: transaction._id.toString(),
    }
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    const db = await Database.getDb()
    const transactions = await db.collection("transactions").find({ userId }).toArray()
    return transactions.map((t: any) => ({ ...t, id: t._id.toString() }))
  }

  static async findTransactionById(id: string): Promise<Transaction | null> {
    const db = await Database.getDb()
    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) })
    if (!transaction) return null
    return {
      ...transaction,
      id: transaction._id.toString(),
    }
  }

  static async findTransactionByReference(reference: string): Promise<Transaction | null> {
    const db = await Database.getDb()
    const transaction = await db.collection("transactions").findOne({ reference })
    if (!transaction) return null
    return {
      ...transaction,
      id: transaction._id.toString(),
    }
  }

  static async updateTransactionStatus(reference: string, status: "pending" | "completed" | "failed" | "cancelled"): Promise<void> {
    const db = await Database.getDb()
    await db.collection("transactions").updateOne(
      { reference },
      { $set: { status, updatedAt: new Date() } }
    )
  }

  static async updateTransactionStatusAtomic(
    reference: string,
    expectedStatus: "pending" | "completed" | "failed" | "cancelled",
    newStatus: "pending" | "completed" | "failed" | "cancelled"
  ): Promise<boolean> {
    const db = await Database.getDb()
    const result = await db.collection("transactions").updateOne(
      { reference, status: expectedStatus },
      { $set: { status: newStatus, updatedAt: new Date() } }
    )
    // Returns true only if a document was actually modified
    return result.modifiedCount > 0
  }

  static async createReferral(referralData: Omit<Referral, "id" | "createdAt">): Promise<Referral> {
    const db = await Database.getDb()
    const now = new Date()
    const result = await db.collection("referrals").insertOne({
      ...referralData,
      createdAt: now,
    })
    const referral = await db.collection("referrals").findOne({ _id: result.insertedId })
    return {
      ...referral,
      id: referral._id.toString(),
    }
  }

  static async getUserReferrals(userId: string): Promise<Referral[]> {
    const db = await Database.getDb()
    const referrals = await db.collection("referrals").find({ referrerId: userId }).toArray()
    return referrals.map((r: any) => ({ ...r, id: r._id.toString() }))
  }

  static async createNotification(notificationData: {
    userId: string;
    type: "transaction" | "referral" | "security" | "system" | "promotion";
    title: string;
    message: string;
    amount?: number;
    status?: "success" | "error" | "warning" | "info";
    actionUrl?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.connectMongoose();
    await Notification.create({
      userId: new ObjectId(notificationData.userId),
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      amount: notificationData.amount,
      status: notificationData.status || "info",
      actionUrl: notificationData.actionUrl,
      metadata: notificationData.metadata,
    });
  }

  static async getUserNotifications(
    userId: string,
    options: {
      type?: string;
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    } = {}
  ): Promise<any[]> {
    await this.connectMongoose();
    const { type, limit = 20, offset = 0, unreadOnly = false } = options;

    let query: any = { userId: new ObjectId(userId) };

    if (type && type !== "all") {
      if (type === "unread") {
        query.read = false;
      } else {
        query.type = type;
      }
    }

    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return notifications.map((n: any) => ({
      id: n._id.toString(),
      type: n.type,
      title: n.title,
      message: n.message,
      amount: n.amount,
      status: n.status,
      read: n.read,
      createdAt: n.createdAt,
      actionUrl: n.actionUrl,
      metadata: n.metadata,
    }));
  }

  static async markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<void> {
    await this.connectMongoose();
    await Notification.updateMany(
      {
        userId: new ObjectId(userId),
        _id: { $in: notificationIds.map(id => new ObjectId(id)) }
      },
      { read: true }
    );
  }

  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    await this.connectMongoose();
    await Notification.findOneAndDelete({
      _id: new ObjectId(notificationId),
      userId: new ObjectId(userId)
    });
  }

  static async getUnreadNotificationCount(userId: string): Promise<number> {
    await this.connectMongoose();
    return await Notification.countDocuments({
      userId: new ObjectId(userId),
      read: false
    });
  }

  static async getUserCount(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();
      const count = await db.collection("users").countDocuments({ role: "user" });
      console.log("User count:", count);
      return count || 0;
    } catch (error) {
      console.error("Error getting user count:", error);
      // Return 0 if database is not available (for development/testing)
      return 0;
    }
  }

  static async getTotalDeposits(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Check if there are any transactions first
      const transactionCount = await db.collection("transactions").countDocuments({ type: "deposit", status: "completed" });

      if (transactionCount === 0) {
        console.log("No completed deposit transactions found");
        return 0;
      }

      const result = await db.collection("transactions").aggregate([
        { $match: { type: "deposit", status: "completed" } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).toArray();

      console.log("Total deposits aggregation result:", result);
      return result.length > 0 ? Number(result[0].total) || 0 : 0;
    } catch (error) {
      console.error("Error calculating total deposits:", error);
      return 0;
    }
  }

  static async getTotalWithdrawals(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Check if there are any withdrawal transactions first
      const transactionCount = await db.collection("transactions").countDocuments({ type: "withdrawal", status: "completed" });

      if (transactionCount === 0) {
        console.log("No completed withdrawal transactions found");
        return 0;
      }

      const result = await db.collection("transactions").aggregate([
        { $match: { type: "withdrawal", status: "completed" } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).toArray();

      console.log("Total withdrawals aggregation result:", result);
      return result.length > 0 ? Number(result[0].total) || 0 : 0;
    } catch (error) {
      console.error("Error calculating total withdrawals:", error);
      return 0;
    }
  }

  static async getPendingWithdrawals(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Check if there are any pending withdrawal transactions first
      const transactionCount = await db.collection("transactions").countDocuments({ type: "withdrawal", status: "pending" });

      if (transactionCount === 0) {
        console.log("No pending withdrawal transactions found");
        return 0;
      }

      const result = await db.collection("transactions").aggregate([
        { $match: { type: "withdrawal", status: "pending" } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).toArray();

      console.log("Pending withdrawals aggregation result:", result);
      return result.length > 0 ? Number(result[0].total) || 0 : 0;
    } catch (error) {
      console.error("Error calculating pending withdrawals:", error);
      return 0;
    }
  }

  static async getMonthlyRevenue(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Check if there are any monthly transactions first
      const monthlyCount = await db.collection("transactions").countDocuments({
        type: "deposit",
        status: "completed",
        createdAt: { $gte: startOfMonth }
      });

      if (monthlyCount === 0) {
        console.log("No completed deposit transactions found for this month");
        return 0;
      }

      const result = await db.collection("transactions").aggregate([
        {
          $match: {
            type: "deposit",
            status: "completed",
            createdAt: { $gte: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).toArray();

      console.log("Monthly revenue aggregation result:", result);
      return result.length > 0 ? Number(result[0].total) || 0 : 0;
    } catch (error) {
      console.error("Error calculating monthly revenue:", error);
      return 0;
    }
  }

  static async getTransactionCount(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();
      const count = await db.collection("transactions").countDocuments({});
      console.log("Total transaction count:", count);
      return count || 0;
    } catch (error) {
      console.error("Error getting transaction count:", error);
      return 0;
    }
  }

  static async getSuccessfulTransactionCount(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();
      const count = await db.collection("transactions").countDocuments({ status: "completed" });
      console.log("Successful transaction count:", count);
      return count || 0;
    } catch (error) {
      console.error("Error getting successful transaction count:", error);
      return 0;
    }
  }

  static async getTotalUsersFund(): Promise<number> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // First check if there are any users
      const userCount = await db.collection("users").countDocuments({ role: "user" });

      if (userCount === 0) {
        console.log("No users found in database");
        return 0;
      }

      // Check if walletBalance field exists by looking at a sample document
      const sampleUser = await db.collection("users").findOne({ role: "user" }, { walletBalance: 1 });

      if (!sampleUser || sampleUser.walletBalance === undefined) {
        console.log("walletBalance field not found in users collection");
        return 0;
      }

      const result = await db.collection("users").aggregate([
        { $match: { role: "user" } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$walletBalance", 0] } } } }
      ]).toArray();

      console.log("Users fund aggregation result:", result);
      const total = result.length > 0 ? Number(result[0].total) || 0 : 0;
      console.log("Calculated total users fund:", total);
      return total;
    } catch (error) {
      console.error("Error calculating users fund:", error);
      return 0;
    }
  }

  static async getReferralStats(): Promise<{
    totalReferrals: number;
    activeReferrals: number;
    totalBonusPaid: number;
    averageTreeSize: number;
    topReferrer: string;
  }> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Get total referrals count
      const totalReferrals = await db.collection("referrals").countDocuments({});

      // Get active referrals (referrals with status "active")
      const activeReferrals = await db.collection("referrals").countDocuments({ status: "active" });

      // Get total bonus paid from referral_bonus transactions
      const bonusResult = await db.collection("transactions").aggregate([
        { $match: { type: "referral_bonus", status: "completed" } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).toArray();

      const totalBonusPaid = bonusResult.length > 0 ? Number(bonusResult[0].total) || 0 : 0;

      // Calculate average tree size (average referrals per referrer)
      const treeSizeResult = await db.collection("referrals").aggregate([
        { $group: { _id: "$referrerId", count: { $sum: 1 } } },
        { $group: { _id: null, avgSize: { $avg: "$count" } } }
      ]).toArray();

      const averageTreeSize = treeSizeResult.length > 0 ? Number(treeSizeResult[0].avgSize) || 0 : 0;

      // Find top referrer (user with most referrals)
      const topReferrerResult = await db.collection("referrals").aggregate([
        { $group: { _id: "$referrerId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray();

      let topReferrer = "No referrals yet";
      if (topReferrerResult.length > 0) {
        const topReferrerId = topReferrerResult[0]._id;
        if (ObjectId.isValid(topReferrerId)) {
          const topReferrerUser = await db.collection("users").findOne({ _id: new ObjectId(topReferrerId) });
          topReferrer = topReferrerUser ? topReferrerUser.fullName : "Unknown User";
        }
      }

      return {
        totalReferrals,
        activeReferrals,
        totalBonusPaid,
        averageTreeSize: Math.round(averageTreeSize * 100) / 100,
        topReferrer
      };
    } catch (error) {
      console.error("Error getting referral stats:", error);
      return {
        totalReferrals: 0,
        activeReferrals: 0,
        totalBonusPaid: 0,
        averageTreeSize: 0,
        topReferrer: "Unknown"
      };
    }
  }

  static async getServiceUsageStats(): Promise<{
    airtimeTransactions: number;
    dataTransactions: number;
    billPayments: number;
    subscriptions: number;
    mostPopularService: string;
  }> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Count transactions by type (excluding deposits, withdrawals, and referral_bonus)
      const airtimeTransactions = await db.collection("transactions").countDocuments({
        type: "payment",
        description: { $regex: "airtime|airtel|mtn|glo|9mobile", $options: "i" }
      });

      const dataTransactions = await db.collection("transactions").countDocuments({
        type: "payment",
        description: { $regex: "data|internet|bundle", $options: "i" }
      });

      const billPayments = await db.collection("transactions").countDocuments({
        type: "payment",
        description: { $regex: "electricity|dstv|gotv|startimes|water", $options: "i" }
      });

      // For subscriptions, we'll count transactions that mention "subscription"
      const subscriptions = await db.collection("transactions").countDocuments({
        type: "payment",
        description: { $regex: "subscription|subscribe", $options: "i" }
      });

      // Determine most popular service
      const serviceCounts = [
        { name: "Airtime", count: airtimeTransactions },
        { name: "Data", count: dataTransactions },
        { name: "Bills", count: billPayments },
        { name: "Subscriptions", count: subscriptions }
      ];

      const mostPopularService = serviceCounts.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
      ).name;

      return {
        airtimeTransactions,
        dataTransactions,
        billPayments,
        subscriptions,
        mostPopularService: mostPopularService || "Airtime"
      };
    } catch (error) {
      console.error("Error getting service usage stats:", error);
      return {
        airtimeTransactions: 0,
        dataTransactions: 0,
        billPayments: 0,
        subscriptions: 0,
        mostPopularService: "Airtime"
      };
    }
  }

  static async getAllUsers(): Promise<DatabaseUser[]> {
    try {
      await this.connectMongoose();
      const db = await Database.getDb();

      // Get all users with role "user"
      const users = await db.collection("users").find({ role: "user" }).toArray();

      return users.map((user: any) => ({
        ...user,
        id: user._id.toString(),
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  static async saveVerificationToken(userId: string, token: string, expires: number): Promise<void> {
    const db = await Database.getDb();
    await db.collection("verification_tokens").insertOne({
      userId,
      token,
      expires: new Date(expires),
      used: false,
      createdAt: new Date(),
    });
  }

  static async getVerificationToken(token: string): Promise<any | null> {
    const db = await Database.getDb();
    return await db.collection("verification_tokens").findOne({ token, used: false });
  }

  static async markTokenAsUsed(token: string): Promise<void> {
    const db = await Database.getDb();
    await db.collection("verification_tokens").updateOne(
      { token },
      { $set: { used: true, updatedAt: new Date() } }
    );
  }

  static async savePasswordResetToken(userId: string, token: string, expires: number): Promise<void> {
    const db = await Database.getDb();
    await db.collection("password_reset_tokens").insertOne({
      userId,
      token,
      expires: new Date(expires),
      used: false,
      createdAt: new Date(),
    });
  }

  static async getPasswordResetToken(token: string): Promise<any | null> {
    const db = await Database.getDb();
    return await db.collection("password_reset_tokens").findOne({ token, used: false });
  }

  static async markPasswordResetTokenAsUsed(token: string): Promise<void> {
    const db = await Database.getDb();
    await db.collection("password_reset_tokens").updateOne(
      { token },
      { $set: { used: true, updatedAt: new Date() } }
    );
  }
}
