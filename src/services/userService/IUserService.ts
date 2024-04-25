import { UserReponse } from "../../utils/types/common/types";

interface IUserService {
  getUser(type: string, userId: string): Promise<UserReponse>;
}

export default IUserService;
