import ITextGeneratorService from "./ITextGeneratorService";

class DummyTestGeneratorService implements ITextGeneratorService {
  private static instance: ITextGeneratorService = new DummyTestGeneratorService();
  private constructor() {}

  static getInstance(): ITextGeneratorService {
    return this.instance;
  }

  async generateSpeakingTestStage2(): Promise<string> {
    return Promise.resolve("Explain a memorable vacation you spent");
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<string> {
    return Promise.resolve("What are the things to consider when selecting a place to stay on a vacation");
  }

  generateWritingTestStage1(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  generateWritingTestStage2(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export default DummyTestGeneratorService;
