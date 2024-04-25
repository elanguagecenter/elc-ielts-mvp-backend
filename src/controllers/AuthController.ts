import CognitoSigninService from "../services/auth/signin/CognitoSigninService";
import ISigninService from "../services/auth/signin/ISigninService";
import { Response, Request, NextFunction } from "express";
import { CognitoChallangePayload, UserSigninPayload, UserSigninResponse } from "../utils/types/common/types";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";

class AuthController {
  private signInService: ISigninService;

  constructor() {
    this.signInService = CognitoSigninService.GetInstance();
  }

  @AsyncControllerHandle
  async signInStudent(req: Request, res: Response, next: NextFunction) {
    const payLoad: UserSigninPayload = req.body;
    const result: UserSigninResponse = await this.signInService.studentSignIn(payLoad);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async completeCognitoChallange(req: Request, res: Response, next: NextFunction) {
    const payLoad: CognitoChallangePayload = req.body;
    const result: UserSigninResponse = await this.signInService.completeCognitoChallange(payLoad);
    res.status(200).send(result);
  }
}

export default AuthController;
