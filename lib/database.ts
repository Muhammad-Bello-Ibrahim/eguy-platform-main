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
  directReferralsCount?: number
  matrixParentId?: string
  autoPlacedAt?: Date
  level5EarningsCompleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class Database {
  // =========================
  // SAFE CONNECTION
  // =========================
  private static async getDb(): Promise<Db> {
    if (cachedDb) return cachedDb
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not defined")
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
      directReferralsCount: 0,
      level5EarningsCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { id: result.insertedId.toString(), ...data }
  }

  static async findUserByEmail(email: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserByPhone(phone: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ phone })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserByReferralCode(referralCode: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ referralCode })
    if (!user) return null
    return { ...user, id: user._id.toString() }
  }

  static async findUserById(id: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
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
    if (!result.value) return null
    return { ...result.value, id: result.value._id.toString() }
  }

  static async updateUserWallet(userId: string, amount: number) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { walletBalance: amount }, $set: { updatedAt: new Date() } }
    )
  }

  static async saveVerificationToken(userId: string, token: string, expires: Date) {
    const db = await this.getDb()
    await db.collection("verification_tokens").insertOne({
      userId,
      token,
      expires,
      createdAt: new Date(),
    })
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
    await db.collection("referrals").insertOne({ ...data, createdAt: new Date() })
  }

  static async getReferral(referrerId: string, referredId: string) {
    const db = await this.getDb()
    return db.collection("referrals").findOne({ referrerId, referredId })
  }

  static async getUserReferrals(userId: string) {
    const db = await this.getDb()
    return db.collection("referrals")
      .find({ referrerId: userId })
      .sort({ createdAt: -1 })
      .toArray()
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
    const db = await this.getDb()
    await db.collection("transactions").insertOne({ ...data, createdAt: new Date() })
  }

  static async getUserTransactions(userId: string) {
    const db = await this.getDb()
    return db.collection("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
  }

  // =========================
  // ELEVATEX SPILLOVER HELPERS
  // =========================
  static async findEligibleMatrixParent(): Promise<DatabaseUser | null> {
    const db = await this.getDb()
    const eligible = await db.collection("users")
      .find({ elevatexActivated: true, directReferralsCount: { $lt: 5 }, level5EarningsCompleted: { $ne: true } })
      .sort({ autoPlacedAt: 1, createdAt: 1 }) // FIFO placement
      .limit(1)
      .toArray()
    if (eligible.length === 0) return null
    return { ...eligible[0], id: eligible[0]._id.toString() }
  }

  static async incrementDirectCount(userId: string) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { directReferralsCount: 1 }, $set: { updatedAt: new Date() } }
    )
  }

  static async markLevel5Completed(userId: string) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { level5EarningsCompleted: true, updatedAt: new Date() } }
    )
  }
}
