import { CreateUserPayload, OrgAdminResponse, StudentResponse, SuperAdminResponse, TeacherResponse, UserReponse } from "../../utils/types/common/types";

interface IUsersRepository {
  getTeacherById(teacherId: string): Promise<TeacherResponse>;
  getStudentById(studentId: string): Promise<StudentResponse>;
  getOrgAdminById(adminId: string): Promise<OrgAdminResponse>;
  getSuperAdminById(superAdmin: string): Promise<SuperAdminResponse>;
  getTeachersWithFewestSpekaingTests(orgId: string): Promise<Array<TeacherResponse>>;
  getAllStudentsByOrgAdmin(adminId: string, page: number, limit: number): Promise<Array<StudentResponse>>;
  getAllStudentsByOrg(orgId: string, page: number, limit: number): Promise<Array<StudentResponse>>;
  getAllTeachersByOrgAdmin(adminId: string, page: number, limit: number): Promise<Array<TeacherResponse>>;
  getAllTeachersByOrg(orgId: string, page: number, limit: number): Promise<Array<TeacherResponse>>;
  createStudent(data: CreateUserPayload, userId: string): Promise<UserReponse>;
  createTeacher(data: CreateUserPayload, userId: string): Promise<UserReponse>;
  createOrgAdmin(data: CreateUserPayload, userId: string): Promise<UserReponse>;
  getAllAdmins(page: number, limit: number): Promise<Array<UserReponse>>;
  getFreshAdmins(): Promise<Array<UserReponse>>;
}

export default IUsersRepository;
