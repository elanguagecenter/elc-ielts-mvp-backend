-- AlterTable
CREATE SEQUENCE practice_writing_test_index_seq;
ALTER TABLE "practice_writing_test" ALTER COLUMN "index" SET DEFAULT nextval('practice_writing_test_index_seq');
ALTER SEQUENCE practice_writing_test_index_seq OWNED BY "practice_writing_test"."index";
