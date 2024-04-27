import IPracticeWritingTestRepository from "../../../repository/writingTest/practice/IPracticeWritingTestRepository";
import IPracticeWritingTestStageRepository from "../../../repository/writingTest/practice/IPracticeWritingTestStageRepository";
import { TestOperations, TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import { PracticeWritingTestModel, PracticeWritingTestStageModel } from "../../../utils/types/dbtypes/models";
import { UpdateWritingTestStage } from "../../../utils/types/test/IELTSTestTypes";
import ChatGPTValidator from "../../../utils/validators/ChatGPTValidator";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ITextGeneratorService from "../../testGen/ITextGeneratorService";
import IWritingTestService from "./IWritingTestService";

class PracticeWritingTestService implements IWritingTestService {
  private practiceWritingTestRepository: IPracticeWritingTestRepository;
  private practiceWritingTestStageRepository: IPracticeWritingTestStageRepository;
  private textGeneratorService: ITextGeneratorService;

  constructor(
    practiceWritingTestRepository: IPracticeWritingTestRepository,
    textGeneratorService: ITextGeneratorService,
    practiceWritingTestStageRepository: IPracticeWritingTestStageRepository
  ) {
    this.practiceWritingTestRepository = practiceWritingTestRepository;
    this.practiceWritingTestStageRepository = practiceWritingTestStageRepository;
    this.textGeneratorService = textGeneratorService;
  }

  async createWritingTest(studentId: string): Promise<PracticeWritingTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const practiceWritingTest: PracticeWritingTestModel = await this.practiceWritingTestRepository.createPracticeWritingTest(studentId);
    await this.generateWritingTestStageOne(practiceWritingTest.practice_writing_test_id);
    await this.generateWritingTestStageTwo(practiceWritingTest.practice_writing_test_id);
    return this.practiceWritingTestRepository.updateStatusById(practiceWritingTest.practice_writing_test_id, TestStatus.WRITING_TEST_STAGES_GENERATED);
  }

  private async generateWritingTestStageOne(writingTestId: string) {
    const stageOne: Array<string | null> = await this.textGeneratorService.generateWritingTestStage1();
    const validatedStageOne: string = ChatGPTValidator.validateNotNullChatGPTResponse(stageOne[0]);
    await this.practiceWritingTestStageRepository.create(writingTestId, validatedStageOne, 1);
  }

  private async generateWritingTestStageTwo(writingTestId: string) {
    const stageTwo: Array<string | null> = await this.textGeneratorService.generateWritingTestStage2();
    const validatedStageTwo: string = ChatGPTValidator.validateNotNullChatGPTResponse(stageTwo[0]);
    await this.practiceWritingTestStageRepository.create(writingTestId, validatedStageTwo, 2);
  }

  async submitAnswer(id: string, answer: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getAllWritingTestsByReleventId(id: string, page: string, limit: string): Promise<Array<PracticeWritingTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(id, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    return await this.practiceWritingTestRepository.getAllByStudentId(id, pageNum, limitNum);
  }

  async getNextAvailableWritingTestStages(writingTestId: string): Promise<Array<PracticeWritingTestStageModel>> {
    const writingTestStages: Array<PracticeWritingTestStageModel> = await this.practiceWritingTestStageRepository.getByStatusesAndId(writingTestId, [
      TestStageStatus.COMPLETED,
      TestStageStatus.EVALUATED,
      TestStageStatus.FAILED,
    ]);
    const nextStage = writingTestStages.length == 0 ? 1 : writingTestStages[0].stg_number + 1;
    const nextWritingTestStage: PracticeWritingTestStageModel | null = await this.practiceWritingTestStageRepository.getByStageAndId(writingTestId, nextStage);
    return nextWritingTestStage ? [...writingTestStages, nextWritingTestStage] : writingTestStages;
  }

  async evaluateWritingTestStage(
    writingTestId: string,
    writingTestStageId: string,
    operation: string,
    payLoad: UpdateWritingTestStage
  ): Promise<Array<PracticeWritingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(payLoad.answer, "Writing Answer");
    CommonValidator.validateNotEmptyOrBlankString(writingTestId, "Writing Test ID");
    CommonValidator.validateNotEmptyOrBlankString(writingTestStageId, "Writing Test Stage Id");
    CommonValidator.validateParamInADefinedValues(operation, Object.values(TestOperations), "Operation");
    const isAlreadyAnswered: boolean = await this.practiceWritingTestStageRepository.checkAlreadyAnswered(writingTestStageId);
    CommonValidator.validateTrueValue(!isAlreadyAnswered, "Already answered");
    const updatedStage: PracticeWritingTestStageModel = await this.practiceWritingTestStageRepository.updateSubmittedAnswerById(writingTestStageId, payLoad.answer);
    const evaluatedResult: Array<string | null> = await this.textGeneratorService.evaluateWritingTestStage(
      updatedStage.generated_question,
      updatedStage.submitted_answer!,
      updatedStage.stg_number
    );
    const validatedResult: string = ChatGPTValidator.validateNotNullChatGPTResponse(evaluatedResult[0]);
    await this.practiceWritingTestStageRepository.updateEvaluatedResultById(writingTestStageId, validatedResult);
    return await this.getNextAvailableWritingTestStages(writingTestId);
  }
}

export default PracticeWritingTestService;
