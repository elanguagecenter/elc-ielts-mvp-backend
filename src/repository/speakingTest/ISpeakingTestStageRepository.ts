import { SpeakingTestStageModel } from "../../utils/types/dbtypes/models";

interface ISpeakingTestStageRepository {
  create(speakingTestId: string, generatedQuestion: string, partNumber: number): Promise<SpeakingTestStageModel>;
  updateStatusBySpeakingTestStageId(speakingTestPartId: string, status: string): Promise<SpeakingTestStageModel>;
  updateMediaUrlBySpeakingTestId(speakingTestId: string, mediaUrl: string): Promise<SpeakingTestStageModel>;
  getAllBySpeakingTestId(speakingTestId: string): Promise<Array<SpeakingTestStageModel>>;
  getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId: string, stgNumber: number): Promise<SpeakingTestStageModel>;
}

export default ISpeakingTestStageRepository;
