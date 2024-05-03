-- CreateTable
CREATE TABLE "practice_speaking_test" (
    "practice_speaking_test_id" TEXT NOT NULL,
    "index" SERIAL NOT NULL,
    "current_status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "practice_speaking_test_pkey" PRIMARY KEY ("practice_speaking_test_id")
);

-- CreateTable
CREATE TABLE "practice_speaking_test_status" (
    "speaking_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_speaking_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_speaking_test_status_pkey" PRIMARY KEY ("speaking_test_status_id")
);

-- CreateTable
CREATE TABLE "practice_speaking_test_stage" (
    "speaking_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_question" TEXT NOT NULL,
    "uploaded_media_url" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_speaking_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_speaking_test_stage_pkey" PRIMARY KEY ("speaking_test_stage_id")
);

-- AddForeignKey
ALTER TABLE "practice_speaking_test" ADD CONSTRAINT "practice_speaking_test_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_speaking_test_status" ADD CONSTRAINT "practice_speaking_test_status_practice_speaking_test_id_fkey" FOREIGN KEY ("practice_speaking_test_id") REFERENCES "practice_speaking_test"("practice_speaking_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_speaking_test_stage" ADD CONSTRAINT "practice_speaking_test_stage_practice_speaking_test_id_fkey" FOREIGN KEY ("practice_speaking_test_id") REFERENCES "practice_speaking_test"("practice_speaking_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;
