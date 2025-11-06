import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de productos requieren autenticación
router.use(authenticateToken);

// Rutas de productos
router.post("/", requireRole(["admin", "manager"]), ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.put("/:id", requireRole(["admin", "manager"]), ProductController.update);
router.delete("/:id", requireRole(["admin"]), ProductController.delete);

export default router;
