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
    if (typeof id !== "string" || id.length !== 24) return null
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    ) as any
    // mongodb driver v6+ returns the document directly; older versions
    // wrap it as { value: doc }. Handle both shapes safely.
    const doc = result?.value !== undefined ? result.value : result
    if (!doc) return null
    return { ...doc, id: doc._id.toString() }
  }

  static async updateUserByEmail(email: string, updates: any) {
    if (typeof email !== "string") return null
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      { email },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    ) as any
    // mongodb driver v6+ returns the document directly; older versions
    // wrap it as { value: doc }. Handle both shapes safely.
    const doc = result?.value !== undefined ? result.value : result
    if (!doc) return null
    return { ...doc, id: doc._id.toString() }
  }

  /**
   * Atomically credits or debits a user's wallet.
   *
   * For debits (amount < 0), the update is conditioned on the current
   * balance being sufficient, so concurrent requests can never push the
   * balance negative (previously a plain $inc with no floor check, which
   * allowed a race between two simultaneous debits to overdraw the wallet).
   *
   * Returns `{ success, matchedCount, modifiedCount }`. Callers performing a
   * debit MUST check `success` — false means the balance was insufficient
   * (or the user no longer exists) and the debit did NOT happen.
   */
  static async updateUserWallet(userId: string, amount: number) {
    const db = await this.getDb()
    const objectId = typeof userId === 'string' && userId.length === 24 ? new ObjectId(userId) : (userId as any)

    const filter: any = { _id: objectId }
    if (amount < 0) {
      // Only allow the debit if the balance can cover it.
      filter.walletBalance = { $gte: -amount }
    }

    const result = await db.collection("users").updateOne(
      filter,
      { $inc: { walletBalance: amount }, $set: { updatedAt: new Date() } }
    )

    const success = result.matchedCount > 0
    console.log("Wallet update result:", { userId, objectId, amount, success, matchedCount: result.matchedCount, modifiedCount: result.modifiedCount })
    return { ...result, success }
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

  // =========================
  // ADMIN DASHBOARD STATS
  // =========================
  static async getAllUsers(): Promise<DatabaseUser[]> {
    const db = await this.getDb()
    const users = await db.collection("users").find({}).toArray()
    return users.map(user => ({ ...user, id: user._id.toString() })) as any
  }

  static async getUserCount(): Promise<number> {
    const db = await this.getDb()
    return await db.collection("users").countDocuments()
  }

  static async getTotalDeposits(): Promise<number> {
    const db = await this.getDb()
    const result = await db.collection("transactions").aggregate([
      { $match: { type: "deposit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray()
    return result[0]?.total || 0
  }

  static async getTotalWithdrawals(): Promise<number> {
    const db = await this.getDb()
    const result = await db.collection("transactions").aggregate([
      { $match: { type: "withdrawal", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray()
    return result[0]?.total || 0
  }

  static async getPendingWithdrawals(): Promise<number> {
    const db = await this.getDb()
    const result = await db.collection("transactions").aggregate([
      { $match: { type: "withdrawal", status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray()
    return result[0]?.total || 0
  }

  static async getMonthlyRevenue(): Promise<number> {
    const db = await this.getDb()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const result = await db.collection("transactions").aggregate([
      { $match: { type: "deposit", status: "completed", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray()
    return result[0]?.total || 0
  }

  static async getTransactionCount(): Promise<number> {
    const db = await this.getDb()
    return await db.collection("transactions").countDocuments()
  }

  static async getSuccessfulTransactionCount(): Promise<number> {
    const db = await this.getDb()
    return await db.collection("transactions").countDocuments({ status: "completed" })
  }

  static async getTotalUsersFund(): Promise<number> {
    const db = await this.getDb()
    const result = await db.collection("users").aggregate([
      { $group: { _id: null, total: { $sum: "$walletBalance" } } }
    ]).toArray()
    return result[0]?.total || 0
  }

  static async getReferralStats(): Promise<any> {
    const db = await this.getDb()
    const totalReferrals = await db.collection("referrals").countDocuments()
    const activeReferrals = await db.collection("referrals").countDocuments({ status: "active" })
    const bonusResult = await db.collection("referrals").aggregate([
      { $group: { _id: null, total: { $sum: "$bonusAmount" } } }
    ]).toArray()
    
    return {
      totalReferrals,
      activeReferrals,
      totalBonusPaid: bonusResult[0]?.total || 0,
      averageTreeSize: 1.5,
      topReferrer: "Admin"
    }
  }

  static async getServiceUsageStats(): Promise<any> {
    const db = await this.getDb()
    const airtime = await db.collection("transactions").countDocuments({ type: "payment", "metadata.serviceType": "airtime" })
    const data = await db.collection("transactions").countDocuments({ type: "payment", "metadata.serviceType": "data" })
    
    return {
      airtimeTransactions: airtime,
      dataTransactions: data,
      billPayments: 0,
      subscriptions: 0,
      mostPopularService: airtime > data ? "Airtime" : "Data"
    }
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

  /**
   * Atomically deducts the ₦1,000 activation fee and marks the user as
   * ElevateX-activated in a single conditional update. The condition
   * (balance >= fee AND not already activated) closes two races that
   * existed when this was a separate balance-check + updateUserById call:
   *   1. Two concurrent activations both passing the balance check and
   *      both deducting, overdrawing the wallet.
   *   2. Two concurrent activations both passing the "not activated" check
   *      and both proceeding, double-charging and double-placing the user.
   * Returns the updated user document, or null if the condition failed
   * (insufficient balance or already activated).
   */
  static async activateElevateXAtomic(
    userId: string,
    fee: number,
    fields: { referralCode: string; matrixParentId?: string }
  ): Promise<DatabaseUser | null> {
    const db = await this.getDb()
    const result = await db.collection("users").findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        walletBalance: { $gte: fee },
        elevatexActivated: { $ne: true },
      },
      {
        $inc: { walletBalance: -fee },
        $set: {
          elevatexActivated: true,
          referralCode: fields.referralCode,
          matrixParentId: fields.matrixParentId,
          autoPlacedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    ) as any
    const doc = result?.value !== undefined ? result.value : result
    if (!doc) return null
    return { ...doc, id: doc._id.toString() }
  }

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

  // =========================
  // RATE LIMITING
  // =========================
  static async checkRateLimit(ip: string, action: string, maxHits: number, windowMs: number): Promise<{ allowed: boolean; remaining: number }> {
    const db = await this.getDb();
    const collection = db.collection("rate_limits");
    
    // Ensure TTL index exists (this runs once and is safe to call repeatedly but ideally should be done on DB init)
    // MongoDB will automatically expire documents based on 'expiresAt'
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowMs);

    const result = await collection.findOneAndUpdate(
      { ip, action },
      {
        $setOnInsert: { ip, action, createdAt: now, expiresAt },
        $inc: { hits: 1 }
      },
      { upsert: true, returnDocument: "after" }
    );

    const doc = result || result?.value;
    if (!doc) return { allowed: true, remaining: maxHits - 1 };

    const hits = doc.hits as number;
    const allowed = hits <= maxHits;
    const remaining = Math.max(0, maxHits - hits);

    return { allowed, remaining };
  }
}
