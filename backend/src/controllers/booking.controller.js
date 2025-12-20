import prisma from "../../prisma/client.js";
import { autoAssignProvider } from "../utils/providerAssigner.js";
import redis from "../utils/redis.js";


export async function createBooking(req, res) {
  const { serviceId, slotId, date } = req.body;
  const userId = req.user.id;

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

  const slot = await prisma.slot.findUnique({
    where: { id: finalSlotId },
  });

  if (!slot || slot.bookedCount >= slot.capacity) {
    return res.status(400).json({ message: "Slot unavailable" });
  }

  // ✅ Transaction-safe booking
  await prisma.$transaction([
    prisma.booking.create({
      data: {
        userId,
        slotId: finalSlotId,
        status: "CONFIRMED",
      },
    }),
    prisma.slot.update({
      where: { id: finalSlotId },
      data: { bookedCount: { increment: 1 } },
    }),
  ]);

  return res.status(201).json({
    message: "Booking confirmed",
    slotId: finalSlotId,
  });
}
