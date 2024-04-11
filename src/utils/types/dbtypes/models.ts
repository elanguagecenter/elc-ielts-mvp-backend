export interface TestModel {
  test_id: string;
  test_name: string;
  current_status: string;
  created_time: Date;
  last_modified_time: Date;
  student_id: string;
}

export interface TestStatusModel {
  test_status_id: String;
  status: String;
  created_time: Date;
  last_modified_time: Date;
  test_id: String;
}

export interface SpeakingTestModel {
  speaking_test_id: string;
  name: string;
  current_status: string;
  created_time: Date;
  last_modified_time: Date;
}

export interface PracticeSpeakingTestModel {
  practice_speaking_test_id: string;
  current_status: string;
  created_time: Date;
  last_modified_time: Date;
  student_id: string;
  practice_speaking_test_stages?: Array<PracticeSpeakingTestStageModel>;
}

export interface SpeakingTestStatusModel {
  speaking_test_status_id: String;
  status: String;
  created_time: Date;
  last_modified_time: Date;
  speaking_test_id: String;
}

export interface SpeakingTestStageModel {
  stg_number: number;
  generated_question: string;
  uploaded_media_url: string | null;
  status: string | null;
  created_time: Date;
  last_modified_time: Date;
}

export interface PracticeSpeakingTestStageModel extends SpeakingTestStageModel {
  practice_speaking_test_stage_id: string;
  practice_speaking_test_id: string;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------ 
 * Practice Writing
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
export interface PracticeWritingTestModel {
  practice_writing_test_id: string;
  index: number;
  current_status: string;
  created_time: Date;
  last_modified_time: Date;
  student_id: string;
  practice_writing_test_stages?: Array<PracticeWritingTestStageModel>;
  // practice_writing_test_statuses :
}

export interface PracticeWritingTestStageModel {
  practice_writing_test_stage_id: string;
  stg_number: number;
  generated_question: string;
  submitted_answer: string | null;
  evaluated_result: string | null;
  status: string;
  created_time: Date;
  last_modified_time: Date;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------ */

/* ------------------------------------------------------------------------------------------------------------------------------------------------ 
 * Practice Reading
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
export interface PracticeReadingTestModel {
  practice_reading_test_id: string;
  index: number;
  current_status: string;
  created_time: Date;
  last_modified_time: Date;
  student_id: string;
  practice_reading_test_stages?: Array<PracticeReadingTestStageModel>;
}

export interface PracticeReadingTestStageModel {
  practice_reading_test_stage_id: string;
  stg_number: number;
  generated_scenario_text: string;
  status: string;
  created_time: Date;
  last_modified_time: Date;
  practice_reading_test_id: string;
  practice_reading_questions?: Array<PracticeReadingTestStageQuestionsModel>;
}

export interface PracticeReadingTestStageQuestionsModel {
  practice_reading_question_id: string;
  question_number: number;
  generated_question: string;
  submitted_anser: string | null;
  evaluated_result: string | null;
  status: string;
  type: string;
  created_time: Date;
  last_modified_time: Date;
  practice_reading_test_stage_id: string;
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------ */
