import { CreateUserPayload, UserReponse } from "../../utils/types/common/types";

interface IUserService {
  getUser(userTypeInToken: string, userId: string): Promise<UserReponse>;
  createUser(userTypeInToken: string, userType: string, userId: string, payload: CreateUserPayload): Promise<UserReponse>;
  getStudents(userTypeInToken: string, orgId: string, userId: string): Promise<Array<UserReponse>>;
  getTeachers(userTypeInToken: string, orgId: string, userId: string): Promise<Array<UserReponse>>;
}

export default IUserService;
