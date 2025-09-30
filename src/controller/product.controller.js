import { Product } from "../data/schema/products.schema.js";

export const ProductController = {
  // Crear producto
  create: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: "Error al crear producto", error });
    }
  },

  // Obtener todos
  getAll: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos", error });
    }
  },

  // Obtener uno por ID
  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto", error });
    }
  },

  // Actualizar
  update: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar producto", error });
    }
  },

  // Eliminar
  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar producto", error });
    }
  }
};