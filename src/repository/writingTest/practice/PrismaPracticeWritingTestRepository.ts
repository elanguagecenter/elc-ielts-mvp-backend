import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStatus } from "../../../utils/types/common/common";
import { PracticeWritingTestModel } from "../../../utils/types/dbtypes/models";
import IPracticeWritingTestRepository from "./IPracticeWritingTestRepository";

class PrismaPracticeWritingTestRepository implements IPracticeWritingTestRepository {
  private static instance: PrismaPracticeWritingTestRepository = new PrismaPracticeWritingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async createPracticeWritingTest(studentId: string): Promise<PracticeWritingTestModel> {
    return await prisma.practice_writing_test.create({
      data: {
        student_id: studentId,
        current_status: TestStatus.WRITING_TEST_CREATED,
      },
    });
  }

  @Handle
  async getAllByStudentId(studentId: string, page: number, limit: number): Promise<Array<PracticeWritingTestModel>> {
    const skip = (page - 1) * limit;
    return await prisma.practice_writing_test.findMany({
      where: {
        student_id: studentId,
      },
      skip: skip,
      take: limit,
      include: {
        practice_writing_test_stages: {
          orderBy: {
            stg_number: "asc",
          },
        },
      },
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  @Handle
  async updateStatusById(writingTestId: string, status: string): Promise<PracticeWritingTestModel> {
    return await prisma.practice_writing_test.update({
      where: {
        practice_writing_test_id: writingTestId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(writingTestId: string): Promise<PracticeWritingTestModel> {
    return await prisma.practice_writing_test
      .findUniqueOrThrow({
        where: {
          practice_writing_test_id: writingTestId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Writing Test not found for practiceWritinggTestId: ${writingTestId}`);
      });
  }
}

export default PrismaPracticeWritingTestRepository;
