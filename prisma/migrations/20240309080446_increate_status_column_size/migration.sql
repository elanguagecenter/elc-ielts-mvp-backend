-- AlterTable
ALTER TABLE "listening_question" ALTER COLUMN "type" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "listening_test" ALTER COLUMN "current_status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "listening_test_stage" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "listening_test_status" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "reading_question" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "reading_test" ALTER COLUMN "current_status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "reading_test_stage" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "reading_test_status" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "speaking_test_stage" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "speaking_test_status" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "writing_test" ALTER COLUMN "current_status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "writing_test_stage" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "writing_test_status" ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);
