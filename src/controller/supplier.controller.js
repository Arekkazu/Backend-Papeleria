import { Supplier } from "../data/schema/suppliers.schema.js";

export const SupplierController = {
  create: async (req, res) => {
    try {
      const supplier = new Supplier(req.body);
      await supplier.save();
      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Error al crear proveedor", error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) return res.status(404).json({ message: "Proveedor no encontrado" });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!supplier) return res.status(404).json({ message: "Proveedor no encontrado" });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar proveedor", error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const supplier = await Supplier.findByIdAndDelete(req.params.id);
      if (!supplier) return res.status(404).json({ message: "Proveedor no encontrado" });
      res.json({ message: "Proveedor eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar proveedor", error: error.message });
    }
  }
};
