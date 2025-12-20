import prisma from "../../prisma/client.js";

export async function createService(req, res) {
  const service = await prisma.service.create({ data: req.body });
  res.status(201).json(service);
}

export async function listServices(req, res) {
  const { dashboard } = req.query;

  if (dashboard === 'true') {
    const services = await prisma.service.findMany({
      include: {
        providers: {
          select: { name: true }
        },
        slots: {
          where: { startTime: { gt: new Date() } },
          select: {
            bookings: {
              where: { status: 'CONFIRMED' }
            }
          }
        }
      }
    });

    // Fetch all resources to map them by type
    const allResources = await prisma.resource.findMany({
      select: { name: true, type: true }
    });

    const formattedServices = services.map(service => {
      const upcomingMeetings = service.slots.reduce((acc, slot) => acc + slot.bookings.length, 0);

      // Combine provider names and matching resource names
      const providerNames = service.providers.map(p => p.name);
      const matchingResourceNames = allResources
        .filter(r => r.type === service.resourceType)
        .map(r => r.name);

      const entities = [...new Set([...providerNames, ...matchingResourceNames])];

      return {
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
        capacity: service.capacity,
        resourceType: service.resourceType,
        image: service.image,
        isPublished: service.isPublished,
        resources: entities,
        upcomingMeetings
      };
    });

    return res.json(formattedServices);
  }

  const services = await prisma.service.findMany({
    // where: { isPublished: true }, // Commented out to show all services in admin
  });
  res.json(services);
}

export async function updateService(req, res) {
  const { id } = req.params;
  try {
    const service = await prisma.service.update({
      where: { id },
      data: req.body,
    });
    res.json(service);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Service not found" });
    }
    throw error;
  }
}

export async function deleteService(req, res) {
  const { id } = req.params;
  try {
    await prisma.service.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Service not found" });
    }
    throw error;
  }
}
