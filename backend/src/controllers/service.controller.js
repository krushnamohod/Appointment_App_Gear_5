import prisma from "../prisma/client.js";

export async function createService(req, res) {
  const service = await prisma.service.create({ data: req.body });
  res.status(201).json(service);
}

export async function listServices(req, res) {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
  });
  res.json(services);
}
