import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import UserAuthorizer from "./UserAuthorizer";

class DummyAuthorizer implements UserAuthorizer {
  private static instance = new DummyAuthorizer();
  private constructor() {}

  static GetInstance(): DummyAuthorizer {
    return this.instance;
  }

  authorize(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    req.userData = {
      userId: "de5718fe-ebe8-479a-890f-d62392c2a6c1",
      email: "jayamaljayamaha2@gmail.com",
      cognitoName: "JJ",
    };
    next();
  }
}

export default DummyAuthorizer;
