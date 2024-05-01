import { UpdateTestStagePayload } from "../../../utils/types/test/IELTSTestTypes";

interface ISpeakingTestService {
  createSpeakingTest(id: string): Promise<any>;
  getAllSpeakingTestsByReleventId(id: string, userType: string, page: string, limit: string): Promise<any>;
  getAllSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<any>;
  getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string, userType: string, userId: string): Promise<any>;
  getNextAvailableSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<Array<any>>;
  updateSpeakingTestStage(
    speakingTestId: string,
    speakingTestStageId: string,
    operation: string,
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<Array<any>>;
  getAudioURLPath(stageId: string, userId: string): Promise<string>;
}

export default ISpeakingTestService;
