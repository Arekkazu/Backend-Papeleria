import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
});

export const Sale = mongoose.model("Sale", salesSchema, "sales");
