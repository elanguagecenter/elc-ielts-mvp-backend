interface ITestGeneratorService {
  generateSpeakingTestStage2(): Promise<string>;
  generateSpeakingTestStage3(previousGeneratedText: string): Promise<string>;
}

export default ITestGeneratorService;
