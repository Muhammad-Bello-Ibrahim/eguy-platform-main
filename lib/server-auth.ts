import bcrypt from "bcryptjs"
import { Database } from "./database"

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword?: string): Promise<boolean> {
  if (!password || !hashedPassword) return false
  return await bcrypt.compare(password, hashedPassword)
}

export async function verifyTransactionPin(userId: string, pin: string | undefined): Promise<{ isValid: boolean; error?: string }> {
  if (!pin) {
    return { isValid: false, error: "Transaction PIN is required" }
  }
  if (pin.length !== 4) {
    return { isValid: false, error: "Transaction PIN must be 4 digits" }
  }
  const user = await Database.findUserById(userId)
  if (!user) {
    return { isValid: false, error: "User not found" }
  }
  if (!user.transactionPin) {
    return { isValid: false, error: "Transaction PIN not configured" }
  }
  const isMatch = await bcrypt.compare(pin, user.transactionPin)
  if (!isMatch) {
    return { isValid: false, error: "Incorrect transaction PIN" }
  }
  return { isValid: true }
}
