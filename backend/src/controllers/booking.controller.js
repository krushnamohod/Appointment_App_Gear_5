import prisma from "../../prisma/client.js";
import { autoAssignProvider } from "../utils/providerAssigner.js";
import redis from "../utils/redis.js";


export async function createBooking(req, res, next) {
  try {
    const { serviceId, slotId, date } = req.body;
    const userId = req.user.id; // Corrected from req.user (middleware attaches full user object, but id is guaranteed)

    let finalSlotId = slotId;

    // 🔁 AUTO ASSIGN if slot not provided
    if (!slotId) {
      const assignment = await autoAssignProvider({ serviceId, date });

      if (!assignment) {
        return res.status(400).json({
          message: "No available providers for selected date",
        });
      }

      finalSlotId = assignment.slot.id;
    }

    // ✅ Transaction-safe booking with Atomic Check
    await prisma.$transaction(async (tx) => {
      // 1. Fetch slot to get capacity
      const slot = await tx.slot.findUnique({
        where: { id: finalSlotId },
      });

      if (!slot) {
        const error = new Error("Slot unavailable");
        error.status = 400;
        throw error;
      }

      // 2. Atomic Update: Only increment if bookedCount < capacity
      // This prevents race conditions where multiple requests read the same count
      const updatedBatch = await tx.slot.updateMany({
        where: {
          id: finalSlotId,
          bookedCount: { lt: slot.capacity },
        },
        data: {
          bookedCount: { increment: 1 },
        },
      });

      if (updatedBatch.count === 0) {
        const error = new Error("Slot is fully booked");
        error.status = 400;
        throw error;
      }

      // 3. Create Booking
      await tx.booking.create({
        data: {
          userId,
          slotId: finalSlotId,
          status: "CONFIRMED",
        },
      });
    });

    return res.status(201).json({
      message: "Booking confirmed",
      slotId: finalSlotId,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
}
