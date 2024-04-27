import { PracticeWritingTestStageModel } from "../../../utils/types/dbtypes/models";
import IWritingTestStageRepository from "../IWritingTestStageRepository";

interface IPracticeWritingTestStageRepository extends IWritingTestStageRepository<PracticeWritingTestStageModel> {
  create(practiceWritingTestId: string, generatedQuestion: string, stgNumber: number): Promise<PracticeWritingTestStageModel>;
}

export default IPracticeWritingTestStageRepository;
