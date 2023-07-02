/*
  Warnings:

  - Added the required column `start_date_of_module` to the `schedulings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `schedulings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SchedulingType" AS ENUM ('STOP_DATE', 'STOP_ANGLE', 'FULL_DATE', 'FULL_ANGLE');

-- CreateEnum
CREATE TYPE "SchedulingStatus" AS ENUM ('PENDING', 'RUNNING', 'FINISHED');

-- AlterTable
ALTER TABLE "schedulings" ADD COLUMN     "is_board" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "start_date_of_module" TEXT NOT NULL,
ADD COLUMN     "status" "SchedulingStatus" NOT NULL,
ADD COLUMN     "type" "SchedulingType" NOT NULL,
ADD COLUMN     "updated" TEXT,
ALTER COLUMN "is_stop" SET DEFAULT false,
ALTER COLUMN "power" SET DEFAULT false,
ALTER COLUMN "water" SET DEFAULT false;
