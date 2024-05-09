/*
  Warnings:

  - You are about to drop the `teacher_test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "teacher_test" DROP CONSTRAINT "teacher_test_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_test" DROP CONSTRAINT "teacher_test_test_id_fkey";

-- AlterTable
ALTER TABLE "teacher" ALTER COLUMN "teacher_name" SET DEFAULT 'teacher',
ALTER COLUMN "teacher_name" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "teacher_test";
