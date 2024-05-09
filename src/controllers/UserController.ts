import CommonUserService from "../services/userService/CommonUserService";
import IUserService from "../services/userService/IUserService";
import AsyncControllerHandle from "../utils/decorators/AsyncControllerErrorDecorator";
import { Response, Request, NextFunction } from "express";
import { Constants } from "../utils/types/common/constants";
import { CreateUserPayload, UserReponse } from "../utils/types/common/types";
import CommonUserRepository from "../repository/users/CommonUserRepository";
import OrganizationRepository from "../repository/organization/OrganizationRepository";
import { UserTypes } from "../utils/types/common/common";

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
  async deleteOrgAdmin(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.adminId;
    const result: UserReponse = await this.userService.deleteUser(req.userData.userType, userId, req.userData.userId, UserTypes.ORG_ADMIN);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async deleteTeacher(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.teacherId;
    const result: UserReponse = await this.userService.deleteUser(req.userData.userType, userId, req.userData.userId, UserTypes.TEACHER);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async deleteStudent(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.studentId;
    const result: UserReponse = await this.userService.deleteUser(req.userData.userType, userId, req.userData.userId, UserTypes.STUDENT);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const result: Array<UserReponse> = await this.userService.getAllAdmins(page, limit);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getFreshAdmins(req: Request, res: Response, next: NextFunction) {
    const result: Array<UserReponse> = await this.userService.getFreshAdmins();
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getStudents(req: Request, res: Response, next: NextFunction) {
    const orgId = req.query.orgId?.toString() || Constants.EMPTY_STR;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const result: Array<UserReponse> = await this.userService.getStudents(req.userData.userType, orgId, req.userData.userId, page, limit);
    res.status(200).send(result);
  }

  @AsyncControllerHandle
  async getTeachers(req: Request, res: Response, next: NextFunction) {
    const orgId = req.query.orgId?.toString() || Constants.EMPTY_STR;
    const limit = req.query.limit?.toString() || Constants.DEFAULT_PAGE_LIMIT;
    const page = req.query.page?.toString() || Constants.DEAULT_PAGE_NUM;
    const result: Array<UserReponse> = await this.userService.getTeachers(req.userData.userType, orgId, req.userData.userId, page, limit);
    res.status(200).send(result);
  }
}

export default UserController;
