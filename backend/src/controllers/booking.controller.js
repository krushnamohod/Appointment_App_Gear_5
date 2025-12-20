import prisma from "../../prisma/client.js";

export async function createBooking(req, res) {
  const { slotId } = req.body;
  const userId = req.user.id;

  const slot = await prisma.slot.findUnique({ where: { id: slotId } });
  if (!slot || slot.bookedCount >= slot.capacity) {
    return res.status(400).json({ message: "Slot unavailable" });
  }

  await prisma.$transaction([
    prisma.booking.create({
      data: { userId, slotId },
    }),
    prisma.slot.update({
      where: { id: slotId },
      data: { bookedCount: { increment: 1 } },
    }),
  ]);

  res.status(201).json({ message: "Booking confirmed" });
}
