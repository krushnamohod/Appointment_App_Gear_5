import { Router } from "express";
import { signup, login, sendOTP, verifyOTP, signupWithOTP, loginWithOTP } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema, loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

// OTP Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/signup-verify", signupWithOTP);
router.post("/login-otp", loginWithOTP);

export default router;
