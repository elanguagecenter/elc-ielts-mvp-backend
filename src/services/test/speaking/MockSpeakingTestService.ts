import ELCIELTSNotImplementedError from "../../../exception/ELCIELTSNotImplementedError";
import { SpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import { UpdateSpeakingTestQuestion, UpdateTestStagePayload } from "../../../utils/types/test/IELTSTestTypes";
import CommonValidator from "../../../utils/validators/CommonValidator";
import { ITestService } from "../TestService";
import ITestGeneratorService from "../../testGen/ITextGeneratorService";
import IMediaRecorder from "../../mediaRecorder/IMediaRecorder";
import { SpeakingTestResponse } from "../../../utils/types/common/types";
import IPracticeSpeakingTestRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestRepository";
import IPracticeSpeakingTestStageRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestStageRepository";
import ISpeakingTestService from "./ISpeakingTestService";

class MockSpeakingTestService implements ISpeakingTestService {
  private practiceSpeakingTestRepository: IPracticeSpeakingTestRepository;
  private practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository;
  private testService: ITestService;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<Array<string | null>>>;
  private mediaRecorder: IMediaRecorder;
  constructor(
    practiceSpeakingTestRepository: IPracticeSpeakingTestRepository,
    practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository,
    testService: ITestService,
    testGenService: ITestGeneratorService,
    mediaRecorder: IMediaRecorder
  ) {
    this.practiceSpeakingTestRepository = practiceSpeakingTestRepository;
    this.practiceSpeakingTestStageRepository = practiceSpeakingTestStageRepository;
    this.testService = testService;
    this.testGenFunctionMap = new Map([
      [2, () => testGenService.generateSpeakingTestStage2()],
      [3, (prevGenText: string) => testGenService.generateSpeakingTestStage3(prevGenText)],
    ]);
    this.mediaRecorder = mediaRecorder;
  }

  updateSpeakingTestStage(
    speakingTestId: string,
    speakingTestStageId: string,
    operation: string,
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  getNextAvailableSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  getAllSpeakingTestsByReleventId(id: string, userType: string, page: string, limit: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string, userType: string, userId: string): Promise<any> {
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
  startSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<any> {
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
  stopSpeakingTestStageRecording(speakingTestId: string, speakingTestStageId: string, stgNumber: string, userId: string): Promise<any> {
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async createSpeakingTest(testId: string): Promise<SpeakingTestResponse> {
    // CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    // const test: TestModel = await this.testService.getTest(testId);
    // const speakingTest: SpeakingTestModel = await this.practiceSpeakingTestRepository.create(testId, `${test.test_name} - speaking test`);

    // const speakingTestStage1: SpeakingTestStageModel = await this.createSpeakingTestStageTwo(speakingTest.speaking_test_id);
    // const speakingTestStage2: SpeakingTestStageModel = await this.createSpeakingTestStageThree(speakingTest.speaking_test_id, speakingTestStage1.generated_question);

    // const updatedSpeakingTest: SpeakingTestModel = await this.practiceSpeakingTestRepository.updateStatusById(speakingTest.speaking_test_id, TestStatus.SPEAKING_TEST_CREATED);
    // const updatedTest: TestModel = await this.testService.updateStatusByTestId(testId, TestStatus.SPEAKING_TEST_CREATED);
    // return {
    //   test: updatedTest,
    //   speakingTest: updatedSpeakingTest,
    //   speakingTestStages: [speakingTestStage1, speakingTestStage2],
    // };
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async getSpeakingTestByTestId(testId: string): Promise<SpeakingTestResponse> {
    // CommonValidator.validateNotEmptyOrBlankString(testId, "Test ID");
    // const speakingTest: SpeakingTestModel | null = await this.practiceSpeakingTestRepository.getByTestId(testId);
    // const stages: Array<SpeakingTestStageModel> = speakingTest ? await this.getAllSpeakingTestStages(speakingTest.speaking_test_id) : [];
    // return {
    //   test: null,
    //   speakingTest: speakingTest,
    //   speakingTestStages: stages,
    // };
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  async getAllSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<Array<SpeakingTestStageModel>> {
    // CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    // return await this.speakingTestStageRepository.getAllBySpeakingTestId(speakingTestId);
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
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

  getAudioURLPath(stageId: string, userId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export default MockSpeakingTestService;
