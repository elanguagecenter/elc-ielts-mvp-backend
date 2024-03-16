import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStatus } from "../../../utils/types/common/common";
import { PracticeSpeakingTestModel, SpeakingTestModel } from "../../../utils/types/dbtypes/models";
import IPracticeSpeakingTestRepository from "./IPracticeSpeakingTestRepository";

class PrismaPracticeSpeakingTestRepository implements IPracticeSpeakingTestRepository {
  private static instance: PrismaPracticeSpeakingTestRepository = new PrismaPracticeSpeakingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(studentId: string, speakingTestname: string): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test.create({
      data: {
        current_status: TestStatus.SPEAKING_TEST_CREATED,
        student_id: studentId,
      },
    });
  }

  @Handle
  async updateStatusById(practiceSpeakingTestId: string, status: string): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test.update({
      where: {
        practice_speaking_test_id: practiceSpeakingTestId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(practiceSpeakingTestId: string): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test
      .findUniqueOrThrow({
        where: {
          practice_speaking_test_id: practiceSpeakingTestId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test not found for practiceSpeakingTestId: ${practiceSpeakingTestId}`);
      });
  }

  async getAllByStudentIdWithPageAndLimit(studentId: string, page: number, limit: number): Promise<Array<PracticeSpeakingTestModel>> {
    const skip = (page - 1) * limit;
    return await prisma.practice_speaking_test.findMany({
      where: {
        student_id: studentId,
      },
      skip: skip,
      take: limit,
      include: {
        practice_speaking_test_stages: {
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
}

export default PrismaPracticeSpeakingTestRepository;
