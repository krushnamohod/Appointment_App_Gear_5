import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 2. Create Organiser User
  const orgPassword = await bcrypt.hash('Org@123', 10);
  const org = await prisma.user.upsert({
    where: { email: 'org@org.com' },
    update: {},
    create: {
      email: 'org@org.com',
      name: 'Organiser User',
      password: orgPassword,
      role: 'ORGANISER',
    },
  });
  console.log(`Created organiser: ${org.email}`);

  // 3. Create Default Service
  const service = await prisma.service.create({
    data: {
      name: 'General Consultation',
      duration: 30,
      capacity: 1,
      isPublished: true,
    }
  });
  console.log(`Created service: ${service.name}`);

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
