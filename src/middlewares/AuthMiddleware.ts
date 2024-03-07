import { Response, NextFunction, Request } from "express";
import UserAuthorizer from "../services/auth/UserAuthorizer";
import CognitoUserAuthorizer from "../services/auth/CognitoUserAuthorizer";
import DummyAuthorizer from "../services/auth/DummyAuthorizer";

export const CognitoAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /* Replace dummyAuthorizer with following for PROD
  const userAuthorizer: UserAuthorizer = CognitoUserAuthorizer.GetInstance();
  */
  const dummyAuthorizer: UserAuthorizer = DummyAuthorizer.GetInstance();
  dummyAuthorizer.authorize(req, res, next);
};
