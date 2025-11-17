import { User } from "../data/schema/users.schemas.js";
import { Product } from "../data/schema/products.schema.js";
import { Category } from "../data/schema/categories.schema.js";
import { Sale } from "../data/schema/sales.schema.js";
import { Cart } from "../data/schema/cart.schema.js";
import { Discount } from "../data/schema/discounts.schema.js";
import { Supplier } from "../data/schema/suppliers.schema.js";
import { Role } from "../data/schema/roles.schemas.js";

export const AdminController = {
  // Obtener estadísticas generales del dashboard
  getDashboardStats: async (req, res) => {
    try {
      // Contar documentos
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();
      const totalDiscounts = await Discount.countDocuments();
      const activeCarts = await Cart.countDocuments({ status: "active" });
      const completedCarts = await Cart.countDocuments({ status: "completed" });

      // Obtener ventas (usando carritos completados como proxy)
      const totalSales = completedCarts;

      // Calcular ingresos totales
      const completedCartsData = await Cart.find({ status: "completed" });
      const totalRevenue = completedCartsData.reduce(
        (sum, cart) => sum + cart.totalAmount,
        0,
      );

      // Productos más vendidos (simulado con carritos)
      const topProducts = await Cart.aggregate([
        { $match: { status: "completed" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: {
              $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] },
            },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
      ]);

      // Usuarios registrados por mes (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const usersByMonth = await User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalDiscounts,
          activeCarts,
          totalSales,
          totalRevenue,
          topProducts,
          usersByMonth,
        },
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener estadísticas",
      });
    }
  },

  // Obtener todos los usuarios (con paginación)
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const query = search
        ? {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const users = await User.find(query)
        .populate("rol")
        .select("-password")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
      });
    }
  },

  // Actualizar rol de usuario
  updateUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        return res.status(400).json({
          success: false,
          message: "ID de rol es requerido",
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role: roleId },
        { new: true },
      ).populate("role");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Rol actualizado exitosamente",
        user,
      });
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar rol",
      });
    }
  },

  // Eliminar usuario
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      // No permitir eliminar al propio admin
      if (userId === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "No puedes eliminar tu propia cuenta",
        });
      }

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
      });
    }
  },

  // Obtener todos los productos con filtros
  getAllProductsAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 10, category, search = "" } = req.query;
      const skip = (page - 1) * limit;

      let query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      // Si se filtra por categoría, buscar el ID de la categoría por su nombre
      if (category) {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // Si no existe la categoría, devolver array vacío
          return res.status(200).json({
            success: true,
            products: [],
            pagination: {
              total: 0,
              page: parseInt(page),
              limit: parseInt(limit),
              pages: 0,
            },
          });
        }
      }

      const products = await Product.find(query)
        .populate("category")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      // Agregar categoryName a cada producto para facilitar el acceso en el frontend
      const productsWithCategoryName = products.map((product) => {
        const productObj = product.toObject();
        productObj.categoryName = product.category?.name || "";
        return productObj;
      });

      res.status(200).json({
        success: true,
        products: productsWithCategoryName,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener productos",
      });
    }
  },

  // Crear producto (bulk)
  createProduct: async (req, res) => {
    try {
      const productData = req.body;

      // Si viene categoryName, buscar el ID de la categoría
      if (productData.categoryName) {
        const categoryDoc = await Category.findOne({
          name: productData.categoryName,
        });
        if (categoryDoc) {
          productData.category = categoryDoc._id;
        } else {
          return res.status(400).json({
            success: false,
            message: `La categoría "${productData.categoryName}" no existe. Por favor, créala primero.`,
          });
        }
        delete productData.categoryName; // Eliminar categoryName del objeto
      }

      const product = new Product(productData);
      await product.save();

      // Poblar la categoría para la respuesta
      await product.populate("category");

      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        product: {
          ...product.toObject(),
          categoryName: product.category?.name || "",
        },
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear producto",
      });
    }
  },

  // Actualizar producto
  updateProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const updateData = req.body;

      // Si viene categoryName, buscar el ID de la categoría
      if (updateData.categoryName) {
        const categoryDoc = await Category.findOne({
          name: updateData.categoryName,
        });
        if (categoryDoc) {
          updateData.category = categoryDoc._id;
        } else {
          return res.status(400).json({
            success: false,
            message: `La categoría "${updateData.categoryName}" no existe. Por favor, créala primero.`,
          });
        }
        delete updateData.categoryName; // Eliminar categoryName del objeto
      }

      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
      }).populate("category");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Producto actualizado exitosamente",
        product: {
          ...product.toObject(),
          categoryName: product.category?.name || "",
        },
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar producto",
      });
    }
  },

  // Eliminar producto
  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar producto",
      });
    }
  },

  // Obtener todos los descuentos
  getAllDiscounts: async (req, res) => {
    try {
      const discounts = await Discount.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        discounts,
      });
    } catch (error) {
      console.error("Error al obtener descuentos:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener descuentos",
      });
    }
  },

  // Crear descuento manual
  createDiscount: async (req, res) => {
    try {
      const discountData = req.body;

      const discount = new Discount(discountData);
      await discount.save();

      res.status(201).json({
        success: true,
        message: "Descuento creado exitosamente",
        discount,
      });
    } catch (error) {
      console.error("Error al crear descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear descuento",
      });
    }
  },

  // Actualizar descuento
  updateDiscount: async (req, res) => {
    try {
      const { discountId } = req.params;
      const updateData = req.body;

      const discount = await Discount.findByIdAndUpdate(
        discountId,
        updateData,
        { new: true },
      );

      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Descuento actualizado exitosamente",
        discount,
      });
    } catch (error) {
      console.error("Error al actualizar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar descuento",
      });
    }
  },

  // Eliminar descuento
  deleteDiscount: async (req, res) => {
    try {
      const { discountId } = req.params;

      const discount = await Discount.findByIdAndDelete(discountId);

      if (!discount) {
        return res.status(404).json({
          success: false,
          message: "Descuento no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Descuento eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar descuento:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar descuento",
      });
    }
  },

  // ============ CATEGORÍAS ============

  // Obtener todas las categorías (con paginación y conteo de productos)
  getCategoriesAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const categories = await Category.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "products",
          },
        },
        {
          $addFields: {
            productsCount: { $size: "$products" },
          },
        },
        {
          $project: {
            products: 0,
          },
        },
        { $sort: { name: 1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);

      const total = await Category.countDocuments(query);

      res.status(200).json({
        success: true,
        categories,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener categorías",
      });
    }
  },

  // Crear categoría
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "El nombre de la categoría es requerido",
        });
      }

      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una categoría con ese nombre",
        });
      }

      const category = new Category({
        name,
        description,
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente",
        category,
      });
    } catch (error) {
      console.error("Error al crear categoría:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear categoría",
      });
    }
  },

  // Actualizar categoría
  updateCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "El nombre de la categoría es requerido",
        });
      }

      const categoryExists = await Category.findOne({
        name,
        _id: { $ne: categoryId },
      });
      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una categoría con ese nombre",
        });
      }

      const category = await Category.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true, runValidators: true },
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Categoría no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message: "Categoría actualizada exitosamente",
        category,
      });
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar categoría",
      });
    }
  },

  // Eliminar categoría
  deleteCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Category.findByIdAndDelete(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Categoría no encontrada",
        });
      }

      res.status(200).json({
        success: true,
        message: "Categoría eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar categoría",
      });
    }
  },

  // ============ PROVEEDORES ============

  // Obtener todos los proveedores (con paginación)
  getSuppliersAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (page - 1) * limit;

      const query = search ? { name: { $regex: search, $options: "i" } } : {};

      const suppliers = await Supplier.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 });

      const total = await Supplier.countDocuments(query);

      res.status(200).json({
        success: true,
        suppliers,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener proveedores",
      });
    }
  },

  // Crear proveedor
  createSupplier: async (req, res) => {
    try {
      const { name, email, phone, address, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "El nombre del proveedor es requerido",
        });
      }

      const supplierExists = await Supplier.findOne({ name });
      if (supplierExists) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un proveedor con ese nombre",
        });
      }

      const supplier = new Supplier({
        name,
        email,
        phone,
        address,
        description,
      });

      await supplier.save();

      res.status(201).json({
        success: true,
        message: "Proveedor creado exitosamente",
        supplier,
      });
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear proveedor",
      });
    }
  },

  // Actualizar proveedor
  updateSupplier: async (req, res) => {
    try {
      const { supplierId } = req.params;
      const { name, email, phone, address, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "El nombre del proveedor es requerido",
        });
      }

      const supplierExists = await Supplier.findOne({
        name,
        _id: { $ne: supplierId },
      });
      if (supplierExists) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un proveedor con ese nombre",
        });
      }

      const supplier = await Supplier.findByIdAndUpdate(
        supplierId,
        { name, email, phone, address, description },
        { new: true, runValidators: true },
      );

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Proveedor no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Proveedor actualizado exitosamente",
        supplier,
      });
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar proveedor",
      });
    }
  },

  // Eliminar proveedor
  deleteSupplier: async (req, res) => {
    try {
      const { supplierId } = req.params;

      const supplier = await Supplier.findByIdAndDelete(supplierId);

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Proveedor no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Proveedor eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar proveedor",
      });
    }
  },

  // ============ EDITAR USUARIOS ============

  // Actualizar usuario completo
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, roleName } = req.body;

      // Validar campos requeridos
      if (!username || !email) {
        return res.status(400).json({
          success: false,
          message: "Nombre de usuario y email son requeridos",
        });
      }

      // Verificar si el username ya existe en otro usuario
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: "El nombre de usuario ya está en uso",
        });
      }

      // Verificar si el email ya existe en otro usuario
      const emailExists = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "El email ya está en uso",
        });
      }

      // Preparar datos de actualización
      const updateData = { username, email };

      // Si se proporciona roleName, buscar el rol
      if (roleName) {
        const role = await Role.findOne({ roleName });
        if (!role) {
          return res.status(404).json({
            success: false,
            message: "Rol no encontrado",
          });
        }
        updateData.rol = role._id;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("rol")
        .select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        user,
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
      });
    }
  },
};
