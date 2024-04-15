interface IVoiceGeneratorService {
  /*---- Listening Test ------------------------------------------------------------------------------------------------------------*/
  generateVoiceForListeningTestStageOne(lines: Array<string>): Promise<Array<Buffer>>;
  generateVoiceForListeningTestStageTwo(lines: Array<string>): Promise<Array<Buffer>>;
  generateVoiceForListeningTestStageThree(lines: Array<string>): Promise<Array<Buffer>>;
  generateVoiceForListeningTestStageFour(lines: Array<string>): Promise<Array<Buffer>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/
}

export default IVoiceGeneratorService;
