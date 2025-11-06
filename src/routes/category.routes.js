import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de categorías requieren autenticación
router.use(authenticateToken);

// Rutas de categorías
router.post("/", requireRole(["admin", "manager"]), CategoryController.create);
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.put(
  "/:id",
  requireRole(["admin", "manager"]),
  CategoryController.update,
);
router.delete("/:id", requireRole(["admin"]), CategoryController.delete);

export default router;
