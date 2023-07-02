/*
  Warnings:

  - You are about to drop the column `node_id` on the `pivots` table. All the data in the column will be lost.
  - You are about to drop the `nodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_farm_id_foreign";

-- DropForeignKey
ALTER TABLE "pivots" DROP CONSTRAINT "pivots_node_id_foreign";

-- DropIndex
DROP INDEX "pivots_node_id_index";

-- AlterTable
ALTER TABLE "pivots" DROP COLUMN "node_id",
ADD COLUMN     "ip_gateway" TEXT,
ADD COLUMN     "is_gprs" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "nodes";
