import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema, loginSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;
