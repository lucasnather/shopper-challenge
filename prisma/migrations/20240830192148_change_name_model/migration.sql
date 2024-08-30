/*
  Warnings:

  - You are about to drop the `consumptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "consumptions";

-- CreateTable
CREATE TABLE "measures" (
    "measure_id" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "customer_code" TEXT NOT NULL,
    " image_url" TEXT NOT NULL,
    "hasConfirmed" BOOLEAN DEFAULT false,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_id")
);
