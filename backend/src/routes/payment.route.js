import { Router } from "express";
import { initiatePayment, handleCallback, verifyPaymentStatus, getTransactions } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/initiate", authMiddleware, initiatePayment);
router.post("/callback", handleCallback);
router.get("/status/:txnId", authMiddleware, verifyPaymentStatus);
router.get("/history", authMiddleware, getTransactions);

export default router;
鼓
