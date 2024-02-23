import ITestRepository from "./ITestRepository";

class PrismaTestRepository implements ITestRepository {
  private static instance: PrismaTestRepository = new PrismaTestRepository();
  static getInstance() {
    return this.instance;
  }
  private constructor() {}
}

export default PrismaTestRepository;
