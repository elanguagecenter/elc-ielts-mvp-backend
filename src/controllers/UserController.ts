import CommonUserService from "../services/userService/CommonUserService";
import IUserService from "../services/userService/IUserService";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { Response, Request, NextFunction } from "express";
import { Constants } from "../utils/types/common/constants";
import { CreateUserPayload, UserReponse } from "../utils/types/common/types";
import CommonUserRepository from "../repository/users/CommonUserRepository";
import OrganizationRepository from "../repository/organization/OrganizationRepository";

class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = new CommonUserService(CommonUserRepository.getInstance(), OrganizationRepository.getInstance());
  }

  @AsyncControllerHandle
  async getUser(req: Request, res: Response, next: NextFunction) {
    const result: UserReponse = await this.userService.getUser(req.userData.userType, req.userData.userId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async createUser(req: Request, res: Response, next: NextFunction) {
    const userType = req.query.userType?.toString() || Constants.EMPTY_STR;
    const payload: CreateUserPayload = req.body;
    const result: UserReponse = await this.userService.createUser(req.userData.userType, userType, req.userData.userId, payload);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getStudents(req: Request, res: Response, next: NextFunction) {
    const orgId = req.query.orgId?.toString() || Constants.EMPTY_STR;
    const result: UserReponse = await this.userService.getStudents(req.userData.userType, orgId, req.userData.userId);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getTeachers(req: Request, res: Response, next: NextFunction) {
    const orgId = req.query.orgId?.toString() || Constants.EMPTY_STR;
    const result: UserReponse = await this.userService.getTeachers(req.userData.userType, orgId, req.userData.userId);
    res.status(200).send(result);
  }
}

export default UserController;
