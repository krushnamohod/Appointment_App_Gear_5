import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    toggleUserStatus,
    updateUserRole
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/users - Get all users
router.get("/", getAllUsers);

// POST /api/users - Create a new user
router.post("/", createUser);

// PATCH /api/users/:id/toggle - Toggle user active status
router.patch("/:id/toggle", toggleUserStatus);

// PATCH /api/users/:id/role - Update user role
router.patch("/:id/role", updateUserRole);

// DELETE /api/users/:id - Delete user
router.delete("/:id", deleteUser);

export default router;
