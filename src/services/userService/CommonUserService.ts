import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import IUsersRepository from "../../repository/users/IUsersRepository";
import { UserTypes } from "../../utils/types/common/common";
import { StudentResponse, UserReponse } from "../../utils/types/common/types";
import CommonValidator from "../../utils/validators/CommonValidator";
import IUserService from "./IUserService";

class CommonUserService implements IUserService {
  private userRepository: IUsersRepository;
  private getUserExecMap: Map<string, (id: string) => Promise<UserReponse>>;

  constructor(userRepository: IUsersRepository) {
    this.userRepository = userRepository;
    this.getUserExecMap = new Map([[UserTypes.STUDENT, this.getStudentById.bind(this)]]);
  }

  async getUser(type: string, userId: string): Promise<UserReponse> {
    CommonValidator.validateParamInADefinedValues(type, Object.values(UserTypes), "User Type");
    const func: (id: string) => Promise<UserReponse> =
      this.getUserExecMap.get(type) || ((id: string) => Promise.reject(new ELCIELTSInternalError("Undefined function for get user")));
    return await func(userId);
  }

  private async getStudentById(studentId: string): Promise<StudentResponse> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    return this.userRepository.getStudentById(studentId);
  }
}

export default CommonUserService;
