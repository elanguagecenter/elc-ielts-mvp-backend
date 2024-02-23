import ISpeakingTestRepository from "./ISpeakingTestRepository";

class PrismaSpeakingTestRepository implements ISpeakingTestRepository {
  private static instance: PrismaSpeakingTestRepository = new PrismaSpeakingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}
}

export default PrismaSpeakingTestRepository;
