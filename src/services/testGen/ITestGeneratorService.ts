interface ITestGeneratorService {
  generateSpeakingTestStage2(): Promise<string>;
  generateSpeakingTestStage3(): Promise<string>;
}

export default ITestGeneratorService;
