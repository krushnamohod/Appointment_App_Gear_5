import { Router } from "express";
import { createService, listServices, updateService, deleteService } from "../controllers/service.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createService);
router.get("/", listServices);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

export default router;
