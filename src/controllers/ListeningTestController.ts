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
import { PracticeListeningTestModel, PracticeListeningTestStageModel } from "../utils/types/dbtypes/models";

class ListeningTestController {
  private listeningTestServiceMap: Map<string, IListeningTestService>;
  private practiceListeningTestService: IListeningTestService;

  constructor() {
    this.practiceListeningTestService = new PracticeListeningTestService(
      ChatGPTGeneratorService.getInstance(),
      OpenAIVoiceGeneratorService.getInstance(),
      FSFileService.getInstance(),
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
}

export default ListeningTestController;
