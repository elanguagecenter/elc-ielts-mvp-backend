import { PracticeSpeakingTestModel, PracticeSpeakingTestStageModel, SpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ITestGeneratorService from "../../testGen/ITextGeneratorService";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";
import { SpeakingTestOperation, TestStageStatus, TestStatus, UserTypes } from "../../../utils/types/common/common";
import IMediaRecorder from "../../mediaRecorder/IMediaRecorder";
import { StudentResponse } from "../../../utils/types/common/types";
import { Constants } from "../../../utils/types/common/constants";
import IPracticeSpeakingTestRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestRepository";
import IPracticeSpeakingTestStageRepository from "../../../repository/speakingTest/practice/IPracticeSpeakingTestStageRepository";
import ISpeakingTestService from "./ISpeakingTestService";
import { UpdateTestStagePayload } from "../../../utils/types/test/IELTSTestTypes";
import ChatGPTValidator from "../../../utils/validators/ChatGPTValidator";
import IUsersRepository from "../../../repository/users/IUsersRepository";
import configs from "../../../config/configs";

class PracticeSpeakingTestService implements ISpeakingTestService {
  private practiceSpeakingTestRepository: IPracticeSpeakingTestRepository;
  private practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository;
  private userRepository: IUsersRepository;
  private testGenFunctionMap: Map<number, (...val: Array<string>) => Promise<Array<string | null>>>;
  private mediaRecorder: IMediaRecorder;
  private getAllTestFuncMap: Map<string, (id: string, page: number, limit: number) => Promise<Array<PracticeSpeakingTestModel>>>;
  private getAllStageFuncMap: Map<string, (speakingTestId: string, id: string) => Promise<Array<PracticeSpeakingTestStageModel>>>;
  private getStageByStageNumberFuncMap: Map<string, (speakingTestId: string, userId: string, stgNumber: number) => Promise<PracticeSpeakingTestStageModel>>;
  private getStagesByStatusesFuncMap: Map<string, (speakingTestId: string, userId: string, statuses: Array<string>) => Promise<Array<PracticeSpeakingTestStageModel>>>;
  private getStagesAndIdFuncMap: Map<string, (speakingTestId: string, userId: string, stage: number) => Promise<PracticeSpeakingTestStageModel | null>>;
  private updateStageOperationFuncMap: Map<
    string,
    (speakingTestId: string, speakingTestStageId: string, payLoad: UpdateTestStagePayload, userId: string, userType: string) => Promise<Array<PracticeSpeakingTestStageModel>>
  >;
  constructor(
    practiceSpeakingTestRepository: IPracticeSpeakingTestRepository,
    practiceSpeakingTestStageRepository: IPracticeSpeakingTestStageRepository,
    userRepository: IUsersRepository,
    testGenService: ITestGeneratorService,
    mediaRecorder: IMediaRecorder
  ) {
    this.practiceSpeakingTestRepository = practiceSpeakingTestRepository;
    this.practiceSpeakingTestStageRepository = practiceSpeakingTestStageRepository;
    this.userRepository = userRepository;
    this.testGenFunctionMap = new Map([
      [2, () => testGenService.generateSpeakingTestStage2()],
      [3, (prevGenText: string) => testGenService.generateSpeakingTestStage3(prevGenText)],
    ]);
    this.mediaRecorder = mediaRecorder;
    this.getAllTestFuncMap = new Map([
      [UserTypes.STUDENT, this.practiceSpeakingTestRepository.getAllByStudentIdWithPageAndLimit.bind(this.practiceSpeakingTestRepository)],
      [UserTypes.TEACHER, this.practiceSpeakingTestRepository.getAllByTeacherIdWithPageAndLimit.bind(this.practiceSpeakingTestRepository)],
    ]);

    this.getAllStageFuncMap = new Map([
      [UserTypes.STUDENT, this.practiceSpeakingTestStageRepository.getAllBySpeakingTestIdAndStudentId.bind(this.practiceSpeakingTestStageRepository)],
      [UserTypes.TEACHER, this.practiceSpeakingTestStageRepository.getAllBySpeakingTestIdAndTeacherId.bind(this.practiceSpeakingTestStageRepository)],
    ]);

    this.getStageByStageNumberFuncMap = new Map([
      [UserTypes.STUDENT, this.practiceSpeakingTestStageRepository.getSpeakingTestStageByStageNumberStudentIdAndSpeakingTestId.bind(this.practiceSpeakingTestStageRepository)],
      [UserTypes.TEACHER, this.practiceSpeakingTestStageRepository.getSpeakingTestStageByStageNumberTeacherIdAndSpeakingTestId.bind(this.practiceSpeakingTestStageRepository)],
    ]);

    this.getStagesByStatusesFuncMap = new Map([
      [UserTypes.STUDENT, this.practiceSpeakingTestStageRepository.getByStatusesStudentIdAndId.bind(this.practiceSpeakingTestStageRepository)],
      [UserTypes.TEACHER, this.practiceSpeakingTestStageRepository.getByStatusesTeacherIdAndId.bind(this.practiceSpeakingTestStageRepository)],
    ]);

    this.getStagesAndIdFuncMap = new Map([
      [UserTypes.STUDENT, this.practiceSpeakingTestStageRepository.getByStageStudentIdAndId.bind(this.practiceSpeakingTestStageRepository)],
      [UserTypes.TEACHER, this.practiceSpeakingTestStageRepository.getByStageTeacherIdAndId.bind(this.practiceSpeakingTestStageRepository)],
    ]);

    this.updateStageOperationFuncMap = new Map([
      [SpeakingTestOperation.START, this.startSpeakingTestStageRecording.bind(this)],
      [SpeakingTestOperation.STOP, this.stopSpeakingTestStageRecording.bind(this)],
      [SpeakingTestOperation.EVALUATE, this.updateEvaluation.bind(this)],
    ]);
  }

  async createSpeakingTest(studentId: string): Promise<PracticeSpeakingTestModel> {
    const timeMills = Date.now();
    const speakingTest: PracticeSpeakingTestModel = await this.practiceSpeakingTestRepository.create(studentId, `${Constants.PRACTICE} - speaking test - ${timeMills}`);

    const speakingTestStage1: SpeakingTestStageModel = await this.createSpeakingTestStageTwo(speakingTest.practice_speaking_test_id);
    await this.createSpeakingTestStageThree(speakingTest.practice_speaking_test_id, speakingTestStage1.generated_question);

    const student: StudentResponse = await this.userRepository.getStudentById(studentId);
    await this.updateEvaluatorId(speakingTest.practice_speaking_test_id, student.org_id!);

    return await this.practiceSpeakingTestRepository.updateStatusByStudentIdAndId(speakingTest.practice_speaking_test_id, TestStatus.SPEAKING_TEST_CREATED, studentId);
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
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateNotEmptyOrBlankString(speakingTestStageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    CommonValidator.validateParamInADefinedValues(operation, Object.values(SpeakingTestOperation), "Operation");

    const func: (
      speakingTestId: string,
      speakingTestStageId: string,
      payLoad: UpdateTestStagePayload,
      userId: string,
      userType: string
    ) => Promise<Array<PracticeSpeakingTestStageModel>> =
      this.updateStageOperationFuncMap.get(operation) || (() => Promise.reject(new ELCIELTSInternalError("Undefined UpdateTestStage function")));
    return func(speakingTestId, speakingTestStageId, payLoad, userId, userType);
  }

  async getAllSpeakingTestsByReleventId(studentId: string, userType: string, page: string, limit: string): Promise<Array<PracticeSpeakingTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    CommonValidator.validateParamInADefinedValues(userType, Object.values(UserTypes), "User Type");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");

    const func: (id: string, page: number, limit: number) => Promise<Array<PracticeSpeakingTestModel>> =
      this.getAllTestFuncMap.get(userType) || (() => Promise.reject(new ELCIELTSInternalError("Undefined GetAllSpeakingTest function")));
    return await func(studentId, pageNum, limitNum);
  }

  private async startSpeakingTestStageRecording(
    speakingTestId: string,
    speakingTestStageId: string,
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    const stgNumberValue = this.validateSpeakingTestStagingNumber(payLoad.stgNumber);
    this.mediaRecorder.startRecording(userId, `${userId}-${speakingTestStageId}.wav`);
    await this.practiceSpeakingTestStageRepository.updateMediaUrlBySpeakingTestStageId(speakingTestStageId, `${userId}-${speakingTestStageId}.wav`, userId);
    await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      TestStageStatus.STARTED,
      stgNumberValue == 2 ? TestStatus.SPEAKING_TEST_PART_2_STARTED : TestStatus.SPEAKING_TEST_PART_3_STARTED,
      userId
    );
    return await this.getNextAvailableSpeakingTestStages(speakingTestId, userType, userId);
  }

  private async stopSpeakingTestStageRecording(
    speakingTestId: string,
    speakingTestStageId: string,
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    const stgNumberValue = this.validateSpeakingTestStagingNumber(payLoad.stgNumber);
    this.mediaRecorder.stopRecording(userId);
    await this.updatePracticeSpeakingTestStageStatus(
      speakingTestId,
      speakingTestStageId,
      TestStageStatus.COMPLETED,
      stgNumberValue == 2 ? TestStatus.SPEAKING_TEST_PART_2_COMPLETED : TestStatus.SPEAKING_TEST_PART_3_COMPLETED,
      userId
    );
    return await this.getNextAvailableSpeakingTestStages(speakingTestId, userType, userId);
  }

  private async updateEvaluatorId(speakingTestId: string, orgId: string) {
    const fewestSpeakingTestTeacher = await this.userRepository.getTeachersWithFewestSpekaingTests(orgId);
    console.log(`fewestSpeakingTestTeacher: ${fewestSpeakingTestTeacher[0].name}`);
    const eligibleEvaluatorId: string | null = fewestSpeakingTestTeacher[0].id || null;
    console.log(`eligibel evaluator id: ${eligibleEvaluatorId}`);
    await this.practiceSpeakingTestRepository.updateEvaluatorId(speakingTestId, eligibleEvaluatorId);
  }

  private async updatePracticeSpeakingTestStageStatus(speakingTestId: string, speakingTestStageId: string, stageStatus: string, speakingTestStatus: string, userId: string) {
    await this.practiceSpeakingTestStageRepository.updateStatusBySpeakingTestStageId(speakingTestStageId, stageStatus, userId);
    await this.practiceSpeakingTestRepository.updateStatusByStudentIdAndId(speakingTestId, speakingTestStatus, userId);
  }

  async getAllSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<Array<SpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateParamInADefinedValues(userType, Object.values(UserTypes), "User Type");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User ID");

    const func: (speakingTestId: string, id: string) => Promise<Array<PracticeSpeakingTestStageModel>> =
      this.getAllStageFuncMap.get(userType) || (() => Promise.reject(new ELCIELTSInternalError("Undefined GetAllSpeakingTestStages function")));
    return await func(speakingTestId, userId);
  }

  async getSpecificSpeakingTestStage(speakingTestId: string, stageNum: string, userType: string, userId: string): Promise<SpeakingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateParamInADefinedValues(userType, Object.values(UserTypes), "User Type");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User ID");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(stageNum);

    const func: (speakingTestId: string, userId: string, stgNumber: number) => Promise<PracticeSpeakingTestStageModel> =
      this.getStageByStageNumberFuncMap.get(userType) || (() => Promise.reject(new ELCIELTSInternalError("Undefined GetSpecificSpeakingTestStage function")));
    return await func(speakingTestId, userId, stgNumberValue);
  }

  private validateSpeakingTestStagingNumber(stgNumber: string): number {
    const stgNumberValue = CommonValidator.validatePositiveNumberString(stgNumber, "stageNumber");
    CommonValidator.validateValidPossibleNumberValue(stgNumberValue, [2, 3], "stageNumber");
    return stgNumberValue;
  }

  async getNextAvailableSpeakingTestStages(speakingTestId: string, userType: string, userId: string): Promise<Array<PracticeSpeakingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(speakingTestId, "Speaking Test ID");
    CommonValidator.validateParamInADefinedValues(userType, Object.values(UserTypes), "User Type");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User ID");

    const func1: (speakingTestId: string, userId: string, statuses: Array<string>) => Promise<Array<PracticeSpeakingTestStageModel>> =
      this.getStagesByStatusesFuncMap.get(userType) || (() => Promise.reject(new ELCIELTSInternalError("Undefined GetStageByStatuses function")));
    const writingTestStages: Array<PracticeSpeakingTestStageModel> = await func1(speakingTestId, userId, [
      TestStageStatus.COMPLETED,
      TestStageStatus.EVALUATED,
      TestStageStatus.FAILED,
    ]);

    const nextStage = writingTestStages.length == 0 ? 2 : writingTestStages[0].stg_number + 1;
    const func2: (speakingTestId: string, userId: string, stage: number) => Promise<PracticeSpeakingTestStageModel | null> =
      this.getStagesAndIdFuncMap.get(userType) || (() => Promise.reject(new ELCIELTSInternalError("Undefined GetStageByNextStage function")));
    const nextWritingTestStage: PracticeSpeakingTestStageModel | null = await func2(speakingTestId, userId, nextStage);
    return nextWritingTestStage ? [...writingTestStages, nextWritingTestStage] : writingTestStages;
  }

  async getAudioURLPath(stageId: string, userId: string): Promise<string> {
    CommonValidator.validateNotEmptyOrBlankString(stageId, "Speaking Test Stage ID");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User Id");
    return await this.practiceSpeakingTestStageRepository.getAudioURLByStageIdAndTeacherId(stageId, userId).then((url) => `${configs.mediaOutBasepath}/${url}`);
  }

  private async updateEvaluation(
    speakingTestId: string,
    speakingTestStageId: string,
    payLoad: UpdateTestStagePayload,
    userId: string,
    userType: string
  ): Promise<Array<PracticeSpeakingTestStageModel>> {
    CommonValidator.validateTrueValue(userType === UserTypes.TEACHER, "Only teacher can evaluate the tests");
    const stgNumberValue = this.validateSpeakingTestStagingNumber(payLoad.stgNumber);
    CommonValidator.validateNotEmptyOrBlankString(payLoad.evaluation, "Evaluation");

    const stage: PracticeSpeakingTestStageModel | null = await this.practiceSpeakingTestStageRepository.getByStageTeacherIdAndId(speakingTestId, userId, stgNumberValue);
    CommonValidator.validateTrueValue(stage != null && stage.status === TestStageStatus.COMPLETED, "Test stage is not precent or not in completed stage");

    await this.practiceSpeakingTestStageRepository.updateEvaluationByStageIdTeacherId(payLoad.evaluation!, speakingTestStageId, userId);
    await this.practiceSpeakingTestRepository.updateStatusByTeacherIdAndId(
      speakingTestId,
      stgNumberValue == 2 ? TestStatus.SPEAKING_TEST_PART_2_EVALUATED : TestStatus.SPEAKING_TEST_PART_3_EVALUATED,
      userId
    );
    return await this.getNextAvailableSpeakingTestStages(speakingTestId, userType, userId);
  }
}

export default PracticeSpeakingTestService;
