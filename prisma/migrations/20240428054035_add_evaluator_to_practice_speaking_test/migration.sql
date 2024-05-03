/*
  Warnings:

  - You are about to drop the column `evaluator_id` on the `speaking_test` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "speaking_test" DROP CONSTRAINT "speaking_test_evaluator_id_fkey";

-- AlterTable
ALTER TABLE "practice_speaking_test" ADD COLUMN     "evaluator_id" TEXT;

-- AlterTable
ALTER TABLE "speaking_test" DROP COLUMN "evaluator_id";

-- AddForeignKey
ALTER TABLE "practice_speaking_test" ADD CONSTRAINT "practice_speaking_test_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;
