import mongoose, { Schema, Document, models, model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "transaction" | "referral" | "security" | "system" | "promotion";
  title: string;
  message: string;
  amount?: number;
  status: "success" | "error" | "warning" | "info";
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["transaction", "referral", "security", "system", "promotion"],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  amount: { type: Number },
  status: {
    type: String,
    enum: ["success", "error", "warning", "info"],
    default: "info"
  },
  read: { type: Boolean, default: false },
  actionUrl: { type: String },
  metadata: { type: Schema.Types.Mixed },
}, {
  timestamps: true
});

// Index for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1 });

export default models.Notification || model<INotification>("Notification", NotificationSchema);
