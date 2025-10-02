import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IDataPlan extends Document {
  network: string;
  dataBundle: string;
  dataPlan: string; // SubAndGain plan code
  duration: string;
  type: string;
  status: string;
  price: number; // Your selling price
  apiPrice: number; // SubAndGain api_user price
}

const DataPlanSchema = new Schema<IDataPlan>({
  network: { type: String, required: true },
  dataBundle: { type: String, required: true },
  dataPlan: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  apiPrice: { type: Number, required: true },
});

export default models.DataPlan || model<IDataPlan>("DataPlan", DataPlanSchema);
