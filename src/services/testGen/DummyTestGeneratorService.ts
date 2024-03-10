import ITestGeneratorService from "./ITestGeneratorService";

class DummyTestGeneratorService implements ITestGeneratorService {
  private static instance: ITestGeneratorService = new DummyTestGeneratorService();
  private constructor() {}

  static getInstance(): ITestGeneratorService {
    return this.instance;
  }

  async generateSpeakingTestStage2(): Promise<string> {
    return Promise.resolve("Explain a memorable vacation you spent");
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<string> {
    return Promise.resolve("What are the things to consider when selecting a place to stay on a vacation");
  }
}

export default DummyTestGeneratorService;
