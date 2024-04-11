import { PracticeSpeakingTestModel, PracticeSpeakingTestStageModel, SpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ITestGeneratorService from "../../testGen/ITextGeneratorService";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";
import { SpeakingTestOperation, TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import IMediaRecorder from "../../mediaRecorder/IMediaRecorder";
import { PracticeSpeakingTestResponse, PracticeSpeakingTestStageStartResponse } from "../../../utils/types/common/types";
import { Constants } from "../../../utils/types/common/constants";
import IPracticeSpeakingTestRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestRepository";
import IPracticeSpeakingTestStageRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestStageRepository";
import ISpeakingTestService from "./ISpeakingTestService";
import { StartStopSpeakingTestStage } from "../../../utils/types/test/IELTSTestTypes";
import ChatGPTValidator from "../../../utils/validators/ChatGPTValidator";

class PracticeSpeakingTestService implements ISpeakingTestService {
  private practiceSpeakingTestRepository: IPracticeSpeakingTestRepository;
  private practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<Array<string | null>>>;
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

  async createSpeakingTest(studentId: string): Promise<PracticeSpeakingTestModel> {
    const timeMills = Date.now();
    const speakingTest: PracticeSpeakingTestModel = await this.practiceSpeakingTestRepository.create(studentId, `${Constants.PRACTICE} - speaking test - ${timeMills}`);

    const speakingTestStage1: SpeakingTestStageModel = await this.createSpeakingTestStageTwo(speakingTest.practice_speaking_test_id);
    await this.createSpeakingTestStageThree(speakingTest.practice_speaking_test_id, speakingTestStage1.generated_question);

    return await this.practiceSpeakingTestRepository.updateStatusById(speakingTest.practice_speaking_test_id, TestStatus.SPEAKING_TEST_CREATED);
  }

  private async createSpeakingTestStageTwo(speakingTestId: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(2);
    if (generateSpeakingTestPart) {
      const question: Array<string | null> = await generateSpeakingTestPart();
      const validatedQuestion: string = ChatGPTValidator.validateNotNullChatGPTResponse(question[0]);
      return await this.practiceSpeakingTestStageRepository.create(speakingTestId, validatedQuestion, 2);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${2} question`);
  }

  private async createSpeakingTestStageThree(speakingTestId: string, prevText: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    const generateSpeakingTestPart = this.testGenFunctionMap.get(3);
    if (generateSpeakingTestPart) {
      const question: Array<string | null> = await generateSpeakingTestPart(prevText);
      const validatedQuestion: string = ChatGPTValidator.validateNotNullChatGPTResponse(question[0]);
      return await this.practiceSpeakingTestStageRepository.create(speakingTestId, validatedQuestion, 3);
    }

    throw new ELCIELTSInternalError(`Exception occured when generating speaking part ${3} question`);
  }

  async updateSpeakingTestStage(
    speakingTestId: string,
    speakingTestStageId: string,
    operation: string,
    payLoad: StartStopSpeakingTestStage,
    userId: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(payLoad.stgNumber);
    CommonValidator.validateParamInADefinedValues(operation, Object.values(SpeakingTestOperation), "Operation");

    return operation === SpeakingTestOperation.START
      ? await this.startSpeakingTestStageRecording(speakingTestId, speakingTestStageId, stgNumberValue, userId)
      : await this.stopSpeakingTestStageRecording(speakingTestId, speakingTestStageId, stgNumberValue, userId);
  }

  async getAllSpeakingTestsByReleventId(studentId: string, page: string, limit: string): Promise<Array<PracticeSpeakingTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    return await this.practiceSpeakingTestRepository.getAllByStudentIdWithPageAndLimit(studentId, pageNum, limitNum);
  }

  private async startSpeakingTestStageRecording(
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: number,
    userId: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    this.mediaRecorder.startRecording(userId, `${userId}-${speakingTestStageId}.wav`);

    await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      TestStageStatus.STARTED,
      stgNumber == 2 ? TestStatus.SPEAKING_TEST_PART_2_STARTED : TestStatus.SPEAKING_TEST_PART_3_STARTED
    );
    return await this.getNextAvailableSpeakingTestStages(speakingTestId);
  }

  private async stopSpeakingTestStageRecording(
    speakingTestId: string,
    speakingTestStageId: string,
    stgNumber: number,
    userId: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    this.mediaRecorder.stopRecording(userId);
    await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      TestStageStatus.COMPLETED,
      stgNumber == 2 ? TestStatus.SPEAKING_TEST_PART_2_COMPLETED : TestStatus.SPEAKING_TEST_PART_3_COMPLETED
    );
    return await this.getNextAvailableSpeakingTestStages(speakingTestId);
  }

  private async updatePracticeSpeakingTestStageStatus(speakingTestId: string, speakingTestStageId: string, stageStatus: string, speakingTestStatus: string) {
    await this.practiceSpeakingTestStageRepository.updateStatusBySpeakingTestStageId(speakingTestStageId, stageStatus);
    await this.practiceSpeakingTestRepository.updateStatusById(speakingTestId, speakingTestStatus);
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

  async getNextAvailableSpeakingTestStages(speakingTestId: string): Promise<Array<PracticeSpeakingTestStageModel>> {
    const writingTestStages: Array<PracticeSpeakingTestStageModel> = await this.practiceSpeakingTestStageRepository.getByStatusesAndId(speakingTestId, [
      TestStageStatus.COMPLETED,
      TestStageStatus.EVALUATED,
      TestStageStatus.FAILED,
    ]);
    const nextStage = writingTestStages.length == 0 ? 2 : writingTestStages[0].stg_number + 1;
    const nextWritingTestStage: PracticeSpeakingTestStageModel | null = await this.practiceSpeakingTestStageRepository.getByStageAndId(speakingTestId, nextStage);
    return nextWritingTestStage ? [...writingTestStages, nextWritingTestStage] : writingTestStages;
  }
}

export default PracticeSpeakingTestService;
