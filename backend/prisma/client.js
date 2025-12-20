import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export default prisma;   // ✅ THIS IS REQUIRED
