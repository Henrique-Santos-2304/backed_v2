/*
  Warnings:

  - You are about to drop the `scheduling_historys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scheduling_historys" DROP CONSTRAINT "scheduling_historys_pivot_id_foreign";

-- DropTable
DROP TABLE "scheduling_historys";
