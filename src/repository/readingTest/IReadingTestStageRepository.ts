interface IReadingTestStageRepository<T> {
  getByStageId(stageId: string): Promise<T>;
  updateStatusById(readingTestStageId: string, status: string): Promise<T>;
  getByStatusesAndId(readingTestId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStageAndId(readingTestId: string, stage: number): Promise<T | null>;
  getAllByReadingTestId(readingTestId: string): Promise<Array<T>>;
  getByStageIdAndStatus(readingTestStageId: string, status: string): Promise<T>;
  checkAlreadyAnswered(testStageId: string): Promise<T>;
}

export default IReadingTestStageRepository;
