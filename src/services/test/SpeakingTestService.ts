import ELCIELTSNotImplementedError from "../../exception/ELCIELTSNotImplementedError";
import ISpeakingTestRepository from "../../repository/speakingTest/ISpeakingTestRepository";
import PrismaSpeakingTestRepository from "../../repository/speakingTest/PrismaSpeakingTestRepository";
import { SpeakingTestModel, SpeakingTestStageModel, TestModel } from "../../utils/types/dbtypes/models";
import { CreateSpekingTest, CreateSpekingTestStage, UpdateSpeakingTestQuestion } from "../../utils/types/test/IELTSTestTypes";
import CommonValidator from "../../utils/validators/CommonValidator";
import { ITestService } from "./TestService";
import TestService from "./TestService";
import ISpeakingTestStageRepository from "../../repository/speakingTest/ISpeakingTestStageRepository";
import PrismaSpeakingTestStageRepository from "../../repository/speakingTest/PrismaSpeakingTestStageRepository";

class SpeakingTestService {
  private speakingTestRepository: ISpeakingTestRepository;
  private speakingTestStageRepository: ISpeakingTestStageRepository;
  private testService: ITestService;
  constructor(speakingTestRepository: ISpeakingTestRepository, speakingTestStageRepository: ISpeakingTestStageRepository, testService: ITestService) {
    this.speakingTestRepository = speakingTestRepository;
    this.speakingTestStageRepository = speakingTestStageRepository;
    this.testService = testService;
  }

  async createSpeakingTest(testId: string, payload: CreateSpekingTest): Promise<SpeakingTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    // CommonValidator.validateNotEmptyOrBlankString(payload.name, "Test Name");
    const test: TestModel = await this.testService.getTest(testId);
    return await this.speakingTestRepository.create(testId, `${test.test_name} - speaking test`);
  }

  async createSpeakingTestStage(testId: string, stgNumber: string, payload: CreateSpekingTestStage) {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    CommonValidator.validatePositiveNumberString(stgNumber, "stgNumber");
    // TODO - Implement ChatGPT question creation part
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async getAllSpeakingTestStages(speakingTestId: string): Promise<Array<SpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Test ID");
    return await this.speakingTestStageRepository.getAllBySpeakingTestId(speakingTestId);
  }

  async getSpecificTestStage(testId: string, stgNumber: string) {
    // TODO - Implement get specific speaking test stage logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async getSpeakingQuestion(testId: string, stgNumber: string, qid: string) {
    // TODO - Implement get speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async updateSpeakingQuestion(testId: string, stgNumber: string, qid: string, payload: UpdateSpeakingTestQuestion) {
    // TODO - Implement update speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
}
const service = {
  prismaSpeakingTest: new SpeakingTestService(
    PrismaSpeakingTestRepository.getInstance(),
    PrismaSpeakingTestStageRepository.getInstance(),
    TestService.prismaTest
  ),
};
export type ISpeakingTestService = SpeakingTestService;
export default service;
