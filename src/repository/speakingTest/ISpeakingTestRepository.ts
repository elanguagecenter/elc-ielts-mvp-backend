import { SpeakingTestModel } from "../../types/dbtypes/models";

interface ISpeakingTestRepository {
  create(testId: string): Promise<SpeakingTestModel>;
  updateStatusById(speakingTestId: string, status: string): Promise<SpeakingTestModel>;
  getById(speakingTestId: string): Promise<SpeakingTestModel>;
}

export default ISpeakingTestRepository;
