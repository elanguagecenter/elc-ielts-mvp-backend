import { UserReponse } from "../../utils/types/common/types";

interface IUserService {
  getUser(userTypeInToken: string, userId: string): Promise<UserReponse>;
}

export default IUserService;
