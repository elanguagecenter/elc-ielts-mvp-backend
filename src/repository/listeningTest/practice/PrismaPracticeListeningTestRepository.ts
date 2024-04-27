import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStatus } from "../../../utils/types/common/common";
import { PracticeListeningTestModel } from "../../../utils/types/dbtypes/models";
import IPracticeListeningTestRepository from "./IPracticeListeningTestRepository";

class PrismaPracticeListeningTestRepository implements IPracticeListeningTestRepository {
  private static instance: IPracticeListeningTestRepository = new PrismaPracticeListeningTestRepository();

  static getInstance() {
    return this.instance;
  }

  private constructor() {}

  @Handle
  async createPracticeTest(studentId: string): Promise<PracticeListeningTestModel> {
    return await prisma.practice_listening_test.create({
      data: {
        student_id: studentId,
        current_status: TestStatus.LISTENING_TEST_CREATED,
      },
    });
  }

  @Handle
  async getAllByStudentId(studentId: string, page: number, limit: number): Promise<Array<PracticeListeningTestModel>> {
    const skip = (page - 1) * limit;
    return await prisma.practice_listening_test.findMany({
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
  async updateStatusById(listeningTestId: string, status: string): Promise<PracticeListeningTestModel> {
    return await prisma.practice_listening_test.update({
      where: {
        practice_listening_test_id: listeningTestId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(listeningTestId: string): Promise<PracticeListeningTestModel> {
    return await prisma.practice_listening_test
      .findUniqueOrThrow({
        where: {
          practice_listening_test_id: listeningTestId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Listening Test not found for practiceListeningTestId: ${listeningTestId}`);
      });
  }
}

export default PrismaPracticeListeningTestRepository;
