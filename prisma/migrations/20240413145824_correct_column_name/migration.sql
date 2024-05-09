/*
  Warnings:

  - The primary key for the `practice_listening_test_stage_question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `practice_listening__test_stage_question_id` on the `practice_listening_test_stage_question` table. All the data in the column will be lost.
  - The required column `practice_listening_test_stage_question_id` was added to the `practice_listening_test_stage_question` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "practice_listening_test_stage_question" DROP CONSTRAINT "practice_listening_test_stage_question_pkey",
DROP COLUMN "practice_listening__test_stage_question_id",
ADD COLUMN     "practice_listening_test_stage_question_id" TEXT NOT NULL,
ADD CONSTRAINT "practice_listening_test_stage_question_pkey" PRIMARY KEY ("practice_listening_test_stage_question_id");
