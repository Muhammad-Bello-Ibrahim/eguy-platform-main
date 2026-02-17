import { MongoClient, Db, ObjectId } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export interface DatabaseUser {
  id: string
  fullName: string
  email: string
  phone: string
  passwordHash: string
  walletBalance: number
  referralCode?: string
  referredBy?: string
  elevatexActivated?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface LinkedAccount {
  id: string
  bank: string
  accountNumber: string
  accountName: string
  isPrimary?: boolean
}

export class Database {
  // =========================
  // SAFE CONNECTION HANDLER
  // =========================

  private static async getDb(): Promise<Db> {
    if (cachedDb) return cachedDb

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined")
    }

    const client = new MongoClient(process.env.MONGODB_URI)

    await client.connect()

    cachedClient = client
    cachedDb = client.db(process.env.MONGODB_DB)

    console.log("✅ MongoDB Connected")

    return cachedDb
  }

  // =========================
  // USERS
  // =========================

  static async createUser(data: Partial<DatabaseUser>) {
    const db = await this.getDb()

    const result = await db.collection("users").insertOne({
      ...data,
      walletBalance: data.walletBalance ?? 0,
      elevatexActivated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      id: result.insertedId.toString(),
      ...data,
    }
  }

  static async findUserByEmail(email: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  // ✅ ADDED THIS METHOD
  static async findUserByPhone(phone: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ phone })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserById(id: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserByReferralCode(code: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({
      referralCode: code,
    })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async updateUserById(id: string, updates: any) {
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    )

    if (!result) return null;
    return { ...result, id: result._id.toString() }
  }

  static async updateUserWallet(userId: string, amount: number) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: { walletBalance: amount },
        $set: { updatedAt: new Date() },
      }
    )
  }

  // =========================
  // TRANSACTIONS
  // =========================

  static async createTransaction(data: {
    userId: string
    type: string
    amount: number
    description: string
    status: string
    metadata?: any
    reference?: string
  }) {
    const db = await this.getDb()
    await db.collection("transactions").insertOne({
      ...data,
      createdAt: new Date(),
    })
  }

  static async getUserTransactions(userId: string) {
    const db = await this.getDb()
    return db
      .collection("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async findTransactionByReference(reference: string) {
    const db = await this.getDb()
    const transaction = await db.collection("transactions").findOne({
      $or: [
        { reference: reference },
        { "metadata.reference": reference }
      ]
    })
    if (!transaction) return null
    return { ...transaction, id: transaction._id.toString() }
  }

  static async updateTransactionStatusAtomic(
    reference: string,
    expectedStatus: string,
    newStatus: string
  ) {
    const db = await this.getDb()
    const result = await db.collection("transactions").findOneAndUpdate(
      {
        $or: [
          { reference: reference },
          { "metadata.reference": reference }
        ],
        status: expectedStatus,
      },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    return result !== null
  }

  // =========================
  // REFERRALS
  // =========================

  static async createReferral(data: {
    referrerId: string
    referredId: string
    level: number
    bonusAmount: number
    status: string
  }) {
    const db = await this.getDb()
    await db.collection("referrals").insertOne({
      ...data,
      createdAt: new Date(),
    })
  }

  static async getUserReferrals(userId: string) {
    const db = await this.getDb()
    return db.collection("referrals").find({ referrerId: userId }).toArray()
  }

  static async getReferral(referrerId: string, referredId: string) {
    const db = await this.getDb()
    return db.collection("referrals").findOne({
      referrerId,
      referredId,
    })
  }

  // =========================
  // EMAIL VERIFICATION
  // =========================

  static async saveVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    const db = await this.getDb()
    await db.collection("verificationTokens").insertOne({
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    })
  }

  static async getVerificationToken(token: string) {
    const db = await this.getDb()
    return db.collection("verificationTokens").findOne({ token })
  }

  static async deleteVerificationToken(token: string) {
    const db = await this.getDb()
    await db.collection("verificationTokens").deleteOne({ token })
  }

  // =========================
  // NOTIFICATIONS
  // =========================

  static async createNotification(data: {
    userId: string
    type: string
    title: string
    message: string
    amount?: number
    status?: string
    actionUrl?: string
  }) {
    const db = await this.getDb()
    await db.collection("notifications").insertOne({
      ...data,
      read: false,
      createdAt: new Date(),
    })
  }

  static async getUserNotifications(userId: string, options: { type?: string, limit?: number, offset?: number } = {}) {
    const db = await this.getDb()
    const query: any = { userId }

    if (options.type && options.type !== "all") {
      if (options.type === "unread") {
        query.read = false
      } else {
        query.type = options.type
      }
    }

    return db
      .collection("notifications")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(options.offset || 0)
      .limit(options.limit || 20)
      .toArray()
  }

  static async getUnreadNotificationCount(userId: string) {
    const db = await this.getDb()
    return db.collection("notifications").countDocuments({
      userId,
      read: false
    })
  }

  static async markNotificationsAsRead(userId: string, notificationIds: string[]) {
    const db = await this.getDb()
    await db.collection("notifications").updateMany(
      {
        userId,
        _id: { $in: notificationIds.map(id => new ObjectId(id)) }
      },
      {
        $set: { read: true }
      }
    )
  }

  static async deleteNotification(userId: string, notificationId: string) {
    const db = await this.getDb()
    await db.collection("notifications").deleteOne({
      userId,
      _id: new ObjectId(notificationId)
    })
  }
}
