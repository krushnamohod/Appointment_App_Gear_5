import nodemailer from "nodemailer";
import prisma from "../../prisma/client.js";

/**
 * @intent Discount/Coupon CRUD and validation
 */

// Email transporter (configure in production)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Create a new discount
 */
export async function createDiscount(req, res, next) {
    try {
        const { code, description, percentage, maxUses, validFrom, validUntil, serviceId, resourceId } = req.body;

        if (!code || !percentage || !validUntil) {
            return res.status(400).json({ message: "Code, percentage, and validUntil are required" });
        }

        const discount = await prisma.discount.create({
            data: {
                code: code.toUpperCase(),
                description,
                percentage: parseInt(percentage),
                maxUses: maxUses ? parseInt(maxUses) : null,
                validFrom: validFrom ? new Date(validFrom) : new Date(),
                validUntil: new Date(validUntil),
                serviceId: serviceId || null,
                resourceId: resourceId || null
            }
        });

        res.status(201).json(discount);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "Discount code already exists" });
        }
        next(error);
    }
}

/**
 * Get all discounts
 */
export async function getAllDiscounts(req, res, next) {
    try {
        const discounts = await prisma.discount.findMany({
            include: {
                service: { select: { name: true } },
                resource: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(discounts);
    } catch (error) {
        next(error);
    }
}

/**
 * Get single discount
 */
export async function getDiscountById(req, res, next) {
    try {
        const { id } = req.params;
        const discount = await prisma.discount.findUnique({
            where: { id },
            include: {
                service: { select: { name: true } },
                resource: { select: { name: true } }
            }
        });
        if (!discount) return res.status(404).json({ message: "Discount not found" });
        res.json(discount);
    } catch (error) {
        next(error);
    }
}

/**
 * Update discount
 */
export async function updateDiscount(req, res, next) {
    try {
        const { id } = req.params;
        const { code, description, percentage, maxUses, validFrom, validUntil, isActive, serviceId, resourceId } = req.body;

        const updateData = {};
        if (code) updateData.code = code.toUpperCase();
        if (description !== undefined) updateData.description = description;
        if (percentage) updateData.percentage = parseInt(percentage);
        if (maxUses !== undefined) updateData.maxUses = maxUses ? parseInt(maxUses) : null;
        if (validFrom) updateData.validFrom = new Date(validFrom);
        if (validUntil) updateData.validUntil = new Date(validUntil);
        if (isActive !== undefined) updateData.isActive = isActive;
        if (serviceId !== undefined) updateData.serviceId = serviceId || null;
        if (resourceId !== undefined) updateData.resourceId = resourceId || null;

        const discount = await prisma.discount.update({
            where: { id },
            data: updateData
        });

        res.json(discount);
    } catch (error) {
        next(error);
    }
}

/**
 * Delete discount
 */
export async function deleteDiscount(req, res, next) {
    try {
        const { id } = req.params;
        await prisma.discount.delete({ where: { id } });
        res.json({ message: "Discount deleted" });
    } catch (error) {
        next(error);
    }
}

/**
 * Validate coupon code (public endpoint for customers)
 */
export async function validateCoupon(req, res, next) {
    try {
        const { code, serviceId } = req.body;

        if (!code) {
            return res.status(400).json({ valid: false, message: "Coupon code required" });
        }

        const discount = await prisma.discount.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!discount) {
            return res.json({ valid: false, message: "Invalid coupon code" });
        }

        // Check if active
        if (!discount.isActive) {
            return res.json({ valid: false, message: "This coupon is no longer active" });
        }

        // Check validity dates
        const now = new Date();
        if (now < discount.validFrom) {
            return res.json({ valid: false, message: "This coupon is not yet valid" });
        }
        if (now > discount.validUntil) {
            return res.json({ valid: false, message: "This coupon has expired" });
        }

        // Check max uses
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            return res.json({ valid: false, message: "This coupon has reached its usage limit" });
        }

        // Check service restriction
        if (discount.serviceId && serviceId && discount.serviceId !== serviceId) {
            return res.json({ valid: false, message: "This coupon is not valid for this service" });
        }

        res.json({
            valid: true,
            percentage: discount.percentage,
            description: discount.description,
            code: discount.code
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Send discount notification email to all users
 */
export async function sendDiscountNotification(req, res, next) {
    try {
        const { id } = req.params;

        const discount = await prisma.discount.findUnique({ where: { id } });
        if (!discount) return res.status(404).json({ message: "Discount not found" });

        // Get all active users
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: { email: true, name: true }
        });

        if (users.length === 0) {
            return res.json({ message: "No users to notify", sent: 0 });
        }

        // Format validity dates
        const validUntil = new Date(discount.validUntil).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // Send emails (in batches in production)
        let sentCount = 0;
        for (const user of users) {
            try {
                await transporter.sendMail({
                    from: process.env.SMTP_FROM || '"Syncra" <noreply@syncra.com>',
                    to: user.email,
                    subject: `🎉 ${discount.percentage}% OFF - Use code ${discount.code}!`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #C4704A;">Special Discount Just For You!</h1>
                            <p>Hi ${user.name || 'there'},</p>
                            <p>${discount.description || 'We have a special offer for you!'}</p>
                            <div style="background: #FFF8F0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; color: #666;">Use code</p>
                                <p style="margin: 10px 0; font-size: 32px; font-weight: bold; color: #C4704A; letter-spacing: 2px;">${discount.code}</p>
                                <p style="margin: 0; font-size: 24px; color: #333;">to get <strong>${discount.percentage}% OFF</strong></p>
                            </div>
                            <p style="color: #666; font-size: 14px;">Valid until: ${validUntil}</p>
                            <a href="${process.env.CUSTOMER_URL || 'http://localhost:5174'}" 
                               style="display: inline-block; background: #C4704A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                                Book Now
                            </a>
                        </div>
                    `
                });
                sentCount++;
            } catch (emailError) {
                console.error(`Failed to send email to ${user.email}:`, emailError.message);
            }
        }

        res.json({ message: `Notification sent to ${sentCount} users`, sent: sentCount });
    } catch (error) {
        next(error);
    }
}

/**
 * Increment discount usage count (called after successful payment)
 */
export async function incrementDiscountUsage(code) {
    try {
        await prisma.discount.update({
            where: { code: code.toUpperCase() },
            data: { usedCount: { increment: 1 } }
        });
    } catch (error) {
        console.error("Failed to increment discount usage:", error);
    }
}
