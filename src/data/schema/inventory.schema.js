import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // referencia a la colección de productos
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Exporta el modelo con el nombre correcto
export const Inventory = mongoose.model("Inventory", InventorySchema, "inventory");
