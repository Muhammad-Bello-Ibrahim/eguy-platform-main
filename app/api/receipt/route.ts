import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { Database } from "@/lib/database"
import nodemailer from "nodemailer"
import jsPDF from "jspdf"

// Helper function to extract service info from transaction
function getServiceInfo(transaction: any) {
  const baseInfo: any = {
    provider: "Unknown",
    type: transaction.type.replace("_", " ").toUpperCase(),
    amount: transaction.amount
  };

  // Extract provider and recipient info from description or metadata
  if (transaction.description) {
    // Try to extract provider from description
    const providerMatch = transaction.description.match(/([A-Z]+)\s+(Airtime|Data|Electricity|Cable)/i);
    if (providerMatch) {
      baseInfo.provider = providerMatch[1];
      baseInfo.type = providerMatch[2].toUpperCase();
    }

    // Try to extract phone number or recipient
    const phoneMatch = transaction.description.match(/(\d{11}|\d{10})/);
    if (phoneMatch) {
      baseInfo.recipient = phoneMatch[1];
    }
  }

  // Handle specific transaction types
  switch (transaction.type) {
    case "deposit":
      return {
        ...baseInfo,
        provider: "eGuy",
        type: "WALLET DEPOSIT",
        recipient: "Wallet"
      };
    case "referral_bonus":
      return {
        ...baseInfo,
        provider: "eGuy",
        type: "REFERRAL BONUS",
        recipient: "Wallet"
      };
    case "airtime":
      return {
        ...baseInfo,
        type: "AIRTIME"
      };
    case "data":
      return {
        ...baseInfo,
        type: "DATA"
      };
    case "electricity":
      return {
        ...baseInfo,
        type: "ELECTRICITY"
      };
    case "cable":
      return {
        ...baseInfo,
        type: "CABLE TV"
      };
    default:
      return baseInfo;
  }
}

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmail = (session?.user as any)?.email;

    if (!session || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(userEmail)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the actual transaction from database
    const transaction = await Database.findTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Check if user owns this transaction
    if (transaction.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Format transaction data for receipt
    const receiptData = {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
      reference: transaction.reference,
      createdAt: transaction.createdAt,
      user: {
        name: user.fullName,
        email: user.email,
        phone: user.phone
      },
      // Add service and payment info based on transaction type
      service: getServiceInfo(transaction),
      payment: {
        method: "Wallet",
        from: "Wallet Balance"
      }
    };

    return NextResponse.json({ receipt: receiptData });
  } catch (error) {
    console.error("Receipt fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userEmail = (session?.user as any)?.email;

    if (!session || !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { transactionId, format = "pdf", action = "generate" } = body

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(userEmail)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the actual transaction from database
    const transaction = await Database.findTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Check if user owns this transaction
    if (transaction.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (action === "email") {
      // Send receipt via email
      try {
        const transporter = createTransporter()

        // Generate PDF receipt
        const pdfBuffer = await generateReceiptPDF(transactionId, user, transaction)

        // Email options
        const mailOptions = {
          from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
          to: user.email,
          subject: `eGuy Digital Wallet - Transaction Receipt (${transactionId})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px;">
              <!-- Header with eGuy branding -->
              <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="display: inline-block; margin-right: 15px; vertical-align: middle;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-weight: bold; font-size: 18px;">eG</span>
                  </div>
                </div>
                <div style="display: inline-block; vertical-align: middle;">
                  <h1 style="margin: 0; color: #1f2937; font-size: 28px; font-weight: bold;">eGuy</h1>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Digital Wallet</p>
                </div>
              </div>

              <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Transaction Receipt</h2>
              <p>Dear ${user.fullName},</p>
              <p>Please find your transaction receipt attached to this email.</p>

              <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #3b82f6;">
                <h3 style="margin-top: 0; color: #3b82f6;">Transaction Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Transaction ID:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${transaction.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: 600; font-size: 18px;">₦${transaction.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Type:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${transaction.type.replace("_", " ").toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Status:</td>
                    <td style="padding: 8px 0;">
                      <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${transaction.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Date:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${new Date(transaction.createdAt).toLocaleDateString()}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>eGuy Digital Wallet</strong><br>
                  Secure • Fast • Reliable
                </p>
              </div>

              <p>If you have any questions about this transaction, please contact our support team.</p>
              <p>Thank you for using eGuy Digital Wallet!</p>

              <!-- Footer -->
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
                <p>This email was sent by eGuy Digital Wallet. For support, visit <a href="mailto:support@eguy.app" style="color: #3b82f6;">support@eguy.app</a></p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `eGuy-Digital-Wallet-receipt-${transactionId}.pdf`,
              content: pdfBuffer,
            }
          ]
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({
          message: "Receipt sent to your email successfully",
          receiptId: `RCP_${Date.now()}`,
        })
      } catch (emailError) {
        console.error("Email sending error:", emailError)
        return NextResponse.json({ error: "Failed to send receipt email" }, { status: 500 })
      }
    } else {
      // Generate receipt for download
      const pdfBuffer = await generateReceiptPDF(transactionId, user, transaction)

      return new NextResponse(pdfBuffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=eGuy-Digital-Wallet-receipt-${transactionId}.pdf`
        }
      })
    }
  } catch (error) {
    console.error("Receipt generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to generate PDF receipt
async function generateReceiptPDF(transactionId: string, user: any, transaction: any): Promise<Buffer> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // ─── Brand Color Palette ──────────────────────────────────────────────────
  const brand = {
    primary:    [70,  240, 210] as [number,number,number],  // #46F0D2 teal
    dark:       [16,  34,  30]  as [number,number,number],  // #10221e deep dark
    darkCard:   [19,  19,  33]  as [number,number,number],  // #131321 card dark
    blue:       [59,  130, 246] as [number,number,number],  // #3b82f6
    purple:     [139, 92,  246] as [number,number,number],  // #8b5cf6
    white:      [255, 255, 255] as [number,number,number],
    slate100:   [241, 245, 249] as [number,number,number],
    slate200:   [226, 232, 240] as [number,number,number],
    slate400:   [148, 163, 184] as [number,number,number],
    slate600:   [71,  85,  105] as [number,number,number],
    slate800:   [30,  41,  59]  as [number,number,number],
    success:    [16,  185, 129] as [number,number,number],
    warning:    [245, 158, 11]  as [number,number,number],
    danger:     [239, 68,  68]  as [number,number,number],
    gray:       [107, 114, 128] as [number,number,number],
  };

  // ─── HEADER BLOCK ─────────────────────────────────────────────────────────
  // Full-width dark header bg
  pdf.setFillColor(...brand.dark);
  pdf.rect(0, 0, pageWidth, 58, 'F');

  // Teal accent strip at bottom of header
  pdf.setFillColor(...brand.primary);
  pdf.rect(0, 55, pageWidth, 3, 'F');

  // Decorative circle top-right
  pdf.setFillColor(70, 240, 210, 0.08 as any);
  pdf.circle(pageWidth - 10, -10, 45, 'F');

  // Decorative circle bottom-left
  pdf.setFillColor(59, 130, 246, 0.06 as any);
  pdf.circle(10, 68, 30, 'F');

  // ── Logo Circle ──
  const logoX = margin + 12;
  const logoY = 24;

  // Outer glow ring
  pdf.setFillColor(70, 240, 210);
  pdf.circle(logoX, logoY, 11, 'F');

  // Inner white circle
  pdf.setFillColor(...brand.dark);
  pdf.circle(logoX, logoY, 8.5, 'F');

  // "eG" text inside
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...brand.primary);
  pdf.text('eG', logoX, logoY + 1.2, { align: 'center' });

  // ── App Name ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(...brand.white);
  pdf.text('eGuy', logoX + 16, logoY + 3);

  // Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(...brand.primary);
  pdf.text('Digital Wallet Platform', logoX + 16, logoY + 9);

  // ── "RECEIPT" label ──
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(...brand.white);
  pdf.text('RECEIPT', pageWidth - margin, logoY + 3, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(...brand.slate400);
  const shortId = transactionId.length > 16 ? transactionId.slice(-16) : transactionId;
  pdf.text(`#${shortId.toUpperCase()}`, pageWidth - margin, logoY + 9, { align: 'right' });

  // ─── AMOUNT HERO ──────────────────────────────────────────────────────────
  let yPos = 76;

  const isCredit = ['deposit', 'referral_bonus'].includes(transaction.type);
  const amountColor = isCredit ? brand.success : brand.blue;
  const sign = isCredit ? '+' : '-';
  const formattedAmount = `${sign}₦${Number(transaction.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  // Light teal bg pill behind amount
  pdf.setFillColor(70, 240, 210, 0.07 as any);
  roundedRect(pdf, margin, yPos - 7, contentWidth, 28, 5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(34);
  pdf.setTextColor(...amountColor);
  pdf.text(formattedAmount, pageWidth / 2, yPos + 10, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...brand.slate400);
  pdf.text('Transaction Amount', pageWidth / 2, yPos - 2, { align: 'center' });

  // ─── STATUS BADGE ─────────────────────────────────────────────────────────
  yPos += 28;
  const statusColors: Record<string, [number,number,number]> = {
    completed: brand.success,
    pending:   brand.warning,
    failed:    brand.danger,
    cancelled: brand.gray,
    success:   brand.success,
  };
  const statusColor = statusColors[transaction.status] ?? brand.gray;
  const statusLabel = transaction.status.toUpperCase();

  const badgeW = pdf.getTextWidth(statusLabel) + 14;
  const badgeX = (pageWidth - badgeW) / 2;
  pdf.setFillColor(...statusColor);
  roundedRect(pdf, badgeX, yPos, badgeW, 8, 4, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(...brand.white);
  pdf.text(statusLabel, pageWidth / 2, yPos + 5.5, { align: 'center' });

  // ─── DIVIDER ──────────────────────────────────────────────────────────────
  yPos += 16;
  pdf.setDrawColor(...brand.slate200);
  pdf.setLineWidth(0.3);
  pdf.line(margin, yPos, pageWidth - margin, yPos);

  // ─── TRANSACTION DETAILS SECTION ─────────────────────────────────────────
  yPos += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...brand.slate800);
  pdf.text('Transaction Details', margin, yPos);

  // Teal underline accent for section title
  pdf.setFillColor(...brand.primary);
  pdf.rect(margin, yPos + 2, 32, 1, 'F');

  yPos += 10;

  const serviceInfo = getServiceInfo(transaction);

  const rows: [string, string, boolean?][] = [
    ['Date & Time',    new Date(transaction.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })],
    ['Transaction ID', transactionId.slice(-20).toUpperCase(), true],
    ['Type',           transaction.type.replace(/_/g, ' ').toUpperCase()],
    ['Description',    (transaction.description || '–').substring(0, 42)],
    ...(transaction.reference ? [['Reference', transaction.reference, true] as [string,string,boolean]] : []),
    ...(serviceInfo.recipient   ? [['Recipient',  serviceInfo.recipient, true] as [string,string,boolean]] : []),
    ...(serviceInfo.provider && serviceInfo.provider !== 'Unknown' ? [['Provider', serviceInfo.provider] as [string,string]] : []),
    ['Payment Method', 'Wallet Balance'],
  ];

  const rowH = 10;
  rows.forEach(([label, value, mono], i) => {
    const rowY = yPos + i * rowH;

    // Alternating row background
    if (i % 2 === 0) {
      pdf.setFillColor(...brand.slate100);
      pdf.rect(margin, rowY, contentWidth, rowH, 'F');
    }

    // Label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...brand.slate400);
    pdf.text(label as string, margin + 4, rowY + 6.5);

    // Value
    pdf.setFont(mono ? 'courier' : 'helvetica', mono ? 'normal' : 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...brand.slate800);
    const val = String(value);
    pdf.text(val, pageWidth - margin - 4, rowY + 6.5, { align: 'right' });
  });

  yPos += rows.length * rowH + 4;

  // ─── ACCOUNT HOLDER SECTION ───────────────────────────────────────────────
  yPos += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...brand.slate800);
  pdf.text('Account Holder', margin, yPos);

  pdf.setFillColor(...brand.primary);
  pdf.rect(margin, yPos + 2, 28, 1, 'F');

  yPos += 10;

  const accountRows: [string, string][] = [
    ['Full Name', user.fullName || '–'],
    ['Email',     user.email    || '–'],
    ['Phone',     user.phone    || '–'],
  ];

  accountRows.forEach(([label, value], i) => {
    const rowY = yPos + i * rowH;
    if (i % 2 === 0) {
      pdf.setFillColor(...brand.slate100);
      pdf.rect(margin, rowY, contentWidth, rowH, 'F');
    }
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...brand.slate400);
    pdf.text(label, margin + 4, rowY + 6.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...brand.slate800);
    pdf.text(value, pageWidth - margin - 4, rowY + 6.5, { align: 'right' });
  });

  yPos += accountRows.length * rowH + 6;

  // ─── INFO NOTE BOX ────────────────────────────────────────────────────────
  yPos += 4;
  pdf.setFillColor(70, 240, 210, 0.05 as any);
  pdf.setDrawColor(...brand.primary);
  pdf.setLineWidth(0.4);
  roundedRect(pdf, margin, yPos, contentWidth, 22, 4, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...brand.primary);
  pdf.text('ⓘ  Important Notice', margin + 5, yPos + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(...brand.slate600);
  pdf.text('Keep this reference number for any disputes. Funds clear within 24 hours.', margin + 5, yPos + 13);
  pdf.text('For support, contact us at support@eguy.app', margin + 5, yPos + 18.5);

  // ─── SUBTLE WATERMARK ─────────────────────────────────────────────────────
  pdf.setTextColor(70, 240, 210, 0.04 as any);
  pdf.setFontSize(72);
  pdf.setFont('helvetica', 'bold');
  pdf.text('eGuy', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  const footerY = pageHeight - 22;

  // Footer background strip
  pdf.setFillColor(...brand.dark);
  pdf.rect(0, footerY - 4, pageWidth, 30, 'F');

  // Teal top border of footer
  pdf.setFillColor(...brand.primary);
  pdf.rect(0, footerY - 4, pageWidth, 1.5, 'F');

  // Footer Logo
  pdf.setFillColor(...brand.primary);
  pdf.circle(margin + 5, footerY + 5, 5, 'F');
  pdf.setFillColor(...brand.dark);
  pdf.circle(margin + 5, footerY + 5, 3.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5);
  pdf.setTextColor(...brand.primary);
  pdf.text('eG', margin + 5, footerY + 6.5, { align: 'center' });

  // App name in footer
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...brand.white);
  pdf.text('eGuy', margin + 13, footerY + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(...brand.slate400);
  pdf.text('Digital Wallet Platform', margin + 13, footerY + 9.5);

  // Right side — contact
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(...brand.slate400);
  pdf.text('support@eguy.app', pageWidth - margin, footerY + 5, { align: 'right' });
  pdf.text('www.eguy.app', pageWidth - margin, footerY + 10, { align: 'right' });

  // Generated timestamp centered
  pdf.setFontSize(6.5);
  pdf.setTextColor(...brand.slate600);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 13, { align: 'center' });

  return Buffer.from(pdf.output('arraybuffer'));
}

// Helper to draw rounded rect
function roundedRect(pdf: any, x: number, y: number, w: number, h: number, r: number, style: string) {
  pdf.roundedRect(x, y, w, h, r, r, style);
}

// Helper for dashed line
function dashedLine(pdf: any, x1: number, y1: number, x2: number, y2: number, dashLen = 1) {
  pdf.setLineDash([dashLen, dashLen], 0);
  pdf.line(x1, y1, x2, y2);
  pdf.setLineDash([], 0);
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return { r: 16,  g: 185, b: 129 };
    case "pending":   return { r: 245, g: 158, b: 11  };
    case "failed":    return { r: 239, g: 68,  b: 68  };
    case "cancelled": return { r: 107, g: 114, b: 128 };
    default:          return { r: 107, g: 114, b: 128 };
  }
}

