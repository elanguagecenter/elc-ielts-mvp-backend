import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { PracticeSpeakingTestModel, SpeakingTestModel, SpeakingTestStageModel, TestModel } from "../dbtypes/models";
import { Decimal } from "@prisma/client/runtime/library";

export interface UserData {
  userId: string;
  email: string;
  cognitoName: string;
  userType: string;
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
  userType?: string;
}

export interface CreateOrganizationPayload<T> {
  org_name: string;
  org_email: string;
  org_mobile_number: string;
  number_of_students: T;
  monthly_allowed_practice_speaking_tests: T;
  monthly_allowed_practice_reading_tests: T;
  monthly_allowed_practice_writing_tests: T;
  monthly_allowed_practice_listening_tests: T;
  monthly_subscription: T;
  adminId: string;
}

export interface CreateUserPayload {
  email: string;
  mobile_number: string;
  name: string;
  org_id: string;
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

export interface UserDeletePayload {
  userId: string;
  orgId?: string;
}
export interface UserReponse {
  org_id?: string | null;
  id: string;
  email: string;
  name: string;
  mobile_number: string;
}
export interface StudentResponse extends UserReponse {}

export interface TeacherResponse extends UserReponse {
  practice_speaking_tests?: Array<PracticeSpeakingTestModel>;
}

export interface OrgAdminResponse extends UserReponse {}

export interface SuperAdminResponse extends UserReponse {}

export interface OrganizationResponse {
  org_id: string;
  org_name: string;
  org_email: string;
  org_mobile_number: string;
  number_of_students: number;
  monthly_allowed_practice_speaking_tests: number;
  monthly_allowed_practice_reading_tests: number;
  monthly_allowed_practice_writing_tests: number;
  monthly_allowed_practice_listening_tests: number;
  monthly_subscription: Decimal;
  admin?: OrgAdminResponse;
}
