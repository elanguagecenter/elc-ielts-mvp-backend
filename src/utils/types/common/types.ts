import { SpeakingTestModel, SpeakingTestStageModel, TestModel } from "../dbtypes/models";

export interface UserData {
  userId: string;
  email: string;
  cognitoName: string;
}

export interface TestSeachResult {
  test_id: string;
  test_name: string;
}

export interface SpeakingTestResponse {
  test: TestModel | null;
  speakingTest: SpeakingTestModel | null;
  speakingTestStages: Array<SpeakingTestStageModel>;
}

export interface SpeakingTestStageStartResponse {
  test: TestModel;
  speakingTest: SpeakingTestModel;
  updatedSpeakingTestStage: SpeakingTestStageModel;
}
