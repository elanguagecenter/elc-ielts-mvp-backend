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
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import { TestStageStatus, TestStatus } from "../../utils/types/common/common";
import FFMpegMediaRecorder from "../mediaRecorder/FFMpegMediaRecorder";
import IMediaRecorder from "../mediaRecorder/IMediaRecorder";
import { SpeakingTestResponse, SpeakingTestStageStartResponse } from "../../utils/types/common/types";
import DummyTestGeneratorService from "../testGen/DummyTestGeneratorService";
import FSMediaRecorder from "../mediaRecorder/FSMediaRecorder";

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
      [2, testGenService.generateSpeakingTestStage2],
      [3, testGenService.generateSpeakingTestStage3],
    ]);
    this.mediaRecorder = mediaRecorder;
  }

  async createSpeakingTest(testId: string): Promise<SpeakingTestResponse> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    const test: TestModel = await this.testService.getTest(testId);
    const speakingTest: SpeakingTestModel = await this.speakingTestRepository.create(testId, `${test.test_name} - speaking test`);

    const speakingTestStages: Array<SpeakingTestStageModel> = await Promise.all(
      ["2", "3"].map(async (value) => await this.createSpeakingTestStage(speakingTest.speaking_test_id, value))
    );
    const updatedSpeakingTest: SpeakingTestModel = await this.speakingTestRepository.updateStatusById(speakingTest.speaking_test_id, TestStatus.SPEAKING_TEST_CREATED);
    const updatedTest: TestModel = await this.testService.updateStatusByTestId(testId, TestStatus.SPEAKING_TEST_CREATED);
    return {
      test: updatedTest,
      speakingTest: updatedSpeakingTest,
      speakingTestStages: speakingTestStages,
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

    return this.updateSpeakingTestStageStatus(testId, speakingTestId, speakingTestStageId, stgNumberValue);
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
    return this.updateSpeakingTestStageStatus(testId, speakingTestId, speakingTestStageId, stgNumberValue);
  }

  private async updateSpeakingTestStageStatus(testId: string, speakingTestId: string, speakingTestStageId: string, stgNumber: number): Promise<SpeakingTestStageStartResponse> {
    const updatedSpeakingTestStage: SpeakingTestStageModel = await this.speakingTestStageRepository.updateStatusBySpeakingTestStageId(
      speakingTestStageId,
      TestStageStatus.COMPLETED
    );
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
    DummyTestGeneratorService.getInstance(),
    //ChatGPTGeneratorService.getInstance(),
    //FFMpegMediaRecorder.getInstance()
    FSMediaRecorder.getInstance()
  ),
};
export type ISpeakingTestService = SpeakingTestService;
export default service;
