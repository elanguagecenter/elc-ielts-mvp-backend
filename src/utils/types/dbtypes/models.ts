export interface TestModel {
  test_id: string;
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
  speaking_test_id: String;
  current_status: String;
  created_time: Date;
  last_modified_time: Date;
  test_id: String;
}

export interface SpeakingTestStatusModel {
  speaking_test_status_id: String;
  status: String;
  created_time: Date;
  last_modified_time: Date;
  speaking_test_id: String;
}

export interface SpeakingTestPartModel {
  speaking_test_part_id: String;
  generated_question: String;
  uploaded_media_url: String | null;
  status: String | null;
  created_time: Date;
  last_modified_time: Date;
  speaking_test_id: String;
}
