import { Sale } from "../data/schema/sales.schema.js";
import { Cart } from "../data/schema/cart.schema.js";
import { Product } from "../data/schema/products.schema.js";
import { Inventory } from "../data/schema/inventory.schema.js";

export const SalesController = {
  // Crear nueva venta
  create: async (req, res) => {
    try {
      const userId = req.user._id;
      const { cartId } = req.body;

      if (!cartId) {
        return res.status(400).json({
          success: false,
          message: "ID del carrito es requerido"
        });
      }

      // Buscar carrito activo del usuario
      const cart = await Cart.findOne({
        _id: cartId,
        user: userId,
        status: "active"
      }).populate("items.product");

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito activo no encontrado"
        });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El carrito está vacío"
        });
      }

      // Verificar stock disponible para todos los productos
      for (const item of cart.items) {
        const inventory = await Inventory.findOne({ product: item.product._id });

        if (!inventory || inventory.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Stock insuficiente para el producto: ${item.product.name}`
          });
        }
      }

      // Crear la venta
      const sale = new Sale({
        cart: cartId
      });

      await sale.save();

      // Actualizar inventario (reducir stock)
      for (const item of cart.items) {
        await Inventory.findOneAndUpdate(
          { product: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
      }

      // Marcar carrito como completado
      cart.status = "completed";
      await cart.save();

      // Poblar datos para la respuesta
      await sale.populate({
        path: "cart",
        populate: {
          path: "items.product",
          select: "name price"
        }
      });

      res.status(201).json({
        success: true,
        message: "Venta creada exitosamente",
        sale
      });
    } catch (error) {
      console.error("Error al crear venta:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener todas las ventas
  getAll: async (req, res) => {
    try {
      const sales = await Sale.find()
        .populate({
          path: "cart",
          populate: [
            {
              path: "user",
              select: "username email"
            },
            {
              path: "items.product",
              select: "name price"
            },
            {
              path: "appliedDiscount",
              select: "code percent"
            }
          ]
        })
        .sort({ saleDate: -1 });

      res.status(200).json({
        success: true,
        sales
      });
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener ventas del usuario autenticado
  getMySales: async (req, res) => {
    try {
      const userId = req.user._id;

      const sales = await Sale.find()
        .populate({
          path: "cart",
          match: { user: userId },
          populate: [
            {
              path: "items.product",
              select: "name price"
            },
            {
              path: "appliedDiscount",
              select: "code percent"
            }
          ]
        })
        .sort({ saleDate: -1 });

      // Filtrar ventas que tienen carrito (puede haber null si el carrito fue eliminado)
      const userSales = sales.filter(sale => sale.cart !== null);

      res.status(200).json({
        success: true,
        sales: userSales
      });
    } catch (error) {
      console.error("Error al obtener ventas del usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener venta por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const sale = await Sale.findById(id)
        .populate({
          path: "cart",
          populate: [
            {
              path: "user",
              select: "username email"
            },
            {
              path: "items.product",
              select: "name price"
            },
            {
              path: "appliedDiscount",
              select: "code percent"
            }
          ]
        });

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada"
        });
      }

      res.status(200).json({
        success: true,
        sale
      });
    } catch (error) {
      console.error("Error al obtener venta:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener estadísticas de ventas
  getStats: async (req, res) => {
    try {
      const { period = "month" } = req.query; // day, week, month, year

      let startDate = new Date();
      const endDate = new Date();

      switch (period) {
        case "day":
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1);
      }

      // Obtener ventas del período
      const sales = await Sale.find({
        saleDate: { $gte: startDate, $lte: endDate }
      }).populate({
        path: "cart",
        populate: {
          path: "items.product",
          select: "name price"
        }
      });

      // Calcular estadísticas
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((total, sale) => {
        if (sale.cart && sale.cart.totalAmount) {
          return total + sale.cart.totalAmount;
        }
        return total;
      }, 0);

      // Productos más vendidos
      const productSales = {};
      sales.forEach(sale => {
        if (sale.cart && sale.cart.items) {
          sale.cart.items.forEach(item => {
            if (item.product) {
              const productId = item.product._id.toString();
              const productName = item.product.name;
              if (!productSales[productId]) {
                productSales[productId] = {
                  name: productName,
                  quantity: 0,
                  revenue: 0
                };
              }
              productSales[productId].quantity += item.quantity;
              productSales[productId].revenue += item.quantity * item.unitPrice;
            }
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      res.status(200).json({
        success: true,
        stats: {
          period,
          totalSales,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          averageSaleValue: totalSales > 0 ? parseFloat((totalRevenue / totalSales).toFixed(2)) : 0,
          topProducts
        }
      });
    } catch (error) {
      console.error("Error al obtener estadísticas de ventas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Obtener ventas por rango de fechas
  getByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Fecha de inicio y fecha de fin son requeridas"
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      const sales = await Sale.find({
        saleDate: { $gte: start, $lte: end }
      })
        .populate({
          path: "cart",
          populate: [
            {
              path: "user",
              select: "username email"
            },
            {
              path: "items.product",
              select: "name price"
            }
          ]
        })
        .sort({ saleDate: -1 });

      res.status(200).json({
        success: true,
        sales
      });
    } catch (error) {
      console.error("Error al obtener ventas por rango de fechas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Eliminar venta (solo admin)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const sale = await Sale.findById(id).populate("cart");
      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Venta no encontrada"
        });
      }

      // Revertir stock si es necesario
      if (sale.cart && sale.cart.items) {
        for (const item of sale.cart.items) {
          await Inventory.findOneAndUpdate(
            { product: item.product },
            { $inc: { stock: item.quantity } }
          );
        }
      }

      await Sale.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Venta eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
};
