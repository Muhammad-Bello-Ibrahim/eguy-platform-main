// Database connection and operations
// This would typically connect to MongoDB Atlas in production

export interface DatabaseUser {
  id: string
  fullName: string
  email: string
  phone: string
  passwordHash: string
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


import { MongoClient, ObjectId } from "mongodb"
const uri = process.env.DATABASE_URL || ""
const client = new MongoClient(uri)
const dbName = uri.split("/").pop()?.split("?")[0] || "eguy"
let db: any

async function getDb() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}


export class Database {
  static async findUserByReferralCode(referralCode: string): Promise<DatabaseUser | null> {
    const db = await getDb();
    const user = await db.collection("users").findOne({ referralCode });
    if (!user) return null;
    return {
      ...user,
      id: user._id.toString(),
    };
  }
  static async updateUserPayoutAccount(email: string, payoutAccount: { bank: string; accountNumber: string; accountName: string }): Promise<DatabaseUser | null> {
    const db = await getDb();
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
  static async updateUserByEmail(email: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
    const db = await getDb();
    await db.collection("users").updateOne(
      { email },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    const user = await db.collection("users").findOne({ email });
    if (!user) return null;
    return {
      ...user,
      id: user._id.toString(),
    };
  }
  static async saveVerificationToken(userId: string, token: string, expires: number): Promise<void> {
    const db = await getDb();
    await db.collection("verification_tokens").updateOne(
      { userId },
      { $set: { token, expires, used: false } },
      { upsert: true }
    );
  }
  static async getDb() {
    return await getDb();
  }
  static async saveResetToken(userId: string, token: string, expires: number): Promise<void> {
    const db = await getDb();
    await db.collection("reset_tokens").updateOne(
      { userId },
      { $set: { token, expires, used: false } },
      { upsert: true }
    );
  }
  static async createUser(userData: Omit<DatabaseUser, "id" | "createdAt" | "updatedAt">): Promise<DatabaseUser> {
    const db = await getDb();
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
    const db = await getDb()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async findUserByPhone(phone: string): Promise<DatabaseUser | null> {
    const db = await getDb()
    const user = await db.collection("users").findOne({ phone })
    if (!user) return null
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async findUserById(id: string): Promise<DatabaseUser | null> {
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!user) return null
    return {
      ...user,
      id: user._id.toString(),
    }
  }

  static async updateUserWallet(userId: string, amount: number): Promise<void> {
    const db = await getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { walletBalance: amount }, $set: { updatedAt: new Date() } }
    )
  }

  static async createTransaction(transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Promise<Transaction> {
    const db = await getDb()
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
    const db = await getDb()
    const transactions = await db.collection("transactions").find({ userId }).toArray()
    return transactions.map((t: any) => ({ ...t, id: t._id.toString() }))
  }

  static async updateTransactionStatus(reference: string, status: "pending" | "completed" | "failed" | "cancelled"): Promise<void> {
    const db = await getDb()
    await db.collection("transactions").updateOne(
      { reference },
      { $set: { status, updatedAt: new Date() } }
    )
  }

  static async createReferral(referralData: Omit<Referral, "id" | "createdAt">): Promise<Referral> {
    const db = await getDb()
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
    const db = await getDb()
    const referrals = await db.collection("referrals").find({ referrerId: userId }).toArray()
    return referrals.map((r: any) => ({ ...r, id: r._id.toString() }))
  }

  static async findTransactionByReference(reference: string): Promise<Transaction | null> {
    const db = await getDb()
    const transaction = await db.collection("transactions").findOne({ reference })
    if (!transaction) return null
    return {
      ...transaction,
      id: transaction._id.toString(),
    }
  }
}
