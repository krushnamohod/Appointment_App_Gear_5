import prisma from "../../prisma/client.js";
import { generateSlots } from "../utils/slotGenerator.js";

export async function generateSlotsForDate(req, res) {
  const { providerId, resourceId, serviceId, date } = req.body;

  if (!providerId && !resourceId) {
    return res.status(400).json({ message: "Either Provider ID or Resource ID is required" });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  let config;
  let entityName;

  if (providerId) {
    const provider = await prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    config = provider.workingHours?.weekly;
    entityName = "Provider";
  } else {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    config = resource.workingHours; // Resource stores workingHours directly
    entityName = "Resource";
  }

  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  const dayConfig = config?.[day];

  if (!dayConfig || !dayConfig.enabled) {
    return res.json({ message: `${entityName} not available on this day` });
  }

  const slots = generateSlots({
    date,
    shifts: dayConfig.slots,
    duration: service.duration,
  });

  const created = [];

  for (const slot of slots) {
    const exists = await prisma.slot.findFirst({
      where: {
        providerId: providerId || null,
        resourceId: resourceId || null,
        serviceId,
        startTime: slot.startTime,
      },
    });

    if (!exists) {
      const newSlot = await prisma.slot.create({
        data: {
          providerId: providerId || null,
          resourceId: resourceId || null,
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

export async function getSlots(req, res, next) {
  try {
    const { date, serviceId, providerId, resourceId } = req.query;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const where = {
      startTime: {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`),
      },
    };

    if (serviceId) where.serviceId = serviceId;
    if (providerId) where.providerId = providerId;
    if (resourceId) where.resourceId = resourceId;

    let slots = await prisma.slot.findMany({
      where,
      include: {
        provider: { select: { id: true, name: true } },
        resource: { select: { id: true, name: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    // 🔄 AUTO-GENERATE if slots are empty and we have enough info
    if (slots.length === 0 && serviceId && (providerId || resourceId)) {
      console.log(`✨ Auto-generating slots for ${date}...`);
      await autoGenerateSlots({ providerId, resourceId, serviceId, date });

      // Re-fetch after generation
      slots = await prisma.slot.findMany({
        where,
        include: {
          provider: { select: { id: true, name: true } },
          resource: { select: { id: true, name: true } }
        },
        orderBy: { startTime: 'asc' }
      });
    }

    const availableSlots = slots.map(slot => ({
      id: slot.id,
      time: new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      startTime: slot.startTime,
      available: slot.bookedCount < slot.capacity,
      provider: slot.provider,
      resource: slot.resource,
      bookedCount: slot.bookedCount,
      capacity: slot.capacity
    }));

    res.json(availableSlots);
  } catch (error) {
    next(error);
  }
}

/**
 * Internal helper for auto-generation (logic from generateSlotsForDate)
 */
async function autoGenerateSlots({ providerId, resourceId, serviceId, date }) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return;

  let config;
  if (providerId) {
    const provider = await prisma.provider.findUnique({ where: { id: providerId } });
    config = provider?.workingHours?.weekly;
  } else {
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    config = resource?.workingHours;
  }

  const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const dayConfig = config?.[day];

  if (!dayConfig || !dayConfig.enabled) return;

  const generated = generateSlots({
    date,
    shifts: dayConfig.slots,
    duration: service.duration,
  });

  for (const slot of generated) {
    // 🔍 Check existence manually to avoid relying on updated Prisma Client indexes
    const exists = await prisma.slot.findFirst({
      where: {
        providerId: providerId || null,
        resourceId: resourceId || null,
        serviceId,
        startTime: slot.startTime,
      }
    });

    if (!exists) {
      await prisma.slot.create({
        data: {
          providerId: providerId || null,
          resourceId: resourceId || null,
          serviceId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity: service.capacity,
        },
      });
    }
  }
}
