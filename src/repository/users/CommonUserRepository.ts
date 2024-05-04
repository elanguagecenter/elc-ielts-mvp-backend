import prisma from "../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import { OrgAdminResponse, StudentResponse, SuperAdminResponse, TeacherResponse } from "../../utils/types/common/types";
import IUsersRepository from "./IUsersRepository";

class CommonUserRepository implements IUsersRepository {
  private static instance: IUsersRepository = new CommonUserRepository();

  static getInstance(): IUsersRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
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

  @Handle
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

  @Handle
  async getTeachersWithFewestSpekaingTests(orgId: string): Promise<Array<TeacherResponse>> {
    return await prisma.teacher.findMany({
      orderBy: {
        practice_speaking_tests: {
          _count: "asc",
        },
      },
      where: {
        org_id: orgId,
      },
      take: 1,
    });
  }

  async getOrgAdminById(adminId: string): Promise<OrgAdminResponse> {
    return await prisma.admin
      .findUniqueOrThrow({
        where: {
          admin_id: adminId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Admin not found for adminId: ${adminId}`);
      });
  }

  async getSuperAdminById(superAdmin: string): Promise<SuperAdminResponse> {
    return await prisma.super_admin
      .findUniqueOrThrow({
        where: {
          super_admin_id: superAdmin,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`super Admin not found for superAdminId: ${superAdmin}`);
      });
  }
}

export default CommonUserRepository;
