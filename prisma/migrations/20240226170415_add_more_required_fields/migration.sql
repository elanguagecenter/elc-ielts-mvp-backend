/*
  Warnings:

  - Added the required column `question_number` to the `listening_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `listening_test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `part_number` to the `listening_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_number` to the `reading_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `reading_test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `part_number` to the `reading_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `speaking_test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `part_number` to the `speaking_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `writing_test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `part_number` to the `writing_test_part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listening_question" ADD COLUMN     "question_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "listening_test" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "listening_test_part" ADD COLUMN     "part_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reading_question" ADD COLUMN     "question_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reading_test" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "reading_test_part" ADD COLUMN     "part_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "speaking_test" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "speaking_test_part" ADD COLUMN     "part_number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "writing_test" ADD COLUMN     "name" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "writing_test_part" ADD COLUMN     "part_number" INTEGER NOT NULL;
