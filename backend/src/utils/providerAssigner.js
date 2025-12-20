import prisma from "../../prisma/client.js";

/**
 * Auto-assign best provider for a service on a given date
 */
export async function autoAssignProvider({ serviceId, date }) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // 1️⃣ Get providers for service
  const providers = await prisma.provider.findMany({
    where: { serviceId },
  });

  if (!providers.length) return null;

  const providerScores = [];

  for (const provider of providers) {
    // 2️⃣ Get available slots for provider
    const slots = await prisma.slot.findMany({
      where: {
        providerId: provider.id,
        startTime: { gte: startOfDay, lte: endOfDay },
        bookedCount: { lt: prisma.slot.fields.capacity },
      },
      orderBy: { startTime: "asc" },
    });

    if (!slots.length) continue;

    // 3️⃣ Count bookings for load
    const bookingsCount = await prisma.booking.count({
      where: {
        slot: {
          providerId: provider.id,
          startTime: { gte: startOfDay, lte: endOfDay },
        },
      },
    });

    providerScores.push({
      provider,
      slots,
      bookingsCount,
      earliestSlot: slots[0],
    });
  }

  if (!providerScores.length) return null;

  // 4️⃣ Sort providers
  providerScores.sort((a, b) => {
    if (a.bookingsCount !== b.bookingsCount) {
      return a.bookingsCount - b.bookingsCount; // least load first
    }
    return (
      new Date(a.earliestSlot.startTime) -
      new Date(b.earliestSlot.startTime)
    );
  });

  // Best provider + slot
  return {
    provider: providerScores[0].provider,
    slot: providerScores[0].earliestSlot,
  };
}
