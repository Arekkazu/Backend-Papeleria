import { Router } from "express";
import Indexrouter from "./index.routes.js";
import authRouter from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import supplierRoutes from "./supplier.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import categoryRoutes from "./category.routes.js";

const router = Router();

// Rutas principales
router.use("/", Indexrouter);

// Rutas de autenticación
router.use("/auth", authRouter);

// Rutas CRUD
router.use("/products", productRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/categories", categoryRoutes);

export default router;
