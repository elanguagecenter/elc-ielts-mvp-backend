import ELCIELTSDataInvalidError from "../../../exception/ELCIELTSDataInvalidError";
import ELCIELTSInternalError from "../../../exception/ELCIELTSInternalError";
import IPracticeListeningTestRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestRepository";
import IPracticeListeningTestStageQuestionRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestStageQuestionRepository";
import IPracticeListeningTestStageRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestStageRepository";
import Incrementer from "../../../utils/common/Incrementer";
import { ListeningTestTextTypes, QuestionStatus, TestOperations, TestQuestionTypes, TestStageStatus, TestStatus } from "../../../utils/types/common/common";
import { ListeningQuestionsCreateManyDataType } from "../../../utils/types/common/types";
import { PracticeListeningTestModel, PracticeListeningTestStageModel, PracticeListeningTestStageQuestionsModel } from "../../../utils/types/dbtypes/models";
import { UpdateListeningTestStage } from "../../../utils/types/test/IELTSTestTypes";
import ChatGPTValidator from "../../../utils/validators/ChatGPTValidator";
import CommonValidator from "../../../utils/validators/CommonValidator";
import IFIleService from "../../fileService/IFileService";
import ITextGeneratorService from "../../testGen/ITextGeneratorService";
import IVoiceGeneratorService from "../../voiceGen/IVoiceGeneratorService";
import IListeningTestService from "./IListeningTestService";

class PracticeListeningTestService implements IListeningTestService {
  private practiceListeningTestRepository: IPracticeListeningTestRepository;
  private practiceListeningTestStageRepository: IPracticeListeningTestStageRepository;
  private practiceListeningTestStageQuestionRepository: IPracticeListeningTestStageQuestionRepository;
  private textGeneratorService: ITextGeneratorService;
  private voiceGeneratorService: IVoiceGeneratorService;
  private fileService: IFIleService;
  private textGenerationMap: Map<number, () => Promise<Array<string | null>>>;
  private stageGenStatusMap: Map<number, Array<string>>;
  private listeningTextTypeMap: Map<number, string>;
  private voiceGenFunctionMap: Map<number, (lines: Array<string>) => Promise<Array<Buffer>>>;

  constructor(
    textGeneratorService: ITextGeneratorService,
    voiceGeneratorService: IVoiceGeneratorService,
    fileService: IFIleService,
    practiceReadingTestRepository: IPracticeListeningTestRepository,
    practiceReadingTestStageRepository: IPracticeListeningTestStageRepository,
    practiceReadingTestStageQuestionRepository: IPracticeListeningTestStageQuestionRepository
  ) {
    this.fileService = fileService;
    this.voiceGeneratorService = voiceGeneratorService;
    this.textGeneratorService = textGeneratorService;
    this.practiceListeningTestRepository = practiceReadingTestRepository;
    this.practiceListeningTestStageRepository = practiceReadingTestStageRepository;
    this.practiceListeningTestStageQuestionRepository = practiceReadingTestStageQuestionRepository;
    this.textGenerationMap = new Map([
      [1, this.textGeneratorService.generateListeningTestStageOneText.bind(this.textGeneratorService)],
      [2, this.textGeneratorService.generateListeningTestStageTwoText.bind(this.textGeneratorService)],
      [3, this.textGeneratorService.generateListeningTestStageThreeText.bind(this.textGeneratorService)],
      [4, this.textGeneratorService.generateListeningTestStageFourText.bind(this.textGeneratorService)],
    ]);
    this.stageGenStatusMap = new Map([
      [1, [TestStatus.LISTENING_TEST_STAGE_ONE_AUDIO_GENERATED, TestStatus.LISTENING_TEST_STAGE_ONE_QUESTIONS_GENERATED]],
      [2, [TestStatus.LISTENING_TEST_STAGE_TWO_AUDIO_GENERATED, TestStatus.LISTENING_TEST_STAGE_TWO_QUESTIONS_GENERATED]],
      [3, [TestStatus.LISTENING_TEST_STAGE_THREE_AUDIO_GENERATED, TestStatus.LISTENING_TEST_STAGE_THREE_QUESTIONS_GENERATED]],
      [4, [TestStatus.LISTENING_TEST_STAGE_FOUR_AUDIO_GENERATED, TestStatus.LISTENING_TEST_STAGE_FOUR_QUESTIONS_GENERATED]],
    ]);
    this.listeningTextTypeMap = new Map([
      [1, ListeningTestTextTypes.CONVERSATION],
      [2, ListeningTestTextTypes.MONOLOUGE],
      [3, ListeningTestTextTypes.DIALOG],
      [4, ListeningTestTextTypes.MONOLOUGE],
    ]);
    this.voiceGenFunctionMap = new Map([
      [1, this.voiceGeneratorService.generateVoiceForListeningTestStageOne.bind(this.voiceGeneratorService)],
      [2, this.voiceGeneratorService.generateVoiceForListeningTestStageTwo.bind(this.voiceGeneratorService)],
      [3, this.voiceGeneratorService.generateVoiceForListeningTestStageThree.bind(this.voiceGeneratorService)],
      [4, this.voiceGeneratorService.generateVoiceForListeningTestStageFour.bind(this.voiceGeneratorService)],
    ]);
  }

  async createTest(studentId: string): Promise<PracticeListeningTestModel> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    return await this.practiceListeningTestRepository.createPracticeTest(studentId);
  }

  async createStage(testId: string, stageNum: string): Promise<PracticeListeningTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Listening Test ID");
    const stageNumber: number = CommonValidator.validatePositiveNumberString(stageNum, "Listening Test Stage Number");
    CommonValidator.validateValidPossibleNumberValue(stageNumber, [1, 2, 3, 4], "Listening Test Stage Number");
    const existingStages: Array<PracticeListeningTestStageModel> = await this.practiceListeningTestStageRepository.getByStageNumberAndId(testId, stageNumber);
    CommonValidator.arraySizeValidator(existingStages, 0, new ELCIELTSDataInvalidError(`Stage has created already for readingTestId: ${testId} and stageNum: ${stageNum}`));

    const stage: PracticeListeningTestStageModel = await this.generateListeningTestStageText(testId, stageNumber);
    await this.generateListeningTestAudio(stage);
    const stageWithQuestions: PracticeListeningTestStageModel = await this.generateListeningTestStageQuestions(stage);
    await this.practiceListeningTestRepository.updateStatusById(testId, this.stageGenStatusMap.get(stageNumber)![0] || "");
    return stageWithQuestions;
  }

  private async generateListeningTestStageText(testId: string, stageNum: number): Promise<PracticeListeningTestStageModel> {
    const textGenFunction: () => Promise<Array<string | null>> = this.textGenerationMap.get(stageNum) || (() => Promise.resolve([null]));
    const generatedText: Array<string | null> = await textGenFunction();
    const validatedGeneratedText: string = ChatGPTValidator.validateNotNullChatGPTResponse(generatedText[0]);
    return this.practiceListeningTestStageRepository.create(testId, validatedGeneratedText, stageNum);
  }

  private async generateListeningTestAudio(stage: PracticeListeningTestStageModel) {
    const lines: Array<string> = stage.generated_scenario_text
      .split(/\n+/)
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/\d+:/g, "").trim());

    const voiceGenFunction: (lines: Array<string>) => Promise<Array<Buffer>> =
      this.voiceGenFunctionMap.get(stage.stg_number) || ((lines: Array<string>) => Promise.reject(new ELCIELTSInternalError("Internal error occured")));

    const audioBufferes: Array<Buffer> = await voiceGenFunction(lines);
    const audioFilePath: string = await this.fileService.writeBufferArrayToFile(audioBufferes, `${stage.practice_listening_test_id}-${stage.stg_number}.mp3`);

    await this.practiceListeningTestStageRepository.updateAudioUrlAndStatusById(
      stage.practice_listening_test_stage_id,
      this.stageGenStatusMap.get(stage.stg_number)![1] || "",
      audioFilePath
    );
    await this.practiceListeningTestRepository.updateStatusById(stage.practice_listening_test_id, this.stageGenStatusMap.get(stage.stg_number)![0] || "");
  }

  private async generateListeningTestStageQuestions(stage: PracticeListeningTestStageModel): Promise<PracticeListeningTestStageModel> {
    const incrementer: Incrementer = new Incrementer();
    const generatedMcqQuestions: Array<string | null> = await this.textGeneratorService.generateListeningTestStageMcqQuestions(
      stage.generated_scenario_text,
      5,
      stage.stg_number,
      this.listeningTextTypeMap.get(stage.stg_number) || ""
    );
    console.log("Reading test MCQ questions generated");
    const generatedSenCompletionQuestions: Array<string | null> = await this.textGeneratorService.generateListeningTestStageTrueFalseQuestions(
      stage.generated_scenario_text,
      5,
      stage.stg_number,
      this.listeningTextTypeMap.get(stage.stg_number) || ""
    );
    console.log("Reading test True False questions generated");
    const data: Array<ListeningQuestionsCreateManyDataType> = [
      ...generatedMcqQuestions
        .filter((question) => question != null)
        .map((question) => question?.replace(/\n{2,}/g, "\n"))
        .map((question) => {
          return {
            question_number: incrementer.incrementAndGet(),
            generated_question: question!,
            practice_listening_test_stage_id: stage.practice_listening_test_stage_id,
            type: TestQuestionTypes.MULTIPLE_CHOICE,
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
            practice_listening_test_stage_id: stage.practice_listening_test_stage_id,
            type: TestQuestionTypes.TRUE_FALSE,
            status: QuestionStatus.CREATED,
          };
        }),
    ];
    const updateStage: PracticeListeningTestStageModel = await this.practiceListeningTestStageRepository.updateStatusById(
      stage.practice_listening_test_stage_id,
      TestStageStatus.QUESTIONS_GENERATED
    );
    const savedQuestions: Array<PracticeListeningTestStageQuestionsModel> = await this.practiceListeningTestStageQuestionRepository.createMany(
      data,
      stage.practice_listening_test_stage_id
    );
    return {
      ...updateStage,
      practice_listening_test_stage_questions: savedQuestions,
    };
  }

  async getTestStageByStageId(stageId: string): Promise<PracticeListeningTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(stageId, "Listening Test Stage Id");
    return await this.practiceListeningTestStageRepository.getWithQuestionsByStageId(stageId);
  }

  async getAllListeningTestsByReleventId(studentId: string, page: string, limit: string): Promise<Array<PracticeListeningTestModel>> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    return await this.practiceListeningTestRepository.getAllByStudentId(studentId, pageNum, limitNum);
  }

  async getListeningTestStageByStageNum(testId: string, stageNum: string): Promise<PracticeListeningTestStageModel> {
    CommonValidator.validateNotEmptyOrBlankString(testId, "Listening Test ID");
    const stageNumber: number = CommonValidator.validatePositiveNumberString(stageNum, "Listening Test Stage Number");
    CommonValidator.validateValidPossibleNumberValue(stageNumber, [1, 2, 3, 4], "Listening Test Stage Number");
    return await this.practiceListeningTestStageRepository.getWithQuestionsByStageAndTestId(testId, stageNumber);
  }

  async getQuestionsByStageId(stageId: string): Promise<Array<PracticeListeningTestStageQuestionsModel>> {
    CommonValidator.validateNotEmptyOrBlankString(stageId, "Listening Test Stage ID");
    return await this.practiceListeningTestStageQuestionRepository.getAllByStageId(stageId);
  }

  async evaluateTestStage(testId: string, stageId: string, operation: string, payLoad: UpdateListeningTestStage): Promise<PracticeListeningTestStageModel> {
    const answerMap = CommonValidator.validateJsonString(payLoad.answerMap, "Answers");
    CommonValidator.validateNotEmptyOrBlankString(testId, "Reading Test ID");
    CommonValidator.validateNotEmptyOrBlankString(stageId, "Reading Test Stage Id");
    CommonValidator.validateParamInADefinedValues(operation, Object.values(TestOperations), "Operation");
    // TODO - add operation based processing since more operations can be added in
    const stage: PracticeListeningTestStageModel = await this.practiceListeningTestStageRepository.checkAlreadyAnswered(stageId);
    const updatedQuestions: Array<PracticeListeningTestStageQuestionsModel> = await Promise.all(
      Array.from(answerMap.entries()).map((entry) => this.practiceListeningTestStageQuestionRepository.updateAnswer(entry[0], entry[1]))
    );

    const evaluatedResults = await Promise.all(
      updatedQuestions.map(async (question) => {
        return {
          questionId: question.practice_listening_test_stage_question_id,
          result: await this.textGeneratorService.evaluateListeningTestQuestions(
            stage.generated_scenario_text,
            question.generated_question,
            question.submitted_answer!,
            question.type
          ),
        };
      })
    );

    await Promise.all(
      evaluatedResults.map((result) => {
        return this.practiceListeningTestStageQuestionRepository.updateResult(result.questionId, result.result[0] || "");
      })
    );

    return await this.practiceListeningTestStageRepository.updateStatusByIdAndGetWithQuestions(stage.practice_listening_test_stage_id, TestStageStatus.EVALUATED);
  }
}

export default PracticeListeningTestService;
