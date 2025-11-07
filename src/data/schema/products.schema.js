import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "Sin descripción",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false, // Permitir null para migración
  },
  categoryName: {
    type: String, // Nombre de categoría como string para compatibilidad
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  suppliers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  }],
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

export const Product = mongoose.model("Product", productsSchema, "products");
