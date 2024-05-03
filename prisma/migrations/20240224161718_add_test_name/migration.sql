/*
  Warnings:

  - Added the required column `test_name` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test" ADD COLUMN     "test_name" VARCHAR(200) NOT NULL;
