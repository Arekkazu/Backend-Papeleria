import { Router } from "express";
import Indexrouter from "./index.routes.js";
const router = Router();
router.use("/", Indexrouter);

export default router;
