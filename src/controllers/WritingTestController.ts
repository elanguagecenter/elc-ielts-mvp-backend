import { Response, Request, NextFunction } from "express";
import IWritingTestService from "../services/test/writing/IWritingTestService";
import { Constants } from "../utils/types/common/constants";
import { PracticeWritingTestModel, PracticeWritingTestStageModel } from "../utils/types/dbtypes/models";
import PracticeWritingTestService from "../services/test/writing/PracticeWritingTestService";
import PrismaPracticeWritingTestRepository from "../repository/writingTest/practice/PrismaPracticeWritingTestRepository";
import ChatGPTGeneratorService from "../services/testGen/ChatGPTGeneratorService";
import PrismaPracticeWritingTestStageRepository from "../repository/writingTest/practice/PrismaPracticeWritingTestStageRepository";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { UpdateWritingTestStage } from "../utils/types/test/IELTSTestTypes";

class WritingTestController {
  private writingTestServiceMap: Map<string, IWritingTestService>;
  private practiceWritingTestService: IWritingTestService;

  constructor() {
    this.practiceWritingTestService = new PracticeWritingTestService(
      PrismaPracticeWritingTestRepository.getInstance(),
      ChatGPTGeneratorService.getInstance(),
      PrismaPracticeWritingTestStageRepository.getInstance()
    );
    this.writingTestServiceMap = new Map([[Constants.PRACTICE_ROUTE, this.practiceWritingTestService]]);
  }

  @AsyncControllerHandle
  async getAllWritingTestsByTestIdOrUserId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const writingTestService: IWritingTestService = this.writingTestServiceMap.get(testId) || this.practiceWritingTestService;
    const result: PracticeWritingTestModel = await writingTestService.getAllWritingTestsByReleventId(
      testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId,
      page,
      limit
    );
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createWritingTest(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const writingTestService: IWritingTestService = this.writingTestServiceMap.get(testId) || this.practiceWritingTestService;
    const result: PracticeWritingTestModel = await writingTestService.createWritingTest(testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async updateWritingTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const writingTestId = req.params.writingTestId;
    const writingTestStageId = req.params.writingTestStageId;
    const operation = req.query.operation?.toString() || Constants.EMPTY_STR;
    const payLoad: UpdateWritingTestStage = req.body;
    const writingTestService: IWritingTestService = this.writingTestServiceMap.get(testId) || this.practiceWritingTestService;
    const updatedStages: Array<PracticeWritingTestStageModel> = await writingTestService.evaluateWritingTestStage(writingTestId, writingTestStageId, operation, payLoad);
    res.status(200).send(updatedStages);
  }

  @AsyncControllerHandle
  async getNextAvailableWritingTestStages(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const writingTestId = req.params.writingTestId;
    const writingTestService: IWritingTestService = this.writingTestServiceMap.get(testId) || this.practiceWritingTestService;
    const result: PracticeWritingTestStageModel = await writingTestService.getNextAvailableWritingTestStages(writingTestId);
    res.status(200).send(result);
  }
}

export default WritingTestController;
