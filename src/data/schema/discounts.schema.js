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
  // Información del personaje Dragon Ball
  dragonBallCharacter: {
    name: String,
    ki: String,
    image: String,
  },
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    enum: ['manual', 'dragonball'],
    default: 'manual',
  },
});

export const Discount = mongoose.model("Discount", discountSchema, "discounts");
