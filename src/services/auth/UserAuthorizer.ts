import { NextFunction, Response, Request } from "express";

interface UserAuthorizer {
  authorize(req: Request, res: Response, next: NextFunction): void;
}

export default UserAuthorizer;
