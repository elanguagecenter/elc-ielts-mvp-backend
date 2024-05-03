-- AlterTable
ALTER TABLE "speaking_test" ADD COLUMN     "evaluator_id" TEXT;

-- AddForeignKey
ALTER TABLE "speaking_test" ADD CONSTRAINT "speaking_test_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "teacher"("teacher_id") ON DELETE SET NULL ON UPDATE CASCADE;
