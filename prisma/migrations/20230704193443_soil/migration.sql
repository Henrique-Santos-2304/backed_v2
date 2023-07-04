/*
  Warnings:

  - Added the required column `timezone` to the `farms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "farms" ADD COLUMN     "timezone" TEXT NOT NULL;
