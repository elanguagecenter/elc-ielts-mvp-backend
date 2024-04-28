import prisma from "../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import { StudentResponse, TeacherResponse } from "../../utils/types/common/types";
import IUsersRepository from "./IUsersRepository";

class CommonUserRepository implements IUsersRepository {
  private static instance: IUsersRepository = new CommonUserRepository();

  static getInstance(): IUsersRepository {
    return this.instance;
  }
  private constructor() {}

  async getTeacherById(teacherId: string): Promise<TeacherResponse> {
    return await prisma.teacher
      .findUniqueOrThrow({
        where: {
          teacher_id: teacherId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Teacher not found for teacherId: ${teacherId}`);
      });
  }

  async getStudentById(studentId: string): Promise<StudentResponse> {
    return await prisma.student
      .findUniqueOrThrow({
        where: {
          student_id: studentId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Student not found for studentId: ${studentId}`);
      });
  }
}

export default CommonUserRepository;
