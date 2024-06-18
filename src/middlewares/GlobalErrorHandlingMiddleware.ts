import { Response, NextFunction, Request } from "express";
import ELCIELTSInternalError from "../exception/ELCIELTSInternalError";

export const SimpleErrorHandler = (error: ELCIELTSInternalError, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    status: 500,
    message: error.message,
  });
};
