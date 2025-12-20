import prisma from "../../prisma/client.js";

/**
 * @intent Get all resources with their linked resources
 */
export async function getAllResources(req, res, next) {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                linkedResources: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true
                    }
                }
            }
        });
        res.json({ resources });
    } catch (error) {
        next(error);
    }
}

/**
 * @intent Get a single resource by ID
 */
export async function getResourceById(req, res, next) {
    try {
        const { id } = req.params;
        const resource = await prisma.resource.findUnique({
            where: { id },
            include: {
                linkedResources: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true
                    }
                }
            }
        });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json({ resource });
    } catch (error) {
        next(error);
    }
}

/**
 * @intent Create a new resource
 */
export async function createResource(req, res, next) {
    try {
        const { name, capacity, linkedResourceIds } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const resource = await prisma.resource.create({
            data: {
                name,
                capacity: capacity || 1,
                linkedResources: linkedResourceIds?.length > 0 ? {
                    connect: linkedResourceIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                linkedResources: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true
                    }
                }
            }
        });

        res.status(201).json({ resource, message: "Resource created successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * @intent Update an existing resource
 */
export async function updateResource(req, res, next) {
    try {
        const { id } = req.params;
        const { name, capacity, linkedResourceIds } = req.body;

        // Check if resource exists
        const existing = await prisma.resource.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Build update data
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (capacity !== undefined) updateData.capacity = capacity;

        // Handle linked resources - disconnect all first, then connect new ones
        if (linkedResourceIds !== undefined) {
            updateData.linkedResources = {
                set: linkedResourceIds.map(id => ({ id }))
            };
        }

        const resource = await prisma.resource.update({
            where: { id },
            data: updateData,
            include: {
                linkedResources: {
                    select: {
                        id: true,
                        name: true,
                        capacity: true
                    }
                }
            }
        });

        res.json({ resource, message: "Resource updated successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * @intent Delete a resource
 */
export async function deleteResource(req, res, next) {
    try {
        const { id } = req.params;

        // Check if resource exists
        const existing = await prisma.resource.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await prisma.resource.delete({ where: { id } });

        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        next(error);
    }
}
