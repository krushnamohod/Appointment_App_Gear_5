import { Router } from "express";
import { createProvider, listProviders, updateProvider, deleteProvider } from "../controllers/provider.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createProvider);
router.get("/", listProviders); // Public or Auth? Making public for now as per service
router.put("/:id", authMiddleware, updateProvider);
router.delete("/:id", authMiddleware, deleteProvider);

export default router;
