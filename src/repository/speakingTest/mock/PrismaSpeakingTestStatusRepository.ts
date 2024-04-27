import prisma from "../../../config/DatabaseSource";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { SpeakingTestStatusModel } from "../../../utils/types/dbtypes/models";
import ISpeakingTestStatusRepository from "../ISpeakingTestStatusRepository";

class PrismaSpeakingTestStatusRepository implements ISpeakingTestStatusRepository {
  private static instance: PrismaSpeakingTestStatusRepository = new PrismaSpeakingTestStatusRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(speakingTestId: string, status: string): Promise<SpeakingTestStatusModel> {
    return await prisma.speaking_test_status.create({
      data: {
        speaking_test_id: speakingTestId,
        status: status,
      },
    });
  }

  @Handle
  async getStatusesBySpeakingTestId(speakingTestId: string): Promise<Array<SpeakingTestStatusModel>> {
    return await prisma.speaking_test_status.findMany({
      where: {
        speaking_test_id: speakingTestId,
      },
    });
  }
}
