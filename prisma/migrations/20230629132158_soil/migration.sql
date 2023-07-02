/*
  Warnings:

  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `last_state` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `last_state` to the `pivots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_timestamp` to the `pivots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_author_foreign";

-- DropForeignKey
ALTER TABLE "actions" DROP CONSTRAINT "actions_pivot_id_foreign";

-- DropForeignKey
ALTER TABLE "last_state" DROP CONSTRAINT "last_state_pivot_id_foreign";

-- AlterTable
ALTER TABLE "pivots" ADD COLUMN     "last_angle" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "last_state" TEXT NOT NULL,
ADD COLUMN     "last_timestamp" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "actions";

-- DropTable
DROP TABLE "last_state";
