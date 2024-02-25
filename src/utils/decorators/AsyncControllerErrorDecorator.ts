import { NextFunction, Request, Response } from "express";

function AsyncControllerHandle(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await originalMethod.call(this, req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default AsyncControllerHandle;
