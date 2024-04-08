import { Response, Request, NextFunction } from "express";
import PrismaPracticeReadingTestRepository from "../repository/readingTest/practice/PrismaPracticeReadingTestRepository";
import PrismaPracticeReadingTestStageQuestionRepository from "../repository/readingTest/practice/PrismaPracticeReadingTestStageQuestionRepository";
import PrismaPracticeReadingTestStageRepository from "../repository/readingTest/practice/PrismaPracticeReadingTestStageRepository";
import IReadingTestService from "../services/test/reading/IReadingTestService";
import PracticeReadingTestService from "../services/test/reading/PracticeReadingTestService";
import ChatGPTGeneratorService from "../services/testGen/ChatGPTGeneratorService";
import { Constants } from "../utils/types/common/constants";
import { PracticeReadingTestModel, PracticeReadingTestStageModel, PracticeReadingTestStageQuestionsModel } from "../utils/types/dbtypes/models";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { UpdateReadingTestStage } from "../utils/types/test/IELTSTestTypes";

class ReadingTestController {
  private readingTestServiceMap: Map<string, IReadingTestService>;
  private practiceReadingTestService: IReadingTestService;

  constructor() {
    this.practiceReadingTestService = new PracticeReadingTestService(
      ChatGPTGeneratorService.getInstance(),
      PrismaPracticeReadingTestRepository.getInstance(),
      PrismaPracticeReadingTestStageRepository.getInstance(),
      PrismaPracticeReadingTestStageQuestionRepository.getInstance()
    );
    this.readingTestServiceMap = new Map([[Constants.PRACTICE_ROUTE, this.practiceReadingTestService]]);
  }

  @AsyncControllerHandle
  async createReadingTest(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const result: PracticeReadingTestModel = await readingTestService.createReadingTest(testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getAllReadingTestsByTestIdOrUserId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const writingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const result: PracticeReadingTestModel = await writingTestService.getAllReadingTestsByReleventId(
      testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId,
      page,
      limit
    );
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createReadingTestStageQuestions(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestStageId = req.params.stageId;
    const ReadingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const result: PracticeReadingTestStageModel = await ReadingTestService.generateReadingTestStageQuestions(readingTestStageId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getNextAvailablReadingTestStages(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestId = req.params.readingTestId;
    const ReadingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const result: Array<PracticeReadingTestStageModel> = await ReadingTestService.getNextAvailableReadingTestStages(readingTestId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getQuestionsForReadingTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestStageId = req.params.stageId;
    const ReadingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const result: Array<PracticeReadingTestStageQuestionsModel> = await ReadingTestService.getQuestionsByStageId(readingTestStageId);
    res.status(200).send(result);
  }

  async getTestStageByStageId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestStageId = req.params.stageId;
    const ReadingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const updatedStage: PracticeReadingTestStageModel = await ReadingTestService.getTestStageByStageId(readingTestStageId);
    res.status(200).send(updatedStage);
  }

  @AsyncControllerHandle
  async updateTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const readingTestId = req.params.readingTestId;
    const readingTestStageId = req.params.stageId;
    const operation = req.query.operation?.toString() || Constants.EMPTY_STR;
    const payLoad: UpdateReadingTestStage = req.body;
    const ReadingTestService: IReadingTestService = this.readingTestServiceMap.get(testId) || this.practiceReadingTestService;
    const updatedStage: PracticeReadingTestStageModel = await ReadingTestService.evaluateTestStage(readingTestId, readingTestStageId, operation, payLoad);
    res.status(200).send(updatedStage);
  }
}

export default ReadingTestController;
