import ELCIELTSDataInvalidError from "../../../exception/ELCIELTSDataInvalidError";
import IPracticeReadingTestRepository from "../../../repository/readingTest/practice/IPracticeReadingTestRepository";
import IPracticeReadingTestStageQuestionRepository from "../../../repository/readingTest/practice/IPracticeReadingTestStageQuestionRepository";
import IPracticeReadingTestStageRepository from "../../../repository/readingTest/practice/IPracticeReadingTestStageRepository";
import Incrementer from "../../../utils/common/Incrementer";
import { QuestionStatus, ReadingTestQuestionTypes, TestOperations, TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import { ReadingQuestionsCreateManyDataType } from "../../../utils/types/common/types";
import { PracticeReadingTestModel, PracticeReadingTestStageModel, PracticeReadingTestStageQuestionsModel } from "../../../utils/types/dbtypes/models";
import { UpdateReadingTestStage } from "../../../utils/types/test/IELTSTestTypes";
import ChatGPTValidator from "../../../utils/validators/ChatGPTValidator";
import CommonValidator from "../../../utils/validators/CommonValidator";
import ITextGeneratorService from "../../testGen/ITextGeneratorService";
import IReadingTestService from "./IReadingTestService";

class PracticeReadingTestService implements IReadingTestService {
  private practiceReadingTestRepository: IPracticeReadingTestRepository;
  private practiceReadingTestStageRepository: IPracticeReadingTestStageRepository;
  private practiceReadingTestStageQuestionRepository: IPracticeReadingTestStageQuestionRepository;
  private textGeneratorService: ITextGeneratorService;
  private textGenerationMap: Map<number, () => Promise<Array<string | null>>>;
  private stageGenStatusMap: Map<number, string>;

  constructor(
    textGeneratorService: ITextGeneratorService,
    practiceReadingTestRepository: IPracticeReadingTestRepository,
    practiceReadingTestStageRepository: IPracticeReadingTestStageRepository,
    practiceReadingTestStageQuestionRepository: IPracticeReadingTestStageQuestionRepository
  ) {
    this.textGeneratorService = textGeneratorService;
    this.practiceReadingTestRepository = practiceReadingTestRepository;
    this.practiceReadingTestStageRepository = practiceReadingTestStageRepository;
    this.practiceReadingTestStageQuestionRepository = practiceReadingTestStageQuestionRepository;
    this.textGenerationMap = new Map([
      [1, this.textGeneratorService.generateReadingTestStageOneText.bind(this.textGeneratorService)],
      [2, this.textGeneratorService.generateReadingTestStageTwoText.bind(this.textGeneratorService)],
      [3, this.textGeneratorService.generateReadingTestStageThreeText.bind(this.textGeneratorService)],
    ]);
    this.stageGenStatusMap = new Map([
      [1, TestStatus.READING_TEST_STAGE_ONE_GENERATED],
      [2, TestStatus.READING_TEST_STAGE_TWO_GENERATED],
      [3, TestStatus.READING_TEST_STAGE_THREE_GENERATED],
    ]);
  }

  async createReadingTest(studentId: string): Promise<PracticeReadingTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    return await this.practiceReadingTestRepository.createPracticeReadingTest(studentId);
  }

  async createStage(readingTestId: string, stageNum: string): Promise<PracticeReadingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(readingTestId, "Reading Test ID");
    const stageNumber: number = CommonValidator.validatePositiveNumberString(stageNum, "Reading Test Stage Number");
    CommonValidator.validateValidPossibleNumberValue(stageNumber, [1, 2, 3], "Reading Test Stage Number");
    const existingStages: Array<PracticeReadingTestStageModel> = await this.practiceReadingTestStageRepository.getByStageNumberAndId(readingTestId, stageNumber);
    CommonValidator.arraySizeValidator(existingStages, 0, new ELCIELTSDataInvalidError(`Stage has created already for readingTestId: ${readingTestId} and stageNum: ${stageNum}`));

    const stage: PracticeReadingTestStageModel = await this.generateReadingTestStageText(readingTestId, stageNumber);
    const stageWithQuestions: PracticeReadingTestStageModel = await this.generateReadingTestStageQuestions(stage);
    await this.practiceReadingTestRepository.updateStatusById(readingTestId, this.stageGenStatusMap.get(stageNumber) || "");
    return stageWithQuestions;
  }

  private async generateReadingTestStageText(readingTestId: string, stageNum: number): Promise<PracticeReadingTestStageModel> {
    const textGenFunction: () => Promise<Array<string | null>> = this.textGenerationMap.get(stageNum) || (() => Promise.resolve([null]));
    const generatedText: Array<string | null> = await textGenFunction();
    const validatedGeneratedText: string = ChatGPTValidator.validateNotNullChatGPTResponse(generatedText[0]);
    return this.practiceReadingTestStageRepository.create(readingTestId, validatedGeneratedText, stageNum);
  }

  private async generateReadingTestStageQuestions(stage: PracticeReadingTestStageModel): Promise<PracticeReadingTestStageModel> {
    const incrementer: Incrementer = Incrementer.init();
    const generatedMcqQuestions: Array<string | null> = await this.textGeneratorService.generateReadingTestStageMcqQuestions(stage.generated_scenario_text, 7, stage.stg_number);
    console.log("Reading test MCQ questions generated");
    const generatedSenCompletionQuestions: Array<string | null> = await this.textGeneratorService.generateReadingTestStageSentanceCompletionQuestions(
      stage.generated_scenario_text,
      6,
      stage.stg_number
    );
    console.log("Reading test Sentence Completion questions generated");
    const data: Array<ReadingQuestionsCreateManyDataType> = [
      ...generatedMcqQuestions
        .filter((question) => question != null)
        .map((question) => question?.replace(/\n{2,}/g, "\n"))
        .map((question) => {
          return {
            question_number: incrementer.incrementAndGet(),
            generated_question: question!,
            practice_reading_test_stage_id: stage.practice_reading_test_stage_id,
            type: ReadingTestQuestionTypes.MULTIPLE_CHOICE,
            status: QuestionStatus.CREATED,
          };
        }),
      ...generatedSenCompletionQuestions
        .filter((question) => question != null)
        .map((question) => question?.replace(/\n{2,}/g, "\n"))
        .map((question) => {
          return {
            question_number: incrementer.incrementAndGet(),
            generated_question: question!,
            practice_reading_test_stage_id: stage.practice_reading_test_stage_id,
            type: ReadingTestQuestionTypes.SENETENCE_COMPLETION,
            status: QuestionStatus.CREATED,
          };
        }),
    ];
    const updateStage: PracticeReadingTestStageModel = await this.practiceReadingTestStageRepository.updateStatusById(
      stage.practice_reading_test_stage_id,
      TestStageStatus.QUESTIONS_GENERATED
    );
    const savedQuestions: Array<PracticeReadingTestStageQuestionsModel> = await this.practiceReadingTestStageQuestionRepository.createMany(
      data,
      stage.practice_reading_test_stage_id
    );
    return {
      ...updateStage,
      practice_reading_questions: savedQuestions,
    };
  }

  async getAllReadingTestsByReleventId(studentId: string, page: string, limit: string): Promise<Array<PracticeReadingTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    return await this.practiceReadingTestRepository.getAllByStudentId(studentId, pageNum, limitNum);
  }

  async getReadingTestStageByStageNum(readingTestId: string, stageNum: string): Promise<PracticeReadingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(readingTestId, "Reading Test ID");
    const stageNumber: number = CommonValidator.validatePositiveNumberString(stageNum, "Reading Test Stage Number");
    CommonValidator.validateValidPossibleNumberValue(stageNumber, [1, 2, 3], "Reading Test Stage Number");
    return await this.practiceReadingTestStageRepository.getWithQuestionsByStageAndTestId(readingTestId, stageNumber);
  }

  async getQuestionsByStageId(readingTestStageId: string): Promise<Array<PracticeReadingTestStageQuestionsModel>> {
    CommonValidator.validateNotEmptyOrBlankString(readingTestStageId, "Reading Test Stage ID");
    return await this.practiceReadingTestStageQuestionRepository.getAllByStageId(readingTestStageId);
  }

  async getTestStageByStageId(testStageId: string): Promise<PracticeReadingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(testStageId, "Writing Test Stage Id");
    return this.practiceReadingTestStageRepository.getWithQuestionsByStageId(testStageId);
  }

  async evaluateTestStage(testId: string, testStageId: string, operation: string, payLoad: UpdateReadingTestStage): Promise<PracticeReadingTestStageModel> {
    const answerMap = CommonValidator.validateJsonString(payLoad.answerMap, "Answers");
    this.validateAnswerValue(answerMap);
    CommonValidator.validateNotEmptyOrBlankString(testId, "Writing Test ID");
    CommonValidator.validateNotEmptyOrBlankString(testStageId, "Writing Test Stage Id");
    CommonValidator.validateParamInADefinedValues(operation, Object.values(TestOperations), "Operation");
    // TODO - add operation based processing since more operations can be added in
    const stage: PracticeReadingTestStageModel = await this.practiceReadingTestStageRepository.checkAlreadyAnswered(testStageId);
    const updatedQuestions: Array<PracticeReadingTestStageQuestionsModel> = await Promise.all(
      Array.from(answerMap.entries()).map((entry) => this.practiceReadingTestStageQuestionRepository.updateAnswer(entry[0], entry[1]))
    );

    const evaluatedResults = await Promise.all(
      updatedQuestions.map(async (question) => {
        return {
          questionId: question.practice_reading_question_id,
          result: await this.textGeneratorService.evaluateReadingTestQuestions(stage.generated_scenario_text, question.generated_question, question.submitted_anser!),
        };
      })
    );

    await Promise.all(
      evaluatedResults.map((result) => {
        return this.practiceReadingTestStageQuestionRepository.updateResult(result.questionId, result.result[0] || "");
      })
    );

    return await this.practiceReadingTestStageRepository.updateStatusByIdAndGetWithQuestions(stage.practice_reading_test_stage_id, TestStageStatus.EVALUATED);
  }

  private validateAnswerValue(answerMap: Map<string, string>) {
    answerMap.forEach((value, key) => {
      CommonValidator.validateNotEmptyOrBlankString(value, "Reading Question Answer");
    });
  }
}

export default PracticeReadingTestService;
