/*
  Warnings:

  - You are about to drop the column `name` on the `practice_reading_test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "practice_reading_test" DROP COLUMN "name",
ADD COLUMN     "index" SERIAL NOT NULL;
