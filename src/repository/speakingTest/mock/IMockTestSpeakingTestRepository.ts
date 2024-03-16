import { SpeakingTestModel } from "../../../utils/types/dbtypes/models";
import ISpeakingTestRepository from "../ISpeakingTestRepository";

interface IMockTestSpeakingTestRepository extends ISpeakingTestRepository<SpeakingTestModel> {
  getByTestId(testId: string): Promise<SpeakingTestModel | null>;
}

export default IMockTestSpeakingTestRepository;
