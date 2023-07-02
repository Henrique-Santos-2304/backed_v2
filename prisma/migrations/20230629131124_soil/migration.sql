/*
  Warnings:

  - You are about to drop the column `last_status_received` on the `states` table. All the data in the column will be lost.
  - Made the column `power` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `water` on table `states` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direction` on table `states` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "states" DROP COLUMN "last_status_received",
ALTER COLUMN "power" SET NOT NULL,
ALTER COLUMN "power" SET DEFAULT false,
ALTER COLUMN "water" SET NOT NULL,
ALTER COLUMN "water" SET DEFAULT false,
ALTER COLUMN "direction" SET NOT NULL,
ALTER COLUMN "connection" SET DEFAULT true;
