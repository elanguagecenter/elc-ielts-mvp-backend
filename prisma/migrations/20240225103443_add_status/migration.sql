/*
  Warnings:

  - Added the required column `status` to the `listening_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `listening_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `listening_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `reading_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `reading_question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `reading_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `speaking_test_part` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `writing_test_part` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listening_question" ADD COLUMN     "status" VARCHAR(20) NOT NULL,
ADD COLUMN     "type" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "listening_test_part" ADD COLUMN     "status" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "reading_question" ADD COLUMN     "status" VARCHAR(20) NOT NULL,
ADD COLUMN     "type" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "reading_test_part" ADD COLUMN     "status" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "speaking_test_part" ADD COLUMN     "status" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "writing_test_part" ADD COLUMN     "status" VARCHAR(20) NOT NULL;
