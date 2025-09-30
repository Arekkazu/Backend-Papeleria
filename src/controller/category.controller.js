import { Category } from "../data/schema/categories.schema.js";

export const CategoryController = {
  create: async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al crear categoría", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías", error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categoría", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar categoría", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
      res.json({ message: "Categoría eliminada" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar categoría", error: error.message });
    }
  }
};
