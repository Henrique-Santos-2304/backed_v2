/*
  Warnings:

  - You are about to drop the column `workers` on the `farms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "farms" DROP COLUMN "workers",
ADD COLUMN     "users" TEXT[];
