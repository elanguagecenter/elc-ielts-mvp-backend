import { SpeakingTestStageModel } from "../../utils/types/dbtypes/models";

interface ISpeakingTestStageRepository<T> {
  create(speakingTestId: string, generatedQuestion: string, partNumber: number): Promise<T>;
  updateStatusBySpeakingTestStageId(speakingTestPartId: string, status: string, userId: string): Promise<T>;
  updateMediaUrlBySpeakingTestStageId(speakingTestStageId: string, mediaUrl: string, studentId: string): Promise<T>;
  getAllBySpeakingTestIdAndStudentId(speakingTestId: string, studentId: string): Promise<Array<T>>;
  getAllBySpeakingTestIdAndTeacherId(speakingTestId: string, teacherId: string): Promise<Array<T>>;
  getSpeakingTestStageByStageNumberStudentIdAndSpeakingTestId(speakingTestId: string, studentId: string, stgNumber: number): Promise<T>;
  getSpeakingTestStageByStageNumberTeacherIdAndSpeakingTestId(speakingTestId: string, teacherId: string, stgNumber: number): Promise<T>;
  getByStatusesStudentIdAndId(speakingTestId: string, studentId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStatusesTeacherIdAndId(speakingTestId: string, teacherId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStageStudentIdAndId(speakingTestId: string, studentId: string, stage: number): Promise<T | null>;
  getByStageTeacherIdAndId(speakingTestId: string, teacherId: string, stage: number): Promise<T | null>;
  getAudioURLByStageIdAndTeacherId(stageId: string, teacherId: string): Promise<string>;
  updateEvaluationByStageIdTeacherId(evaluation: string, stageId: string, teacherId: string): Promise<T>;
}

export default ISpeakingTestStageRepository;
