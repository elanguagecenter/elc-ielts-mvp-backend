/*
  Warnings:

  - The primary key for the `practice_speaking_test_stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `speaking_test_stage_id` on the `practice_speaking_test_stage` table. All the data in the column will be lost.
  - The primary key for the `practice_speaking_test_status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `speaking_test_status_id` on the `practice_speaking_test_status` table. All the data in the column will be lost.
  - The required column `practice_speaking_test_stage_id` was added to the `practice_speaking_test_stage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `practice_speaking_test_status_id` was added to the `practice_speaking_test_status` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "practice_speaking_test_stage" DROP CONSTRAINT "practice_speaking_test_stage_pkey",
DROP COLUMN "speaking_test_stage_id",
ADD COLUMN     "practice_speaking_test_stage_id" TEXT NOT NULL,
ADD CONSTRAINT "practice_speaking_test_stage_pkey" PRIMARY KEY ("practice_speaking_test_stage_id");

-- AlterTable
ALTER TABLE "practice_speaking_test_status" DROP CONSTRAINT "practice_speaking_test_status_pkey",
DROP COLUMN "speaking_test_status_id",
ADD COLUMN     "practice_speaking_test_status_id" TEXT NOT NULL,
ADD CONSTRAINT "practice_speaking_test_status_pkey" PRIMARY KEY ("practice_speaking_test_status_id");
