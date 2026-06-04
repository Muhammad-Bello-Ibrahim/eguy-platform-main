import { MongoClient, Db, ObjectId } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export interface LinkedAccount {
  id: string
  bank: string
  bankCode?: string
  accountNumber: string
  accountName: string
  isPrimary: boolean
  createdAt?: Date
}

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
  linkedAccounts?: LinkedAccount[]
  transactionPin?: string
  twoFactorEnabled?: boolean
  biometricEnabled?: boolean
  biometricCredentials?: any[]
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
  
  static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
    if (typeof email !== "string") return null
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ email })
    if (!user) return null
    return { ...user, id: user._id.toString() } as any
  }

  static async findUserByPhone(phone: string): Promise<DatabaseUser | null> {
    if (typeof phone !== "string") return null
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ phone })
    if (!user) return null
    return { ...user, id: user._id.toString() } as any
  }

  static async findUserByReferralCode(referralCode: string): Promise<DatabaseUser | null> {
    if (typeof referralCode !== "string") return null
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ referralCode })
    if (!user) return null
    return { ...user, id: user._id.toString() } as any
  }

  static async findUserById(id: string): Promise<DatabaseUser | null> {
    if (typeof id !== "string" || id.length !== 24) return null
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!user) return null
    return { ...user, id: user._id.toString() } as any
  }

  static async updateUserById(id: string, updates: any) {
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    ) as any
    if (!result || !result.value) return null
    return { ...result.value, id: result.value._id.toString() }
  }

  static async updateUserByEmail(email: string, updates: any) {
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      { email },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    ) as any
    if (!result || !result.value) return null
    return { ...result.value, id: result.value._id.toString() }
  }

  static async updateUserWallet(userId: string, amount: number) {
    const db = await this.getDb()
    const objectId = typeof userId === 'string' && userId.length === 24 ? new ObjectId(userId) : (userId as any)
    const result = await db.collection("users").updateOne(
      { _id: objectId as any },
      { $inc: { walletBalance: amount }, $set: { updatedAt: new Date() } }
    )
    console.log("Wallet update result:", { userId, objectId, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount })
    return result
  }

  static async saveVerificationToken(userId: string, token: string, expires: Date | number) {
    const db = await this.getDb()
    const expiresAt = expires instanceof Date ? expires : new Date(expires)
    await db.collection("verification_tokens").insertOne({
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    })
  }

  static async getVerificationToken(token: string) {
    const db = await this.getDb()
    const tokenDoc = await db.collection("verification_tokens").findOne({ token })
    if (!tokenDoc) return null
    return {
      ...tokenDoc,
      expiresAt: tokenDoc.expiresAt ?? tokenDoc.expires,
    }
  }

  static async deleteVerificationToken(token: string) {
    const db = await this.getDb()
    await db.collection("verification_tokens").deleteOne({ token })
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

  static async getUserReferrals(userId: string): Promise<any[]> {
    const db = await this.getDb()
    const allReferrals: any[] = []
    const visited = new Set<string>()
    
    // BFS to build multi-level referral tree
    const queue = [{ userId, level: 1 }]
    
    while (queue.length > 0) {
      const { userId: currentId, level } = queue.shift()!
      
      if (visited.has(currentId) || level > 5) {
        continue
      }
      visited.add(currentId)
      
      // Get direct referrals of current user
      const directReferrals = await db.collection("referrals")
        .find({ referrerId: currentId })
        .sort({ createdAt: -1 })
        .toArray()
      
      // Add to results with level assignment
      for (const ref of directReferrals) {
        const referralWithLevel = { ...ref, level }
        allReferrals.push(referralWithLevel)
        
        // Queue the referred user to fetch their referrals at next level
        if (level < 5) {
          queue.push({ userId: ref.referredId, level: level + 1 })
        }
      }
    }
    
    return allReferrals.sort((a: any, b: any) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
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
    reference?: string
    metadata?: any
  }) {
    const db = await this.getDb()
    // Store userId as string for consistency
    const transactionData = {
      ...data,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await db.collection("transactions").insertOne(transactionData)
    return result.insertedId.toString()
  }

  static async getUserTransactions(userId: string) {
    const db = await this.getDb()
    return db.collection("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
  }

  static async findTransactionByReference(reference: string) {
    const db = await this.getDb()
    const tx = await db.collection("transactions").findOne({ reference })
    if (!tx) return null
    console.log("Found transaction by reference:", { reference, status: tx.status, userId: tx.userId })
    return { 
      ...tx, 
      id: tx._id.toString()
    }
  }

  static async findTransactionById(id: string) {
    const db = await this.getDb()
    const objectId = typeof id === 'string' && id.length === 24 ? new ObjectId(id) : id
    const tx = await db.collection("transactions").findOne({ _id: objectId as any })
    if (!tx) return null
    return { 
      ...tx, 
      id: tx._id.toString()
    }
  }

  static async updateTransactionStatusAtomic(reference: string, fromStatus: string, toStatus: string) {
    const db = await this.getDb()
    
    // First verify the transaction is still in fromStatus
    const currentTx = await db.collection("transactions").findOne({ reference })
    console.log("Current transaction state:", { reference, currentStatus: currentTx?.status, fromStatus })
    
    if (!currentTx) {
      console.log("Transaction not found")
      return false
    }
    
    if (currentTx.status !== fromStatus) {
      console.log("Transaction status mismatch", { currentStatus: currentTx.status, expectedStatus: fromStatus })
      return false
    }
    
    // Update the transaction status
    const result = await db.collection("transactions").updateOne(
      { _id: currentTx._id },
      { $set: { status: toStatus, updatedAt: new Date() } }
    )
    
    console.log("Transaction status update result:", { reference, fromStatus, toStatus, matched: result.matchedCount, modified: result.modifiedCount })
    return result.modifiedCount > 0
  }

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
    return { ...eligible[0], id: eligible[0]._id.toString() } as any
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

  // =========================
  // LINKED ACCOUNTS (BANKING)
  // =========================
  static async addLinkedAccount(userId: string, accountDetails: Omit<LinkedAccount, 'id'>) {
    const db = await this.getDb()
    const accountId = new ObjectId().toString()
    const newAccount: LinkedAccount = {
      id: accountId,
      ...accountDetails,
      createdAt: new Date()
    }
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $push: { linkedAccounts: newAccount } as any }
    )
    return newAccount
  }

  static async removeLinkedAccount(userId: string, accountId: string) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { linkedAccounts: { id: accountId } } as any }
    )
  }

  static async setPrimaryLinkedAccount(userId: string, accountId: string) {
    const db = await this.getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user) return
    
    const linkedAccounts = (user.linkedAccounts || []).map((acc: any) => ({
      ...acc,
      isPrimary: acc.id === accountId
    }))
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { linkedAccounts } }
    )
  }

  // =========================
  // PASSWORD RESET TOKENS
  // =========================
  static async savePasswordResetToken(userId: string, token: string, expires: number | Date) {
    const db = await this.getDb()
    const expiresAt = expires instanceof Date ? expires : new Date(expires)
    // Delete any existing reset tokens for this user first
    await db.collection("password_reset_tokens").deleteMany({ userId })
    await db.collection("password_reset_tokens").insertOne({
      userId,
      token,
      expiresAt,
      used: false,
      createdAt: new Date(),
    })
  }

  static async getPasswordResetToken(token: string) {
    const db = await this.getDb()
    const tokenDoc = await db.collection("password_reset_tokens").findOne({
      token,
      used: false,
    })
    if (!tokenDoc) return null
    return {
      ...tokenDoc,
      userId: tokenDoc.userId,
      expires: tokenDoc.expiresAt,
    }
  }

  static async markPasswordResetTokenAsUsed(token: string) {
    const db = await this.getDb()
    await db.collection("password_reset_tokens").updateOne(
      { token },
      { $set: { used: true, usedAt: new Date() } }
    )
  }

  // =========================
  // SETTINGS & BIOMETRICS
  // =========================
  static async toggleBiometric(userId: string, enabled: boolean) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { biometricEnabled: enabled, updatedAt: new Date() } }
    )
  }

  static async toggleTwoFactor(userId: string, enabled: boolean) {
    const db = await this.getDb()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { twoFactorEnabled: enabled, updatedAt: new Date() } }
    )
  }
}
