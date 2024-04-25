import CommonUserService from "../services/userService/CommonUserService";
import IUserService from "../services/userService/IUserService";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { Response, Request, NextFunction } from "express";
import { Constants } from "../utils/types/common/constants";
import { UserReponse } from "../utils/types/common/types";
import CommonUserRepository from "../repository/users/CommonUserRepository";

class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = new CommonUserService(CommonUserRepository.getInstance());
  }

  @AsyncControllerHandle
  async getUser(req: Request, res: Response, next: NextFunction) {
    const type = req.query.type?.toString() || Constants.EMPTY_STR;
    const result: UserReponse = await this.userService.getUser(type, req.userData.userId);
    res.status(200).send(result);
  }
}

export default UserController;
