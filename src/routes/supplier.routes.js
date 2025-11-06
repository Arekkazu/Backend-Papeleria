import { Router } from "express";
import { SupplierController } from "../controller/supplier.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de proveedores requieren autenticación
router.use(authenticateToken);

// Rutas de proveedores
router.post("/", requireRole(["admin", "manager"]), SupplierController.create);
router.get("/", SupplierController.getAll);
router.get("/:id", SupplierController.getById);
router.put(
  "/:id",
  requireRole(["admin", "manager"]),
  SupplierController.update,
);
router.delete("/:id", requireRole(["admin"]), SupplierController.delete);

export default router;
