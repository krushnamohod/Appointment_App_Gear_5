import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding sample courts...');

    // 1. Create a "Badminton Court" service if it doesn't exist
    const courtService = await prisma.service.upsert({
        where: { id: 'sample-court-service-id' },
        update: {},
        create: {
            id: 'sample-court-service-id',
            name: 'Badminton Court (1 Hour)',
            duration: 60,
            price: 500,
            resourceType: 'COURT',
            venue: 'Star Sports Arena, Sector 5',
            isPublished: true,
            manageCapacity: true,
            capacity: 4,
            image: 'https://images.unsplash.com/photo-1626224580175-340ad0e3a76b?q=80&w=2070&auto=format&fit=crop'
        },
    });

    // 2. Create some "COURT" resources
    const court1 = await prisma.resource.upsert({
        where: { id: 'court-1' },
        update: {},
        create: {
            id: 'court-1',
            name: 'Court A (Premium)',
            type: 'COURT',
            capacity: 4,
        }
    });

    const court2 = await prisma.resource.upsert({
        where: { id: 'court-2' },
        update: {},
        create: {
            id: 'court-2',
            name: 'Court B (Standard)',
            type: 'COURT',
            capacity: 4,
        }
    });

    console.log('Seeding completed sucessfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
