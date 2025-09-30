import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";

const router = Router();

router.post("/", ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
