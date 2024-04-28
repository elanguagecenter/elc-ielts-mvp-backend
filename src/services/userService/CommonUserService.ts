import ELCIELTSInsufficientPermissionError from "../../exception/ELCIELTSInsufficientPermissionError";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import IUsersRepository from "../../repository/users/IUsersRepository";
import { UserTypes } from "../../utils/types/common/common";
import { StudentResponse, TeacherResponse, UserReponse } from "../../utils/types/common/types";
import CommonValidator from "../../utils/validators/CommonValidator";
import IUserService from "./IUserService";

class CommonUserService implements IUserService {
  private userRepository: IUsersRepository;
  private getUserExecMap: Map<string, (id: string) => Promise<UserReponse>>;

  constructor(userRepository: IUsersRepository) {
    this.userRepository = userRepository;
    this.getUserExecMap = new Map([
      [UserTypes.STUDENT, this.getStudentById.bind(this)],
      [UserTypes.TEACHER, this.getTeacherById.bind(this)],
    ]);
  }

  async getUser(userTypeInToken: string, userId: string): Promise<UserReponse> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, Object.values(UserTypes), "User Type");
    const func: (id: string) => Promise<UserReponse> =
      this.getUserExecMap.get(userTypeInToken) || ((id: string) => Promise.reject(new ELCIELTSInternalError("Undefined function for get user")));
    return await func(userId);
  }

  private async getStudentById(studentId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    return this.userRepository.getStudentById(studentId);
  }

  private async getTeacherById(teacherId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(teacherId, "Teacher ID");
    return this.userRepository.getTeacherById(teacherId);
  }
}

export default CommonUserService;
