import mongoose from "mongoose";

const BillsPlanSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["electricity", "cable_tv", "internet", "education", "insurance", "others"],
  },
  provider: {
    type: String,
    required: true, // e.g., "DSTV", "GOTV", "PHCN", "WAEC", etc.
  },
  planName: {
    type: String,
    required: true, // e.g., "DSTV Premium", "WAEC Scratch Card"
  },
  planCode: {
    type: String,
    required: true, // API plan code
  },
  amount: {
    type: Number,
    required: true, // API amount
  },
  price: {
    type: Number,
    required: true, // User price (with profit margin)
  },
  apiPrice: {
    type: Number,
    required: true, // API price
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.BillsPlan || mongoose.model("BillsPlan", BillsPlanSchema);