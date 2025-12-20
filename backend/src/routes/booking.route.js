import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/", authMiddleware, createBooking);
export default router;
