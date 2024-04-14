import ELCIELTSDataInvalidError from "../../../exception/ELCIELTSDataInvalidError";
import IPracticeListeningTestRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestRepository";
import IPracticeListeningTestStageQuestionRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestStageQuestionRepository";
import IPracticeListeningTestStageRepository from "../../../repository/listeningTest/practice/IPracticeListeningTestStageRepository";
import { TestStatus } from "../../../utils/types/common/common";
import { PracticeListeningTestModel, PracticeListeningTestStageModel } from "../../../utils/types/dbtypes/models";
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
    this.textGenerationMap = new Map([[1, this.textGeneratorService.generateListeningTestStageOneText.bind(this.textGeneratorService)]]);
    this.stageGenStatusMap = new Map([
      [1, [TestStatus.LISTENING_TEST_STAGE_ONE_QUESTIONS_GENERATED, TestStatus.LISTENING_TEST_STAGE_ONE_AUDIO_GENERATED]],
      [2, [TestStatus.LISTENING_TEST_STAGE_TWO_QUESTIONS_GENERATED, TestStatus.LISTENING_TEST_STAGE_TWO_AUDIO_GENERATED]],
      [3, [TestStatus.LISTENING_TEST_STAGE_THREE_QUESTIONS_GENERATED, TestStatus.LISTENING_TEST_STAGE_THREE_AUDIO_GENERATED]],
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
    // const stageWithQuestions: PracticeListeningTestStageModel = await this.generateReadingTestStageQuestions(stage);
    await this.practiceListeningTestRepository.updateStatusById(testId, this.stageGenStatusMap.get(stageNumber)![0] || "");
    await this.generateListeningTestAudio(stage);

    return stage;
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
    const audioBufferes: Array<Buffer> = await this.voiceGeneratorService.generateVoiceForListeningTestStageOne(lines);
    this.fileService.writeBufferArrayToFile(audioBufferes, `/${stage.practice_listening_test_id}-${stage.stg_number}.mp3`);
    await this.practiceListeningTestRepository.updateStatusById(stage.practice_listening_test_id, this.stageGenStatusMap.get(stage.stg_number)![1] || "");
  }

  private async generateReadingTestStageQuestions(stage: PracticeListeningTestStageModel): Promise<PracticeListeningTestStageModel> {
    throw new Error("Method not implemented.");
  }

  getTestStageByStageId(stageId: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getAllListeningTestsByReleventId(id: string, page: string, limit: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getReadingTestStageByStageNum(testId: string, stageNum: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getQuestionsByStageId(stageId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  evaluateTestStage(testId: string, stageId: string, operation: string, payLoad: UpdateListeningTestStage): Promise<PracticeListeningTestStageModel> {
    throw new Error("Method not implemented.");
  }
}

export default PracticeListeningTestService;
