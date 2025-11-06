import { Router } from "express";
import { ReviewController } from "../controller/review.controller.js";
import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get("/", ReviewController.getAll);
router.get("/product/:productId", ReviewController.getByProduct);
router.get("/product/:productId/stats", ReviewController.getProductStats);
router.get("/:id", ReviewController.getById);

// Rutas protegidas (requieren autenticación)
router.use(authenticateToken);

router.post("/", ReviewController.create);
router.get("/my/reviews", ReviewController.getMyReviews);
router.put("/:id", ReviewController.update);
router.delete("/:id", ReviewController.delete);

export default router;
