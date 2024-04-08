import ELCIELTSGPTError from "../../../exception/ELCIELTSGPTError";
import IPracticeReadingTestRepository from "../../../repository/readingTest/practice/IPracticeReadingTestRepository";
import IPracticeReadingTestStageQuestionRepository from "../../../repository/readingTest/practice/IPracticeReadingTestStageQuestionRepository";
import IPracticeReadingTestStageRepository from "../../../repository/readingTest/practice/IPracticeReadingTestStageRepository";
import Incrementer from "../../../utils/common/Incrementer";
import incrementDecorator from "../../../utils/decorators/IncrementDecorator";
import OpenAIUtils from "../../../utils/openai/OpenAIUtils";
import { QuestionStatus, ReadingTestQuestionTypes, TestOperations, TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import { Constants } from "../../../utils/types/common/constants";
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
  }

  async createReadingTest(studentId: string): Promise<PracticeReadingTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const practiceReadingTest: PracticeReadingTestModel = await this.practiceReadingTestRepository.createPracticeReadingTest(studentId);
    const stageOne: PracticeReadingTestStageModel = await this.generateReadingTestStageOne(practiceReadingTest.practice_reading_test_id);
    return await this.practiceReadingTestRepository.updateStatusById(practiceReadingTest.practice_reading_test_id, TestStatus.READING_TEST_STAGES_GENERATED);
  }

  private async generateReadingTestStageOne(readingTestId: string): Promise<PracticeReadingTestStageModel> {
    const generatedText: Array<string | null> = await this.textGeneratorService.generateReadingTestStageOneText();
    console.log("Reading test Text generated");
    const validatedGeneratedText: string = ChatGPTValidator.validateNotNullChatGPTResponse(generatedText[0]);
    return this.practiceReadingTestStageRepository.create(readingTestId, validatedGeneratedText, 1);
  }

  async generateReadingTestStageQuestions(stageId: string): Promise<PracticeReadingTestStageModel> {
    const incrementer: Incrementer = Incrementer.init();
    const stage: PracticeReadingTestStageModel = await this.practiceReadingTestStageRepository.getByStageIdAndStatus(stageId, TestStageStatus.CREATED);
    const generatedMcqQuestions: Array<string | null> = await this.textGeneratorService.generateReadingTestStageOneMcqQuestions(stage.generated_scenario_text, 7);
    console.log("Reading test MCQ questions generated");
    const generatedSenCompletionQuestions: Array<string | null> = await this.textGeneratorService.generateReadingTestStageOneSentanceCompletionQuestions(
      stage.generated_scenario_text,
      6
    );
    console.log("Reading test Sentence Completion questions generated");
    const data: Array<ReadingQuestionsCreateManyDataType> = [
      ...generatedMcqQuestions
        .filter((question) => question != null)
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
    const updateStage: PracticeReadingTestStageModel = await this.practiceReadingTestStageRepository.updateStatusById(stageId, TestStageStatus.QUESTIONS_GENERATED);
    const savedQuestions: Array<PracticeReadingTestStageQuestionsModel> = await this.practiceReadingTestStageQuestionRepository.createMany(data, stageId);
    return {
      ...updateStage,
      practice_reading_test_stage_questions: savedQuestions,
    };
  }

  async getAllReadingTestsByReleventId(studentId: string, page: string, limit: string): Promise<Array<PracticeReadingTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    return await this.practiceReadingTestRepository.getAllByStudentId(studentId, pageNum, limitNum);
  }

  async getNextAvailableReadingTestStages(readingTestId: string): Promise<Array<PracticeReadingTestStageModel>> {
    CommonValidator.validateNotEmptyOrBlankString(readingTestId, "Reading Test ID");
    return await this.practiceReadingTestStageRepository.getAllByReadingTestId(readingTestId);
  }

  async getQuestionsByStageId(readingTestStageId: string): Promise<Array<PracticeReadingTestStageQuestionsModel>> {
    CommonValidator.validateNotEmptyOrBlankString(readingTestStageId, "Reading Test Stage ID");
    return await this.practiceReadingTestStageQuestionRepository.getAllByStageId(readingTestStageId);
  }

  async getTestStageByStageId(testStageId: string): Promise<PracticeReadingTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(testStageId, "Writing Test Stage Id");
    return this.practiceReadingTestStageRepository.getByStageId(testStageId);
  }

  async evaluateTestStage(testId: string, testStageId: string, operation: string, payLoad: UpdateReadingTestStage): Promise<PracticeReadingTestStageModel> {
    const answerMap = CommonValidator.validateJsonString(payLoad.answerMap, "Answers");
    console.log(answerMap);
    this.validateAnswerValue(answerMap);
    console.log("here");
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

    return await this.practiceReadingTestStageRepository.updateStatusById(stage.practice_reading_test_stage_id, TestStageStatus.EVALUATED);
  }

  private validateAnswerValue(answerMap: Map<string, string>) {
    answerMap.forEach((value, key) => {
      CommonValidator.validateNotEmptyOrBlankString(value, "Reading Question Answer");
    });
  }
}

export default PracticeReadingTestService;
