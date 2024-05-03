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
  async updateStatusByStudentIdAndId(speakingTestId: string, status: string, studentId: string): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test.update({
      where: {
        practice_speaking_test_id: speakingTestId,
        student_id: studentId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async updateStatusByTeacherIdAndId(speakingTestId: string, status: string, teacherId: string): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test.update({
      where: {
        practice_speaking_test_id: speakingTestId,
        evaluator_id: teacherId,
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

  @Handle
  async getAllByStudentIdWithPageAndLimit(studentId: string, page: number, limit: number): Promise<Array<PracticeSpeakingTestModel>> {
    const skip = (page - 1) * limit;
    return await prisma.practice_speaking_test.findMany({
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
  async getAllByTeacherIdWithPageAndLimit(teacherId: string, page: number, limit: number): Promise<Array<PracticeSpeakingTestModel>> {
    const skip = (page - 1) * limit;
    return await prisma.practice_speaking_test.findMany({
      where: {
        evaluator_id: teacherId,
        current_status: {
          in: [
            TestStatus.SPEAKING_TEST_PART_3_COMPLETED,
            TestStatus.SPEAKING_TEST_PART_2_EVALUATED,
            TestStatus.SPEAKING_TEST_PART_3_EVALUATED,
            TestStatus.SPEAKING_TEST_PART_2_FAILED,
            TestStatus.SPEAKING_TEST_PART_3_FAILED,
          ],
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
  async updateEvaluatorId(testId: string, evaluatorId: string | null): Promise<PracticeSpeakingTestModel> {
    return await prisma.practice_speaking_test.update({
      where: {
        practice_speaking_test_id: testId,
      },
      data: {
        evaluator_id: evaluatorId,
      },
    });
  }
}

export default PrismaPracticeSpeakingTestRepository;
