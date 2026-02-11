// lib/models/airtimePlan.ts
export interface AirtimePlan {
  _id?: string;
  network: string;
  amount: number;
  price: number;     // your selling price
  apiPrice: number;  // SubAndGain API price
  createdAt?: Date;
  updatedAt?: Date;
}

