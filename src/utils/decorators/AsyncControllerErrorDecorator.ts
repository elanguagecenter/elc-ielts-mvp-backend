import { NextFunction, Request, Response } from "express";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";

function AsyncControllerHandle(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await originalMethod.call(this, req, res, next);
    } catch (err) {
      console.error(err);
      if (err instanceof ELCIELTSInternalError) {
        next(err);
      } else {
        next(new ELCIELTSInternalError("Internal Error"));
      }
    }
  };
}

export default AsyncControllerHandle;
