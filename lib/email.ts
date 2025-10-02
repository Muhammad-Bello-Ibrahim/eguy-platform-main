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
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`
  await transporter.sendMail({
    from: `eGuy <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click <a href='${verifyUrl}'>here</a> to verify your email. This link expires in 1 hour.</p>`
  })
}
import nodemailer from "nodemailer"

export async function sendResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`
  await transporter.sendMail({
    from: `eGuy <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link expires in 30 minutes.</p>`
  })
}
