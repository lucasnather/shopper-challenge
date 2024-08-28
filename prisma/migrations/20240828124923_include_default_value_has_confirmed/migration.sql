-- AlterTable
ALTER TABLE "consumptions" ALTER COLUMN "hasConfirmed" DROP NOT NULL,
ALTER COLUMN "hasConfirmed" SET DEFAULT false;
