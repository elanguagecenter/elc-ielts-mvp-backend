import { Response, Request, NextFunction } from "express";
import TestService from "../services/test/TestService";
import { CreateTest } from "../utils/types/test/IELTSTestTypes";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";

class TestController {
  @AsyncControllerHandle
  async createNewTest(req: Request, res: Response, next: NextFunction) {
    const payLoad: CreateTest = req.body;
    const userId = req.userData.userId;
    const result = await TestService.prismaTest.createTest(userId, payLoad);
    res.status(200).json(result);
  }

  async getMultipleTests(req: Request, res: Response, next: NextFunction) {
    const limit = req.query.limit;
  }

  @AsyncControllerHandle
  async getSpecificTest(req: Request, res: Response, next: NextFunction) {
    const testId = req.params.testId;
    const result = await TestService.prismaTest.getTest(testId);
    res.status(200).json(result);
  }

  @AsyncControllerHandle
  async seachTestByNameForStudent(req: Request, res: Response, next: NextFunction) {
    const testName: string | undefined = req.query.name?.toString();
    const result = await TestService.prismaTest.seachTestByNameForStudent(req.userData.userId, testName);
    res.status(200).json(result);
  }
}

export default TestController;
