import {
  AdminAddUserToGroupCommand,
  AdminAddUserToGroupCommandInput,
  AdminAddUserToGroupCommandOutput,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import IUsersRepository from "../../repository/users/IUsersRepository";
import { CognitoUserGroups, GetAdminTypes, UserTypes } from "../../utils/types/common/common";
import { CreateUserPayload, OrgAdminResponse, UserDeletePayload, UserReponse } from "../../utils/types/common/types";
import CommonValidator from "../../utils/validators/CommonValidator";
import IUserService from "./IUserService";
import configs from "../../config/configs";
import cognitoClient from "../../config/CognitoConfig";
import IOrganizationRepository from "../../repository/organization/IOrganizationRepository";

class CommonUserService implements IUserService {
  private userRepository: IUsersRepository;
  private organizationRepository: IOrganizationRepository;
  private getSelfUserExecMap: Map<string, (id: string) => Promise<UserReponse>>;
  private getAllStudentsExecMap: Map<string, (id: string, page: number, limit: number) => Promise<Array<UserReponse>>>;
  private getAllTeacherExecMap: Map<string, (id: string, page: number, limit: number) => Promise<Array<UserReponse>>>;
  private createAdnDeleteUserPermissionLogicMap: Map<string, (userType: string) => boolean>;
  private userTypeCognitoGroupMap: Map<string, string>;
  private createUserExecMap: Map<string, (data: CreateUserPayload, userId: string) => Promise<UserReponse>>;
  private deleteUserExecMap: Map<string, (payLoad: UserDeletePayload) => Promise<UserReponse>>;

  constructor(userRepository: IUsersRepository, organizationRepository: IOrganizationRepository) {
    this.userRepository = userRepository;
    this.organizationRepository = organizationRepository;

    this.getSelfUserExecMap = new Map([
      [UserTypes.STUDENT, this.getStudentById.bind(this)],
      [UserTypes.TEACHER, this.getTeacherById.bind(this)],
      [UserTypes.ORG_ADMIN, this.getOrgAdminById.bind(this)],
      [UserTypes.SUPER_ADMIN, this.getSuperAdminById.bind(this)],
    ]);

    this.getAllStudentsExecMap = new Map([
      [UserTypes.STUDENT, () => Promise.reject("Student user doesn't have permission to get all users")],
      [UserTypes.TEACHER, () => Promise.reject("Teacher doesn't have permission to get all users")],
      [UserTypes.ORG_ADMIN, this.getAllStudentsByOrgAdmin.bind(this)],
      [UserTypes.SUPER_ADMIN, this.getAllStudentsByOrgId.bind(this)],
    ]);

    this.getAllTeacherExecMap = new Map([
      [UserTypes.STUDENT, () => Promise.reject("Student user doesn't have permission to get all users")],
      [UserTypes.TEACHER, () => Promise.reject("Teacher doesn't have permission to get all users")],
      [UserTypes.ORG_ADMIN, this.getAllTeachersByOrgAdmin.bind(this)],
      [UserTypes.SUPER_ADMIN, this.getAllTeachersByOrgId.bind(this)],
    ]);

    this.createAdnDeleteUserPermissionLogicMap = new Map([
      [UserTypes.SUPER_ADMIN, (userType: string) => userType === UserTypes.ORG_ADMIN],
      [UserTypes.ORG_ADMIN, (userType: string) => userType === UserTypes.STUDENT || userType === UserTypes.TEACHER],
    ]);

    this.userTypeCognitoGroupMap = new Map([
      [UserTypes.STUDENT, CognitoUserGroups.STUDENT_GROUP],
      [UserTypes.TEACHER, CognitoUserGroups.TEACHER_GROUP],
      [UserTypes.ORG_ADMIN, CognitoUserGroups.ORG_ADMIN_GROUP],
    ]);

    this.createUserExecMap = new Map([
      [UserTypes.ORG_ADMIN, this.userRepository.createOrgAdmin.bind(this.userRepository)],
      [UserTypes.TEACHER, this.userRepository.createTeacher.bind(this.userRepository)],
      [UserTypes.STUDENT, this.userRepository.createStudent.bind(this.userRepository)],
    ]);

    this.deleteUserExecMap = new Map([
      [UserTypes.ORG_ADMIN, this.userRepository.deleteOrgAdminById.bind(this.userRepository)],
      [UserTypes.TEACHER, this.userRepository.deleteTeacherById.bind(this.userRepository)],
      [UserTypes.STUDENT, this.userRepository.deleteStudentById.bind(this.userRepository)],
    ]);
  }

  async createUser(userTypeInToken: string, userType: string, userId: string, payload: CreateUserPayload): Promise<UserReponse> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, [UserTypes.ORG_ADMIN, UserTypes.SUPER_ADMIN], "Admin Type");
    CommonValidator.validateParamInADefinedValues(userType, [UserTypes.ORG_ADMIN, UserTypes.TEACHER, UserTypes.STUDENT], "User Type");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User ID");

    const permissionVerifierFunc: (userType: string) => boolean = this.createAdnDeleteUserPermissionLogicMap.get(userTypeInToken) || (() => false);
    CommonValidator.validateTrueValue(permissionVerifierFunc(userType), `${userTypeInToken} user doesn't have permission to create the requested user type`);

    this.validateCreateUserPayload(payload);
    if (userType != UserTypes.ORG_ADMIN) {
      const orgAdmin: UserReponse = await this.getUser(userTypeInToken, userId);
      payload.org_id = orgAdmin.org_id || "";
      CommonValidator.validateNotEmptyOrBlankString(payload.org_id, "Org admin");
    }

    const generatedUserId: string = await this.createUserInCognito(payload);
    CommonValidator.validateNotEmptyOrBlankString(generatedUserId, "Generated UserId");
    this.addUserToCognitoGroup(payload.email, userType);

    const userCreateDbFunc: (data: CreateUserPayload, userId: string) => Promise<UserReponse> =
      this.createUserExecMap.get(userType) || ((data: CreateUserPayload, userId: string) => Promise.reject(new ELCIELTSInternalError("Undefined function for create user")));
    return await userCreateDbFunc(payload, generatedUserId);
  }

  async deleteUser(userTypeInToken: string, userId: string, adminUserId: string, userType: string): Promise<UserReponse> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, [UserTypes.ORG_ADMIN, UserTypes.SUPER_ADMIN], "Admin Type");
    CommonValidator.validateNotEmptyOrBlankString(userId, "User ID");
    CommonValidator.validateNotEmptyOrBlankString(adminUserId, "Admin ID");

    const permissionVerifierFunc: (userType: string) => boolean = this.createAdnDeleteUserPermissionLogicMap.get(userTypeInToken) || (() => false);
    CommonValidator.validateTrueValue(permissionVerifierFunc(userType), `${userTypeInToken} user doesn't have permission to delete the user type`);

    const deletePayload: UserDeletePayload = {
      userId: userId,
    };

    if (userType != UserTypes.ORG_ADMIN) {
      const orgAdmin: UserReponse = await this.getUser(userTypeInToken, adminUserId);
      deletePayload.orgId = orgAdmin.org_id || "";
    }

    const userDeleteDbFunc: (deletePayload: UserDeletePayload) => Promise<UserReponse> =
      this.deleteUserExecMap.get(userType) || ((deletePayload: UserDeletePayload) => Promise.reject(new ELCIELTSInternalError("Undefined function for delete user")));
    const user: UserReponse = await userDeleteDbFunc(deletePayload);
    await this.deleteUserInCognito(user.email);
    return user;
  }

  async getUser(userTypeInToken: string, userId: string): Promise<UserReponse> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, Object.values(UserTypes), "User Type");
    const func: (id: string) => Promise<UserReponse> =
      this.getSelfUserExecMap.get(userTypeInToken) || ((id: string) => Promise.reject(new ELCIELTSInternalError("Undefined function for get user")));
    return await func(userId);
  }

  async getAllAdmins(page: string, limit: string): Promise<Array<UserReponse>> {
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    CommonValidator.validateLowerLimit(pageNum, 1, "Page");
    CommonValidator.validateLowerLimit(limitNum, 0, "Limit");
    return await this.userRepository.getAllAdmins(pageNum, limitNum);
  }

  async getFreshAdmins(): Promise<Array<UserReponse>> {
    return await this.userRepository.getFreshAdmins();
  }

  async getStudents(userTypeInToken: string, orgId: string, userId: string, page: string, limit: string): Promise<Array<UserReponse>> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, Object.values(UserTypes), "User Type");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    CommonValidator.validateLowerLimit(pageNum, 1, "Page");
    CommonValidator.validateLowerLimit(limitNum, 0, "Limit");
    const func: (id: string, page: number, limit: number) => Promise<Array<UserReponse>> =
      this.getAllStudentsExecMap.get(userTypeInToken) ||
      ((id: string, page: number, limit: number) => Promise.reject(new ELCIELTSInternalError("Undefined function for get all students")));

    return await func(userTypeInToken === UserTypes.ORG_ADMIN ? userId : orgId, pageNum, limitNum);
  }
  async getTeachers(userTypeInToken: string, orgId: string, userId: string, page: string, limit: string): Promise<Array<UserReponse>> {
    CommonValidator.validateParamInADefinedValues(userTypeInToken, Object.values(UserTypes), "User Type");
    const pageNum: number = CommonValidator.validatePositiveNumberString(page, "Page");
    const limitNum: number = CommonValidator.validatePositiveNumberString(limit, "Limit");
    const func: (id: string, page: number, limit: number) => Promise<Array<UserReponse>> =
      this.getAllTeacherExecMap.get(userTypeInToken) ||
      ((id: string, page: number, limit: number) => Promise.reject(new ELCIELTSInternalError("Undefined function for get all teachers")));
    return await func(userTypeInToken === UserTypes.ORG_ADMIN ? userId : orgId, pageNum, limitNum);
  }

  private validateCreateUserPayload(payload: CreateUserPayload) {
    CommonValidator.validateNotEmptyOrBlankString(payload.email, "Email");
    CommonValidator.validateNotEmptyOrBlankString(payload.mobile_number, "Mobile");
    CommonValidator.validateNotEmptyOrBlankString(payload.name, "Name");
  }

  private async deleteUserInCognito(userName: string): Promise<AdminDeleteUserCommandOutput> {
    const input: AdminDeleteUserCommandInput = {
      UserPoolId: configs.cognito_pool_id,
      Username: userName,
    };
    const createUserCommand: AdminDeleteUserCommand = new AdminDeleteUserCommand(input);
    return await cognitoClient.send(createUserCommand);
  }

  private async createUserInCognito(payload: CreateUserPayload): Promise<string> {
    const input: AdminCreateUserCommandInput = {
      UserPoolId: configs.cognito_pool_id,
      Username: payload.email,
      UserAttributes: [
        { Name: "email", Value: payload.email },
        { Name: "custom:userId", Value: crypto.randomUUID() },
      ],
    };
    const createUserCommand: AdminCreateUserCommand = new AdminCreateUserCommand(input);
    const response: AdminCreateUserCommandOutput = await cognitoClient.send(createUserCommand);
    return response.User?.Attributes?.filter((attribute) => attribute.Name === "custom:userId").map((attribute) => attribute.Value)[0] || "";
  }

  private async addUserToCognitoGroup(email: string, userType: string) {
    const input: AdminAddUserToGroupCommandInput = {
      GroupName: this.userTypeCognitoGroupMap.get(userType),
      UserPoolId: configs.cognito_pool_id,
      Username: email,
    };
    const command: AdminAddUserToGroupCommand = new AdminAddUserToGroupCommand(input);
    await cognitoClient.send(command);
  }

  private async getStudentById(studentId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(studentId, "Student ID");
    return this.userRepository.getStudentById(studentId);
  }

  private async getTeacherById(teacherId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(teacherId, "Teacher ID");
    return this.userRepository.getTeacherById(teacherId);
  }

  private async getSuperAdminById(superAdminId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(superAdminId, "Super Admin ID");
    return this.userRepository.getSuperAdminById(superAdminId);
  }

  private async getOrgAdminById(orgAdminId: string): Promise<UserReponse> {
    CommonValidator.validateNotEmptyOrBlankString(orgAdminId, "Org Admin ID");
    return this.userRepository.getOrgAdminById(orgAdminId);
  }

  private async getAllStudentsByOrgAdmin(orgAdminId: string, pageNum: number, limitNum: number): Promise<Array<UserReponse>> {
    console.log(orgAdminId);
    CommonValidator.validateNotEmptyOrBlankString(orgAdminId, "Org Admin ID");
    return await this.userRepository.getAllStudentsByOrgAdmin(orgAdminId, pageNum, limitNum);
  }

  private async getAllStudentsByOrgId(orgId: string, pageNum: number, limitNum: number): Promise<Array<UserReponse>> {
    CommonValidator.validateNotEmptyOrBlankString(orgId, "Org ID");
    return await this.userRepository.getAllStudentsByOrg(orgId, pageNum, limitNum);
  }

  private async getAllTeachersByOrgAdmin(orgAdminId: string, pageNum: number, limitNum: number): Promise<Array<UserReponse>> {
    CommonValidator.validateNotEmptyOrBlankString(orgAdminId, "Org Admin ID");
    return await this.userRepository.getAllTeachersByOrgAdmin(orgAdminId, pageNum, limitNum);
  }

  private async getAllTeachersByOrgId(orgId: string, pageNum: number, limitNum: number): Promise<Array<UserReponse>> {
    CommonValidator.validateNotEmptyOrBlankString(orgId, "Org ID");
    return await this.userRepository.getAllTeachersByOrg(orgId, pageNum, limitNum);
  }
}

export default CommonUserService;
