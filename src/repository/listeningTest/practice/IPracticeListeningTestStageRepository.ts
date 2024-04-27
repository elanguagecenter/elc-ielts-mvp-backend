import { PracticeListeningTestStageModel } from "../../../utils/types/dbtypes/models";
import IListeningTestStageRepository from "../IListeningTestStageRepository";

interface IPracticeListeningTestStageRepository extends IListeningTestStageRepository<PracticeListeningTestStageModel> {
  create(practiceTestId: string, generatedText: string, stgNumber: number): Promise<PracticeListeningTestStageModel>;
}

export default IPracticeListeningTestStageRepository;
