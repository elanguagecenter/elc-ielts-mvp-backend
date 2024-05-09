/*
  Warnings:

  - You are about to drop the column `generated_audio_url` on the `practice_listening_test_stage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "practice_listening_test_stage" DROP COLUMN "generated_audio_url",
ADD COLUMN     "generated_audio_path" TEXT NOT NULL DEFAULT 'local';
