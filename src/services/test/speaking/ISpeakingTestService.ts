interface ISpeakingTestService {
  createSpeakingTest(id: string): Promise<any>;
  startSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<any>;
  stopSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<any>;
  getAllSpeakingTestsByReleventId(id: string, page: string, limit: string): Promise<any>;
  getAllSpeakingTestStages(speakingTestId: string): Promise<any>;
  getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string): Promise<any>;
}

export default ISpeakingTestService;
