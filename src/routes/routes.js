import { Router } from "express";
import Indexrouter from "./index.routes.js";
import authRouter from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import supplierRoutes from "./supplier.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import categoryRoutes from "./category.routes.js";
import cartRoutes from "./cart.routes.js";
import discountRoutes from "./discount.routes.js";
import reviewRoutes from "./review.routes.js";
import salesRoutes from "./sales.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

// Rutas principales
router.use("/", Indexrouter);

// Rutas de autenticación
router.use("/auth", authRouter);

// Rutas de administración (protegidas)
router.use("/admin", adminRoutes);

// Rutas CRUD
router.use("/products", productRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/categories", categoryRoutes);

// Nuevas rutas - Gestión de tienda
router.use("/cart", cartRoutes);
router.use("/discounts", discountRoutes);
router.use("/reviews", reviewRoutes);
router.use("/sales", salesRoutes);

export default router;
