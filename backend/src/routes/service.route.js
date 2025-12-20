import { Router } from "express";
import { createService, listServices } from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/", authMiddleware, createService);
router.get("/", listServices);
export default router;
