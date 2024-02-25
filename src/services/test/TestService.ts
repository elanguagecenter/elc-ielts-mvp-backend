import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import ELCIELTSNotImplementedError from "../../exception/ELCIELTSNotImplementedError";
import ITestRepository from "../../repository/test/ITestRepository";
import PrismaTestRepository from "../../repository/test/PrismaTestRepository";
import { TestModel } from "../../utils/types/dbtypes/models";
import { CreateTest } from "../../utils/types/test/IELTSTestTypes";
import CommonValidator from "../../utils/validators/CommonValidator";

class TestService {
  private testRepository: ITestRepository;
  constructor(testRepository: ITestRepository) {
    this.testRepository = testRepository;
  }

  async getTest(testId: string): Promise<TestModel> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    return await this.testRepository.getById(testId);
  }

  async createTest(userId: string, payload: CreateTest): Promise<TestModel> {
    CommonValidator.validateNotEmptyOrBlankString(payload.name, "Test Name");
    return await this.testRepository.create(userId, payload.name);
  }
}

const service = {
  prismaTest: new TestService(PrismaTestRepository.getInstance()),
};

export default service;
