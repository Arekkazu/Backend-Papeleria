import { Inventory } from "../data/schema/inventory.schema.js";

export const InventoryController = {
  create: async (req, res) => {
    try {
      const inventory = new Inventory(req.body);
      await inventory.save();
      res.status(201).json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error al crear inventario", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const inventory = await Inventory.find().populate("product");
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener inventario", error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const inventory = await Inventory.findById(req.params.id).populate("product");
      if (!inventory) return res.status(404).json({ message: "Registro no encontrado" });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener inventario", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!inventory) return res.status(404).json({ message: "Registro no encontrado" });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar inventario", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const inventory = await Inventory.findByIdAndDelete(req.params.id);
      if (!inventory) return res.status(404).json({ message: "Registro no encontrado" });
      res.json({ message: "Registro eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar inventario", error: error.message });
    }
  }
};
