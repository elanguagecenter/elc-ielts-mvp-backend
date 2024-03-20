import prisma from "../../../config/DatabaseSource";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStageStatus } from "../../../utils/types/common/common";
import { PracticeWritingTestStageModel } from "../../../utils/types/dbtypes/models";
import IPracticeWritingTestStageRepository from "./IPracticeWritingTestStageRepository";

class PrismaPracticeWritingTestStageRepository implements IPracticeWritingTestStageRepository {
  private static instance: PrismaPracticeWritingTestStageRepository = new PrismaPracticeWritingTestStageRepository();

  static getInstance(): PrismaPracticeWritingTestStageRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(practiceWritingTestId: string, generatedQuestion: string, stgNumber: number): Promise<PracticeWritingTestStageModel> {
    return await prisma.practice_writing_test_stage.create({
      data: {
        practice_writing_test_id: practiceWritingTestId,
        generated_question: generatedQuestion,
        stg_number: stgNumber,
        status: TestStageStatus.CREATED,
      },
    });
  }

  @Handle
  async updateStatusById(practiceWritingTestStageId: string, status: string): Promise<PracticeWritingTestStageModel> {
    return await prisma.practice_writing_test_stage.update({
      where: {
        practice_writing_test_stage_id: practiceWritingTestStageId,
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateSubmittedAnswerById(practiceWritingTestStageId: string, submitAnswer: string): Promise<PracticeWritingTestStageModel> {
    return await prisma.practice_writing_test_stage.update({
      where: {
        practice_writing_test_stage_id: practiceWritingTestStageId,
      },
      data: {
        submitted_answer: submitAnswer,
        status: TestStageStatus.COMPLETED,
      },
    });
  }

  @Handle
  async updateEvaluatedResultById(practiceWritingTestStageId: string, evaludatedResult: string): Promise<PracticeWritingTestStageModel> {
    return await prisma.practice_writing_test_stage.update({
      where: {
        practice_writing_test_stage_id: practiceWritingTestStageId,
      },
      data: {
        evaluated_result: evaludatedResult,
        status: TestStageStatus.EVALUATED,
      },
    });
  }

  @Handle
  async getByStatusesAndId(writingTestId: string, statuses: Array<string>): Promise<Array<PracticeWritingTestStageModel>> {
    return await prisma.practice_writing_test_stage.findMany({
      where: {
        practice_writing_test_id: writingTestId,
        status: {
          in: statuses,
        },
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getByStageAndId(writingTestId: string, stage: number): Promise<PracticeWritingTestStageModel | null> {
    return await prisma.practice_writing_test_stage.findFirst({
      where: {
        practice_writing_test_id: writingTestId,
        stg_number: stage,
      },
    });
  }

  @Handle
  async checkAlreadyAnswered(practiceWritingTestStageId: string): Promise<boolean> {
    return await prisma.practice_writing_test_stage
      .findMany({
        where: {
          practice_writing_test_stage_id: practiceWritingTestStageId,
          submitted_answer: null,
        },
      })
      .then((result) => {
        if (result.length == 0) {
          return true;
        }
        return false;
      });
  }
}

export default PrismaPracticeWritingTestStageRepository;
