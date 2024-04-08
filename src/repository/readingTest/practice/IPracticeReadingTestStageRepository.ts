import { PracticeReadingTestStageModel } from "../../../utils/types/dbtypes/models";
import IReadingTestStageRepository from "../IReadingTestStageRepository";

interface IPracticeReadingTestStageRepository extends IReadingTestStageRepository<PracticeReadingTestStageModel> {
  create(practiceReadingTestId: string, generatedText: string, stgNumber: number): Promise<PracticeReadingTestStageModel>;
}

export default IPracticeReadingTestStageRepository;
