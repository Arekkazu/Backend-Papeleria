import mongoose from "mongoose";

const suppliersSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Supplier = mongoose.model(
  "Supplier",
  suppliersSchema,
  "suppliers",
);
