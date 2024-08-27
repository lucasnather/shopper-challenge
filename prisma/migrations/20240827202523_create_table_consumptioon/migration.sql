-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('GAS', 'WATER');

-- CreateTable
CREATE TABLE "consumptions" (
    "measure_id" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "customer_code" TEXT NOT NULL,
    " image_url" TEXT NOT NULL,
    "hasConfirmed" BOOLEAN NOT NULL,

    CONSTRAINT "consumptions_pkey" PRIMARY KEY ("measure_id")
);
