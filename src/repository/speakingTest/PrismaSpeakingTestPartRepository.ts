import prisma from "../../config/DatabaseSource";
import Handle from "../../decorators/DBErrorHandlingDecorator";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import { TestPartStatus } from "../../types/common/common";
import { SpeakingTestPartModel } from "../../types/dbtypes/models";
import ISpeakingTestPartRepository from "./ISpeakingTestPartRepository";

class PrismaSpeakingTestPartRepository implements ISpeakingTestPartRepository {
  private static instance: PrismaSpeakingTestPartRepository = new PrismaSpeakingTestPartRepository();

  static getInstance(): PrismaSpeakingTestPartRepository {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(speakingTestId: string, generatedQuestion: string): Promise<SpeakingTestPartModel> {
    return await prisma.speaking_test_part.create({
      data: {
        generated_question: generatedQuestion,
        status: TestPartStatus.CREATED,
        speaking_test_id: speakingTestId,
      },
    });
  }
  @Handle
  async updateStatusSpeakingTestPartId(speakingTestPartId: string, status: string): Promise<SpeakingTestPartModel> {
    return await prisma.speaking_test_part.update({
      where: {
        speaking_test_part_id: speakingTestPartId,
      },
      data: {
        status: status,
      },
    });
  }
  async updateMediaUrlBySpeakingTestId(speakingTestId: string, mediaUrl: string): Promise<SpeakingTestPartModel> {
    throw new Error("Method not implemented.");
  }
  async getAllBySpeakingTestId(speakingTestId: string): Promise<SpeakingTestPartModel[]> {
    throw new Error("Method not implemented.");
  }
}
