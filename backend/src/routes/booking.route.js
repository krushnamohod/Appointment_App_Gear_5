import { Router } from "express";
import { createBooking, getUserBookings, cancelBooking } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBookingSchema } from "../validators/booking.schema.js";

const router = Router();
router.post("/", authMiddleware, validate(createBookingSchema), createBooking);
router.get("/", authMiddleware, getUserBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);

export default router;

