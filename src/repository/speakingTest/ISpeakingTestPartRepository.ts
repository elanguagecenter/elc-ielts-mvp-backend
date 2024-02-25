import { SpeakingTestPartModel } from "../../utils/types/dbtypes/models";

interface ISpeakingTestPartRepository {
  create(speakingTestId: string, generatedQuestion: string): Promise<SpeakingTestPartModel>;
  updateStatusSpeakingTestPartId(speakingTestPartId: string, status: string): Promise<SpeakingTestPartModel>;
  updateMediaUrlBySpeakingTestId(speakingTestId: string, mediaUrl: string): Promise<SpeakingTestPartModel>;
  getAllBySpeakingTestId(speakingTestId: string): Promise<Array<SpeakingTestPartModel>>;
}

export default ISpeakingTestPartRepository;
