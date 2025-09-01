import mongoose from "mongoose";

export const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});
