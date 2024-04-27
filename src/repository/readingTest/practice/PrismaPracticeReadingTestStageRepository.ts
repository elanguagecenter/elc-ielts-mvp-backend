import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStageStatus } from "../../../utils/types/common/common";
import { PracticeReadingTestStageModel } from "../../../utils/types/dbtypes/models";
import IPracticeReadingTestStageRepository from "./IPracticeReadingTestStageRepository";

class PrismaPracticeReadingTestStageRepository implements IPracticeReadingTestStageRepository {
  private static instance: PrismaPracticeReadingTestStageRepository = new PrismaPracticeReadingTestStageRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  async getByStageId(stageId: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage
      .findUniqueOrThrow({
        where: {
          practice_reading_test_stage_id: stageId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Reading Test stage not found for practiceReadingTestStageId: ${stageId}`);
      });
  }

  @Handle
  async getWithQuestionsByStageId(stageId: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage
      .findUniqueOrThrow({
        where: {
          practice_reading_test_stage_id: stageId,
        },
        include: {
          practice_reading_questions: true,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Reading Test stage not found for practiceReadingTestStageId: ${stageId}`);
      });
  }

  @Handle
  async create(practiceReadingTestId: string, generatedText: string, stgNumber: number): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage.create({
      data: {
        practice_reading_test_id: practiceReadingTestId,
        generated_scenario_text: generatedText,
        stg_number: stgNumber,
        status: TestStageStatus.CREATED,
      },
    });
  }

  @Handle
  async updateStatusById(practiceReadingTestStageId: string, status: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage.update({
      where: {
        practice_reading_test_stage_id: practiceReadingTestStageId,
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateStatusByIdAndGetWithQuestions(practiceReadingTestStageId: string, status: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage.update({
      where: {
        practice_reading_test_stage_id: practiceReadingTestStageId,
      },
      data: {
        status: status,
      },
      include: {
        practice_reading_questions: {
          orderBy: {
            question_number: "asc",
          },
        },
      },
    });
  }

  @Handle
  async getByStatusesAndId(readingTestId: string, statuses: Array<string>): Promise<Array<PracticeReadingTestStageModel>> {
    return await prisma.practice_reading_test_stage.findMany({
      where: {
        practice_reading_test_id: readingTestId,
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
  async getByStageNumberAndId(readingTestId: string, stage: number): Promise<Array<PracticeReadingTestStageModel>> {
    return await prisma.practice_reading_test_stage.findMany({
      where: {
        practice_reading_test_id: readingTestId,
        stg_number: stage,
      },
    });
  }

  @Handle
  async getWithQuestionsByStageAndTestId(readingTestId: string, stage: number): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage
      .findFirstOrThrow({
        where: {
          practice_reading_test_id: readingTestId,
          stg_number: stage,
        },
        include: {
          practice_reading_questions: {
            orderBy: {
              question_number: "asc",
            },
          },
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Reading Test stage not found for readingTestId: ${readingTestId} and stageNum ${stage}`);
      });
  }

  @Handle
  async getByStageIdAndStatus(readingTestStageId: string, status: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage
      .findFirstOrThrow({
        where: {
          practice_reading_test_stage_id: readingTestStageId,
          status: status,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Reading Test stage not found for practiceReadingTestStageId: ${readingTestStageId} and status: ${status}`);
      });
  }

  async getAllByReadingTestId(readingTestId: string): Promise<Array<PracticeReadingTestStageModel>> {
    return await prisma.practice_reading_test_stage.findMany({
      where: {
        practice_reading_test_id: readingTestId,
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  async checkAlreadyAnswered(testStageId: string): Promise<PracticeReadingTestStageModel> {
    return await prisma.practice_reading_test_stage
      .findUniqueOrThrow({
        where: {
          practice_reading_test_stage_id: testStageId,
          status: {
            in: [TestStageStatus.QUESTIONS_GENERATED, TestStageStatus.FAILED],
          },
        },
      })
      .then((result) => {
        if (result == null) {
          throw new ELCIELTSNotFoundError(`Answers already submitted or Questions aren't created for practiceReadingTestStageId: ${testStageId}`);
        }
        return result;
      });
  }
}

export default PrismaPracticeReadingTestStageRepository;
