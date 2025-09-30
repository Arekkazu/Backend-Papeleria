import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const authRouter = Router();

// Rutas públicas (no requieren autenticación)
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

// Rutas protegidas (requieren autenticación)
authRouter.post("/logout", authenticateToken, AuthController.logout);
authRouter.get("/profile", authenticateToken, AuthController.getProfile);
authRouter.get("/verify", authenticateToken, AuthController.verifyAuth);

export default authRouter;
