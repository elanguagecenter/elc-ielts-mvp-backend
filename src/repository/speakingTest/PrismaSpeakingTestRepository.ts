import prisma from "../../config/DatabaseSource";
import Handle from "../../decorators/DBErrorHandlingDecorator";
import ELCIELTSNotFoundError from "../../exception/ELCIELTSNotFoundError";
import { TestStatus } from "../../types/common/common";
import { SpeakingTestModel } from "../../types/dbtypes/models";
import ISpeakingTestRepository from "./ISpeakingTestRepository";

class PrismaSpeakingTestRepository implements ISpeakingTestRepository {
  private static instance: PrismaSpeakingTestRepository = new PrismaSpeakingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(testId: string): Promise<SpeakingTestModel> {
    return await prisma.speaking_test.create({
      data: {
        current_status: TestStatus.SPEAKING_TEST_CREATED,
        test_id: testId,
      },
    });
  }

  @Handle
  async updateStatusById(speakingTestId: string, status: string): Promise<SpeakingTestModel> {
    return await prisma.speaking_test.update({
      where: {
        speaking_test_id: speakingTestId,
      },
      data: {
        current_status: status,
      },
    });
  }

  @Handle
  async getById(speakingTestId: string): Promise<SpeakingTestModel> {
    return await prisma.speaking_test
      .findUniqueOrThrow({
        where: {
          speaking_test_id: speakingTestId,
        },
      })
      .catch(() => {
        throw new ELCIELTSNotFoundError(`Speaking Test not found for testId: ${speakingTestId}`);
      });
  }
}

export default PrismaSpeakingTestRepository;
