import ELCIELTSNotImplementedError from "../../exception/ELCIELTSNotImplementedError";
import ISpeakingTestRepository from "../../repository/speakingTest/ISpeakingTestRepository";
import PrismaSpeakingTestRepository from "../../repository/speakingTest/PrismaSpeakingTestRepository";
import { SpeakingTestModel, SpeakingTestStageModel, TestModel } from "../../utils/types/dbtypes/models";
import { UpdateSpeakingTestQuestion } from "../../utils/types/test/IELTSTestTypes";
import CommonValidator from "../../utils/validators/CommonValidator";
import { ITestService } from "./TestService";
import TestService from "./TestService";
import ISpeakingTestStageRepository from "../../repository/speakingTest/ISpeakingTestStageRepository";
import PrismaSpeakingTestStageRepository from "../../repository/speakingTest/PrismaSpeakingTestStageRepository";
import ITestGeneratorService from "../testGen/ITestGeneratorService";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import { TestStageStatus, TestStatus } from "../../utils/types/common/common";
import IMediaRecorder from "../mediaRecorder/IMediaRecorder";
import { SpeakingTestResponse, SpeakingTestStageStartResponse } from "../../utils/types/common/types";
import FSMediaRecorder from "../mediaRecorder/FSMediaRecorder";
import ChatGPTGeneratorService from "../testGen/ChatGPTGeneratorService";

class SpeakingTestService {
  private speakingTestRepository: ISpeakingTestRepository;
  private speakingTestStageRepository: ISpeakingTestStageRepository;
  private testService: ITestService;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<string>>;
  private mediaRecorder: IMediaRecorder;
  constructor(
    speakingTestRepository: ISpeakingTestRepository,
    speakingTestStageRepository: ISpeakingTestStageRepository,
    testService: ITestService,
    testGenService: ITestGeneratorService,
    mediaRecorder: IMediaRecorder
  ) {
    this.speakingTestRepository = speakingTestRepository;
    this.speakingTestStageRepository = speakingTestStageRepository;
    this.testService = testService;
    this.testGenFunctionMap = new Map([
      [2, () => testGenService.generateSpeakingTestStage2()],
      [3, (prevGenText: string) => testGenService.generateSpeakingTestStage3(prevGenText)],
    ]);
    this.mediaRecorder = mediaRecorder;
  }

  async createSpeakingTest(testId: string): Promise<SpeakingTestResponse> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    const test: TestModel = await this.testService.getTest(testId);
    const speakingTest: SpeakingTestModel = await this.speakingTestRepository.create(testId, `${test.test_name} - speaking test`);

    const speakingTestStage1: SpeakingTestStageModel = await this.createSpeakingTestStageTwo(speakingTest.speaking_test_id);
    const speakingTestStage2: SpeakingTestStageModel = await this.createSpeakingTestStageThree(speakingTest.speaking_test_id, speakingTestStage1.generated_question);

    const updatedSpeakingTest: SpeakingTestModel = await this.speakingTestRepository.updateStatusById(speakingTest.speaking_test_id, TestStatus.SPEAKING_TEST_CREATED);
    const updatedTest: TestModel = await this.testService.updateStatusByTestId(testId, TestStatus.SPEAKING_TEST_CREATED);
    return {
      test: updatedTest,
      speakingTest: updatedSpeakingTest,
      speakingTestStages: [speakingTestStage1, speakingTestStage2],
    };
  }

  async getSpeakingTestByTestId(testId: string): Promise<SpeakingTestResponse> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    const speakingTest: SpeakingTestModel | null = await this.speakingTestRepository.getByTestId(testId);
    const stages: Array<SpeakingTestStageModel> = speakingTest ? await this.getAllSpeakingTestStages(speakingTest.speaking_test_id) : [];
    return {
      test: null,
      speakingTest: speakingTest,
      speakingTestStages: stages,
    };
  }

  async createSpeakingTestStageTwo(speakingTestId: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(2);
    if (generateSpeakingTestPart) {
      const question = await generateSpeakingTestPart();
      return await this.speakingTestStageRepository.create(speakingTestId, question, 2);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${2} question`);
  }

  async createSpeakingTestStageThree(speakingTestId: string, prevText: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(3);
    if (generateSpeakingTestPart) {
      const question = await generateSpeakingTestPart(prevText);
      return await this.speakingTestStageRepository.create(speakingTestId, question, 3);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${3} question`);
  }

  async getAllSpeakingTestStages(speakingTestId: string): Promise<Array<SpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    return await this.speakingTestStageRepository.getAllBySpeakingTestId(speakingTestId);
  }

  async getSpecificSpeakingTestStage(speakingTestId: string, stgNumber: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stgNumber);
    return await this.speakingTestStageRepository.getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId, stgNumberValue);
  }

  async startSpeakingTestStageRecording(
    testId: string,
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: string,
    userId: string
  ): Promise<SpeakingTestStageStartResponse> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stgNumber);

    this.mediaRecorder.startRecording(userId, `${userId}-${speakingTestStageId}.wav`);

    return this.updateSpeakingTestStageStatus(testId, speakingTestId, speakingTestStageId, stgNumberValue, TestStageStatus.STARTED);
  }

  async stopSpeakingTestStageRecording(
    testId: string,
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: string,
    userId: string
  ): Promise<SpeakingTestStageStartResponse> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stgNumber);

    this.mediaRecorder.stopRecording(userId);
    return this.updateSpeakingTestStageStatus(testId, speakingTestId, speakingTestStageId, stgNumberValue, TestStageStatus.COMPLETED);
  }

  private async updateSpeakingTestStageStatus(
    testId: string,
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: number,
    status: string
  ): Promise<SpeakingTestStageStartResponse> {
    const updatedSpeakingTestStage: SpeakingTestStageModel = await this.speakingTestStageRepository.updateStatusBySpeakingTestStageId(speakingTestStageId, status);
    const updatedSpeakingTest: SpeakingTestModel = await this.speakingTestRepository.updateStatusById(
      speakingTestId,
      stgNumber == 2 ? TestStatus.SPEAKING_TEST_PART_2_STARTED : TestStatus.SPEAKING_TEST_PART_3_STARTED
    );
    const updatedTest: TestModel = await this.testService.updateStatusByTestId(
      testId,
      stgNumber == 2 ? TestStatus.SPEAKING_TEST_PART_2_STARTED : TestStatus.SPEAKING_TEST_PART_3_STARTED
    );
    return {
      test: updatedTest,
      speakingTest: updatedSpeakingTest,
      updatedSpeakingTestStage: updatedSpeakingTestStage,
    };
  }

  async getSpeakingQuestion(testId: string, stgNumber: string, qid: string) {
    // TODO - Implement get speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async updateSpeakingStageQuestion(testId: string, stgNumber: string, qid: string, payload: UpdateSpeakingTestQuestion) {
    // TODO - Implement update speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  private validateSpeakingTestStagingNumber(stgNumber: string): number {
    const stgNumberValue = CommonValidator.validatePositiveNumberString(stgNumber, "stageNumber");
    CommonValidator.validateValidPossibleNumberValue(stgNumberValue, [2, 3], "stageNumber");
    return stgNumberValue;
  }
}
const service = {
  prismaSpeakingTest: new SpeakingTestService(
    PrismaSpeakingTestRepository.getInstance(),
    PrismaSpeakingTestStageRepository.getInstance(),
    TestService.prismaTest,
    ChatGPTGeneratorService.getInstance(),
    FSMediaRecorder.getInstance()
  ),
};
export type ISpeakingTestService = SpeakingTestService;
export default service;
