/*
  Warnings:

  - You are about to drop the column `listening_test_part_id` on the `listening_question` table. All the data in the column will be lost.
  - You are about to drop the column `reading_test_part_id` on the `reading_question` table. All the data in the column will be lost.
  - You are about to drop the `listening_test_part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reading_test_part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `speaking_test_part` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `writing_test_part` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `listening_test_stage_id` to the `listening_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reading_test_stage_id` to the `reading_question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "listening_question" DROP CONSTRAINT "listening_question_listening_test_part_id_fkey";

-- DropForeignKey
ALTER TABLE "listening_test_part" DROP CONSTRAINT "listening_test_part_listening_test_id_fkey";

-- DropForeignKey
ALTER TABLE "reading_question" DROP CONSTRAINT "reading_question_reading_test_part_id_fkey";

-- DropForeignKey
ALTER TABLE "reading_test_part" DROP CONSTRAINT "reading_test_part_reading_test_id_fkey";

-- DropForeignKey
ALTER TABLE "speaking_test_part" DROP CONSTRAINT "speaking_test_part_speaking_test_id_fkey";

-- DropForeignKey
ALTER TABLE "writing_test_part" DROP CONSTRAINT "writing_test_part_writing_test_id_fkey";

-- AlterTable
ALTER TABLE "listening_question" DROP COLUMN "listening_test_part_id",
ADD COLUMN     "listening_test_stage_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reading_question" DROP COLUMN "reading_test_part_id",
ADD COLUMN     "reading_test_stage_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "listening_test_part";

-- DropTable
DROP TABLE "reading_test_part";

-- DropTable
DROP TABLE "speaking_test_part";

-- DropTable
DROP TABLE "writing_test_part";

-- CreateTable
CREATE TABLE "speaking_test_stage" (
    "speaking_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_question" TEXT NOT NULL,
    "uploaded_media_url" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "speaking_test_id" TEXT NOT NULL,

    CONSTRAINT "speaking_test_stage_pkey" PRIMARY KEY ("speaking_test_stage_id")
);

-- CreateTable
CREATE TABLE "writing_test_stage" (
    "writing_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_answer" TEXT,
    "evaluated_result" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "writing_test_id" TEXT NOT NULL,

    CONSTRAINT "writing_test_stage_pkey" PRIMARY KEY ("writing_test_stage_id")
);

-- CreateTable
CREATE TABLE "reading_test_stage" (
    "reading_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_scenario_text" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "reading_test_id" TEXT NOT NULL,

    CONSTRAINT "reading_test_stage_pkey" PRIMARY KEY ("reading_test_stage_id")
);

-- CreateTable
CREATE TABLE "listening_test_stage" (
    "listening_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_conversation_text" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "listening_test_id" TEXT NOT NULL,

    CONSTRAINT "listening_test_stage_pkey" PRIMARY KEY ("listening_test_stage_id")
);

-- AddForeignKey
ALTER TABLE "speaking_test_stage" ADD CONSTRAINT "speaking_test_stage_speaking_test_id_fkey" FOREIGN KEY ("speaking_test_id") REFERENCES "speaking_test"("speaking_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_test_stage" ADD CONSTRAINT "writing_test_stage_writing_test_id_fkey" FOREIGN KEY ("writing_test_id") REFERENCES "writing_test"("writing_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_test_stage" ADD CONSTRAINT "reading_test_stage_reading_test_id_fkey" FOREIGN KEY ("reading_test_id") REFERENCES "reading_test"("reading_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_question" ADD CONSTRAINT "reading_question_reading_test_stage_id_fkey" FOREIGN KEY ("reading_test_stage_id") REFERENCES "reading_test_stage"("reading_test_stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_test_stage" ADD CONSTRAINT "listening_test_stage_listening_test_id_fkey" FOREIGN KEY ("listening_test_id") REFERENCES "listening_test"("listening_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_question" ADD CONSTRAINT "listening_question_listening_test_stage_id_fkey" FOREIGN KEY ("listening_test_stage_id") REFERENCES "listening_test_stage"("listening_test_stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;
