import { z } from "zod"

// ----------------------------------------------------
// 1. SIGN UP VALIDATION SCHEMA
// ----------------------------------------------------
export const signUpSchema = z.object({
  fullName: z.string()
    .min(7, "Full name must be at least 7 characters")
    .max(45, "Full name cannot exceed 45 characters")
    .transform(val => val.trim()),
  email: z.string()
    .email("Invalid email address")
    .max(45, "Email cannot exceed 45 characters")
    .transform(val => val.trim().toLowerCase()),
  phone: z.string()
    .length(11, "Phone number must be exactly 11 characters")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
  transactionPin: z.string()
    .length(4, "Transaction PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "Transaction PIN must be 4 digits"),
  referralCode: z.string()
    .max(12, "Referral code cannot exceed 12 characters")
    .transform(val => val.trim())
    .optional()
    .or(z.literal("")),
  dob: z.string()
    .max(30)
    .optional(),
  address: z.string()
    .max(45, "Address cannot exceed 45 characters")
    .transform(val => val.trim())
    .optional()
    .or(z.literal("")),
}).strict() // Reject/Strip extra params to prevent mass assignment

// ----------------------------------------------------
// 2. PROFILE UPDATE VALIDATION SCHEMA
// ----------------------------------------------------
export const profileUpdateSchema = z.object({
  fullName: z.string()
    .min(7, "Full name must be between 7 and 45 characters")
    .max(45, "Full name cannot exceed 45 characters")
    .transform(val => val.trim())
    .optional(),
  phone: z.string()
    .length(11, "Phone number must be exactly 11 characters")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  avatar: z.string()
    .max(255)
    .nullable()
    .optional(),
  payoutAccount: z.object({
    bank: z.string().max(100),
    bankCode: z.string().max(20).optional(),
    accountNumber: z.string().max(20),
    accountName: z.string().max(100),
  }).nullable().optional(),
  bio: z.string().max(200).optional(),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().max(100).optional(),
  location: z.string()
    .max(45, "Address cannot exceed 45 characters")
    .transform(val => val.trim())
    .optional(),
}).strict()

// ----------------------------------------------------
// 3. USER SETTINGS SUB-SCHEMAS (Category specific)
// ----------------------------------------------------
export const profileSettingsSchema = z.object({
  displayName: z.string()
    .min(7, "Full name must be between 7 and 45 characters")
    .max(45, "Full name cannot exceed 45 characters")
    .transform(val => val.trim())
    .optional(),
  phone: z.string()
    .length(11, "Phone number must be exactly 11 characters")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .optional(),
  avatar: z.string().max(255).nullable().optional(),
  bio: z.string().max(200).optional(),
  location: z.string()
    .max(45, "Location cannot exceed 45 characters")
    .transform(val => val.trim())
    .optional(),
  dateOfBirth: z.string().max(30).nullable().optional()
}).strict()

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  transactionAlerts: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional()
}).strict()

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "connections"]).optional(),
  showOnlineStatus: z.boolean().optional(),
  allowReferrals: z.boolean().optional(),
  dataSharing: z.boolean().optional()
}).strict()

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().optional(),
  sessionTimeout: z.number().min(1).max(720).optional(),
  loginAlerts: z.boolean().optional()
}).strict()

export const preferencesSettingsSchema = z.object({
  currency: z.string().max(10).optional(),
  language: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
  theme: z.string().max(20).optional()
}).strict()
