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
  const margin = 20;

  // --- Theme Colors ---
  const colors = {
    primary: [71, 240, 209], // #47f0d1 (Teal/Greenish) - Your primary color
    secondary: [15, 23, 42], // Slate 900 - Dark background
    text: {
      dark: [15, 23, 42],
      light: [100, 116, 139], // Slate 500
      white: [255, 255, 255]
    },
    success: [34, 197, 94],
    error: [239, 68, 68],
    warning: [245, 158, 11],
    gray: [241, 245, 249] // Slate 100
  };

  // --- Header Background ---
  // Create a curved header background
  pdf.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.rect(0, 0, pageWidth, 50, 'F');

  // Add a subtle glow/accent line
  pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.setLineWidth(1);
  pdf.line(0, 49, pageWidth, 49);

  // --- Header Content ---
  let yPosition = 25;

  // Logo Circle
  pdf.setFillColor(255, 255, 255);
  pdf.circle(margin + 10, yPosition, 12, 'F');

  // Logo Text "eG"
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  pdf.text('eG', margin + 6, yPosition + 1.5);

  // App Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('eGuy', margin + 30, yPosition + 2);

  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(148, 163, 184); // Slate 400
  pdf.text('Digital Wallet', margin + 30, yPosition + 7);

  // Title "Receipt" on the right
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('RECEIPT', pageWidth - margin - 5, yPosition + 2, { align: 'right' });


  // --- Main Content Box ---
  yPosition = 70;

  // Amount Section
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(colors.text.light[0], colors.text.light[1], colors.text.light[2]);
  pdf.text('Total Amount', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 12;
  const isPositive = transaction.type === "deposit" || transaction.type === "referral_bonus";
  const amountText = `${isPositive ? "+" : "-"}₦${transaction.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(36);
  if (isPositive) {
    pdf.setTextColor(colors.success[0], colors.success[1], colors.success[2]);
  } else {
    pdf.setTextColor(colors.text.dark[0], colors.text.dark[1], colors.text.dark[2]);
  }
  pdf.text(amountText, pageWidth / 2, yPosition, { align: 'center' });

  // Status Badge
  yPosition += 10;
  const statusColor = getStatusColor(transaction.status);
  const statusText = transaction.status.toUpperCase();

  pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  // Calculate width for centered badge
  const statusWidth = pdf.getTextWidth(statusText) + 12;
  const badgeX = (pageWidth - statusWidth) / 2;

  // Rounded rect for badge
  roundedRect(pdf, badgeX, yPosition, statusWidth, 7, 3, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text(statusText, pageWidth / 2, yPosition + 4.5, { align: 'center' });


  // --- Details Grid ---
  yPosition += 25;
  const boxPadding = 6;
  const rowHeight = 12;
  let currentY = yPosition;

  // Helper for rows
  const addRow = (label: string, value: string, isMono: boolean = false) => {
    // Label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(colors.text.light[0], colors.text.light[1], colors.text.light[2]);
    pdf.text(label, margin, currentY + boxPadding);

    // Value
    pdf.setFont(isMono ? 'courier' : 'helvetica', isMono ? 'normal' : 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(colors.text.dark[0], colors.text.dark[1], colors.text.dark[2]);
    pdf.text(value, pageWidth - margin, currentY + boxPadding, { align: 'right' });

    // Dotted Line
    pdf.setDrawColor(226, 232, 240); // Slate 200
    pdf.setLineWidth(0.5);
    dashedLine(pdf, margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);

    currentY += rowHeight + 2;
  };

  const serviceInfo = getServiceInfo(transaction);

  addRow('Transaction Date', new Date(transaction.createdAt).toLocaleString());
  addRow('Transaction Reference', transaction.reference || transaction.id, true);
  addRow('Transaction Type', transaction.type.replace(/_/g, " ").toUpperCase());

  if (transaction.description) {
    // Truncate if too long
    const desc = transaction.description.length > 40 ? transaction.description.substring(0, 37) + '...' : transaction.description;
    addRow('Description', desc);
  }

  if (serviceInfo.recipient) {
    addRow('Recipient / Details', serviceInfo.recipient, true);
  }

  if (serviceInfo.provider && serviceInfo.provider !== "Unknown") {
    addRow('Provider', serviceInfo.provider);
  }

  // --- Additional Info Box ---
  currentY += 10;
  pdf.setFillColor(248, 250, 252); // Slate 50
  pdf.setDrawColor(226, 232, 240); // Slate 200
  roundedRect(pdf, margin, currentY, pageWidth - (margin * 2), 40, 4, 'FD');

  const infoY = currentY + 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(colors.text.dark[0], colors.text.dark[1], colors.text.dark[2]);
  pdf.text('Important Information', margin + 10, infoY);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(colors.text.light[0], colors.text.light[1], colors.text.light[2]);

  const infoText = [
    "• This transaction receipt is generated automatically.",
    "• Please keep this reference number for any disputes.",
    "• Funds transfer checks generally clear within 24 hours."
  ];

  let lineY = infoY + 6;
  infoText.forEach(line => {
    pdf.text(line, margin + 10, lineY);
    lineY += 5;
  });


  // --- Watermark (Subtle) ---
  pdf.setTextColor(241, 245, 249); // Very light gray
  pdf.setFontSize(60);
  pdf.setFont('helvetica', 'bold');
  const watermarkText = "eGuy";

  // Center watermark
  const textWidth = pdf.getTextWidth(watermarkText);
  // Save graphics state
  // jsPDF doesn't support save/restore clearly in TS typings always, but we can just rotate back

  // Simple centered watermark without rotation to be safe/clean
  pdf.text(watermarkText, (pageWidth / 2), (pageHeight / 2), { align: 'center' });


  // --- Footer ---
  const footerY = pageHeight - 30;

  // Divider
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(margin, footerY, pageWidth - margin, footerY);

  // Footer Text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text('eGuy Digital Wallet', pageWidth / 2, footerY + 8, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(colors.text.light[0], colors.text.light[1], colors.text.light[2]);
  pdf.text('support@eguy.app  •  www.eguy.app', pageWidth / 2, footerY + 13, { align: 'center' });


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
  pdf.setLineDash([], 0); // Restore solid
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
