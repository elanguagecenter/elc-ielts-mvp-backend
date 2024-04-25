import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { PracticeSpeakingTestModel, SpeakingTestModel, SpeakingTestStageModel, TestModel } from "../dbtypes/models";

export interface UserData {
  userId: string;
  email: string;
  cognitoName: string;
}

export interface UserSigninPayload {
  userName: string;
  password: string;
}

export interface CognitoChallangePayload {
  challangeName: string;
  userName: string;
  newPassword?: string;
  cognitoSession?: string;
}

export interface UserSigninResponse {
  status: string;
  tokenData?: AuthenticationResultType;
  sessionData?: string;
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

export interface PracticeSpeakingTestResponse {
  speakingTest: PracticeSpeakingTestModel | null;
  speakingTestStages: Array<SpeakingTestStageModel>;
}

export interface SpeakingTestStageStartResponse {
  test: TestModel;
  speakingTest: SpeakingTestModel;
  updatedSpeakingTestStage: SpeakingTestStageModel;
}

export interface PracticeSpeakingTestStageStartResponse {
  speakingTest: PracticeSpeakingTestModel;
  updatedSpeakingTestStage: SpeakingTestStageModel;
}

export interface ReadingQuestionsCreateManyDataType {
  practice_reading_test_stage_id: string;
  generated_question: string;
  question_number: number;
  type: string;
  status: string;
}

export interface ListeningQuestionsCreateManyDataType {
  practice_listening_test_stage_id: string;
  generated_question: string;
  question_number: number;
  type: string;
  status: string;
}

export interface GetS3SignedUrlResponse {
  signedUrl: string;
}

export interface UserReponse {}

export interface StudentResponse extends UserReponse {
  student_id: string;
  student_email: string;
  student_name: string;
  student_mobile_number: string;
}
