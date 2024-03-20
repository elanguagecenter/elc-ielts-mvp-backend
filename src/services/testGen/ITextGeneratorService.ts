interface ITextGeneratorService {
  generateSpeakingTestStage2(): Promise<string>;
  generateSpeakingTestStage3(previousGeneratedText: string): Promise<string>;
  generateWritingTestStage1(): Promise<string>;
  generateWritingTestStage2(): Promise<string>;
  evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<string>;
}

export default ITextGeneratorService;
