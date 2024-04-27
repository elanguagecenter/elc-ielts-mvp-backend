import prisma from "../../../config/DatabaseSource";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import ELCIELTSNotFoundError from "../../../exception/ELCIELTSNotFoundError";
import { TestStatus } from "../../../utils/types/common/common";
import { SpeakingTestModel } from "../../../utils/types/dbtypes/models";
import ISpeakingTestRepository from "../ISpeakingTestRepository";
import IMockTestSpeakingTestRepository from "./IMockTestSpeakingTestRepository";

class PrismaMockSpeakingTestRepository implements IMockTestSpeakingTestRepository {
  private static instance: PrismaMockSpeakingTestRepository = new PrismaMockSpeakingTestRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  @Handle
  async create(testId: string, speakingTestname: string): Promise<SpeakingTestModel> {
    return await prisma.speaking_test.create({
      data: {
        name: speakingTestname,
        current_status: TestStatus.SPEAKING_TEST_CREATED,
        test_id: testId,
      },
    });
  }

  @Handle
  async getByTestId(testId: string): Promise<SpeakingTestModel | null> {
    return await prisma.speaking_test.findUnique({
      where: {
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
        throw new ELCIELTSNotFoundError(`Speaking Test not found for speakingTestId: ${speakingTestId}`);
      });
  }
}

export default PrismaMockSpeakingTestRepository;
