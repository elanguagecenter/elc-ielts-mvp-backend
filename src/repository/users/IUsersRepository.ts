import { StudentResponse, TeacherResponse } from "../../utils/types/common/types";

interface IUsersRepository {
  getTeacherById(teacherId: string): Promise<TeacherResponse>;
  getStudentById(studentId: string): Promise<StudentResponse>;
  getTeachersWithFewestSpekaingTests(orgId: string): Promise<Array<TeacherResponse>>;
}

export default IUsersRepository;
