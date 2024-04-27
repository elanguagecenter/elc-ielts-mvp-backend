import prisma from "../../config/DatabaseSource";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import { TestStatus } from "../../utils/types/common/common";
import { TestModel } from "../../utils/types/dbtypes/models";
import ITestRepository from "./ITestRepository";
import { TestSeachResult } from "../../utils/types/common/types";

class PrismaTestRepository implements ITestRepository {
  private static instance: PrismaTestRepository = new PrismaTestRepository();
  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(studentId: string, testName: string): Promise<TestModel> {
    return await prisma.test.create({
      data: {
        test_name: testName,
        current_status: TestStatus.TEST_CREATED,
        student_id: studentId,
      },
    });
  }

  @Handle
  async updateStatusById(testId: string, status: string): Promise<TestModel> {
    return await prisma.test.update({
      where: {
        test_id: testId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(testId: string): Promise<TestModel> {
    return await prisma.test
      .findUniqueOrThrow({
        where: {
          test_id: testId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Test not found for testId: ${testId}`);
      });
  }

  @Handle
  async getAllWithLimit(limit: number): Promise<Array<TestModel>> {
    return await prisma.test.findMany({
      take: limit,
    });
  }

  @Handle
  async seachByTestNameAndUserId(name: string, userId: string): Promise<Array<TestSeachResult>> {
    return await prisma.test.findMany({
      where: {
        student_id: userId,
        test_name: {
          contains: name.toLowerCase(),
          mode: "insensitive",
        },
      },
      select: {
        test_id: true,
        test_name: true,
      },
    });
  }
}

export default PrismaTestRepository;
