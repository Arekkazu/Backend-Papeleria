import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas del carrito requieren autenticación
router.use(authenticateToken);

// Rutas del carrito
router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/item/:productId", CartController.updateCartItem);
router.post("/apply-discount", CartController.applyDiscount);
router.delete("/remove-discount", CartController.removeDiscount);
router.delete("/clear", CartController.clearCart);
router.post("/checkout", CartController.checkout);

export default router;
