import prisma from "../../../config/DatabaseSource";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { TestStageStatus } from "../../../utils/types/common/common";
import { SpeakingTestStageModel } from "../../../utils/types/dbtypes/models";
import ISpeakingTestStageRepository from "../ISpeakingTestStageRepository";

class PrismaSpeakingTestStageRepository implements ISpeakingTestStageRepository<SpeakingTestStageModel> {
  private static instance: PrismaSpeakingTestStageRepository = new PrismaSpeakingTestStageRepository();

  static getInstance(): PrismaSpeakingTestStageRepository {
    return this.instance;
  }
  private constructor() {}

  getAudioURLByStageIdAndTeacherId(stageId: string, teacherId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  updateEvaluationByStageIdTeacherId(evaluation: string, stageId: string, teacherId: string): Promise<SpeakingTestStageModel> {
    throw new Error("Method not implemented.");
  }

  @Handle
  async create(speakingTestId: string, generatedQuestion: string, stgNumber: number): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage.create({
      data: {
        stg_number: stgNumber,
        generated_question: generatedQuestion,
        status: TestStageStatus.CREATED,
        speaking_test_id: speakingTestId,
      },
    });
  }
  @Handle
  async updateStatusBySpeakingTestStageId(speakingTestStageId: string, status: string, userId: string): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage.update({
      where: {
        speaking_test_stage_id: speakingTestStageId,
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateMediaUrlBySpeakingTestStageId(speakingTestStageId: string, mediaUrl: string, studentId: string): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage.update({
      where: {
        speaking_test_stage_id: speakingTestStageId,
      },
      data: {
        uploaded_media_url: mediaUrl,
      },
    });
  }

  @Handle
  async getAllBySpeakingTestIdAndStudentId(speakingTestId: string, studentId: string): Promise<SpeakingTestStageModel[]> {
    return await prisma.speaking_test_stage.findMany({
      where: {
        speaking_test_id: speakingTestId,
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getAllBySpeakingTestIdAndTeacherId(speakingTestId: string, teacherId: string): Promise<SpeakingTestStageModel[]> {
    return await prisma.speaking_test_stage.findMany({
      where: {
        speaking_test_id: speakingTestId,
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getSpeakingTestStageByStageNumberStudentIdAndSpeakingTestId(speakingTestId: string, studentId: string, stgNumber: number): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage
      .findFirstOrThrow({
        where: {
          speaking_test_id: speakingTestId,
          stg_number: stgNumber,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test stage not found for speakingTestId: ${speakingTestId}`);
      });
  }

  @Handle
  async getSpeakingTestStageByStageNumberTeacherIdAndSpeakingTestId(speakingTestId: string, teacherId: string, stgNumber: number): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage
      .findFirstOrThrow({
        where: {
          speaking_test_id: speakingTestId,
          stg_number: stgNumber,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test stage not found for speakingTestId: ${speakingTestId}`);
      });
  }

  getByStatusesStudentIdAndId(speakingTestId: string, studentId: string, statuses: string[]): Promise<SpeakingTestStageModel[]> {
    throw new Error("Method not implemented.");
  }

  getByStatusesTeacherIdAndId(speakingTestId: string, teacherId: string, statuses: string[]): Promise<SpeakingTestStageModel[]> {
    throw new Error("Method not implemented.");
  }
  getByStageStudentIdAndId(speakingTestId: string, studentId: string, stage: number): Promise<SpeakingTestStageModel | null> {
    throw new Error("Method not implemented.");
  }

  getByStageTeacherIdAndId(speakingTestId: string, teacherId: string, stage: number): Promise<SpeakingTestStageModel | null> {
    throw new Error("Method not implemented.");
  }
}

export default PrismaSpeakingTestStageRepository;
