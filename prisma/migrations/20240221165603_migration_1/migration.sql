-- CreateTable
CREATE TABLE "organization" (
    "org_id" TEXT NOT NULL,
    "org_name" VARCHAR(100) NOT NULL,
    "org_email" VARCHAR(50) NOT NULL,
    "org_mobile_number" VARCHAR(15) NOT NULL,
    "number_of_students" INTEGER NOT NULL,
    "monthly_allowed_tests" INTEGER NOT NULL,
    "monthly_subscription" DECIMAL(65,30) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("org_id")
);

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" TEXT NOT NULL,
    "admin_email" VARCHAR(50) NOT NULL,
    "admin_mobile_number" VARCHAR(15) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_id" TEXT NOT NULL,
    "student_email" VARCHAR(50) NOT NULL,
    "student_mobile_number" VARCHAR(15) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "test" (
    "test_id" TEXT NOT NULL,
    "current_status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("test_id")
);

-- CreateTable
CREATE TABLE "test_status" (
    "test_status_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "test_status_pkey" PRIMARY KEY ("test_status_id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacher_id" TEXT NOT NULL,
    "teacher_name" VARCHAR(50) NOT NULL,
    "teacher_email" VARCHAR(50) NOT NULL,
    "teacher_mobile_number" VARCHAR(15) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "teacher_test" (
    "teacher_test_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,

    CONSTRAINT "teacher_test_pkey" PRIMARY KEY ("teacher_test_id")
);

-- CreateTable
CREATE TABLE "speaking_test" (
    "speaking_test_id" TEXT NOT NULL,
    "current_status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "speaking_test_pkey" PRIMARY KEY ("speaking_test_id")
);

-- CreateTable
CREATE TABLE "speaking_test_status" (
    "speaking_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "speaking_test_id" TEXT NOT NULL,

    CONSTRAINT "speaking_test_status_pkey" PRIMARY KEY ("speaking_test_status_id")
);

-- CreateTable
CREATE TABLE "speaking_test_part" (
    "speaking_test_part_id" TEXT NOT NULL,
    "generated_question" TEXT NOT NULL,
    "uploaded_media_url" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "speaking_test_id" TEXT NOT NULL,

    CONSTRAINT "speaking_test_part_pkey" PRIMARY KEY ("speaking_test_part_id")
);

-- CreateTable
CREATE TABLE "writing_test" (
    "writing_test_id" TEXT NOT NULL,
    "current_status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "writing_test_pkey" PRIMARY KEY ("writing_test_id")
);

-- CreateTable
CREATE TABLE "writing_test_status" (
    "writing_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "writing_test_id" TEXT NOT NULL,

    CONSTRAINT "writing_test_status_pkey" PRIMARY KEY ("writing_test_status_id")
);

-- CreateTable
CREATE TABLE "writing_test_part" (
    "writing_test_part_id" TEXT NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_answer" TEXT NOT NULL,
    "evaluated_result" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "writing_test_id" TEXT NOT NULL,

    CONSTRAINT "writing_test_part_pkey" PRIMARY KEY ("writing_test_part_id")
);

-- CreateTable
CREATE TABLE "reading_test" (
    "reading_test_id" TEXT NOT NULL,
    "current_status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "reading_test_pkey" PRIMARY KEY ("reading_test_id")
);

-- CreateTable
CREATE TABLE "reading_test_status" (
    "reading_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "reading_test_id" TEXT NOT NULL,

    CONSTRAINT "reading_test_status_pkey" PRIMARY KEY ("reading_test_status_id")
);

-- CreateTable
CREATE TABLE "reading_test_part" (
    "reading_test_part_id" TEXT NOT NULL,
    "generated_scenario_text" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "reading_test_id" TEXT NOT NULL,

    CONSTRAINT "reading_test_part_pkey" PRIMARY KEY ("reading_test_part_id")
);

-- CreateTable
CREATE TABLE "reading_question" (
    "reading_question_id" TEXT NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_anser" TEXT NOT NULL,
    "evaluated_result" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "reading_test_part_id" TEXT NOT NULL,

    CONSTRAINT "reading_question_pkey" PRIMARY KEY ("reading_question_id")
);

-- CreateTable
CREATE TABLE "listening_test" (
    "listening_test_id" TEXT NOT NULL,
    "current_status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "listening_test_pkey" PRIMARY KEY ("listening_test_id")
);

-- CreateTable
CREATE TABLE "listening_test_status" (
    "listening_test_status_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "listening_test_id" TEXT NOT NULL,

    CONSTRAINT "listening_test_status_pkey" PRIMARY KEY ("listening_test_status_id")
);

-- CreateTable
CREATE TABLE "listening_test_part" (
    "listening_test_part_id" TEXT NOT NULL,
    "generated_conversation_text" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "listening_test_id" TEXT NOT NULL,

    CONSTRAINT "listening_test_part_pkey" PRIMARY KEY ("listening_test_part_id")
);

-- CreateTable
CREATE TABLE "listening_question" (
    "listening_question_id" TEXT NOT NULL,
    "generated_question" TEXT NOT NULL,
    "submitted_answer" TEXT NOT NULL,
    "evaluated_result" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP(3) NOT NULL,
    "listening_test_part_id" TEXT NOT NULL,

    CONSTRAINT "listening_question_pkey" PRIMARY KEY ("listening_question_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_org_id_key" ON "admin"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_test_test_id_key" ON "teacher_test"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_test_test_id_key" ON "speaking_test"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "writing_test_test_id_key" ON "writing_test"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "reading_test_test_id_key" ON "reading_test"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "listening_test_test_id_key" ON "listening_test"("test_id");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_status" ADD CONSTRAINT "test_status_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organization"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_test" ADD CONSTRAINT "teacher_test_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_test" ADD CONSTRAINT "teacher_test_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_test" ADD CONSTRAINT "speaking_test_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_test_status" ADD CONSTRAINT "speaking_test_status_speaking_test_id_fkey" FOREIGN KEY ("speaking_test_id") REFERENCES "speaking_test"("speaking_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_test_part" ADD CONSTRAINT "speaking_test_part_speaking_test_id_fkey" FOREIGN KEY ("speaking_test_id") REFERENCES "speaking_test"("speaking_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_test" ADD CONSTRAINT "writing_test_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_test_status" ADD CONSTRAINT "writing_test_status_writing_test_id_fkey" FOREIGN KEY ("writing_test_id") REFERENCES "writing_test"("writing_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_test_part" ADD CONSTRAINT "writing_test_part_writing_test_id_fkey" FOREIGN KEY ("writing_test_id") REFERENCES "writing_test"("writing_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_test" ADD CONSTRAINT "reading_test_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_test_status" ADD CONSTRAINT "reading_test_status_reading_test_id_fkey" FOREIGN KEY ("reading_test_id") REFERENCES "reading_test"("reading_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_test_part" ADD CONSTRAINT "reading_test_part_reading_test_id_fkey" FOREIGN KEY ("reading_test_id") REFERENCES "reading_test"("reading_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_question" ADD CONSTRAINT "reading_question_reading_test_part_id_fkey" FOREIGN KEY ("reading_test_part_id") REFERENCES "reading_test_part"("reading_test_part_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_test" ADD CONSTRAINT "listening_test_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_test_status" ADD CONSTRAINT "listening_test_status_listening_test_id_fkey" FOREIGN KEY ("listening_test_id") REFERENCES "listening_test"("listening_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_test_part" ADD CONSTRAINT "listening_test_part_listening_test_id_fkey" FOREIGN KEY ("listening_test_id") REFERENCES "listening_test"("listening_test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_question" ADD CONSTRAINT "listening_question_listening_test_part_id_fkey" FOREIGN KEY ("listening_test_part_id") REFERENCES "listening_test_part"("listening_test_part_id") ON DELETE RESTRICT ON UPDATE CASCADE;
