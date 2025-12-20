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

export async function getSlots(req, res) {
  const { date, serviceId, providerId } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  const where = {
    // Basic date filter - would ideally filter by time range falling on that day
    // For simplicity assuming YYYY-MM-DD string match or range if timestamp
    // Ideally, slots store exact ISO DateTime. 
    // Let's assume frontend sends YYYY-MM-DD and we filter slots starting on that day.
    startTime: {
      gte: new Date(`${date}T00:00:00.000Z`),
      lt: new Date(`${date}T23:59:59.999Z`),
    },
  };

  if (serviceId) where.serviceId = serviceId;
  if (providerId) where.providerId = providerId;

  const slots = await prisma.slot.findMany({
    where,
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          // avatar: true // Add to schema if needed
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  // Check availability logic (bookedCount < capacity)
  const availableSlots = slots.map(slot => ({
    id: slot.id,
    time: new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    startTime: slot.startTime,
    available: slot.bookedCount < slot.capacity,
    provider: slot.provider
  }));

  res.json(availableSlots);
}
