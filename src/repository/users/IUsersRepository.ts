import { StudentResponse, TeacherResponse } from "../../utils/types/common/types";

interface IUsersRepository {
  getTeacherById(teacherId: string): Promise<TeacherResponse>;
  getStudentById(studentId: string): Promise<StudentResponse>;
}

export default IUsersRepository;
