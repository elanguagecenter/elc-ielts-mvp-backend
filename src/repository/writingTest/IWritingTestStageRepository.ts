interface IWritingTestStageRepository<T> {
  updateStatusById(writingTestStageId: string, status: string): Promise<T>;
  updateSubmittedAnswerById(writingTestStageId: string, submitAnswer: string): Promise<T>;
  updateEvaluatedResultById(writingTestStageId: string, evaludatedResult: string): Promise<T>;
  getByStatusesAndId(writingTestId: string, statuses: Array<string>): Promise<Array<T>>;
  getByStageAndId(writingTestId: string, stage: number): Promise<T | null>;
  checkAlreadyAnswered(practiceWritingTestStageId: string): Promise<boolean>;
}

export default IWritingTestStageRepository;
