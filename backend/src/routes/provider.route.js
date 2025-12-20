import { Router } from "express";
import { createProvider } from "../controllers/provider.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/", authMiddleware, createProvider);
export default router;
