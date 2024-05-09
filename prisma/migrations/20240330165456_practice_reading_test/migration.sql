-- CreateTable
CREATE TABLE "practice_reading_test" (
    "practice_reading_test_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "current_status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "practice_reading_test_pkey" PRIMARY KEY ("practice_reading_test_id")
);

-- CreateTable
CREATE TABLE "practice_reading_test_status" (
    "practice_reading_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_reading_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_reading_test_status_pkey" PRIMARY KEY ("practice_reading_test_status_id")
);

-- CreateTable
CREATE TABLE "practice_reading_test_stage" (
    "practice_reading_test_stage_id" TEXT NOT NULL,
    "stg_number" INTEGER NOT NULL,
    "generated_scenario_text" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_reading_test_id" TEXT NOT NULL,

    CONSTRAINT "practice_reading_test_stage_pkey" PRIMARY KEY ("practice_reading_test_stage_id")
);

-- CreateTable
CREATE TABLE "practice_reading_question" (
    "practice_reading_question_id" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_anser" TEXT,
    "evaluated_result" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "practice_reading_test_stage_id" TEXT NOT NULL,

    CONSTRAINT "practice_reading_question_pkey" PRIMARY KEY ("practice_reading_question_id")
);

-- AddForeignKey
ALTER TABLE "practice_reading_test" ADD CONSTRAINT "practice_reading_test_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_reading_test_status" ADD CONSTRAINT "practice_reading_test_status_practice_reading_test_id_fkey" FOREIGN KEY ("practice_reading_test_id") REFERENCES "practice_reading_test"("practice_reading_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_reading_test_stage" ADD CONSTRAINT "practice_reading_test_stage_practice_reading_test_id_fkey" FOREIGN KEY ("practice_reading_test_id") REFERENCES "practice_reading_test"("practice_reading_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_reading_question" ADD CONSTRAINT "practice_reading_question_practice_reading_test_stage_id_fkey" FOREIGN KEY ("practice_reading_test_stage_id") REFERENCES "practice_reading_test_stage"("practice_reading_test_stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;
