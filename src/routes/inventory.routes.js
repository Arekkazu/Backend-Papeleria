import { Router } from "express";
import { InventoryController } from "../controller/inventory.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de inventario requieren autenticación
router.use(authenticateToken);

// Rutas de inventario
router.post("/", requireRole(["admin", "manager"]), InventoryController.create);
router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.put(
  "/:id",
  requireRole(["admin", "manager"]),
  InventoryController.update,
);
router.delete("/:id", requireRole(["admin"]), InventoryController.delete);

export default router;
