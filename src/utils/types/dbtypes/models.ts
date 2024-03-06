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
  test_id: string;
}

export interface SpeakingTestStatusModel {
  speaking_test_status_id: String;
  status: String;
  created_time: Date;
  last_modified_time: Date;
  speaking_test_id: String;
}

export interface SpeakingTestStageModel {
  speaking_test_stage_id: String;
  stg_number: number;
  generated_question: String;
  uploaded_media_url: String | null;
  status: String | null;
  created_time: Date;
  last_modified_time: Date;
  speaking_test_id: String;
}
