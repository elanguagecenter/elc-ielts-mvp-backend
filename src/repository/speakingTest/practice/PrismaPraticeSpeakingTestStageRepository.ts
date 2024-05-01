import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStageStatus } from "../../../utils/types/common/common";
import { PracticeSpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import IPracticeSpeakingTestStageRepository from "./IPracticeSpeakingTestStageRepository";

class PrismaPraticeSpeakingTestStageRepository implements IPracticeSpeakingTestStageRepository {
  private static instance: PrismaPraticeSpeakingTestStageRepository = new PrismaPraticeSpeakingTestStageRepository();

  static getInstance(): PrismaPraticeSpeakingTestStageRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(speakingTestId: string, generatedQuestion: string, stgNumber: number): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.create({
      data: {
        stg_number: stgNumber,
        generated_question: generatedQuestion,
        status: TestStageStatus.CREATED,
        practice_speaking_test_id: speakingTestId,
      },
    });
  }
  @Handle
  async updateStatusBySpeakingTestStageId(speakingTestStageId: string, status: string, userId: string): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.update({
      where: {
        practice_speaking_test_stage_id: speakingTestStageId,
        practice_speaking_test: {
          student_id: userId,
        },
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateMediaUrlBySpeakingTestStageId(speakingTestStageId: string, mediaUrl: string, studentId: string): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.update({
      where: {
        practice_speaking_test_stage_id: speakingTestStageId,
        practice_speaking_test: {
          student_id: studentId,
        },
      },
      data: {
        uploaded_media_url: mediaUrl,
      },
    });
  }

  @Handle
  async getAllBySpeakingTestIdAndStudentId(speakingTestId: string, studentId: string): Promise<Array<PracticeSpeakingTestStageModel>> {
    return await prisma.practice_speaking_test_stage.findMany({
      where: {
        practice_speaking_test_id: speakingTestId,
        practice_speaking_test: {
          student_id: studentId,
        },
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getAllBySpeakingTestIdAndTeacherId(speakingTestId: string, teacherId: string): Promise<Array<PracticeSpeakingTestStageModel>> {
    return await prisma.practice_speaking_test_stage.findMany({
      where: {
        practice_speaking_test_id: speakingTestId,
        practice_speaking_test: {
          evaluator_id: teacherId,
        },
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getSpeakingTestStageByStageNumberStudentIdAndSpeakingTestId(speakingTestId: string, studentId: string, stgNumber: number): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage
      .findFirstOrThrow({
        where: {
          practice_speaking_test_id: speakingTestId,
          stg_number: stgNumber,
          practice_speaking_test: {
            student_id: studentId,
          },
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test stage not found for speakingTestId: ${speakingTestId}`);
      });
  }

  @Handle
  async getSpeakingTestStageByStageNumberTeacherIdAndSpeakingTestId(speakingTestId: string, teacherId: string, stgNumber: number): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage
      .findFirstOrThrow({
        where: {
          practice_speaking_test_id: speakingTestId,
          stg_number: stgNumber,
          practice_speaking_test: {
            evaluator_id: teacherId,
          },
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test stage not found for speakingTestId: ${speakingTestId}`);
      });
  }

  @Handle
  async getByStatusesStudentIdAndId(speakingTestId: string, studentId: string, statuses: Array<string>): Promise<Array<PracticeSpeakingTestStageModel>> {
    return await prisma.practice_speaking_test_stage.findMany({
      where: {
        practice_speaking_test_id: speakingTestId,
        practice_speaking_test: {
          student_id: studentId,
        },
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
  async getByStatusesTeacherIdAndId(speakingTestId: string, teacherId: string, statuses: Array<string>): Promise<Array<PracticeSpeakingTestStageModel>> {
    return await prisma.practice_speaking_test_stage.findMany({
      where: {
        practice_speaking_test_id: speakingTestId,
        practice_speaking_test: {
          evaluator_id: teacherId,
        },
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
  async getByStageStudentIdAndId(speakingTestId: string, studentId: string, stage: number): Promise<PracticeSpeakingTestStageModel | null> {
    return await prisma.practice_speaking_test_stage.findFirst({
      where: {
        practice_speaking_test_id: speakingTestId,
        stg_number: stage,
        practice_speaking_test: {
          student_id: studentId,
        },
      },
    });
  }

  @Handle
  async getByStageTeacherIdAndId(speakingTestId: string, teacherId: string, stage: number): Promise<PracticeSpeakingTestStageModel | null> {
    return await prisma.practice_speaking_test_stage.findFirst({
      where: {
        practice_speaking_test_id: speakingTestId,
        stg_number: stage,
        practice_speaking_test: {
          evaluator_id: teacherId,
        },
      },
    });
  }

  @Handle
  async getAudioURLByStageIdAndTeacherId(stageId: string, teacherId: string): Promise<string> {
    return await prisma.practice_speaking_test_stage
      .findFirst({
        where: {
          practice_speaking_test_stage_id: stageId,
          practice_speaking_test: {
            evaluator_id: teacherId,
          },
        },
        select: {
          uploaded_media_url: true,
        },
      })
      .then((result) => {
        if (result && result.uploaded_media_url) {
          return result.uploaded_media_url;
        } else {
          throw new ELCIELTSNotFoundError(`Requested audio URL not found for stageId ${stageId}`);
        }
      });
  }

  async updateEvaluationByStageIdTeacherId(evaluation: string, stageId: string, teacherId: string): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.update({
      where: {
        practice_speaking_test_stage_id: stageId,
        practice_speaking_test: {
          evaluator_id: teacherId,
        },
      },
      data: {
        evaluated_result: evaluation,
        status: TestStageStatus.EVALUATED,
      },
    });
  }
}

export default PrismaPraticeSpeakingTestStageRepository;
