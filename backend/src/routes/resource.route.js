import { Router } from "express";
import {
    createResource,
    deleteResource,
    getAllResources,
    getResourceById,
    updateResource
} from "../controllers/resource.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/resources - Get all resources (Public)
router.get("/", getAllResources);

// GET /api/resources/:id - Get a single resource (Public)
router.get("/:id", getResourceById);

// POST /api/resources - Create a new resource (Protected)
router.post("/", authMiddleware, createResource);

// PUT /api/resources/:id - Update a resource (Protected)
router.put("/:id", authMiddleware, updateResource);

// DELETE /api/resources/:id - Delete a resource (Protected)
router.delete("/:id", authMiddleware, deleteResource);

export default router;
