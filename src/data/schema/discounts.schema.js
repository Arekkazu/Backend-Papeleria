import mongoose from "mongoose";

export const discountSchema = new mongoose.Schema({
  code: String,
  percent: Number,
  active: Boolean,
});
