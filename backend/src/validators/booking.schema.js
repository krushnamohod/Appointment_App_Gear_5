import { z } from "zod";

export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string().uuid(),
        slotId: z.string().uuid().optional(), // Optional for auto-assign
        date: z.string().optional(), // Expected format: YYYY-MM-DD
    }).refine((data) => data.slotId || data.date, {
        message: "Either slotId or date must be provided",
        path: ["slotId", "date"],
    }),
});
