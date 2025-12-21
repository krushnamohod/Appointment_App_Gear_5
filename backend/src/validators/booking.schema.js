import { z } from "zod";

export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string().min(1),
        slotId: z.string().min(1).optional(), // Optional for auto-assign
        date: z.string().optional(), // Expected format: YYYY-MM-DD
        capacity: z.number().int().min(1).optional(),
        answers: z.record(z.any()).optional(),
        details: z.object({
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            location: z.string().optional()
        }).optional(),
    }).refine((data) => data.slotId || data.date, {
        message: "Either slotId or date must be provided",
        path: ["slotId", "date"],
    }),
});
