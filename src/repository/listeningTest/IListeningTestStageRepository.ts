import { PracticeListeningTestStageModel } from "../../utils/types/dbtypes/models";

interface IListeningTestStageRepository<T> {
  getByStageId(stageId: string): Promise<T>;
  getWithQuestionsByStageId(stageId: string): Promise<T>;
  updateStatusById(stageId: string, status: string): Promise<T>;
  updateStatusByIdAndGetWithQuestions(stageId: string, status: string): Promise<T>;
  getByStatusesAndId(testId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStageNumberAndId(testId: string, stage: number): Promise<Array<PracticeListeningTestStageModel>>;
  getWithQuestionsByStageAndTestId(testId: string, stage: number): Promise<T>;
  getAllByListeningTestId(testId: string): Promise<Array<T>>;
  getByStageIdAndStatus(stageId: string, status: string): Promise<T>;
  checkAlreadyAnswered(stageId: string): Promise<T>;
}

export default IListeningTestStageRepository;
