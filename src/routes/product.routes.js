import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Rutas protegidas (requieren autenticación y roles)
router.post("/", authenticateToken, requireRole(["admin", "manager"]), ProductController.create);
router.put("/:id", authenticateToken, requireRole(["admin", "manager"]), ProductController.update);
router.delete("/:id", authenticateToken, requireRole(["admin"]), ProductController.delete);

export default router;
