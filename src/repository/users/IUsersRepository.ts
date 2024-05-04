import { OrgAdminResponse, StudentResponse, SuperAdminResponse, TeacherResponse } from "../../utils/types/common/types";

interface IUsersRepository {
  getTeacherById(teacherId: string): Promise<TeacherResponse>;
  getStudentById(studentId: string): Promise<StudentResponse>;
  getOrgAdminById(adminId: string): Promise<OrgAdminResponse>;
  getSuperAdminById(superAdmin: string): Promise<SuperAdminResponse>;
  getTeachersWithFewestSpekaingTests(orgId: string): Promise<Array<TeacherResponse>>;
}

export default IUsersRepository;
