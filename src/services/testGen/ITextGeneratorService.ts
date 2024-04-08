interface ITextGeneratorService {
  // speaking test
  generateSpeakingTestStage2(): Promise<Array<string | null>>;
  generateSpeakingTestStage3(previousGeneratedText: string): Promise<Array<string | null>>;

  // writing test
  generateWritingTestStage1(): Promise<Array<string | null>>;
  generateWritingTestStage2(): Promise<Array<string | null>>;
  evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<Array<string | null>>;

  // reading test
  generateReadingTestStageOneText(): Promise<Array<string | null>>;
  generateReadingTestStageOneMcqQuestions(text: string, numberOfQuestion: number): Promise<Array<string | null>>;
  generateReadingTestStageOneSentanceCompletionQuestions(text: string, numberOfQuestion: number): Promise<Array<string | null>>;
  evaluateReadingTestQuestions(text: string, question: string, answer: string): Promise<Array<string | null>>;
}

export default ITextGeneratorService;
