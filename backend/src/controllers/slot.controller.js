import prisma from "../../prisma/client.js";

export async function getAvailableSlots(req, res) {
  const { serviceId } = req.query;

  const slots = await prisma.slot.findMany({
    where: {
      serviceId,
      bookedCount: { lt: prisma.slot.fields.capacity },
    },
  });

  res.json(slots);
}
