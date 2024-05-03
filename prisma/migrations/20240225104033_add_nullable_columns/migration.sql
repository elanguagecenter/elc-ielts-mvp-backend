-- AlterTable
ALTER TABLE "listening_question" ALTER COLUMN "submitted_answer" DROP NOT NULL,
ALTER COLUMN "evaluated_result" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reading_question" ALTER COLUMN "submitted_anser" DROP NOT NULL,
ALTER COLUMN "evaluated_result" DROP NOT NULL;

-- AlterTable
ALTER TABLE "speaking_test_part" ALTER COLUMN "uploaded_media_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "writing_test_part" ALTER COLUMN "submitted_answer" DROP NOT NULL,
ALTER COLUMN "evaluated_result" DROP NOT NULL;
