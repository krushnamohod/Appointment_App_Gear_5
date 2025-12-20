import prisma from "../../prisma/client.js";

export async function createProvider(req, res) {
  const provider = await prisma.provider.create({ data: req.body });
  res.status(201).json(provider);
}
