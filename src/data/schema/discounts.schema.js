import mongoose from "mongoose";

export const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  percent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export const Discount = mongoose.model("Discount", discountSchema, "discounts");
