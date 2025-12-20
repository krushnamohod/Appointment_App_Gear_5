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

// Apply auth middleware to all resource routes
router.use(authMiddleware);

// GET /api/resources - Get all resources
router.get("/", getAllResources);

// GET /api/resources/:id - Get a single resource
router.get("/:id", getResourceById);

// POST /api/resources - Create a new resource
router.post("/", createResource);

// PUT /api/resources/:id - Update a resource
router.put("/:id", updateResource);

// DELETE /api/resources/:id - Delete a resource
router.delete("/:id", deleteResource);

export default router;
