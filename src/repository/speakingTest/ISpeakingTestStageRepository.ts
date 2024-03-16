import { SpeakingTestStageModel } from "../../utils/types/dbtypes/models";

interface ISpeakingTestStageRepository<T> {
  create(speakingTestId: string, generatedQuestion: string, partNumber: number): Promise<T>;
  updateStatusBySpeakingTestStageId(speakingTestPartId: string, status: string): Promise<T>;
  updateMediaUrlBySpeakingTestStageId(speakingTestId: string, mediaUrl: string): Promise<T>;
  getAllBySpeakingTestId(speakingTestId: string): Promise<Array<T>>;
  getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId: string, stgNumber: number): Promise<T>;
}

export default ISpeakingTestStageRepository;
