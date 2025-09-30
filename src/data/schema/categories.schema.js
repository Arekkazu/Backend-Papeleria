import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false, // puedes hacerlo true si quieres que siempre sea obligatorio
    trim: true,
  },
});

export const Category = mongoose.model(
  "Category",
  categoriesSchema,
  "categories",
);
