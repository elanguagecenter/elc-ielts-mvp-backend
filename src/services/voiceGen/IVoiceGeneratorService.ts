interface IVoiceGeneratorService {
  /*---- Listening Test ------------------------------------------------------------------------------------------------------------*/
  generateVoiceForListeningTestStageOne(lines: Array<string>): Promise<Array<Buffer>>;
  /*--------------------------------------------------------------------------------------------------------------------------------*/
}

export default IVoiceGeneratorService;
