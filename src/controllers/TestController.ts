import { Response, Request } from "express";
import TestService from "../services/test/TestService";
import { CreateTest } from "../types/test/IELTSTestTypes";

export const createNewTest = (req: Request, res: Response) => {
  const payLoad: CreateTest = req.body;
  const result = TestService.prismaTest.createTest(payLoad);
  res.status(200).send(result);
};

export const getSpecificTest = (req: Request, res: Response) => {
  const testId = req.params.testId;
  const result = TestService.prismaTest.getTest(testId);
  res.status(200).send(result);
};
