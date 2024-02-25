import prisma from "../../config/DatabaseSource";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import { TestStatusModel } from "../../utils/types/dbtypes/models";
import ITestStatusRepository from "./ITestStatusRepository";

class PrismaTestStatusRepository implements ITestStatusRepository {
  private static instance: PrismaTestStatusRepository = new PrismaTestStatusRepository();
  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(testId: string, status: string): Promise<TestStatusModel> {
    return await prisma.test_status.create({
      data: {
        status: status,
        test_id: testId,
      },
    });
  }

  @Handle
  async getStatusByTestId(testId: string): Promise<Array<TestStatusModel>> {
    return await prisma.test_status.findMany({
      where: {
        test_id: testId,
      },
    });
  }
}
