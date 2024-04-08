import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStatus } from "../../../utils/types/common/common";
import { PracticeReadingTestModel } from "../../../utils/types/dbtypes/models";
import IPracticeReadingTestRepository from "./IPracticeReadingTestRepository";

class PrismaPracticeReadingTestRepository implements IPracticeReadingTestRepository {
  private static instance: PrismaPracticeReadingTestRepository = new PrismaPracticeReadingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async createPracticeReadingTest(studentId: string): Promise<PracticeReadingTestModel> {
    return await prisma.practice_reading_test.create({
      data: {
        student_id: studentId,
        current_status: TestStatus.READING_TEST_CREATED,
      },
    });
  }

  @Handle
  async getAllByStudentId(studentId: string, page: number, limit: number): Promise<PracticeReadingTestModel[]> {
    const skip = (page - 1) * limit;
    return await prisma.practice_reading_test.findMany({
      where: {
        student_id: studentId,
      },
      skip: skip,
      take: limit,
      orderBy: {
        last_modified_time: "desc",
      },
    });
  }

  @Handle
  async updateStatusById(readingTestId: string, status: string): Promise<PracticeReadingTestModel> {
    return await prisma.practice_reading_test.update({
      where: {
        practice_reading_test_id: readingTestId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(readingTestId: string): Promise<PracticeReadingTestModel> {
    return await prisma.practice_reading_test
      .findUniqueOrThrow({
        where: {
          practice_reading_test_id: readingTestId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Writing Test not found for practiceWritinggTestId: ${readingTestId}`);
      });
  }
}

export default PrismaPracticeReadingTestRepository;
