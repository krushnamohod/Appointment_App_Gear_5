import { Router } from "express";
import { generateSlotsForDate, getSlots } from "../controllers/slot.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generate", authMiddleware, generateSlotsForDate);
router.get("/", getSlots);

export default router;
