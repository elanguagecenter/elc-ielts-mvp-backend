import { Response, NextFunction, Request } from "express";
import UserAuthorizer from "../services/auth/tokenAuth/UserAuthorizer";
import CognitoUserAuthorizer from "../services/auth/tokenAuth/CognitoUserAuthorizer";
import DummyAuthorizer from "../services/auth/tokenAuth/DummyAuthorizer";

export const CognitoAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /* Replace dummyAuthorizer with following for PROD
  const userAuthorizer: UserAuthorizer = CognitoUserAuthorizer.GetInstance();
  */
  // const userAuthorizer: UserAuthorizer = DummyAuthorizer.GetInstance();
  const userAuthorizer: UserAuthorizer = CognitoUserAuthorizer.GetInstance();
  userAuthorizer.authorize(req, res, next);
};
