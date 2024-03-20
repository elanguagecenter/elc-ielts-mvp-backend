import { PracticeSpeakingTestModel, SpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ITestGeneratorService from "../../testGen/ITextGeneratorService";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";
import { TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import IMediaRecorder from "../../mediaRecorder/IMediaRecorder";
import { PracticeSpeakingTestResponse, PracticeSpeakingTestStageStartResponse } from "../../../utils/types/common/types";
import { Constants } from "../../../utils/types/common/constants";
import IPracticeSpeakingTestRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestRepository";
import IPracticeSpeakingTestStageRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestStageRepository";
import ISpeakingTestService from "./ISpeakingTestService";

class PracticeSpeakingTestService implements ISpeakingTestService {
  private practiceSpeakingTestRepository: IPracticeSpeakingTestRepository;
  private practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<string>>;
  private mediaRecorder: IMediaRecorder;
  constructor(
    practiceSpeakingTestRepository: IPracticeSpeakingTestRepository,
    practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository,
    testGenService: ITestGeneratorService,
    mediaRecorder: IMediaRecorder
  ) {
    this.practiceSpeakingTestRepository = practiceSpeakingTestRepository;
    this.practiceSpeakingTestStageRepository = practiceSpeakingTestStageRepository;
    this.testGenFunctionMap = new Map([
      [2, () => testGenService.generateSpeakingTestStage2()],
      [3, (prevGenText: string) => testGenService.generateSpeakingTestStage3(prevGenText)],
    ]);
    this.mediaRecorder = mediaRecorder;
  }

  async createSpeakingTest(studentId: string): Promise<PracticeSpeakingTestResponse> {
    const timeMills = Date.now();
    const speakingTest: PracticeSpeakingTestModel = await this.practiceSpeakingTestRepository.create(studentId, `${Constants.PRACTICE} - speaking test - ${timeMills}`);

    const speakingTestStage1: SpeakingTestStageModel = await this.createSpeakingTestStageTwo(speakingTest.practice_speaking_test_id);
    const speakingTestStage2: SpeakingTestStageModel = await this.createSpeakingTestStageThree(speakingTest.practice_speaking_test_id, speakingTestStage1.generated_question);

    const updatedSpeakingTest: PracticeSpeakingTestModel = await this.practiceSpeakingTestRepository.updateStatusById(
      speakingTest.practice_speaking_test_id,
      TestStatus.SPEAKING_TEST_CREATED
    );
    return {
      speakingTest: updatedSpeakingTest,
      speakingTestStages: [speakingTestStage1, speakingTestStage2],
    };
  }

  private async createSpeakingTestStageTwo(speakingTestId: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(2);
    if (generateSpeakingTestPart) {
      const question = await generateSpeakingTestPart();
      return await this.practiceSpeakingTestStageRepository.create(speakingTestId, question, 2);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${2} question`);
  }

  private async createSpeakingTestStageThree(speakingTestId: string, prevText: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(3);
    if (generateSpeakingTestPart) {
      const question = await generateSpeakingTestPart(prevText);
      return await this.practiceSpeakingTestStageRepository.create(speakingTestId, question, 3);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${3} question`);
  }

  async getAllSpeakingTestsByReleventId(studentId: string, page: string, limit: string): Promise<Array<PracticeSpeakingTestResponse>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    const speakingTests: Array<PracticeSpeakingTestModel> = await this.practiceSpeakingTestRepository.getAllByStudentIdWithPageAndLimit(studentId, pageNum, limitNum);

    return speakingTests.map((test) => {
      const stages = test.practice_speaking_test_stages ? test.practice_speaking_test_stages : [];
      delete test.practice_speaking_test_stages;
      return {
        speakingTest: test,
        speakingTestStages: stages,
      };
    });
  }

  async startSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<PracticeSpeakingTestStageStartResponse> {
    console.log(`speakingTestId ${speakingTestId}: ${typeof speakingTestId}`);
    console.log(`speakingTestStageId ${speakingTestStageId}: ${typeof speakingTestStageId}`);
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stgNumber);

    this.mediaRecorder.startRecording(userId, `${userId}-${speakingTestStageId}.wav`);

    return await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      stgNumberValue,
      TestStageStatus.STARTED,
      stgNumberValue == 2 ? TestStatus.SPEAKING_TEST_PART_2_STARTED : TestStatus.SPEAKING_TEST_PART_3_STARTED
    );
  }

  async stopSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<PracticeSpeakingTestStageStartResponse> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stgNumber);

    this.mediaRecorder.stopRecording(userId);
    return await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      stgNumberValue,
      TestStageStatus.COMPLETED,
      stgNumberValue == 2 ? TestStatus.SPEAKING_TEST_PART_2_COMPLETED : TestStatus.SPEAKING_TEST_PART_3_COMPLETED
    );
  }

  private async updatePracticeSpeakingTestStageStatus(
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: number,
    stageStatus: string,
    speakingTestStatus: string
  ): Promise<PracticeSpeakingTestStageStartResponse> {
    const updatedSpeakingTestStage: SpeakingTestStageModel = await this.practiceSpeakingTestStageRepository.updateStatusBySpeakingTestStageId(speakingTestStageId, stageStatus);
    const updatedSpeakingTest: PracticeSpeakingTestModel = await this.practiceSpeakingTestRepository.updateStatusById(speakingTestId, speakingTestStatus);

    return {
      speakingTest: updatedSpeakingTest,
      updatedSpeakingTestStage: updatedSpeakingTestStage,
    };
  }

  async getAllSpeakingTestStages(speakingTestId: string): Promise<Array<SpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    return await this.practiceSpeakingTestStageRepository.getAllBySpeakingTestId(speakingTestId);
  }

  async getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stageNum);
    return await this.practiceSpeakingTestStageRepository.getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId, stgNumberValue);
  }

  private validateSpeakingTestStagingNumber(stgNumber: string): number {
    const stgNumberValue = CommonValidator.validatePositiveNumberString(stgNumber, "stageNumber");
    CommonValidator.validateValidPossibleNumberValue(stgNumberValue, [2, 3], "stageNumber");
    return stgNumberValue;
  }
}

export default PracticeSpeakingTestService;
