import { Router } from "express";
import { getBookingStats } from "../controllers/reporting.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(authMiddleware);

// GET /api/reporting/stats - Get booking statistics
router.get("/stats", getBookingStats);

export default router;
