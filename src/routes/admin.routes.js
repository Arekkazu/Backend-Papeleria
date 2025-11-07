import { Router } from "express";
import { AdminController } from "../controller/admin.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación Y rol de admin
router.use(authenticateToken);
router.use(requireRole("admin"));

// Dashboard y estadísticas
router.get("/stats", AdminController.getDashboardStats);

// Gestión de usuarios
router.get("/users", AdminController.getAllUsers);
router.put("/users/:userId", AdminController.updateUser);
router.put("/users/:userId/role", AdminController.updateUserRole);
router.delete("/users/:userId", AdminController.deleteUser);

// Gestión de productos
router.get("/products", AdminController.getAllProductsAdmin);
router.post("/products", AdminController.createProduct);
router.put("/products/:productId", AdminController.updateProduct);
router.delete("/products/:productId", AdminController.deleteProduct);

// Gestión de categorías
router.get("/categories", AdminController.getCategoriesAdmin);
router.post("/categories", AdminController.createCategory);
router.put("/categories/:categoryId", AdminController.updateCategory);
router.delete("/categories/:categoryId", AdminController.deleteCategory);

// Gestión de proveedores
router.get("/suppliers", AdminController.getSuppliersAdmin);
router.post("/suppliers", AdminController.createSupplier);
router.put("/suppliers/:supplierId", AdminController.updateSupplier);
router.delete("/suppliers/:supplierId", AdminController.deleteSupplier);

export default router;
