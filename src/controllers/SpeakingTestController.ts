import SpeakingTestService from "../services/test/SpeakingTestService";
import { Response, Request } from "express";
import { CreateSpekingTest, CreateSpekingTestStage, UpdateSpeakingTestQuestion } from "../types/test/IELTSTestTypes";

export const createNewSpeakingTest = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const payLoad: CreateSpekingTest = req.body;
  const result = SpeakingTestService.prismaSpeakingTest.createSpeakingTest(testId, payLoad);
  res.status(200).send(result);
};

export const getExistingSpeakingStages = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const result = SpeakingTestService.prismaSpeakingTest.getAllSpeakingTestStages(testId);
  res.status(200).send(result);
};

export const getSpecificExistingSpeakingStage = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const stgNumber = req.params.stgNumber;
  const result = SpeakingTestService.prismaSpeakingTest.getSpecificTestStage(testId, stgNumber);
  res.status(200).send(result);
};

export const createNewSpeakingStage = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const stgNumber = req.params.stgNumber;
  const payLoad: CreateSpekingTestStage = req.body;
  const result = SpeakingTestService.prismaSpeakingTest.createSpeakingTestStage(testId, stgNumber, payLoad);
  res.status(200).send(result);
};

export const getSpecificSpeakingTestQuestion = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const stgNumber = req.params.stgNumber;
  const qid = req.params.qid;
  const result = SpeakingTestService.prismaSpeakingTest.getSpeakingQuestion(testId, stgNumber, qid);
  res.status(200).send(result);
};

export const updateSpeakingTestQuestion = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const stgNumber = req.params.stgNumber;
  const qid = req.params.qid;
  const payLoad: UpdateSpeakingTestQuestion = req.body;
  const result = SpeakingTestService.prismaSpeakingTest.updateSpeakingQuestion(testId, stgNumber, qid, payLoad);
  res.status(200).send(result);
};
