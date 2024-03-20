import { Response, Request, NextFunction } from "express";
import { StartStopSpeakingTestStage } from "../utils/types/test/IELTSTestTypes";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { Constants } from "../utils/types/common/constants";
import PrismaPracticeSpeakingTestRepository from "../repository/speakingTest/practice/PrismaPracticeSpeakingTestRepository";
import PrismaPraticeSpeakingTestStageRepository from "../repository/speakingTest/practice/PrismaPraticeSpeakingTestStageRepository";
import ChatGPTGeneratorService from "../services/testGen/ChatGPTGeneratorService";
import FSMediaRecorder from "../services/mediaRecorder/FSMediaRecorder";
import PracticeSpeakingTestService from "../services/test/speaking/PracticeSpeakingTestService";
import MockSpeakingTestService from "../services/test/speaking/MockSpeakingTestService";
import TestService from "../services/test/TestService";
import ISpeakingTestService from "../services/test/speaking/ISpeakingTestService";
import { PracticeSpeakingTestStageModel } from "../utils/types/dbtypes/models";

class SpeakingTestController {
  private speakingTestServiceMap: Map<string, ISpeakingTestService>;
  private practiceSpeakingTestService: ISpeakingTestService;
  private mockSpeakingTestService: ISpeakingTestService;

  constructor() {
    this.practiceSpeakingTestService = new PracticeSpeakingTestService(
      PrismaPracticeSpeakingTestRepository.getInstance(),
      PrismaPraticeSpeakingTestStageRepository.getInstance(),
      ChatGPTGeneratorService.getInstance(),
      FSMediaRecorder.getInstance()
    );
    this.mockSpeakingTestService = new MockSpeakingTestService(
      PrismaPracticeSpeakingTestRepository.getInstance(),
      PrismaPraticeSpeakingTestStageRepository.getInstance(),
      TestService.prismaTest,
      ChatGPTGeneratorService.getInstance(),
      FSMediaRecorder.getInstance()
    );
    this.speakingTestServiceMap = new Map([[Constants.PRACTICE_ROUTE, this.practiceSpeakingTestService]]);
  }

  @AsyncControllerHandle
  async createNewSpeakingTest(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const spekaingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result = await spekaingTestService.createSpeakingTest(testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getAllSpeakingTestsByTestIdOrUserId(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const spekaingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result = await spekaingTestService.getAllSpeakingTestsByReleventId(testId == Constants.PRACTICE_ROUTE ? req.userData.userId : testId, page, limit);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getExistingSpeakingStagesForSpeakingTestId(req: Request, res: Response) {
    const speakingTestId = req.params.speakingTestId;
    const testId = req.params.testId;
    const spekaingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result = await spekaingTestService.getAllSpeakingTestStages(speakingTestId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getSpecificExistingSpeakingStage(req: Request, res: Response) {
    const testId = req.params.testId;
    const stgNumber = req.params.stgNumber;
    const speakingTestId = req.params.speakingTestId;
    const spekaingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result = await spekaingTestService.getSpecificSpeakingTestStage(speakingTestId, stgNumber);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async updateSpeakingTestStage(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const speakingTestId = req.params.speakingTestId;
    const speakingTestStageId = req.params.stageId;
    const payLoad: StartStopSpeakingTestStage = req.body;
    const operation = req.query.operation?.toString() || Constants.EMPTY_STR;

    const spekaingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result = await spekaingTestService.updateSpeakingTestStage(speakingTestId, speakingTestStageId, operation, payLoad, req.userData.userId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getNextAvailableWritingTestStages(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const speakingTestId = req.params.speakingTestId;
    const speakingTestService: ISpeakingTestService = this.speakingTestServiceMap.get(testId) || this.mockSpeakingTestService;
    const result: Array<PracticeSpeakingTestStageModel> = await speakingTestService.getNextAvailableSpeakingTestStages(speakingTestId);
    res.status(200).send(result);
  }
}

export default SpeakingTestController;
