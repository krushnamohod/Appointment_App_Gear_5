import prisma from "../../prisma/client.js";

export async function createProvider(req, res) {
  const provider = await prisma.provider.create({ data: req.body });
  res.status(201).json(provider);
}

export async function listProviders(req, res) {
  const { serviceId } = req.query;

  const where = serviceId ? { serviceId } : {};

  const providers = await prisma.provider.findMany({
    where,
    include: {
      service: {
        select: { name: true }
      }
    }
  });
  res.json(providers);
}

export async function updateProvider(req, res) {
  const { id } = req.params;
  try {
    const provider = await prisma.provider.update({
      where: { id },
      data: req.body,
    });
    res.json(provider);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Provider not found" });
    }
    throw error;
  }
}

export async function deleteProvider(req, res) {
  const { id } = req.params;
  try {
    await prisma.provider.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Provider not found" });
    }
    throw error;
  }
}
