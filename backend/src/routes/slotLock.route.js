import { Router } from "express";
import { lockSlot } from "../controllers/slotLock.controller.js";
import { unlockSlot } from "../controllers/slotUnlock.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/lock", authMiddleware, lockSlot);
router.post("/unlock", authMiddleware, unlockSlot);

export default router;
