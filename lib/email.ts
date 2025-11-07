export async function sendVerificationEmail(email: string, token: string) {
  const nodemailer = require("nodemailer")
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Use environment variable if available, fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`

  await transporter.sendMail({
    from: `eGuy <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Thank you for signing up with eGuy! Please click the button below to verify your email address and activate your account.</p>
        <p style="margin: 30px 0;">
          <a href="${verifyUrl}"
             style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${verifyUrl}</span>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This verification link will expire in 1 hour for security reasons.
        </p>
      </div>
    `
  })
}

export async function sendResetEmail(email: string, token: string) {
  const nodemailer = require("nodemailer")
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Use environment variable if available, fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `eGuy <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You've requested to reset your password for your eGuy account. Click the button below to set a new password.</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${resetUrl}</span>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This reset link will expire in 30 minutes for security reasons.
        </p>
      </div>
    `
  })
}
