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
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
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
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { transactionId, format = "pdf", action = "generate" } = body

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID required" }, { status: 400 })
    }

    const user = await Database.findUserByEmail(session.user.email)
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

      return new NextResponse(pdfBuffer, {
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
  const margin = 20;
  let yPosition = margin;

  // Add watermark background (subtle text across the page)
  pdf.setTextColor(220, 220, 220); // Very light gray
  pdf.setFontSize(30);
  pdf.setFont('helvetica', 'bold');

  // Watermark text repeated across the page
  const watermarkText = 'eGuy';
  const watermarkWidth = pdf.getTextWidth(watermarkText);

  // Position watermarks diagonally across the page (simpler approach)
  for (let i = 50; i < pageHeight; i += 100) {
    for (let j = 0; j < pageWidth; j += watermarkWidth + 150) {
      pdf.text(watermarkText, j, i, { angle: 45 });
    }
  }

  // Helper function to add text with styling
  const addStyledText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.setFont(options.font || 'helvetica', options.style || 'normal');
    pdf.setFontSize(options.size || 10);

    if (Array.isArray(options.color)) {
      // RGB array
      pdf.setTextColor(options.color[0], options.color[1], options.color[2]);
    } else if (typeof options.color === 'string') {
      // Hex color string
      pdf.setTextColor(options.color);
    } else {
      // Default black
      pdf.setTextColor(options.color || 0);
    }

    pdf.text(text, x, y);
  };

  // Header - eGuy Logo and Title
  yPosition += 10;

  // Logo background circle (larger for watermark effect)
  pdf.setFillColor(59, 130, 246, 0.1); // Light blue with transparency for watermark
  pdf.circle(margin + 15, yPosition + 8, 12, 'F');

  // Main logo circle (solid)
  pdf.setFillColor(59, 130, 246); // Blue color
  pdf.circle(margin + 15, yPosition + 8, 10, 'F');

  // Logo text (white "eG")
  addStyledText('eG', margin + 10, yPosition + 12, {
    size: 20,
    color: 255,
    font: 'helvetica',
    style: 'bold'
  });

  // Company name
  addStyledText('eGuy', margin + 30, yPosition + 10, {
    size: 22,
    color: 0,
    font: 'helvetica',
    style: 'bold'
  });

  // Digital Wallet subtitle
  yPosition += 8;
  addStyledText('Digital Wallet', margin + 30, yPosition + 10, {
    size: 12,
    color: 107,
    font: 'helvetica',
    style: 'normal'
  });

  // Receipt title and date
  yPosition += 25;
  addStyledText('Transaction Receipt', margin, yPosition, {
    size: 16,
    color: 0,
    font: 'helvetica',
    style: 'bold'
  });

  yPosition += 8;
  addStyledText(new Date(transaction.createdAt).toLocaleDateString(), margin, yPosition, {
    size: 10,
    color: 107
  });

  // Decorative line
  yPosition += 10;
  pdf.setDrawColor(148, 163, 184); // Gray color
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  // Transaction details
  yPosition += 15;

  // Main transaction info
  addStyledText(transaction.description || `${transaction.type.replace("_", " ").toUpperCase()}`, margin, yPosition, {
    size: 14,
    color: 0,
    font: 'helvetica',
    style: 'bold'
  });

  yPosition += 8;
  const amountText = `${transaction.type === "deposit" || transaction.type === "referral_bonus" ? "+" : "-"}₦${transaction.amount.toLocaleString()}`;
  addStyledText(amountText, margin, yPosition, {
    size: 16,
    color: transaction.type === "deposit" || transaction.type === "referral_bonus" ? [34, 197, 94] : [239, 68, 68],
    font: 'helvetica',
    style: 'bold'
  });

  // Status badge
  yPosition += 10;
  const statusColor = getStatusColor(transaction.status);
  pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  const statusText = transaction.status.toUpperCase();
  const statusWidth = pdf.getTextWidth(statusText) + 8;
  pdf.rect(pageWidth - margin - statusWidth, yPosition - 3, statusWidth + 4, 8, 'F');

  addStyledText(statusText, pageWidth - margin - statusWidth + 2, yPosition + 3, {
    size: 8,
    color: 255
  });

  // Transaction details section
  yPosition += 20;

  // Section title
  addStyledText('Transaction Details', margin, yPosition, {
    size: 12,
    color: 0,
    font: 'helvetica',
    style: 'bold'
  });

  yPosition += 10;

  // Details in two columns
  const leftColumnX = margin;
  const rightColumnX = pageWidth / 2 + 10;
  let leftY = yPosition;

  // Left column
  addStyledText('Transaction ID:', leftColumnX, leftY, { size: 10, color: 107 });
  addStyledText(transaction.id, leftColumnX + 35, leftY, { size: 10, color: 0 });
  leftY += 6;

  addStyledText('Date & Time:', leftColumnX, leftY, { size: 10, color: 107 });
  addStyledText(new Date(transaction.createdAt).toLocaleString(), leftColumnX + 35, leftY, { size: 10, color: 0 });
  leftY += 6;

  addStyledText('Type:', leftColumnX, leftY, { size: 10, color: 107 });
  addStyledText(transaction.type.replace("_", " ").toUpperCase(), leftColumnX + 35, leftY, { size: 10, color: 0 });
  leftY += 6;

  if (transaction.reference) {
    addStyledText('Reference:', leftColumnX, leftY, { size: 10, color: 107 });
    addStyledText(transaction.reference, leftColumnX + 35, leftY, { size: 10, color: 0 });
    leftY += 6;
  }

  // Right column - Service info
  const serviceInfo = getServiceInfo(transaction);

  if (serviceInfo.provider && serviceInfo.provider !== "Unknown") {
    addStyledText('Provider:', rightColumnX, yPosition, { size: 10, color: 107 });
    addStyledText(serviceInfo.provider, rightColumnX + 25, yPosition, { size: 10, color: 0 });
    yPosition += 6;
  }

  if (serviceInfo.recipient) {
    addStyledText('Recipient:', rightColumnX, yPosition, { size: 10, color: 107 });
    addStyledText(serviceInfo.recipient, rightColumnX + 25, yPosition, { size: 10, color: 0 });
    yPosition += 6;
  }

  addStyledText('Amount:', rightColumnX, yPosition, { size: 10, color: 107 });
  addStyledText(`₦${transaction.amount.toLocaleString()}`, rightColumnX + 25, yPosition, { size: 10, color: 0 });

  // Footer section
  yPosition += 30;

  // Decorative line
  pdf.setDrawColor(148, 163, 184);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 10;

  // Footer logo (smaller version)
  const footerLogoY = yPosition + 5;

  // Footer logo background circle
  pdf.setFillColor(59, 130, 246, 0.15); // Light blue with transparency
  pdf.circle(pageWidth - margin - 10, footerLogoY, 8, 'F');

  // Footer logo circle (solid)
  pdf.setFillColor(59, 130, 246); // Blue color
  pdf.circle(pageWidth - margin - 10, footerLogoY, 6, 'F');

  // Footer logo text
  addStyledText('eG', pageWidth - margin - 15, footerLogoY + 4, {
    size: 12,
    color: 255,
    font: 'helvetica',
    style: 'bold'
  });

  // Footer text
  addStyledText('This receipt is generated electronically and is valid without signature.', margin, yPosition, {
    size: 8,
    color: 107
  });

  yPosition += 6;
  addStyledText('For support, contact us at support@eguy.app', margin, yPosition, {
    size: 8,
    color: 107
  });

  yPosition += 6;
  addStyledText('Thank you for using eGuy!', margin, yPosition, {
    size: 10,
    color: 0,
    font: 'helvetica',
    style: 'bold'
  });

  // Return PDF as buffer
  return Buffer.from(pdf.output('arraybuffer'));
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return { r: 16, g: 185, b: 129 }; // Green
    case "pending":
      return { r: 245, g: 158, b: 11 }; // Yellow
    case "failed":
      return { r: 239, g: 68, b: 68 }; // Red
    case "cancelled":
      return { r: 107, g: 114, b: 128 }; // Gray
    default:
      return { r: 107, g: 114, b: 128 }; // Gray
  }
}
