import ELCIELTSNotImplementedError from "../../exception/ELCIELTSNotImplementedError";
import ITestRepository from "../../repository/test/ITestRepository";
import PrismaTestRepository from "../../repository/test/PrismaTestRepository";
import { CreateTest } from "../../types/test/IELTSTestTypes";

class TestService {
  private testRepository: ITestRepository;
  constructor(testRepository: ITestRepository) {
    this.testRepository = testRepository;
  }

  getTest(testId: string) {
    // TODO - Get specific Test Logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  createTest(payload: CreateTest) {
    // TODO - Create Test Logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
}

const service = {
  prismaTest: new TestService(PrismaTestRepository.getInstance()),
};

export default service;
