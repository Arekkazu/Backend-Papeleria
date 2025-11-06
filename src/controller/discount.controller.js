import { Discount } from "../data/schema/discounts.schema.js";

export const DiscountController = {
  // Crear nuevo descuento
  create: async (req, res) => {
    try {
      const { code, percent, active = true } = req.body;

      if (!code || percent === undefined) {
        return res.status(400).json({
          success: false,
          message: "Código y porcentaje son requeridos"
        });
      }

      if (percent < 0 || percent > 100) {
        return res.status(400).json({
          success: false,
          message: "El porcentaje debe estar entre 0 y 100"
        });
      }

      // Verificar si el código ya existe
      const existingDiscount = await Discount.findOne({ code });
      if (existingDiscount) {
        return res.status(400).json({
          success: false,
          message: "El código de descuento ya existe"
        });
      }

      const discount = new Discount({
        code,
        percent,
        active
      });

      await discount.save();

      res.status(201).json({
        success: true,
        message: "Descuento creado exitosamente",
        discount
      });
    } catch (error) {
      console.error("Error al crear descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener todos los descuentos
  getAll: async (req, res) => {
    try {
      const discounts = await Discount.find().sort({ code: 1 });

      res.status(200).json({
        success: true,
        discounts
      });
    } catch (error) {
      console.error("Error al obtener descuentos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener descuentos activos
  getActive: async (req, res) => {
    try {
      const discounts = await Discount.find({ active: true }).sort({ code: 1 });

      res.status(200).json({
        success: true,
        discounts
      });
    } catch (error) {
      console.error("Error al obtener descuentos activos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener descuento por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado"
        });
      }

      res.status(200).json({
        success: true,
        discount
      });
    } catch (error) {
      console.error("Error al obtener descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener descuento por código
  getByCode: async (req, res) => {
    try {
      const { code } = req.params;

      const discount = await Discount.findOne({ code });
      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado"
        });
      }

      res.status(200).json({
        success: true,
        discount
      });
    } catch (error) {
      console.error("Error al obtener descuento por código:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Actualizar descuento
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { code, percent, active } = req.body;

      const discount = await Discount.findById(id);
      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado"
        });
      }

      // Si se está actualizando el código, verificar que no exista otro con el mismo código
      if (code && code !== discount.code) {
        const existingDiscount = await Discount.findOne({ code });
        if (existingDiscount) {
          return res.status(400).json({
            success: false,
            message: "El código de descuento ya existe"
          });
        }
        discount.code = code;
      }

      if (percent !== undefined) {
        if (percent < 0 || percent > 100) {
          return res.status(400).json({
            success: false,
            message: "El porcentaje debe estar entre 0 y 100"
          });
        }
        discount.percent = percent;
      }

      if (active !== undefined) {
        discount.active = active;
      }

      await discount.save();

      res.status(200).json({
        success: true,
        message: "Descuento actualizado exitosamente",
        discount
      });
    } catch (error) {
      console.error("Error al actualizar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Eliminar descuento
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await Discount.findByIdAndDelete(id);
      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado"
        });
      }

      res.status(200).json({
        success: true,
        message: "Descuento eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Validar descuento
  validate: async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Código de descuento es requerido"
        });
      }

      const discount = await Discount.findOne({
        code,
        active: true
      });

      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Código de descuento no válido o expirado"
        });
      }

      res.status(200).json({
        success: true,
        message: "Descuento válido",
        discount
      });
    } catch (error) {
      console.error("Error al validar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
};
