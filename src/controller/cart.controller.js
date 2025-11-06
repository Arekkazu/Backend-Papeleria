import { Cart } from "../data/schema/cart.schema.js";
import { Product } from "../data/schema/products.schema.js";
import { Discount } from "../data/schema/discounts.schema.js";

export const CartController = {
  // Obtener carrito del usuario autenticado
  getCart: async (req, res) => {
    try {
      const userId = req.user._id;

      let cart = await Cart.findOne({ user: userId, status: "active" })
        .populate("items.product")
        .populate("appliedDiscount");

      // Si no existe carrito activo, crear uno nuevo
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          totalAmount: 0,
          status: "active"
        });
        await cart.save();
      }

      res.status(200).json({
        success: true,
        cart
      });
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Agregar producto al carrito
  addToCart: async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "ID del producto es requerido"
        });
      }

      // Verificar que el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado"
        });
      }

      // Buscar carrito activo del usuario
      let cart = await Cart.findOne({ user: userId, status: "active" });

      // Si no existe carrito, crear uno nuevo
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          totalAmount: 0,
          status: "active"
        });
      }

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Actualizar cantidad si ya existe
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Agregar nuevo item
        cart.items.push({
          product: productId,
          quantity,
          unitPrice: product.price
        });
      }

      // Recalcular total
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);

      await cart.save();

      // Poblar datos para la respuesta
      await cart.populate("items.product");
      await cart.populate("appliedDiscount");

      res.status(200).json({
        success: true,
        message: "Producto agregado al carrito",
        cart
      });
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Actualizar cantidad de producto en el carrito
  updateCartItem: async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Cantidad válida es requerida"
        });
      }

      const cart = await Cart.findOne({ user: userId, status: "active" });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado"
        });
      }

      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado en el carrito"
        });
      }

      if (quantity === 0) {
        // Eliminar item si cantidad es 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Actualizar cantidad
        cart.items[itemIndex].quantity = quantity;
      }

      // Recalcular total
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);

      await cart.save();
      await cart.populate("items.product");
      await cart.populate("appliedDiscount");

      res.status(200).json({
        success: true,
        message: "Carrito actualizado",
        cart
      });
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Aplicar descuento al carrito
  applyDiscount: async (req, res) => {
    try {
      const userId = req.user._id;
      const { discountCode } = req.body;

      if (!discountCode) {
        return res.status(400).json({
          success: false,
          message: "Código de descuento es requerido"
        });
      }

      // Buscar descuento activo
      const discount = await Discount.findOne({
        code: discountCode,
        active: true
      });

      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Código de descuento no válido o expirado"
        });
      }

      const cart = await Cart.findOne({ user: userId, status: "active" });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado"
        });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El carrito está vacío"
        });
      }

      // Aplicar descuento
      cart.appliedDiscount = discount._id;

      // Recalcular total con descuento
      const subtotal = cart.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);

      cart.totalAmount = subtotal - (subtotal * discount.percent / 100);

      await cart.save();
      await cart.populate("items.product");
      await cart.populate("appliedDiscount");

      res.status(200).json({
        success: true,
        message: "Descuento aplicado exitosamente",
        cart
      });
    } catch (error) {
      console.error("Error al aplicar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Remover descuento del carrito
  removeDiscount: async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId, status: "active" });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado"
        });
      }

      if (!cart.appliedDiscount) {
        return res.status(400).json({
          success: false,
          message: "No hay descuento aplicado"
        });
      }

      // Remover descuento y recalcular total
      cart.appliedDiscount = null;
      cart.totalAmount = cart.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);

      await cart.save();
      await cart.populate("items.product");

      res.status(200).json({
        success: true,
        message: "Descuento removido",
        cart
      });
    } catch (error) {
      console.error("Error al remover descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Vaciar carrito
  clearCart: async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId, status: "active" });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado"
        });
      }

      cart.items = [];
      cart.totalAmount = 0;
      cart.appliedDiscount = null;

      await cart.save();

      res.status(200).json({
        success: true,
        message: "Carrito vaciado exitosamente",
        cart
      });
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  },

  // Completar carrito (crear venta)
  checkout: async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId, status: "active" })
        .populate("items.product");

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrito no encontrado"
        });
      }

      if (cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El carrito está vacío"
        });
      }

      // Aquí se integraría con el módulo de ventas
      // Por ahora solo marcamos el carrito como completado
      cart.status = "completed";
      await cart.save();

      res.status(200).json({
        success: true,
        message: "Compra completada exitosamente",
        cart
      });
    } catch (error) {
      console.error("Error al completar compra:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
};
