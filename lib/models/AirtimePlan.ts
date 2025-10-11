import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IAirtimePlan extends Document {
  network: string;
  amount: number;
  price: number; // Your selling price
  apiPrice: number; // SubAndGain api_user price
}

const AirtimePlanSchema = new Schema<IAirtimePlan>({
  network: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  apiPrice: { type: Number, required: true },
});

export default models.AirtimePlan || model<IAirtimePlan>("AirtimePlan", AirtimePlanSchema);
