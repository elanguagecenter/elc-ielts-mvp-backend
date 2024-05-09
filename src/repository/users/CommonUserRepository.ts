import prisma from "../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import { CreateUserPayload, OrgAdminResponse, StudentResponse, SuperAdminResponse, TeacherResponse, UserDeletePayload, UserReponse } from "../../utils/types/common/types";
import IUsersRepository from "./IUsersRepository";

class CommonUserRepository implements IUsersRepository {
  private static instance: IUsersRepository = new CommonUserRepository();

  static getInstance(): IUsersRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async createStudent(data: CreateUserPayload, userId: string): Promise<UserReponse> {
    return await prisma.student.create({
      data: {
        id: userId,
        email: data.email,
        name: data.name,
        mobile_number: data.mobile_number,
        org_id: data.org_id,
      },
    });
  }

  @Handle
  async createTeacher(data: CreateUserPayload, userId: string): Promise<UserReponse> {
    return await prisma.teacher.create({
      data: {
        id: userId,
        email: data.email,
        name: data.name,
        mobile_number: data.mobile_number,
        org_id: data.org_id,
      },
    });
  }

  @Handle
  async createOrgAdmin(data: CreateUserPayload, userId: string): Promise<UserReponse> {
    return await prisma.admin.create({
      data: {
        id: userId,
        email: data.email,
        name: data.name,
        mobile_number: data.mobile_number,
      },
    });
  }

  async deleteStudentById(payLoad: UserDeletePayload): Promise<UserReponse> {
    return await prisma.student.delete({
      where: {
        id: payLoad.userId,
        org_id: payLoad.orgId,
      },
    });
  }

  async deleteTeacherById(payLoad: UserDeletePayload): Promise<UserReponse> {
    return await prisma.teacher.delete({
      where: {
        id: payLoad.userId,
        org_id: payLoad.orgId,
      },
    });
  }

  async deleteOrgAdminById(payLoad: UserDeletePayload): Promise<UserReponse> {
    return await prisma.admin.delete({
      where: {
        id: payLoad.userId,
      },
    });
  }

  @Handle
  async getTeacherById(teacherId: string): Promise<TeacherResponse> {
    return await prisma.teacher
      .findUniqueOrThrow({
        where: {
          id: teacherId,
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
          id: studentId,
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

  @Handle
  async getOrgAdminById(adminId: string): Promise<OrgAdminResponse> {
    return await prisma.admin
      .findUniqueOrThrow({
        where: {
          id: adminId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Admin not found for adminId: ${adminId}`);
      });
  }

  @Handle
  async getSuperAdminById(superAdmin: string): Promise<SuperAdminResponse> {
    return await prisma.super_admin
      .findUniqueOrThrow({
        where: {
          id: superAdmin,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`super Admin not found for superAdminId: ${superAdmin}`);
      });
  }

  @Handle
  async getAllStudentsByOrgAdmin(adminId: string, page: number, limit: number): Promise<Array<StudentResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.student.findMany({
      where: {
        org: {
          admin: {
            id: adminId,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  @Handle
  async getAllStudentsByOrg(orgId: string, page: number, limit: number): Promise<Array<StudentResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.student.findMany({
      where: {
        org_id: orgId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  @Handle
  async getAllTeachersByOrgAdmin(adminId: string, page: number, limit: number): Promise<Array<TeacherResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.teacher.findMany({
      where: {
        org: {
          admin: {
            id: adminId,
          },
        },
      },
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  @Handle
  async getAllTeachersByOrg(orgId: string, page: number, limit: number): Promise<Array<TeacherResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.teacher.findMany({
      where: {
        org_id: orgId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  async getAllAdmins(page: number, limit: number): Promise<Array<OrgAdminResponse>> {
    const skip = (page - 1) * limit;
    return await prisma.admin.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  async getFreshAdmins(): Promise<Array<OrgAdminResponse>> {
    return await prisma.admin.findMany({
      where: {
        org_id: null,
      },
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }
}

export default CommonUserRepository;
