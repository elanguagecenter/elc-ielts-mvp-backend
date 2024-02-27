import prisma from "../../config/DatabaseSource";
import Handle from "../../utils/decorators/DBErrorHandlingDecorator";
import { TestPartStatus } from "../../utils/types/common/common";
import { SpeakingTestStageModel } from "../../utils/types/dbtypes/models";
import ISpeakingTestStageRepository from "./ISpeakingTestStageRepository";

class PrismaSpeakingTestStageRepository implements ISpeakingTestStageRepository {
  private static instance: PrismaSpeakingTestStageRepository = new PrismaSpeakingTestStageRepository();

  static getInstance(): PrismaSpeakingTestStageRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(speakingTestId: string, generatedQuestion: string, stgNumber: number): Promise<SpeakingTestStageModel> {
    return await prisma.speaking_test_stage.create({
      data: {
        stg_number: stgNumber,
        generated_question: generatedQuestion,
        status: TestPartStatus.CREATED,
        speaking_test_id: speakingTestId,
      },
    });
  }
  @Handle
  async updateStatusBySpeakingTestStageId(speakingTestStageId: string, status: string): Promise<SpeakingTestStageModel> {
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
  async updateMediaUrlBySpeakingTestId(speakingTestStageId: string, mediaUrl: string): Promise<SpeakingTestStageModel> {
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
  async getAllBySpeakingTestId(speakingTestId: string): Promise<SpeakingTestStageModel[]> {
    return await prisma.speaking_test_stage.findMany({
      where: {
        speaking_test_id: speakingTestId,
      },
    });
  }
}

export default PrismaSpeakingTestStageRepository;
