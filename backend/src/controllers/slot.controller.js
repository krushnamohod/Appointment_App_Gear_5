import prisma from "../../prisma/client.js";
import { generateSlots } from "../utils/slotGenerator.js";

export async function generateSlotsForDate(req, res) {
  const { providerId, serviceId, date } = req.body;

  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  const service = await prisma.service.findUnique({ where: { id: serviceId } });

  if (!provider || !service) {
    return res.status(404).json({ message: "Provider or Service not found" });
  }

  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const config = provider.workingHours.weekly[day];

  if (!config || !config.enabled) {
    return res.json({ message: "Provider not available on this day" });
  }

  const slots = generateSlots({
    date,
    shifts: config.slots,
    duration: service.duration,
  });

  const created = [];

  for (const slot of slots) {
    const exists = await prisma.slot.findFirst({
      where: {
        providerId,
        serviceId,
        startTime: slot.startTime,
      },
    });

    if (!exists) {
      const newSlot = await prisma.slot.create({
        data: {
          providerId,
          serviceId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity: service.capacity,
        },
      });
      created.push(newSlot);
    }
  }

  res.json({
    message: "Slots generated successfully",
    total: created.length,
    slots: created,
  });
}
