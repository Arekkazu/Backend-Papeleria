import mongoose from "mongoose";

const suppliersSchema = new mongoose.Schema({
  // Usamos `name` para mantenerse consistente con el frontend/admin.controller
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
});

export const Supplier = mongoose.model(
  "Supplier",
  suppliersSchema,
  "suppliers",
);
