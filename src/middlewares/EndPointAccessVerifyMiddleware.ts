import { Response, NextFunction, Request } from "express";
import { UserTypes } from "../utils/types/common/common";
import ELCIELTSInsufficientPermissionError from "../exception/ELCIELTSInsufficientPermissionError";

const StudentAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.userType && req.userData.userType === UserTypes.STUDENT) {
    next();
  } else {
    next(new ELCIELTSInsufficientPermissionError(`${req.userData.userType} user type is not authorize to access requested endpoint`));
  }
};

const TeacherAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.userType && req.userData.userType === UserTypes.TEACHER) {
    next();
  } else {
    next(new ELCIELTSInsufficientPermissionError(`${req.userData.userType} user type is not authorize to access requested endpoint`));
  }
};

export default {
  StudentAccess: StudentAccess,
  TeacherAccess: TeacherAccess,
};
