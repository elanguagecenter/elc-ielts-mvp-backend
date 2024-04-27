import { PracticeReadingTestStageModel } from "../../utils/types/dbtypes/models";

interface IReadingTestStageRepository<T> {
  getByStageId(stageId: string): Promise<T>;
  getWithQuestionsByStageId(readingTestId: string): Promise<T>;
  updateStatusById(readingTestStageId: string, status: string): Promise<T>;
  updateStatusByIdAndGetWithQuestions(readingTestStageId: string, status: string): Promise<T>;
  getByStatusesAndId(readingTestId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStageNumberAndId(readingTestId: string, stage: number): Promise<Array<PracticeReadingTestStageModel>>;
  getWithQuestionsByStageAndTestId(readingTestId: string, stage: number): Promise<T>;
  getAllByReadingTestId(readingTestId: string): Promise<Array<T>>;
  getByStageIdAndStatus(readingTestStageId: string, status: string): Promise<T>;
  checkAlreadyAnswered(testStageId: string): Promise<T>;
}

export default IReadingTestStageRepository;
