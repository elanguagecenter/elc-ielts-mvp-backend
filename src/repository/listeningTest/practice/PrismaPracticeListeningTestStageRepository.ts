import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStageStatus } from "../../../utils/types/common/common";
import { PracticeListeningTestStageModel } from "../../../utils/types/dbtypes/models";
import IPracticeListeningTestStageRepository from "./IPracticeListeningTestStageRepository";

class PrismaPracticeListeningTestStageRepository implements IPracticeListeningTestStageRepository {
  private static instance: IPracticeListeningTestStageRepository = new PrismaPracticeListeningTestStageRepository();

  static getInstance() {
    return this.instance;
  }

  private constructor() {}

  @Handle
  async create(practiceTestId: string, generatedText: string, stgNumber: number): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage.create({
      data: {
        practice_listening_test_id: practiceTestId,
        generated_scenario_text: generatedText,
        stg_number: stgNumber,
        status: TestStageStatus.CREATED,
      },
    });
  }

  @Handle
  async getByStageNumberAndId(testId: string, stage: number): Promise<Array<PracticeListeningTestStageModel>> {
    return await prisma.practice_listening_test_stage.findMany({
      where: {
        practice_listening_test_id: testId,
        stg_number: stage,
      },
    });
  }

  @Handle
  async getByStageId(stageId: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage
      .findUniqueOrThrow({
        where: {
          practice_listening_test_stage_id: stageId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Listening Test stage not found for practiceListeningTestStageId: ${stageId}`);
      });
  }

  @Handle
  async getWithQuestionsByStageId(stageId: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage
      .findUniqueOrThrow({
        where: {
          practice_listening_test_stage_id: stageId,
        },
        include: {
          practice_listening_test_stage_questions: true,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Listening Test stage not found for practiceListeningTestStageId: ${stageId}`);
      });
  }

  @Handle
  async updateStatusById(stageId: string, status: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage.update({
      where: {
        practice_listening_test_stage_id: stageId,
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateAudioUrlAndStatusById(stageId: string, status: string, audioUrl: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage.update({
      where: {
        practice_listening_test_stage_id: stageId,
      },
      data: {
        generated_audio_path: audioUrl,
        status: status,
      },
    });
  }

  @Handle
  async updateStatusByIdAndGetWithQuestions(stageId: string, status: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage.update({
      where: {
        practice_listening_test_stage_id: stageId,
      },
      data: {
        status: status,
      },
      include: {
        practice_listening_test_stage_questions: {
          orderBy: {
            question_number: "asc",
          },
        },
      },
    });
  }

  @Handle
  async getByStatusesAndId(listeningTestId: string, statuses: Array<string>): Promise<Array<PracticeListeningTestStageModel>> {
    return await prisma.practice_listening_test_stage.findMany({
      where: {
        practice_listening_test_id: listeningTestId,
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
  async getWithQuestionsByStageAndTestId(listeningTestId: string, stage: number): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage
      .findFirstOrThrow({
        where: {
          practice_listening_test_id: listeningTestId,
          stg_number: stage,
        },
        include: {
          practice_listening_test_stage_questions: {
            orderBy: {
              question_number: "asc",
            },
          },
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Listening Test stage not found for listeningTestId: ${listeningTestId} and stageNum ${stage}`);
      });
  }

  @Handle
  async getAllByListeningTestId(listeningTestId: string): Promise<Array<PracticeListeningTestStageModel>> {
    return await prisma.practice_listening_test_stage.findMany({
      where: {
        practice_listening_test_id: listeningTestId,
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getByStageIdAndStatus(stageId: string, status: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage
      .findFirstOrThrow({
        where: {
          practice_listening_test_stage_id: stageId,
          status: status,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Listening Test stage not found for practiceListeningTestStageId: ${stageId} and status: ${status}`);
      });
  }

  @Handle
  async checkAlreadyAnswered(stageId: string): Promise<PracticeListeningTestStageModel> {
    return await prisma.practice_listening_test_stage
      .findUniqueOrThrow({
        where: {
          practice_listening_test_stage_id: stageId,
          status: {
            in: [TestStageStatus.QUESTIONS_GENERATED, TestStageStatus.FAILED],
          },
        },
      })
      .then((result) => {
        if (result == null) {
          throw new ELCIELTSNotFoundError(`Answers already submitted or Questions aren't created for practiceListeningTestStageId: ${stageId}`);
        }
        return result;
      });
  }
}

export default PrismaPracticeListeningTestStageRepository;
