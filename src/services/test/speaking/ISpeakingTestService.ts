import { StartStopSpeakingTestStage } from "../../../utils/types/test/IELTSTestTypes";

interface ISpeakingTestService {
  createSpeakingTest(id: string): Promise<any>;
  getAllSpeakingTestsByReleventId(id: string, page: string, limit: string): Promise<any>;
  getAllSpeakingTestStages(speakingTestId: string): Promise<any>;
  getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string): Promise<any>;
  getNextAvailableSpeakingTestStages(speakingTestId: string): Promise<Array<any>>;
  updateSpeakingTestStage(speakingTestId: string, speakingTestStageId: string, operation: string, payLoad: StartStopSpeakingTestStage, userId: string): Promise<Array<any>>;
}

export default ISpeakingTestService;
