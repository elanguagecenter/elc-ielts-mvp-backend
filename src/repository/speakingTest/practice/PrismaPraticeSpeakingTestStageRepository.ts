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
  async updateStatusBySpeakingTestStageId(speakingTestStageId: string, status: string): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.update({
      where: {
        practice_speaking_test_stage_id: speakingTestStageId,
      },
      data: {
        status: status,
      },
    });
  }

  @Handle
  async updateMediaUrlBySpeakingTestStageId(speakingTestStageId: string, mediaUrl: string): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage.update({
      where: {
        practice_speaking_test_stage_id: speakingTestStageId,
      },
      data: {
        uploaded_media_url: mediaUrl,
      },
    });
  }

  @Handle
  async getAllBySpeakingTestId(speakingTestId: string): Promise<PracticeSpeakingTestStageModel[]> {
    return await prisma.practice_speaking_test_stage.findMany({
      where: {
        practice_speaking_test_id: speakingTestId,
      },
      orderBy: {
        stg_number: "asc",
      },
    });
  }

  @Handle
  async getSpeakingTestStageByStageNumberAndSpeakingTestId(speakingTestId: string, stgNumber: number): Promise<PracticeSpeakingTestStageModel> {
    return await prisma.practice_speaking_test_stage
      .findFirstOrThrow({
        where: {
          practice_speaking_test_id: speakingTestId,
          stg_number: stgNumber,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test stage not found for speakingTestId: ${speakingTestId}`);
      });
  }
}

export default PrismaPraticeSpeakingTestStageRepository;
