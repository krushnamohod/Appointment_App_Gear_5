/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";
