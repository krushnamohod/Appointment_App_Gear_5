import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js";

/**
 * Get all users (for admin role management)
 */
export async function getAllUsers(req, res, next) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ users });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a new user (admin only)
 */
export async function createUser(req, res, next) {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.status(201).json({ user, message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(req, res, next) {
    try {
        const { id } = req.params;

        // Get current user
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle status
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.json({ user: updatedUser, message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user role
 */
export async function updateUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.json({ user: updatedUser, message: "User role updated successfully" });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete user
 */
export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user
        await prisma.user.delete({ where: { id } });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}
