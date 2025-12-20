import prisma from "../../prisma/client.js";

/**
 * Auto-assign best provider or resource for a service on a given date
 */
export async function autoAssignProvider({ serviceId, date }) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // 1️⃣ Get Service info
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { resourceType: true }
  });

  if (!service) return null;

  let items = [];
  let itemType = 'provider';

  if (service.resourceType) {
    items = await prisma.resource.findMany({
      where: { type: service.resourceType }
    });
    itemType = 'resource';
  } else {
    items = await prisma.provider.findMany({
      where: { serviceId },
    });
  }

  if (!items.length) return null;

  const itemScores = [];

  for (const item of items) {
    const where = {
      startTime: { gte: startOfDay, lte: endOfDay },
      bookedCount: { lt: prisma.slot.fields.capacity },
    };

    if (itemType === 'resource') {
      where.resourceId = item.id;
    } else {
      where.providerId = item.id;
    }

    // 2️⃣ Get available slots for item
    const slots = await prisma.slot.findMany({
      where,
      orderBy: { startTime: "asc" },
    });

    if (!slots.length) continue;

    const bookingWhere = {
      slot: {
        startTime: { gte: startOfDay, lte: endOfDay },
      }
    };

    if (itemType === 'resource') {
      bookingWhere.slot.resourceId = item.id;
    } else {
      bookingWhere.slot.providerId = item.id;
    }

    // 3️⃣ Count bookings for load
    const bookingsCount = await prisma.booking.count({
      where: bookingWhere,
    });

    itemScores.push({
      item,
      slots,
      bookingsCount,
      earliestSlot: slots[0],
    });
  }

  if (!itemScores.length) return null;

  // 4️⃣ Sort items
  itemScores.sort((a, b) => {
    if (a.bookingsCount !== b.bookingsCount) {
      return a.bookingsCount - b.bookingsCount; // least load first
    }
    return (
      new Date(a.earliestSlot.startTime) -
      new Date(b.earliestSlot.startTime)
    );
  });

  // Best item + slot
  return {
    [itemType]: itemScores[0].item,
    slot: itemScores[0].earliestSlot,
  };
}
