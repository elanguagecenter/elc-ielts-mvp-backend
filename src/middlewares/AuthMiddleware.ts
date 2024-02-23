import { Response, NextFunction, Request } from "express";
import UserAuthorizer from "../services/auth/UserAuthorizer";
import CognitoUserAuthorizer from "../services/auth/CognitoUserAuthorizer";

export const CognitoAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAuthorizer: UserAuthorizer = CognitoUserAuthorizer.GetInstance();
  userAuthorizer.authorize(req, res, next);
};
