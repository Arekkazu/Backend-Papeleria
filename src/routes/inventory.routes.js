import { Router } from "express";
import { InventoryController } from "../controller/inventory.controller.js";

const router = Router();

router.post("/", InventoryController.create);
router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.put("/:id", InventoryController.update);
router.delete("/:id", InventoryController.delete);

export default router;
