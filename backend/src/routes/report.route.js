import { Router } from "express";
import { getDashboardStats } from "../controllers/report.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware to all report routes
router.use(authMiddleware);

// GET /api/reports/dashboard - Get dashboard stats and chart data
router.get("/dashboard", getDashboardStats);

export default router;
