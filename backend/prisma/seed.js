import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin & Test Users
  const password = await bcrypt.hash('Test@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password },
    create: { email: 'admin@admin.com', name: 'Admin User', password, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: { password },
    create: { email: 'test@test.com', name: 'Test Customer', password, role: 'CUSTOMER' },
  });

  // 2. Create Services
  const specialistService = await prisma.service.create({
    data: {
      name: 'General Consultation',
      duration: 30,
      price: 50,
      capacity: 1,
      isPublished: true,
      introductionMessage: 'Welcome to our clinic! Please select a specialist.',
    }
  });

  const courtService = await prisma.service.create({
    data: {
      name: 'Badminton Court',
      duration: 60,
      price: 20,
      capacity: 4,
      resourceType: 'COURT',
      isPublished: true,
      introductionMessage: 'Book your court for a high-energy session!',
    }
  });

  // 3. Create a Specialist (Provider)
  const provider = await prisma.provider.create({
    data: {
      name: 'Dr. Jane Smith',
      serviceId: specialistService.id,
      workingHours: {
        weekly: {
          monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
          tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
          wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
          thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
          friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
        }
      }
    }
  });

  // 4. Create a Resource
  const court = await prisma.resource.create({
    data: {
      name: 'Badminton Court 1',
      type: 'COURT',
      capacity: 4,
      workingHours: {
        monday: { enabled: true, slots: [{ start: '08:00', end: '22:00' }] },
        tuesday: { enabled: true, slots: [{ start: '08:00', end: '22:00' }] },
        wednesday: { enabled: true, slots: [{ start: '08:00', end: '22:00' }] },
        thursday: { enabled: true, slots: [{ start: '08:00', end: '22:00' }] },
        friday: { enabled: true, slots: [{ start: '08:00', end: '22:00' }] },
        saturday: { enabled: true, slots: [{ start: '10:00', end: '20:00' }] },
        sunday: { enabled: true, slots: [{ start: '10:00', end: '20:00' }] },
      }
    }
  });

  console.log('✅ Comprehensive seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
