import { StudentResponse } from "../../utils/types/common/types";

interface IUsersRepository {
  getStudentById(studentId: string): Promise<StudentResponse>;
}

export default IUsersRepository;
