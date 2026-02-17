import { MongoClient, Db, ObjectId } from "mongodb"

let client: MongoClient
let db: Db

export interface DatabaseUser {
  id: string
  fullName: string
  email: string
  phone: string
  passwordHash: string
  transactionPin?: string
  walletBalance: number
  referralCode?: string
  referredBy?: string
  elevatexActivated?: boolean
  kycStatus?: string
  status?: string
  role?: string
  createdAt?: Date
  updatedAt?: Date
}

export class Database {
  // =========================
  // CONNECTION
  // =========================

  private static async connect() {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI as string)
      await client.connect()
      db = client.db(process.env.MONGODB_DB)
      console.log("✅ MongoDB Connected")
    }
  }

  private static async getDb(): Promise<Db> {
    await this.connect()
    return db
  }

  // =========================
  // USER METHODS
  // =========================

  static async createUser(data: Partial<DatabaseUser>) {
    const database = await this.getDb()

    const result = await database.collection("users").insertOne({
      ...data,
      walletBalance: data.walletBalance ?? 0,
      elevatexActivated: data.elevatexActivated ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      id: result.insertedId.toString(),
      ...data,
    } as DatabaseUser
  }

  static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    const database = await this.getDb()
    const user = await database.collection("users").findOne({ email })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserByPhone(phone: string): Promise<DatabaseUser | null> {
    const database = await this.getDb()
    const user = await database.collection("users").findOne({ phone })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserById(id: string): Promise<DatabaseUser | null> {
    const database = await this.getDb()
    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(id) })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserByReferralCode(
    code: string
  ): Promise<DatabaseUser | null> {
    const database = await this.getDb()
    const user = await database.collection("users").findOne({ referralCode: code })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async updateUserById(id: string, updates: Partial<DatabaseUser>) {
    const database = await this.getDb()
    await database.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    )
  }

  // =========================
  // WALLET
  // =========================

  static async updateUserWallet(userId: string, amount: number) {
    const database = await this.getDb()

    await database.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: { walletBalance: amount },
        $set: { updatedAt: new Date() },
      }
    )
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
    const database = await this.getDb()

    await database.collection("referrals").insertOne({
      ...data,
      createdAt: new Date(),
    })
  }

  static async getReferral(referrerId: string, referredId: string) {
    const database = await this.getDb()

    return database.collection("referrals").findOne({
      referrerId,
      referredId,
    })
  }

  static async getUserReferrals(userId: string) {
    const database = await this.getDb()

    return database.collection("referrals").find({
      referrerId: userId,
      status: "active",
    }).toArray()
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
  }) {
    const database = await this.getDb()

    await database.collection("transactions").insertOne({
      ...data,
      createdAt: new Date(),
    })
  }

  // =========================
  // RANK SYSTEM
  // =========================

  static async getUserRank(userId: string) {
    const database = await this.getDb()

    const totalReferrals = await database.collection("referrals").countDocuments({
      referrerId: userId,
      status: "active",
    })

    let rank = "Starter"

    if (totalReferrals >= 50) rank = "Diamond"
    else if (totalReferrals >= 20) rank = "Gold"
    else if (totalReferrals >= 10) rank = "Silver"
    else if (totalReferrals >= 5) rank = "Bronze"

    return {
      rank,
      stats: {
        totalReferrals,
      },
    }
  }

  // =========================
  // EMAIL VERIFICATION
  // =========================

  static async saveVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    const database = await this.getDb()

    await database.collection("verificationTokens").insertOne({
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    })
  }

  static async findVerificationToken(token: string) {
    const database = await this.getDb()

    return database.collection("verificationTokens").findOne({
      token,
    })
  }

  static async deleteVerificationToken(token: string) {
    const database = await this.getDb()

    await database.collection("verificationTokens").deleteOne({
      token,
    })
  }
}
