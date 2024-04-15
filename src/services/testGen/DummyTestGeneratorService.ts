import ITextGeneratorService from "./ITextGeneratorService";

class DummyTestGeneratorService implements ITextGeneratorService {
  private static instance: ITextGeneratorService = new DummyTestGeneratorService();
  private constructor() {}
  generateListeningTestStageFourText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateListeningTestStageThreeText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateListeningTestStageTwoText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateListeningTestStageMcqQuestions(text: string, numberOfQuestion: number, taskNum: number, textType: string): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateListeningTestStageTrueFalseQuestions(text: string, numberOfQuestion: number, taskNum: number, textType: string): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateListeningTestStageOneText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateSpeakingTestStage2(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateSpeakingTestStage3(previousGeneratedText: string): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateWritingTestStage1(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateWritingTestStage2(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateReadingTestStageOneText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateReadingTestStageTwoText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateReadingTestStageThreeText(): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateReadingTestStageMcqQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  generateReadingTestStageSentanceCompletionQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }
  evaluateReadingTestQuestions(text: string, question: string, answer: string): Promise<(string | null)[]> {
    throw new Error("Method not implemented.");
  }

  static getInstance(): ITextGeneratorService {
    return this.instance;
  }
}

export default DummyTestGeneratorService;
