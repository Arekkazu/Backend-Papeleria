import { Product } from "../data/schema/products.schema.js";

export const ProductController = {
  // Crear producto
  create: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        product: newProduct
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({ 
        success: false,
        message: "Error al crear producto", 
        error: error.message 
      });
    }
  },

  // Obtener todos
  getAll: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('category', 'name description')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener productos", 
        error: error.message 
      });
    }
  },

  // Obtener uno por ID
  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name description')
        .populate('suppliers', 'companyName email phone');
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: "Producto no encontrado" 
        });
      }
      
      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({ 
        success: false,
        message: "Error al obtener producto", 
        error: error.message 
      });
    }
  },

  // Actualizar
  update: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: "Producto no encontrado" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Producto actualizado exitosamente",
        product
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ 
        success: false,
        message: "Error al actualizar producto", 
        error: error.message 
      });
    }
  },

  // Eliminar
  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: "Producto no encontrado" 
        });
      }
      
      res.status(200).json({ 
        success: true,
        message: "Producto eliminado exitosamente" 
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ 
        success: false,
        message: "Error al eliminar producto", 
        error: error.message 
      });
    }
  }
};