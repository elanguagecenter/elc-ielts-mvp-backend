/*
  Warnings:

  - You are about to drop the column `generated_conversation_text` on the `practice_listening_test_stage` table. All the data in the column will be lost.
  - Added the required column `generated_scenario_text` to the `practice_listening_test_stage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "practice_listening_test_stage" DROP COLUMN "generated_conversation_text",
ADD COLUMN     "generated_scenario_text" TEXT NOT NULL;
