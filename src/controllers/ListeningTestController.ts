import { Response, Request, NextFunction } from "express";
import PrismaPracticeListeningTestRepository from "../repository/listeningTest/practice/PrismaPracticeListeningTestRepository";
import PrismaPracticeListeningTestStageQuestionRepository from "../repository/listeningTest/practice/PrismaPracticeListeningTestStageQuestionRepository";
import PrismaPracticeListeningTestStageRepository from "../repository/listeningTest/practice/PrismaPracticeListeningTestStageRepository";
import FSFileService from "../services/fileService/FSFileService";
import IListeningTestService from "../services/test/listening/IListeningTestService";
import PracticeListeningTestService from "../services/test/listening/PracticeListeningTestService";
import ChatGPTGeneratorService from "../services/testGen/ChatGPTGeneratorService";
import OpenAIVoiceGeneratorService from "../services/voiceGen/OpenAIVoiceGeneratorService";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { Constants } from "../utils/types/common/constants";
import { PracticeListeningTestModel, PracticeListeningTestStageModel, PracticeListeningTestStageQuestionsModel } from "../utils/types/dbtypes/models";
import S3FileService from "../services/fileService/S3FileService";
import { UpdateListeningTestStage } from "../utils/types/test/IELTSTestTypes";

class ListeningTestController {
  private listeningTestServiceMap: Map<string, IListeningTestService>;
  private practiceListeningTestService: IListeningTestService;

  constructor() {
    this.practiceListeningTestService = new PracticeListeningTestService(
      ChatGPTGeneratorService.getInstance(),
      OpenAIVoiceGeneratorService.getInstance(),
      S3FileService.getInstance(),
      PrismaPracticeListeningTestRepository.getInstance(),
      PrismaPracticeListeningTestStageRepository.getInstance(),
      PrismaPracticeListeningTestStageQuestionRepository.getInstance()
    );
    this.listeningTestServiceMap = new Map([[Constants.PRACTICE_ROUTE, this.practiceListeningTestService]]);
  }

  @AsyncControllerHandle
  async createTest(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const result: PracticeListeningTestModel = await listeningTestService.createTest(testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestId = req.params.listeningTestId;
    const stageNum = req.query.stageNumber?.toString() || Constants.ZERO;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const result: PracticeListeningTestStageModel = await listeningTestService.createStage(listeningTestId, stageNum);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getAllListeningTestsByTestIdOrUserId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const result: PracticeListeningTestStageModel = await listeningTestService.getAllListeningTestsByReleventId(
      testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId,
      page,
      limit
    );
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getListeningTestStageByStageNum(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestId = req.params.listeningTestId;
    const stageNum = req.query.stageNumber?.toString() || Constants.ZERO;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const result: PracticeListeningTestStageModel = await listeningTestService.getListeningTestStageByStageNum(listeningTestId, stageNum);
    res.status(200).send(result);
  }

  async getTestStageByStageId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestStageId = req.params.stageId;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const updatedStage: PracticeListeningTestStageModel = await listeningTestService.getTestStageByStageId(listeningTestStageId);
    res.status(200).send(updatedStage);
  }

  @AsyncControllerHandle
  async getQuestionsForListeningTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestStageId = req.params.stageId;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const result: Array<PracticeListeningTestStageQuestionsModel> = await listeningTestService.getQuestionsByStageId(listeningTestStageId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async updateTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const listeningTestId = req.params.listeningTestId;
    const stageId = req.params.stageId;
    const operation = req.query.operation?.toString() || Constants.EMPTY_STR;
    const payLoad: UpdateListeningTestStage = req.body;
    const listeningTestService: IListeningTestService = this.listeningTestServiceMap.get(testId) || this.practiceListeningTestService;
    const updatedStage: PracticeListeningTestStageModel = await listeningTestService.evaluateTestStage(listeningTestId, stageId, operation, payLoad);
    res.status(200).send(updatedStage);
  }
}

export default ListeningTestController;
