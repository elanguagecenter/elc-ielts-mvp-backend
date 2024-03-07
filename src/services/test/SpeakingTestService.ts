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
import ITestGeneratorService from "../testGen/ITestGeneratorService";
import ChatGPTGeneratorService from "../testGen/ChatGPTGeneratorService";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import { TestStatus } from "../../utils/types/common/common";
import ITestRepository from "../../repository/test/ITestRepository";

class SpeakingTestService {
  private speakingTestRepository: ISpeakingTestRepository;
  private speakingTestStageRepository: ISpeakingTestStageRepository;
  private testService: ITestService;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<string>>;
  constructor(
    speakingTestRepository: ISpeakingTestRepository,
    speakingTestStageRepository: ISpeakingTestStageRepository,
    testService: ITestService,
    testGenService: ITestGeneratorService
  ) {
    this.speakingTestRepository = speakingTestRepository;
    this.speakingTestStageRepository = speakingTestStageRepository;
    this.testService = testService;
    this.testGenFunctionMap = new Map([
      [1, testGenService.generateSpeakingTestStage2],
      [2, testGenService.generateSpeakingTestStage3],
    ]);
  }

  async createSpeakingTest(testId: string): Promise<SpeakingTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    const test: TestModel = await this.testService.getTest(testId);
    const speakingTest: SpeakingTestModel = await this.speakingTestRepository.create(testId, `${test.test_name} - speaking test`);
    ["2", "3"].forEach(async (value) => await this.createSpeakingTestStage(speakingTest.speaking_test_id, value));
    await this.speakingTestRepository.updateStatusById(speakingTest.speaking_test_id, TestStatus.SPEAKING_TEST_CREATED);
    await this.testService.updateStatusByTestId(testId, TestStatus.SPEAKING_TEST_CREATED);
    return speakingTest;
  }

  async createSpeakingTestStage(speakingTestId: string, stgNumber: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const stgNumberValue = CommonValidator.validatePositiveNumberString(stgNumber, "stageNumber");
    CommonValidator.validateValidPossibleNumberValue(stgNumberValue, [2, 3], "stageNumber");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(stgNumberValue);
    if (generateSpeakingTestPart) {
      const question = await generateSpeakingTestPart();
      return await this.speakingTestStageRepository.create(speakingTestId, question, stgNumberValue);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${stgNumberValue} question`);
  }

  async getAllSpeakingTestStages(speakingTestId: string): Promise<Array<SpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    return await this.speakingTestStageRepository.getAllBySpeakingTestId(speakingTestId);
  }

  async getSpecificSpeakingTestStage(speakingTestId: string, stgNumber: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const stgNumberValue = CommonValidator.validatePositiveNumberString(stgNumber, "stageNumber");
    CommonValidator.validateValidPossibleNumberValue(stgNumberValue, [2, 3], "stageNumber");
    return await this.speakingTestStageRepository.getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId, stgNumberValue);
  }

  async getSpeakingQuestion(testId: string, stgNumber: string, qid: string) {
    // TODO - Implement get speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async updateSpeakingStageQuestion(testId: string, stgNumber: string, qid: string, payload: UpdateSpeakingTestQuestion) {
    // TODO - Implement update speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
}
const service = {
  prismaSpeakingTest: new SpeakingTestService(
    PrismaSpeakingTestRepository.getInstance(),
    PrismaSpeakingTestStageRepository.getInstance(),
    TestService.prismaTest,
    ChatGPTGeneratorService.getInstance()
  ),
};
export type ISpeakingTestService = SpeakingTestService;
export default service;
