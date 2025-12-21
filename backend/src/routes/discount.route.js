import { Router } from "express";
import {
    createDiscount,
    deleteDiscount,
    getAllDiscounts,
    getDiscountById,
    sendDiscountNotification,
    updateDiscount,
    validateCoupon
} from "../controllers/discount.controller.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public - Validate coupon code
router.post("/validate", validateCoupon);

// Admin only routes
router.use(authMiddleware);

router.get("/", getAllDiscounts);
router.get("/:id", getDiscountById);
router.post("/", adminMiddleware, createDiscount);
router.put("/:id", adminMiddleware, updateDiscount);
router.delete("/:id", adminMiddleware, deleteDiscount);
router.post("/:id/notify", adminMiddleware, sendDiscountNotification);

export default router;
