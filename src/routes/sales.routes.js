import { Router } from "express";
import { SalesController } from "../controller/sales.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de ventas requieren autenticación
router.use(authenticateToken);

// Rutas de ventas
router.post("/", SalesController.create);
router.get("/", requireRole(["admin"]), SalesController.getAll);
router.get("/my-sales", SalesController.getMySales);
router.get("/stats", requireRole(["admin"]), SalesController.getStats);
router.get("/date-range", requireRole(["admin"]), SalesController.getByDateRange);
router.get("/:id", SalesController.getById);
router.delete("/:id", requireRole(["admin"]), SalesController.delete);

export default router;
