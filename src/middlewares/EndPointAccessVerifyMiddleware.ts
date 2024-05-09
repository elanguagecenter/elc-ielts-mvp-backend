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

const OrgAdminAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.userType && req.userData.userType === UserTypes.ORG_ADMIN) {
    next();
  } else {
    next(new ELCIELTSInsufficientPermissionError(`${req.userData.userType} user type is not authorize to access requested endpoint`));
  }
};

const SuperAdminAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.userType && req.userData.userType === UserTypes.SUPER_ADMIN) {
    next();
  } else {
    next(new ELCIELTSInsufficientPermissionError(`${req.userData.userType} user type is not authorize to access requested endpoint`));
  }
};

const allAdminAccess = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.userType && (req.userData.userType === UserTypes.SUPER_ADMIN || req.userData.userType === UserTypes.ORG_ADMIN)) {
    next();
  } else {
    next(new ELCIELTSInsufficientPermissionError(`${req.userData.userType} user type is not authorize to access requested endpoint`));
  }
};

export default {
  StudentAccess: StudentAccess,
  TeacherAccess: TeacherAccess,
  OrgAdminAccess: OrgAdminAccess,
  SuperAdminAccess: SuperAdminAccess,
  allAdminAccess: allAdminAccess,
};
