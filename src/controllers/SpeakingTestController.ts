import SpeakingTestService, { ISpeakingTestService } from "../services/test/SpeakingTestService";
import { Response, Request } from "express";
import { UpdateSpeakingTestQuestion } from "../utils/types/test/IELTSTestTypes";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";

class SpeakingTestController {
  private speakingTestService: ISpeakingTestService;
  constructor() {
    this.speakingTestService = SpeakingTestService.prismaSpeakingTest;
  }

  @AsyncControllerHandle
  async createNewSpeakingTest(req: Request, res: Response) {
    const testId = req.params.testId;
    const result = await this.speakingTestService.createSpeakingTest(testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getExistingSpeakingStages(req: Request, res: Response) {
    const testId = req.params.testId;
    const result = await this.speakingTestService.getAllSpeakingTestStages(testId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getSpecificExistingSpeakingStage(req: Request, res: Response) {
    const testId = req.params.testId;
    const stgNumber = req.params.stgNumber;
    const result = await this.speakingTestService.getSpecificSpeakingTestStage(testId, stgNumber);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createNewSpeakingStage(req: Request, res: Response) {
    const testId = req.params.testId;
    const stgNumber = req.params.stgNumber;
    const result = await this.speakingTestService.createSpeakingTestStage(testId, stgNumber);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getSpecificSpeakingTestQuestion(req: Request, res: Response) {
    const testId = req.params.testId;
    const stgNumber = req.params.stgNumber;
    const qid = req.params.qid;
    const result = await this.speakingTestService.getSpeakingQuestion(testId, stgNumber, qid);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async updateSpeakingTestQuestion(req: Request, res: Response) {
    const testId = req.params.testId;
    const stgNumber = req.params.stgNumber;
    const qid = req.params.qid;
    const payLoad: UpdateSpeakingTestQuestion = req.body;
    const result = await this.speakingTestService.updateSpeakingStageQuestion(testId, stgNumber, qid, payLoad);
    res.status(200).send(result);
  }
}

export default SpeakingTestController;
