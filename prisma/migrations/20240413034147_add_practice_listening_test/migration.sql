/*
  Warnings:

  - You are about to drop the column `submitted_anser` on the `practice_reading_question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "practice_reading_question" DROP COLUMN "submitted_anser",
ADD COLUMN     "submitted_answer" TEXT;

-- CreateTable
CREATE TABLE "practice_listening_test" (
    "practice_listening_test_id" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "current_status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "practice_listening_test_pkey" PRIMARY KEY ("practice_listening_test_id")
);

-- CreateTable
CREATE TABLE "practice_listening_test_status" (
    "practice_listening_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_listening_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_listening_test_status_pkey" PRIMARY KEY ("practice_listening_test_status_id")
);

-- CreateTable
CREATE TABLE "practice_listening_test_stage" (
    "practice_listening_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_conversation_text" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_listening_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_listening_test_stage_pkey" PRIMARY KEY ("practice_listening_test_stage_id")
);

-- CreateTable
CREATE TABLE "practice_listening_test_stage_question" (
    "practice_listening__test_stage_question_id" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_answer" TEXT,
    "evaluated_result" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_listening_test_stage_id" TEXT NOT NULL,

    CONSTRAINT "practice_listening_test_stage_question_pkey" PRIMARY KEY ("practice_listening__test_stage_question_id")
);

-- AddForeignKey
ALTER TABLE "practice_listening_test" ADD CONSTRAINT "practice_listening_test_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_listening_test_status" ADD CONSTRAINT "practice_listening_test_status_practice_listening_test_id_fkey" FOREIGN KEY ("practice_listening_test_id") REFERENCES "practice_listening_test"("practice_listening_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_listening_test_stage" ADD CONSTRAINT "practice_listening_test_stage_practice_listening_test_id_fkey" FOREIGN KEY ("practice_listening_test_id") REFERENCES "practice_listening_test"("practice_listening_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_listening_test_stage_question" ADD CONSTRAINT "practice_listening_test_stage_question_practice_listening__fkey" FOREIGN KEY ("practice_listening_test_stage_id") REFERENCES "practice_listening_test_stage"("practice_listening_test_stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;
