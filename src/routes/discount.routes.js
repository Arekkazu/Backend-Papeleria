import { Router } from "express";
import { DiscountController } from "../controller/discount.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas de descuentos requieren autenticación
router.use(authenticateToken);

// Rutas de descuentos
router.post("/", requireRole(["admin"]), DiscountController.create);
router.get("/", DiscountController.getAll);
router.get("/active", DiscountController.getActive);
router.get("/:id", DiscountController.getById);
router.get("/code/:code", DiscountController.getByCode);
router.put("/:id", requireRole(["admin"]), DiscountController.update);
router.delete("/:id", requireRole(["admin"]), DiscountController.delete);
router.post("/validate", DiscountController.validate);

export default router;
